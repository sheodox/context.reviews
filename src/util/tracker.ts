import {trim, quoteCharacters} from './trim';
import {prisma} from "./prisma";
import {
    phrasesListTime,
    phrasesAdded,
    phrasesRemoved,
    phrasesUndone,
    phrasesAddTime,
    phrasesRemoveTime,
    phrasesUndoTime,
    phrasesTotal,
    phrasesActive
} from "../metrics";
import {phraseLogger} from "./logger";
import { Phrase } from '@prisma/client';

class Tracker {
    /**
     * Split a long search phrase into sentences.
     */
    static split(phrase: string) {
    	phrase = phrase.replace(/\r/g, '');
    	//insert newlines after sentences, and split on those. this can be also used
        //to intentionally split text when bulk adding phrases
        const delimiter = '\n';
        ['。', '！', '？'].forEach(punctuation => {
            phrase = phrase.replace(new RegExp(punctuation, 'g'), `${punctuation}${delimiter}`);
        });
        //split between quotes that are right next to each other, like "something」「something else"
        quoteCharacters.map(([open, close]) => {
            phrase = phrase.replace(new RegExp(`${close}\s*${open}`, 'g'), `${close}\n${open}`)
        });
        return phrase.split(delimiter);
    }

    /**
     * add a new phrase
     * @param userId - user's UUID
     * @param phrases - a string of phrases, will be broken apart and stored individually
     */
    async add(userId: string, phrases: string) {
        if (!phrases) {
            return;
        }

        const addedPhrases = [],
            existingPhrases = [];

        //add each sentence individually
        for (let phrase of Tracker.split(phrases)) {
            phrase = trim(phrase);
            if (phrase) {
                phrasesAdded.inc();
                phrasesActive.inc();
                phrasesTotal.inc();
                const addTimeEnd = phrasesAddTime.startTimer(),
                    existing = await prisma.phrase.findFirst({
                        where: {
                            userId, phrase
                        }
                    });

                //try to guarantee no duplicate phrases (per user)
                if (!existing) {
                    const newPhrase = await prisma.phrase.create({
                        data: {
                            userId,
                            phrase
                        }
                    })

                    addedPhrases.push(newPhrase);
                }
                //if the phrase is a duplicate, but the other one was deleted, un-delete it
                else if (existing.deleted) {
                    await prisma.phrase.update({
                        where: {
                            id: existing.id
                        },
                        data: {
                            deleted: false,
                            deletedAt: null
                        }
                    });
                    addedPhrases.push(existing);
                }
                else {
                    existingPhrases.push(existing);
                }
                addTimeEnd();
            }
        }
        return {addedPhrases, existingPhrases};
    }

    /**
     * remove a phrase by its id (or ids if an array is passed)
     * @param userId
     * @param id - a phrase's ID (uuid)
     */
    async remove(userId: string, id: string) {
        const ids = Array.isArray(id) ? id : [id];

        for (const id of ids) {
            const removeTimeEnd = phrasesRemoveTime.startTimer(),
                phrase = await prisma.phrase.findFirst({
                    where: {
                        id,
                        userId
                    }
                });

            //would probably be good enough to just delete by phrase ID, but also make sure the user_id matches
            //for extra protection
            if (phrase) {
                phrasesRemoved.inc();
                phrasesActive.dec();
                await prisma.phrase.update({
                    where: {
                        id: phrase.id
                    },
                    data: {
                        deleted: true,
                        deletedAt: new Date()
                    }
                });
            }
            removeTimeEnd();
        }
    }

    /**
     * Undelete the last thing from the history
     */
    async undo(userId: string) {
        const undoTimeEnd = phrasesUndoTime.startTimer(),
            mostRecentDeletedPhrase = await prisma.phrase
                .findFirst({
                    where: {
                        userId,
                        deleted: true
                    },
                    orderBy: {
                        deletedAt: 'desc'
                    }
                });

        if (mostRecentDeletedPhrase) {
            phrasesUndone.inc();
            phrasesActive.inc();
            await prisma.phrase.update({
                where: {
                    id: mostRecentDeletedPhrase.id
                },
                data: {
                    deletedAt: null,
                    deleted: false
                }
            })
        }
        undoTimeEnd();
    }

    /**
     * get all phrases
     * @returns {Phrase[]}
     */
    async list(userId: string) {
        const listTimeEnd = phrasesListTime.startTimer(),
            list = await prisma.phrase.findMany({
                    select: {
                        id: true, phrase: true
                    },
                    where:{
                        userId, deleted: false
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                });

        listTimeEnd();
        return list;
    }
    async countActive(userId: string): Promise<number> {
        return await prisma.phrase.count({
            where: {
                userId, deleted: false
            }
        });
    }
    async countTotal(userId: string): Promise<number> {
        return await prisma.phrase.count({
            where: {
                userId
            }
        });
    }
}

export const tracker = new Tracker();
