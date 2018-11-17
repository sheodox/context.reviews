// ==UserScript==
// @name         Jisho Phrase Stasher
// @namespace    http://tampermonkey.net/
// @version      0.0.6
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
    
    function record() {
        if (serverUrl) {
            const phrase = document.querySelector('#keyword').value,
                url = `${serverUrl}/add/${encodeURIComponent(phrase)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url
            });
        }
    }
    setup();
    record();
})();

