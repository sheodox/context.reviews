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
    get(source, word) {
        return this._data[source][word];
    }
    set(source, word, data) {
        this._data[source][word] = data;
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
    static async search(searchText) {
        const cached = cache.get('jisho', searchText);
        if (cached) {
            return cached;
        }
        const result = JSON.parse(await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(searchText)}`)); 
        
        if (result.meta.status === 200) { //success
            const data = result.data.map(res => {
                const reading = res.japanese[0].reading;
                return {
                    word: res.japanese[0].word || reading,
                    reading,
                    definitions: res.senses.map(({english_definitions, tags=[], info=[]}) => {
                        return {
                            definition: english_definitions.join(', '),
                            info: [...tags, ...info].join(', ')
                        }
                    })
                }
            });
            cache.set('jisho', searchText, data);
            return data;
        }
    }
}

class GooSearch {
    static async fetch$(url) {
        return cheerio.load(await fetch(url));
    }
    static async search(word) {
        const cached = cache.get('goo', word);
        if (cached) {
            return cached;
        }
        const $search = await GooSearch.fetch$(`https://dictionary.goo.ne.jp/srch/all/${encodeURIComponent(word)}/m1u/`),
            //get a list of links to individual definition pages. often the first result isn't what we want
            definitionLinks = [].map.call($search('#NR-main').find('a[href^="/jn/"]'), a => a.attribs.href);
        const lookups = [];

        for(let i = 0; i < definitionLinks.length; i++) {
            lookups.push(new Promise(async (resolve, reject) => {
                const $ = await GooSearch.fetch$(`https://dictionary.goo.ne.jp${definitionLinks[i]}`),
                    $main = $('#NR-main');
                //some words have a single definitions, others have multiple definitions each their own 'ol' with a in a <strong> at the beginning of the definition
                const $definition = $main.find('.meaning_area .contents'),
                    $ols = $definition.find('ol');
                resolve({
                    word: $('title').text().replace('の意味 - goo国語辞書', '').trim(),
                    definitions: [].map.call($ols.length ? $ols : $definition,
                        //strip out the hard coded numbering when there are multiple definitions
                        el => {return {definition: $(el).text().trim().replace(/^[０-９\s]*/, '')}}
                    )
                });
            }));
        }
        return Promise.all(lookups).then((definitions) => {
            cache.set('goo', word, definitions);
            return definitions;
        });
    }
}

module.exports = {
    jisho: JishoSearch,
    goo: GooSearch
};
