
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
            table: q('#list'),
            tbody: q('#listbody'),
            count: q('#phrase-count'),
            stop: q('#stop'),
            hints: q('#hints'),
            search: q('#jisho-search'),
            definitions: q('#definition-panel')
        };
        this.rowTemplate = Handlebars.compile(q('#row-template').textContent);
        this.definitionTemplate = Handlebars.compile(q('#definition-template').textContent);
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

        q('#search-form').addEventListener('submit', e => {
            e.preventDefault();
            openJishoSearch(this.DOM.search.value);
        });

        const body = q('body');
        body.addEventListener('mouseup', e => {
            if (!e.target.closest('a, button, input')) {
                const selected = getSelection().toString();
                if (selected) {
                    this.textSelected(selected);
                }
            }
        });
        
        body.addEventListener('keydown', e => {
            if (e.target.tagName !== 'input' && e.which === 83) { //s
                this.DOM.search.focus();
                this.DOM.search.select();
                e.preventDefault();
            }
        });
    }
    async textSelected(text) {
        say(text);
        this.DOM.search.value = text;
        this.DOM.definitions.innerHTML = '<h1 class="loading">Loading...</h1>';
        const definitions = await f(`lookup/${encodeURIComponent(text)}`);
        console.log(definitions);
        this.DOM.definitions.innerHTML = definitions.map(this.definitionTemplate).join('');
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
        this.DOM.count.textContent = ` (${list.length})`;
        
        const show = el => el.classList.remove('hidden'),
            hide = el => el.classList.add('hidden');
        
        if (list.length) {
            show(this.DOM.table);
            hide(this.DOM.hints);
        }
        else {
            hide(this.DOM.table);
            show(this.DOM.hints);
        }
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

const hostname = q('#hostname');
hostname.value = location.href;
q('#copy-hostname').addEventListener('click', e => {
    e.preventDefault();
    hostname.select();
    document.execCommand('copy');
});

const pl = new PhraseList();
