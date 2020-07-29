// ==UserScript==
// @name         Context.Reviews Phrase Stasher
// @namespace    http://context.reviews/
// @version      2.0.0
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
        .context-toast.error .context-toast-main {
            background: #e83450;
            color: black;
        }
        .context-toast.success .context-toast-main {
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
            margin-right: 0.2rem;
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
            padding: 0.3rem;
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
                    <img src="https://context.reviews/favicon.png" alt="Context.Reviews logo"/>
                    <a href="https://context.reviews" target="_blank" rel="noreferrer noopener">{{toast.text}}</a>
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

    createToast({
        type: 'error',
		ttl: 60000,
        text: `Context.Reviews no longer uses a Tampermonkey script, please visit the "Help" menu on Context.Reviews to find links to the new Firefox and Chrome browser extensions. You can disable or remove this script, if you don't otherwise use Tampermonkey you can uninstall that as well.`
    })
})();

