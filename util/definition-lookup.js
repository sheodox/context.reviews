const fs = require('fs'),
    fetch = require('./fetch'),
    cheerio = require('cheerio');

class Cache {
    constructor() {
        const getData = (path, fallback) => {
            try {
                return JSON.parse(fs.readFileSync(path));
            } catch(e) {
                return fallback;
            }
        };

        this._path = './data/lookup-cache.json';
        this._data = getData(this._path, {jisho: {}, goo: {}});
        
        this._write = Promise.resolve();
    } 
    get(source, word, newestSchemaVersion) {
        const cached = this._data[source][word];
        if (!cached) {
            return;
        }
        const {schemaVersion, data} = this._data[source][word];

        //cache miss if the schema version doesn't match
        if (newestSchemaVersion === schemaVersion) {
            return data;
        }
    }
    set(source, word, data, schemaVersion) {
        this._data[source][word] = {schemaVersion, data};
        this.save();
    }
    save() {
        const saveFile = (path, data) => () => {
            return new Promise(resolve => {
                fs.writeFile(path, JSON.stringify(data, null, 4), resolve);
            });
        };
        
        this._write = this._write
            .then(saveFile(this._path, this._data))
    }
}
const cache = new Cache();

class JishoSearch {
	static schemaVersion = 2;
    static async search(searchText) {
        const cached = cache.get('jisho', searchText, JishoSearch.schemaVersion);
        if (cached) {
            return cached;
        }
        const searchResultsUrl = word => `https://jisho.org/search/${encodeURIComponent(word)}`,
            result = JSON.parse(await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchText)}`));

        if (result.meta.status === 200) { //success
            const definitions = result.data.map(res => {
                const reading = res.japanese[0].reading,
                    word = res.japanese[0].word;
                return {
                    word: res.japanese[0].word || reading,
                    href: searchResultsUrl(word),
                    reading,
                    meanings: res.senses.map(({english_definitions, tags=[], info=[]}) => {
                        return {
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
            cache.set('jisho', searchText, searchResults, JishoSearch.schemaVersion);
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
        const cached = cache.get('goo', word, GooSearch.schemaVersion);
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
