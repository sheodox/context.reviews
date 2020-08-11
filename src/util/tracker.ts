import {trim} from './trim';
import {Repository} from "typeorm/index";
import {Phrase} from '../entity/Phrase';
import {connection} from "../entity";

class Tracker {
    phraseRepository: Promise<Repository<Phrase>>;
    constructor() {
        this.phraseRepository = connection.then(connection => {
            return connection.getRepository(Phrase);
        })
    }

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

        const phraseRepository = await this.phraseRepository,
            newPhrases = [];

        //add each sentence individually
        for (let phrase of Tracker.split(phrases)) {
            phrase = trim(phrase);
            if (phrase) {
                const existing = await phraseRepository.findOne({
                    userId, phrase
                });
                //try to guarantee no duplicate phrases (per user)
                if (!existing) {
                    const newPhrase = new Phrase();
                    newPhrase.userId = userId;
                    newPhrase.phrase = phrase;

                    await phraseRepository.save(newPhrase);
                    newPhrases.push(newPhrase);
                }
                //if the phrase is a duplicate, but the other one was deleted, un-delete it
                else if (existing.deleted) {
                    existing.deletedAt = null;
                    existing.deleted = false;
                    await phraseRepository.save(existing);
                    newPhrases.push(existing);
                }
            }
        }
        return newPhrases;
    }

    /**
     * remove a phrase by its id (or ids if an array is passed)
     * @param userId
     * @param id - a phrase's ID (uuid)
     */
    async remove(userId: string, id: string) {
        const phraseRepository = await this.phraseRepository,
            ids = Array.isArray(id) ? id : [id];

        for (const id of ids) {
            const phrase = await phraseRepository.findOne({
                id
            });

            //would probably be good enough to just delete by phrase ID, but also make sure the user_id matches
            //for extra protection
            if (phrase.userId === userId) {
                phrase.deleted = true;
                phrase.deletedAt = new Date();
                await phraseRepository.save(phrase);
            }
        }
    }

    /**
     * Undelete the last thing from the history
     */
    async undo(userId: string) {
        const phraseRepository = await this.phraseRepository,
            mostRecentDeletedPhrase = await phraseRepository
                .findOne({
                    where: {
                        userId,
                        deleted: true
                    },
                    order: {
                        deletedAt: 'DESC'
                    }
                });

        if (mostRecentDeletedPhrase) {
            mostRecentDeletedPhrase.deletedAt = null;
            mostRecentDeletedPhrase.deleted = false;
            await phraseRepository.save(mostRecentDeletedPhrase);
        }
    }

    /**
     * get all phrases
     * @returns {Phrase[]}
     */
    async list(userId: string) : Promise<Phrase[]> {
        return await (await this.phraseRepository)
            .find({
                select: ['id', 'phrase'],
                where:{
                    userId, deleted: false
                },
                order: {
                    createdAt: 'ASC'
                }
            })
    }
}

export const tracker = new Tracker();