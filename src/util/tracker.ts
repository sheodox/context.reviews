import {query} from './db';
import {trim} from './trim';

interface Phrase {
    //the user's UUID who looked up this phrase
    user_id: string,
    //auto-generated UUID for this phrase
    phrase_id: string,
    //the actual text they're studying
    phrase: string,
    created_at: Date,
    deleted: boolean,
    deleted_at: null | Date,
    visible: boolean
}

class Tracker {
    constructor() {}

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
     * @param user_id - user's UUID
     * @param phrases - a string of phrases, will be broken apart and stored individually
     */
    async add(user_id: string, phrases: string) {
        const newPhrases = [];
        if (!phrases) {
            return;
        }
        //add each sentence individually
        for (let phrase of Tracker.split(phrases)) {
            phrase = trim(phrase);
            if (phrase) {
                const existing = (await query(
                        `SELECT *
                         FROM phrases
                         WHERE user_id = $1
                           AND phrase = $2`,
                    [user_id, phrase]
                )).rows[0];
                //try to guarantee no duplicate phrases (per user)
                if (!existing) {
                    const {rows} = await query(
                            `INSERT INTO phrases(user_id, phrase)
                             VALUES ($1, $2) RETURNING phrase, phrase_id`,
                        [user_id, phrase]
                    );
                    newPhrases.push(rows[0]);
                }
                //if the phrase is a duplicate, but the other one was deleted, un-delete it
                else if (existing.deleted) {
                    const {rows} = await query(
                        `UPDATE phrases SET deleted=false, deleted_at=null WHERE phrase_id=$1
                         RETURNING phrase, phrase_id`,
                        [existing.phrase_id]
                    );
                    newPhrases.push(rows[0]);
                }
            }
        }
        return newPhrases;
    }

    /**
     * remove a phrase by its id (or ids if an array is passed)
     * @param user_id
     * @param id - a phrase's ID (uuid)
     */
    async remove(user_id: string, id: string) {
        const ids = Array.isArray(id) ? id : [id];
        for (const id of ids) {
            //would probably be good enough to just delete by phrase ID, but also make sure the user_id matches
            //for extra protection
            await query(
                    `UPDATE phrases
                     SET deleted= true,
                         deleted_at=timezone('utc', now())
                     WHERE user_id = $1
                       AND phrase_id = $2`,
                [user_id, id]
            )
        }
    }

    /**
     * Undelete the last thing from the history
     */
    async undo(user_id: string) {
        await query(
            `UPDATE phrases
            SET deleted=false, deleted_at=null
            WHERE phrase_id=(
                SELECT phrase_id FROM phrases
                WHERE user_id=$1 AND deleted=true ORDER BY deleted_at DESC LIMIT 1
            )
            `, [user_id]
        )
    }

    /**
     * get all phrases
     * @returns {any}
     */
    async list(user_id: string) : Promise<Phrase[]> {
        return (
            await query(`SELECT phrase_id, phrase, visible FROM phrases WHERE user_id=$1 AND deleted=false ORDER BY created_at ASC;`, [user_id])
        ).rows;
    }

    async hide(user_id: string, id: string ) {
        await query(
            `UPDATE phrases SET visible=false WHERE user_id=$1 AND phrase_id=$2`,
            [user_id, id]
        );
    }

    async showAll(user_id: string) {
        await query(
            `UPDATE phrases SET visible=true WHERE user_id=$1`,
            [user_id]
        )
    }
}

export const tracker = new Tracker();
