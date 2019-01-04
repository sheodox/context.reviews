
//querySelector shorthand
const q = sel => document.querySelector(sel);
async function f(url) {
    const response = await fetch(url);
    return await response.json();
}

function openJishoSearch(phrase) {
    window.open(`http://jisho.org/search/${encodeURIComponent(phrase)}`);
}

class PhraseList {
    constructor() {
        this.socket = io({
            path: location.pathname + 'socket.io/socket.io',
            reconnectionAttempts: 1
        });
        
        this.socket.on('connect_error', () => {
            //don't run twice
            if (this.useXHR) {
                return;
            }
            console.log('falling back to xhr');
            this.useXHR = true;
            let prevList = '';
            const refresh = async () => {
                const list = await f('list'),
                    listStr = JSON.stringify(list);
                //don't rebuild the dom if nothing has changed
                if (listStr !== prevList) {
                    this.updateList(list);
                    prevList = listStr;
                }
            };
            setInterval(refresh, 5 * 1000);
            refresh();
        });
        this.DOM = {
            tbody: q('#listbody'),
            count: q('#phrase-count'),
            stop: q('#stop')
        };
        this.rowTemplate = Handlebars.compile(q('#rowTemplate').textContent);
        this.phraseList = [];
        
        this.DOM.tbody.addEventListener('click', e => {
            if (e.target.matches('button[data-action]')) {
                this.handleActionClick(
                    e.target.getAttribute('data-action'),
                    e.target.getAttribute('data-id')
                );
            }
        });
        
        this.socket.on('refresh', this.updateList.bind(this));
        this.socket.emit('list');
        
        this.DOM.stop.addEventListener('click', e => {
            speechSynthesis.cancel();
        });
        const originalStopText = this.DOM.stop.textContent;
        
        q('#undo').addEventListener('click', e => {
            this.undo();
        });
        
        q('body').addEventListener('keydown', e => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey && e.which === 90) {
                this.undo();
            }
        });
        
        const frame = () => {
            this.DOM.stop.textContent = originalStopText + 
                (speechSynthesis.speaking ? '🔊' : '');
            
            requestAnimationFrame(frame);
        };
        frame();
    }
    handleActionClick(action, id) {
        const phrase = this.getPhrase(id);

        switch (action) {
            case 'read':
                say(phrase);
                break;
            case 'jisho':
                openJishoSearch(phrase);
                break;
            case 'delete':
                this.remove(id);
                break;
        }
    }
    getPhrase(id) {
        return this.phraseList.find(item => item.id === id).phrase;
    }
    
    async undo() {
        if (this.useXHR) {
            this.updateList(await f(`undo`));
        }
        else {
            this.socket.emit('undo');
        }
    }

    async remove(id) {
        if (this.useXHR) {
            this.updateList(await f(`remove/${id}`))
        }
        else {
            this.socket.emit('remove', id);
        }
    }
    /**
     * Update the rendered list.
     * @param list - list of phrases from server if known, it's the response to add/remove calls so it's known in those cases without doing another request
     * @returns {Promise<void>}
     */
    updateList(list) {
        this.phraseList = list;
        this.DOM.tbody.innerHTML = '';
        list.forEach(this.makeRow.bind(this));
        this.DOM.count.textContent = ` (${list.length})`
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
        this.DOM.tbody.append(tr);
    }
}

const search = q('#jisho-search'),
    body = q('body');
body.addEventListener('mouseup', e => {
    if (!e.target.closest('a, button, input')) {
        const selected = getSelection().toString();
        say(selected);
        search.value = selected;
    }
    
});

body.addEventListener('keydown', e => {
    if (e.target.tagName !== 'input' && e.which === 83) { //s
        search.focus();
        search.select();
        e.preventDefault();
    }
});


q('#search-form').addEventListener('submit', e => {
    e.preventDefault();
    openJishoSearch(search.value);
});


const pl = new PhraseList();
