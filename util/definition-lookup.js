const fs = require('fs'),
    fetch = require('./fetch'),
    cheerio = require('cheerio'),
    {redis} = require('./redis');

const LOOKUP_TTL = 60 * 60 * 24 * 90; // about three months in seconds

class Cache {
    constructor() {}
    cacheKey(source, word) {
        return `dictionary-${source}-${word}`;
    }
    async get(source, word, newestSchemaVersion) {
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
    async set(source, word, data, schemaVersion) {
        const key = this.cacheKey(source, word);
        await redis.set(key, JSON.stringify({
            schemaVersion, data
        }));
        this.refreshTTL(key);
    }
    async refreshTTL(key) {
        await redis.expire(key, LOOKUP_TTL);
    }
}
const cache = new Cache();

class JishoSearch {
	static schemaVersion = 9;
    static async search(searchText) {
        const cached = await cache.get('jisho', searchText, JishoSearch.schemaVersion);
        if (cached) {
            return cached;
        }
        const searchResultsUrl = word => `https://jisho.org/search/${encodeURIComponent(word)}`,
            wordUrl = slug => `https://jisho.org/word/${encodeURIComponent(slug)}`,
            result = JSON.parse(await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchText)}`));

        if (result.meta.status === 200) { //success
            const definitions = result.data.map(res => {
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
                    word: res.japanese[0].word || reading,
                    href: wordUrl(res.slug),
                    tags,
                    alternateForms: res.japanese.slice(1).map(({word, reading}) => {
                    	//since goo searches never have readings, it's easier to show words
                        //that are only kana as if that's the word, and it has no extra reading
                        //that way the UI only needs to conditionally render readings, and not both
                        return {
                            reading,
                            word: word || reading,
                        }
                    }),
                    reading,
                    meanings: res.senses.map(({english_definitions, parts_of_speech=[], tags=[], info=[], restrictions=[], see_also=[], links=[]}) => {
                        return {
                        	preInfo: parts_of_speech.join(', '),
                            definition: english_definitions.join(', '),
                            seeAlso: see_also,
                            links: links,
                            info: [
                                ...tags, ...info,
                                ...restrictions.map(restriction => `Only applies to ${restriction}`)
                            ].join(', ')
                        }
                    })
                }
            });
            const searchResults = {
                href: searchResultsUrl(searchText),
                definitions,
            };
            await cache.set('jisho', searchText, searchResults, JishoSearch.schemaVersion);
            return searchResults;
        }
    }
}

module.exports = {
    jisho: JishoSearch,
};
