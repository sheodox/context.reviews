// ==UserScript==
// @name         Context.Reviews Phrase Stasher
// @namespace    http://context.reviews/
// @version      1.0.0
// @description  Stores looked up phrases for later review
// @author       sheodox
// @match        https://jisho.org/search/*
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
            padding: 0.5rem 1rem;
            margin: 0.3rem;
            border-radius: 0.2rem;
            box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.6);
        }
        .context-toast a {
            color: black;
        }
        .context-toast img {
            width: 1rem;
            height: 1rem;
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
    `;
    mount.innerHTML = `
        <toast v-for="toast in toasts" :toast="toast" :key="toast.text"/>
    `;
    mount.id = "context-reviews-root"
    document.head.appendChild(style);
    document.body.appendChild(mount);

    Vue.component('toast', {
        props: ['toast'],
        data: function() {
            return {
                hidden: false,
            };
        },
        template: `
            <div :class="['context-toast', toast.type, {hidden: hidden}]">
                <img src="{{--server--}}/favicon.png" alt="Context.Reviews logo"/>
                <a href="{{--server--}}" target="_blank" rel="noreferrer noopener">{{toast.text}}</a>
            </div>
        `,
        mounted() {
            setTimeout(() => {
                this.hidden = true;
            }, this.toast.ttl || 3000);
        }
    });


    let createToast;
    const app = new Vue({
        el: mount,
        data: {
            toasts: []
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
            url = `{{--server--}}/phrases/add/${encodeURIComponent(phrase)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (res) => {
                if (res.status === 200) {
                    const phrases = JSON.parse(res.responseText);
                    createToast({
                        type: 'success',
                        ttl: 3000,
                        text: `Phrase added, you have ${phrases.length} ${phrases.length === 1 ? 'phrase' : 'phrases'}.`
                    })
                    return;
                }

                const error = {
                    0: `Couldn't connect to Context.Reviews. Is the site down?`,
                    401: `You aren't signed in!`
                }[res.status]
                createToast({
                    type: 'error',
                    ttl: 3000,
                    text: error || `Error: status code ${res.status}`
                })
            },
            onerror: res => {
                createToast({
                    type: 'error',
                    ttl: 3000,
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

