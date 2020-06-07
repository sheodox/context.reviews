// ==UserScript==
// @name         Context.Reviews Phrase Stasher
// @namespace    http://context.reviews/
// @version      1.2.0
// @description  Stores looked up phrases for later review
// @author       sheodox
// @match        https://jisho.org/search*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// ==/UserScript==


(function() {
    'use strict';
    const mount = document.createElement('div'),
        style = document.createElement('style');
    style.textContent = `
        #context-reviews-root {
            position: fixed;
            z-index: 10000000;
            top: 0;
            left: 0;
        }
        .context-toast {
            margin: 0.3rem;
            border-radius: 0.2rem;
            box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.6);
            overflow: hidden;
            max-width: 20rem;
        }
        .context-toast a {
            color: black;
        }
        .context-toast img {
            width: 2rem;
            height: 2rem;
        }
        .context-toast.error {
            background: #e83450;
            color: black;
        }
        .context-toast.success {
            background: #46fb51;
            color: black;
        }
        .context-toast.hidden {
            display: none;
        }
        .context-toast ul {
            margin: 0;
            list-style: none;
        }
        .context-toast-phrase:hover {
            background: #3e4553;
        }
        .context-toast-phrase {
            display: flex;
            padding: 0.4rem;
        }
        .context-toast-phrase span {
            color: white;
            flex: 1;
        }
        .context-toast-phrase span.deleted {
            text-decoration: line-through;
            color: #888;
        }
        .context-toast-phrase button {
            flex: 0;
            margin: 0;
            padding: 0 0.1rem;
            border-radius: 3px;
            white-space: nowrap;
            color: #3db4f2;
            background: #252b31;
            transition: background 0.1s, color 0.1s;
        }
        .context-toast-phrase button:disabled {
            background: #2e3b48;
            color: #606060;
        }
        .context-toast-phrase button:not(:disabled):hover {
            color: red;
        }
        .context-toast-main {
            margin: 1rem;
            margin: 0.3rem;
        }
        .context-toast-phrase-list {
            margin: 0.3rem;
            background: #343944;
        }
        .ttl-track {
            height: 0.3rem;
            background: #343944;
            border-bottom: 1px solid #343944;
            width: 100%;
        }
        .ttl-bar {
            background: #3db4f2;
            height: 100%;
        }
    `;
    mount.id = "context-reviews-root"
    document.head.appendChild(style);
    document.body.appendChild(mount);

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
                <button @click="removePhrase(phrase.phrase_id)" :disabled="deleted">
                    削除
                </button>
            </li>
		`,
        methods: {
            removePhrase(id) {
                const url = `{{--server--}}/phrases/remove/${this.phrase.phrase_id}`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: (res) => {
                    	this.deleted = true;
                    },
                    onerror: res => {
                        createToast({
                            type: 'error',
                            ttl: 5000,
                            text: `Couldn't connect to Context.Reviews. Is the site down?`
                        })
                    }
                });
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
                
                <div class="context-toast-main">
                    <img src="{{--server--}}/favicon.png" alt="Context.Reviews logo"/>
                    <a href="{{--server--}}" target="_blank" rel="noreferrer noopener">{{toast.text}}</a>
                </div>
                
                <ul v-if="toast.phrases" class="context-toast-phrase-list">
                    <toast-phrase v-for="phrase in toast.phrases" :phrase="phrase" :key="phrase.phrase_id" />
                </ul>                
            </div>
        `,
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
                    this.ttlStyle = (this.ttlMs / this.ttlMax) * 100 + '%';
                }

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
            const firstResultText = $('.concept_light .concept_light-representation .text').eq(0).text().trim()

            if (firstResultText !== lastKnownFirstResult) {
                lastKnownFirstResult = firstResultText;
                onResultsChange();
            }
        }, 20);
    }
    
    function record(word) {
        const phrase = word || document.querySelector('#keyword').value,
            url = `{{--server--}}/phrases/add/${encodeURIComponent(phrase)}?diff=true`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (res) => {
                if (res.status === 200) {
                    const phrases = JSON.parse(res.responseText);
                    //if nothing was actually added, don't show any toasts
                    if (phrases.length) {
                        createToast({
                            type: 'success',
                            ttl: 5000,
                            text: `Phrases added.`,
                            phrases
                        })
                    }
                    return;
                }

                const error = {
                    0: `Couldn't connect to Context.Reviews. Is the site down?`,
                    401: `You aren't signed in!`
                }[res.status]
                createToast({
                    type: 'error',
                    text: error || `Error: status code ${res.status}`
                })
            },
            onerror: res => {
                createToast({
                    type: 'error',
                    text: `Couldn't connect to Context.Reviews. Is the site down?`
                })
            }
        });
    }

    //anything that needs to happen whenever the list of search results change
    function onResultsChange() {
        //.concept_light-wrapper is the column that contains the reading for the word, as well as the links
        $('.concept_light').each(function() {
            const $wrapper = $(this),
                word = $wrapper.find('.concept_light-representation .text').text().trim(),
                $addReview = $('<a />')
                    .text(`Add ${word} to review list`)
                    .attr({
                        href: '#',
                        class: 'concept_light-status_link'
                    })
                    .on('click', (e) => {
                        record(word)
                        //prevent scrolling to the top
                        e.preventDefault();
                    })

            //.concept_light-status is the direct container of the badges and links beneath the word
            $wrapper
                //it's easy to accidentally open the "links" dropdown when moving your cursor down the list
                //of links, so put the add button right before it so that remains on the bottom
                .find('.concept_light-status a[data-dropdown]')
                .before($addReview);

        })
    }

    setup();
    record();
})();

