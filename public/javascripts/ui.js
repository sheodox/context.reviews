
//querySelector shorthand
const q = sel => document.querySelector(sel);

class PhraseList {
    constructor() {
        this.socket = io();
        this.tbody = q('#listbody');
        this.count = q('#phrase-count');
        this.rowTemplate = Handlebars.compile(q('#rowTemplate').textContent);
        this.phraseList = [];
        
        this.tbody.addEventListener('click', e => {
            if (e.target.matches('button[data-action]')) {
                this.handleActionClick(
                    e.target.getAttribute('data-action'),
                    e.target.getAttribute('data-id')
                );
            }
        });
        
        this.socket.on('refresh', this.updateList.bind(this));
        this.socket.emit('list');
        
        q('#stop').addEventListener('click', e => {
            speechSynthesis.cancel();
        });
        
        q('#undo').addEventListener('click', e => {
            this.socket.emit('undo');
        });
        
        q('body').addEventListener('keydown', e => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey && e.which === 90) {
                this.socket.emit('undo');
            }
        })
    }
    handleActionClick(action, id) {
        const phrase = this.getPhrase(id);

        switch (action) {
            case 'read':
                say(phrase);
                break;
            case 'jisho':
                window.open(`http://jisho.org/search/${encodeURIComponent(phrase)}`);
                break;
            case 'delete':
                this.remove(id);
                break;
        }
    }
    getPhrase(id) {
        return this.phraseList.find(item => item.id === id).phrase;
    }

    remove(id) {
        this.socket.emit('remove', id);
    }
    /**
     * Update the rendered list.
     * @param list - list of phrases from server if known, it's the response to add/remove calls so it's known in those cases without doing another request
     * @returns {Promise<void>}
     */
    updateList(list) {
        this.phraseList = list;
        this.tbody.innerHTML = '';
        list.forEach(this.makeRow.bind(this));
        this.count.textContent = ` (${list.length})`
    }
    /**
     * Appends a row to the table
     * @param {object} item
     *  @param item.phrase - phrase text
     *  @param item.id - unique identifier from server for this phrase
     */
    makeRow(item) {
        const tr = document.createElement('tr');
        tr.innerHTML = this.rowTemplate(item);
        this.tbody.append(tr);
    }
}

q('body').addEventListener('mouseup', e => {
    if (!e.target.matches('a, button')) {
        say(getSelection().toString());
    }
});



const pl = new PhraseList();
