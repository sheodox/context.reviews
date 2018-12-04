const fs = require('fs'),
    trim = require('./trim');

class Tracker {
    constructor() {
        this._path = './data/phrases.json';
        this._saveP = Promise.resolve();
        this._deleteHistory = [];
        this._maxInHistory = 100;
        
        try {
            this._data = JSON.parse(fs.readFileSync(this._path));
        } catch(e) {
            this._data = [];
        }
    }

    /**
     * Split a long search phrase into sentences.
     * @param phrase
     * @returns {*|string[]}
     */
    static split(phrase) {
        const delimiter = '__splitter__';
        ['。', '！', '？'].forEach(punctuation => {
            phrase = phrase.replace(new RegExp(punctuation, 'g'), `${punctuation}${delimiter}`);
        });
        return phrase.split(delimiter);
    }

    /**
     * Gets a unique ID, can't just use timestamps because several phrases can be added at the same time
     * @returns {number}
     */
    getGUID() {
        return String(1 + this._data.reduce((highest, next) => {
            return Math.max(highest, parseInt(next.id, 0));
        }, 0));
    }
    
    /**
     * add a new phrase
     * @param phrase
     */
    add(phrase='') {
        //add each sentence individually
        Tracker.split(phrase).forEach(phrase => {
            phrase = trim(phrase);
            //prevent duplicates if the phrase was looked up again
            if (phrase && !this._data.some(item => item.phrase === phrase)) {
                this._data.push({
                    phrase, id: this.getGUID()
                });
                this._save();
            }
        });
    }

    /**
     * remove a phrase by its id
     * @param id
     */
    remove(id) {
        const idx = this._data.findIndex(p => {
            return p.id === id;
        });
        
        //keep a bit of a history around so we can undo
        this._deleteHistory.push({data: this._data[idx], index: idx});
        if (this._deleteHistory > this._maxInHistory) {
            this._deleteHistory.shift();
        }
        
        this._data.splice(idx, 1);
        this._save();
    }

    /**
     * Undelete the last thing from the history
     */
    undo() {
        if (this._deleteHistory.length) {
            const lastDeleted = this._deleteHistory.pop();
            //other things may have been added since this was deleted, make sure it's unique again
            lastDeleted.data.id = this.getGUID();
            this._data.splice(lastDeleted.index, 0, lastDeleted.data);
            this._save();
        }
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
                fs.writeFile(this._path, JSON.stringify(this._data, null, 4), resolve)
            });
        })
    }
}

module.exports = new Tracker();
