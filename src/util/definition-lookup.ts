import fetch from './fetch';
import {redis} from './redis-utils';

const LOOKUP_TTL = 60 * 60 * 24 * 90; // about three months in seconds

interface Definition extends JapaneseForm {
    // string for the 'word' page for this specific result
    href: string,
    tags: string[],
    alternateForms: JapaneseForm[],
    meanings: {
        preInfo: string,
        definition: string,
        seeAlso: string[],
        links: JishoExternalLink[],
        info: string
    }[]
}

interface JapaneseForm {
    word: string,
    reading: string
}

interface SearchResults {
    href: string,
    definitions: Definition[]
}

class DefinitionCache {
    constructor() {}
    cacheKey(source: string, word: string) {
        return `dictionary-${source}-${word}`;
    }
    async get(source: string, word: string, newestSchemaVersion: number) {
        const key = this.cacheKey(source, word),
            cached = await redis.get(key);
        if (!cached) {
            return;
        }
        const {schemaVersion, data} = JSON.parse(cached);

        //cache miss if the schema version doesn't match
        if (newestSchemaVersion === schemaVersion) {
            this.refreshTTL(key); //don't actually care if this gets done before returning the data
            return data;
        }
    }
    async set(source: string, word: string, data: SearchResults, schemaVersion: number) {
        const key = this.cacheKey(source, word);
        await redis.set(key, JSON.stringify({
            schemaVersion, data
        }));
        this.refreshTTL(key);
    }
    async refreshTTL(key: string) {
        await redis.expire(key, LOOKUP_TTL);
    }
}
const cache = new DefinitionCache();

interface JishoResponse {
    meta: {
        //HTTP status code
        status: number
    },
    data: JishoDefinition[]
}

interface JishoExternalLink {
    text: string,
    url: string
}

interface JishoDefinition {
    //unique URL slug for this word. multiple words can have the same spelling, the slug differentiates duplicates
    slug: string,
    is_common: boolean,
    //things like 'wanikani22'
    tags: string[],
    //strings like "jlpt-n3", "jlpt-n1"
    jlpt: string[],
    //the first form in this array is the "main" form shown in big letters, the rest are alternate forms
    japanese: JapaneseForm[],
    senses: {
        english_definitions: string[],
        //things like "Noun", "Expression"
        parts_of_speech:[],
        //things like "Usually written using kana alone", "Archaism", "Proverb", "Slang"
        tags: string[],
        //forms that this sense only applies to (like "to die" applies only to the 逝く form of 行く)
        restrictions: string[],
        //additional notes about this sense, e.g. on 暁 this is ["usu. as ~の暁に"]
        info: string[],
        //an array of other searches related to this result, like 吝か has see_also: ["吝かでない"]
        see_also: string[],
        links: JishoExternalLink[],
        antonyms: unknown[],
        //if the word is based on a different word another language this defines that
        source: {
            //examples are for オーダメイド
            language: string, //e.g. English
            word: string //e.g. "order made" (with quotes)
        }[],
    }[],
    attribution: {
        jmdict: boolean,
        jmnedict: boolean,
        dbpedia: boolean
    }
}

export class JishoSearch {
	static schemaVersion = 10;
    static async search(searchText: string): Promise<SearchResults> {
        const cached = await cache.get('jisho', searchText, JishoSearch.schemaVersion);
        if (cached) {
            return cached;
        }
        const searchResultsUrl = (word: string) => `https://jisho.org/search/${encodeURIComponent(word)}`,
            wordUrl = (slug: string) => `https://jisho.org/word/${encodeURIComponent(slug)}`,
            result: JishoResponse = JSON.parse(await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchText)}`));

        if (result.meta.status === 200) { //success
            const definitions = result.data.map((res) : Definition => {
                const reading = res.japanese[0].reading,
                    word = res.japanese[0].word;
                let tags = [];
                if (res.is_common) {
                    tags.push('common');
                }
                tags = tags.concat([
                    ...res.jlpt,
                    ...res.tags
                ])

                return {
                    word: word || reading,
                    href: wordUrl(res.slug),
                    tags,
                    alternateForms: res.japanese.slice(1).map(({word, reading}) => {
                        return {
                            reading,
                            word: word || reading,
                        }
                    }),
                    reading,
                    meanings: res.senses.map((
                        {
                            english_definitions,
                            parts_of_speech=[],
                            tags=[],
                            info=[],
                            restrictions=[],
                            see_also=[],
                            links=[],
                            source=[]
                        }
                    ) => {
                        return {
                        	preInfo: parts_of_speech.join(', '),
                            definition: english_definitions.join(', '),
                            seeAlso: see_also,
                            links: links,
                            info: [
                                ...tags, ...info,
                                ...restrictions.map(restriction => `Only applies to ${restriction}`),
                                // trim because sometimes we don't have a source.word, like for ファンファーレ, it's just {language: "German", word: ""}
                                // the trim just removes the trailing space
                                ...source.map(source => `From ${source.language} ${source.word}`.trim())
                            ].join(', ')
                        }
                    })
                };
            });
            const searchResults: SearchResults = {
                href: searchResultsUrl(searchText),
                definitions,
            };
            await cache.set('jisho', searchText, searchResults, JishoSearch.schemaVersion);
            return searchResults;
        }
    }
}