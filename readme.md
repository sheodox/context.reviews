# Japanese Context Sentence Review

Automatically cache sentences that were looked up on Jisho.org so you can review them all at once later. Has built in speech synthesis to read whatever you've highlighted, or read the entire sentence out. Also has quick access to look up the context sentence on Jisho again.

This is for use with [my other userscripts](https://github.com/sheodox/japanese-userscripts) particularly with the yahoo search redirect one. With these combined you can read an ebook, lookup an entire context sentence at once that contains an unknown word on Jisho.org (by using the Yahoo 辞書 context menu item in your ebook reader), then review all the sentences you looked up at the end of your study session.

## Installation

1. git clone this repository
1. `npm install` (assuming you have [node.js](https://nodejs.org/en/) 8+ installed)
1. `npm start`
1. Go to port 4000 on whatever the hostname of the machine you did steps 1-3 on in your browser (http://localhost:4000 if installed locally)
1. Click "Install userscript" (assuming you have [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
1. Go to [Jisho.org](http://jisho.org)
1. Click the Tampermonkey menu in Chrome's toolbar and click "Set review server URL" and enter the same url as in step four when prompted

## Example

![screenshot](https://raw.githubusercontent.com/sheodox/japanese-context-sentence-review/master/images/screenshot.png)
