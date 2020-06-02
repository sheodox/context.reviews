// ==UserScript==
// @name         Jisho Phrase Stasher
// @namespace    http://context.reviews/
// @version      0.0.7
// @description  Stores looked up phrases for later review
// @author       sheodox
// @match        https://jisho.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==


(function() {
    'use strict';
    const serverKey = 'server_url';
    let serverUrl = GM_getValue(serverKey),
        registeredMenuId;

    /**
     * Setup menu to configure server URL
     */
    function setup() {
        if (registeredMenuId) {
            GM_unregisterMenuCommand(registeredMenuId);
        }
        registeredMenuId = GM_registerMenuCommand(
            !!serverUrl ? 'Change review server URL' : 'Set review server URL',
            setServerURL,
            'u'
        );

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
    
    function setServerURL() {
        const url = prompt('Enter phrase stash server hostname url', serverUrl || '');
        if (url) {
            //trim trailing slashes so we don't double up slashes
            serverUrl = url.replace(/\/$/, '');
            GM_setValue(serverKey, serverUrl);
            setup();
        }
    }

    function record(word) {
        if (serverUrl) {
            const phrase = word || document.querySelector('#keyword').value,
                url = `${serverUrl}/phrases/add/${encodeURIComponent(phrase)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url
            });
        }
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

