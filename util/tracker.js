const fs = require('fs');

class Tracker {
    constructor() {
        this._path = './data/phrases.json';
        this._saveP = Promise.resolve();
        
        try {
            this._data = JSON.parse(fs.readFileSync(this._path));
        } catch(e) {
            this._data = [];
        }
    }

    /**
     * add a new phrase
     * @param phrase
     */
    add(phrase='') {
        phrase = phrase.trim();
        //prevent duplicates if the phrase was looked up again
        if (phrase && !this._data.some(item => item.phrase === phrase)) {
            this._data.push({
                phrase, id: '' + Date.now()
            });
            this._save();
        }
    }

    /**
     * remove a phrase by its id
     * @param id
     */
    remove(id) {
        const idx = this._data.findIndex(p => {
            return p.id === id;
        });
        this._data.splice(idx, 1);
        this._save();
    }

    /**
     * get all phrases
     * @returns {any}
     */
    list() {
        return JSON.parse(JSON.stringify(this._data));
    }

    /**
     * save all phrases to a file
     * @private
     */
    _save() {
        this._saveP = this._saveP.then(() => {
            return new Promise(resolve => {
                fs.writeFile(this._path, JSON.stringify(this._data), resolve)
            });
        })
    }
}

module.exports = new Tracker();
