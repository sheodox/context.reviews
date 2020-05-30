const fs = require('fs'),
    fetch = require('./fetch'),
    cheerio = require('cheerio'),
    {promisify} = require('util'),
    redisModule = require('redis'),
    redisClient = redisModule.createClient({
        host: 'redis'
    }),
    redis = {};
//node-redis doesn't natively support a promise API
['get', 'set'].forEach(method => redis[method] = promisify(redisClient[method]).bind(redisClient));

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
            return data;
        }
    }
    async set(source, word, data, schemaVersion) {
        await redis.set(this.cacheKey(source, word), JSON.stringify({
            schemaVersion, data
        }));
    }
}
const cache = new Cache();

class JishoSearch {
	static schemaVersion = 5;
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
                    meanings: res.senses.map(({english_definitions, parts_of_speech=[], tags=[], info=[]}) => {
                        return {
                        	preInfo: parts_of_speech.join(', '),
                            definition: english_definitions.join(', '),
                            info: [...tags, ...info].join(', ')
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

class GooSearch {
    static schemaVersion = 2;
    static async fetch$(url) {
        return cheerio.load(await fetch(url));
    }
    static async search(word) {
        const cached = await cache.get('goo', word, GooSearch.schemaVersion);
        if (cached) {
            return cached;
        }
        const searchUrl = `https://dictionary.goo.ne.jp/srch/all/${encodeURIComponent(word)}/m1u/`,
            $search = await GooSearch.fetch$(searchUrl),
            //get a list of links to individual definition pages. often the first result isn't what we want
            definitionLinks = [].map.call($search('#NR-main').find('a[href^="/word/"]:not([href^="/word/en/"])'), a => a.attribs.href);
        const lookups = [];

        for(let i = 0; i < definitionLinks.length; i++) {
            lookups.push(new Promise(async (resolve, reject) => {
                const definitionUrl = `https://dictionary.goo.ne.jp${definitionLinks[i]}`,
                    $ = await GooSearch.fetch$(definitionUrl),
                    $main = $('#NR-main');
                //some words have a single definitions, others have multiple definitions each their own 'ol' with a in a <strong> at the beginning of the definition
                const $definition = $main.find('.meaning_area .contents'),
                    $ols = $definition.find('ol');
                resolve({
                    word: $('title').text().replace('の意味 - goo国語辞書', '').trim(),
                    href: definitionUrl,
                    meanings: [].map.call($ols.length ? $ols : $definition,
                        //strip out the hard coded numbering when there are multiple definitions
                        el => {return {definition: $(el).text().trim().replace(/^[０-９\s]*/, '')}}
                    )
                });
            }));
        }
        return Promise.all(lookups).then((definitions) => {
        	const searchResults = {
                href: searchUrl,
                definitions
            };
            cache.set('goo', word, searchResults, GooSearch.schemaVersion);
            return searchResults;
        });
    }
}

module.exports = {
    jisho: JishoSearch,
    goo: GooSearch
};
