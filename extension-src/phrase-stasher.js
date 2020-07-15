import Vue from 'vue';
import './extension-style.scss';

const mount = document.createElement('div');
mount.id = "context-reviews-root"
document.body.appendChild(mount);
const COULDNT_CONNECT_ERROR = `Couldn't connect to Context.Reviews. Is the site down?`,
    extensionNamespace = typeof browser !== "undefined" ? browser : chrome;

function messageBackground(handler, data) {
    return new Promise((resolve) => {
    	const message = {
            handler,
            data
        };
        extensionNamespace.runtime.sendMessage(message, (response) => {
            resolve(response);
        });
    });
}

function getResourceUrl(url) {
    return extensionNamespace.extension.getURL(url);
}

Vue.component('toast-phrase', {
    props: ['phrase'],
    data: function () {
        return {
            deleted: false
        }
    },
    template: `
            <li class="context-toast-phrase">
                <span :class="{deleted: deleted}">
                    {{phrase.phrase}}
                </span>
                <button @click="removePhrase(phrase.phrase_id)" v-if="!deleted">
                    Delete
                </button>
                <button @click="addPhrase(phrase.phrase)" v-if="deleted">
                    Add
                </button>
            </li>
		`,
    methods: {
        async removePhrase(id) {
            const {status} = await messageBackground('removePhrase', this.phrase.phrase_id)
            if (status === 200) {
                this.deleted = true;
            }
            else if (status === 0) {
                createToast({
                    type: 'error',
                    ttl: 5000,
                    text: COULDNT_CONNECT_ERROR
                })
            }
        },
        async addPhrase(phrase) {
            const {status} = await messageBackground('addPhrase', phrase)
            if (status === 200) {
                this.deleted = false;
            }
            else if (status === 0) {
                createToast({
                    type: 'error',
                    ttl: 5000,
                    text: COULDNT_CONNECT_ERROR
                })
            }
        }
    },
})

Vue.component('toast', {
    props: ['toast', 'frozen'],
    data: function() {
        return {
            hidden: false,
            ttlStyle: '100%',
            ttlMs: null,
            ttlMax: null,
            lastFrame: null,
        };
    },
    template: `
            <div :class="['context-toast', toast.type, {hidden: hidden}]">
                <div class="ttl-track">
                    <div class="ttl-bar" :style="{width: ttlStyle}" />
                </div>
                
                <div class="context-toast-title-bar">
                    <img src="${getResourceUrl('/icons/context-reviews-96.png')}" alt="Context.Reviews logo"/>
                    <a href="{{--server--}}" target="_blank" rel="noreferrer noopener">{{toast.text}}</a>
                    <button @click="hideToast()">
                        &Cross;
                        <span class="sr-only">Close toast</span>
                    </button>
                </div>
                
                <ul v-if="toast.phrases" class="context-toast-phrase-list">
                    <toast-phrase v-for="phrase in toast.phrases" :phrase="phrase" :key="phrase.phrase_id" />
                </ul>                
            </div>
        `,
    methods: {
        hideToast () {
            this.ttlMs = 0;
            this.hidden = true;
        }
    },
    mounted() {
        this.ttlMs = this.toast.ttl || 3000;
        this.ttlMax = this.ttlMs;
        this.lastFrame = Date.now();

        //slowly tick down and eventually hide the toast, providing a reverse loading bar showing how much time is left
        const tickTTL = () => {
            const now = Date.now();
            //if the user is hovering over the toasts we don't want them to randomly disappear, they probably want to interact with them
            if (!this.frozen) {
                this.ttlMs -= (now - this.lastFrame);
            }
            else {
                //reset the ttl on hover
                this.ttlMs = this.ttlMax;
            }

            this.ttlStyle = (this.ttlMs / this.ttlMax) * 100 + '%';
            this.lastFrame = now;
            //keep ticking down the timer until the toast TTL has expired, then hide it
            if (this.ttlMs > 0) {
                requestAnimationFrame(tickTTL)
            }
            else {
                this.hidden = true;
            }
        }
        tickTTL();
        setTimeout(() => {
        }, this.toast.ttl || 3000);
    }
});


mount.innerHTML = `
    <div @mouseenter="mouseEnter()" @mouseleave="mouseLeave()">
        <toast v-for="toast in toasts" :toast="toast" :key="toast.text" :frozen="frozen"/>
    </div>
`;

let createToast;
const app = new Vue({
    el: mount,
    data: {
        toasts: [],
        frozen: false,
    },
    methods: {
        mouseEnter() {
            this.frozen = true;
        },
        mouseLeave() {
            this.frozen = false;
        }
    },
    mounted() {
        createToast = (toastData) => {
            this.toasts.push(toastData);
        }
    }
});

function setup() {
    //if the first result ever changes (like when clicking through parts of a sentence), run a callback
    let lastKnownFirstResult = '';
    setInterval(() => {
        const firstResult = document.querySelector('.concept_light .concept_light-representation .text');

        if (firstResult && firstResult !== lastKnownFirstResult) {
            lastKnownFirstResult = firstResult;
            onResultsChange();
        }
    }, 20);
}

async function record(word) {
    const phrase = word || document.querySelector('#keyword').value,
        {status, response} = await messageBackground('addPhrase', phrase)

    if (status === 200) {
        const numNew = response.addedPhrases.length;
        //if nothing was actually added, don't show any toasts
        if (numNew > 0) {
            createToast({
                type: 'success',
                ttl: 5000,
                text: `${numNew} phrase${numNew === 1 ? '' : 's'} added (${response.stats.totalPhrases} total)`,
                phrases: response.addedPhrases
            })
        }
        return;
    }

    const error = {
        0: COULDNT_CONNECT_ERROR,
        401: `You aren't signed in!`
    }[status]

    createToast({
        type: 'error',
        text: error || `Error: status code ${status}`
    });
}

//anything that needs to happen whenever the list of search results change
function onResultsChange() {
    //.concept_light-wrapper is the column that contains the reading for the word, as well as the links
    for (const wrapper of document.querySelectorAll('.concept_light')) {
        const word = wrapper.querySelector('.concept_light-representation .text').textContent.trim(),
            addReview = document.createElement('a');

        addReview.textContent = `Add ${word} to Context.Reviews`;
        addReview.setAttribute('href', '#');
        addReview.classList.add('concept_light-status_link');
        addReview.addEventListener('click', e => {
            record(word)
            //prevent scrolling to the top
            e.preventDefault();
        })

        //.concept_light-status is the direct container of the badges and links beneath the word
        //it's easy to accidentally open the "links" dropdown when moving your cursor down the list
        //of links, so put the add button right before it so that remains on the bottom
        wrapper.querySelector('.concept_light-status a[data-dropdown]')
            .after(addReview);
    }
}

setup();
record();
