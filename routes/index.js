const express = require('express'),
    router = express.Router(),
    tracker = require('../util/tracker'),
    lookup = require('../util/definition-lookup');
let io;

function refresh() {
    io.emit('refresh', tracker.list());
}

/**
 * send node modules files 
 */
router.get('/module/:name', (req, res, next) => {
    const modules = {
        'handlebars.js' : 'node_modules/handlebars/dist/handlebars.runtime.js'
    },
        requested = modules[req.params.name];
    if (requested) {
        res.sendfile(requested)
    }
    else {
        next();
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Japanese Context Sentence Review'});
});

router.get('/add/:phrase', (req, res) => {
    tracker.add(req.params.phrase);
    res.json(tracker.list());
    refresh();
});

router.get('/list', (req, res) => {
    res.json(tracker.list());
});

router.get('/remove/:id', (req, res) => {
    tracker.remove(req.params.id);
    res.json(tracker.list());
    refresh();
});

router.get('/undo', (req, res) => {
    tracker.undo();
    res.json(tracker.list());
    refresh();
});

function sendNoResults(res, source, word) {
    res.json({
        source, data: [{word: 'No results', definitions: [{definition:`No definitions found for ${word}`}]}]
    })
}

router.get('/lookup/jisho/:word', async (req, res) => {
    const word = req.params.word,
        jishoResults = await lookup.jisho.search(word);
    if (jishoResults.length) {
        res.json(
            {source: 'Jisho', data: jishoResults}
        );
    }
    else {
        sendNoResults(res, 'Jisho', word);
    }
});


router.get('/lookup/goo/:word', async (req, res) => {
    const word = req.params.word,
        noResults = () => sendNoResults(res, 'Goo辞書', word),
        //the jisho search should be cached
        jishoResults = await lookup.jisho.search(word);
    if (!jishoResults.length) {
        return noResults();
    }

    const gooResults = await lookup.goo.search(jishoResults[0].word);
    if (gooResults.length) {
        res.json(
            {source: 'Goo辞書', data: gooResults}
        );
    }
    else {
        noResults();
    }
});

module.exports = (sio) => {
    io = sio;
    io.on('connection', socket => {
        socket.on('remove', id => {
            tracker.remove(id);
            refresh();
        });

        socket.on('list', () => {
            socket.emit('refresh', tracker.list());
        });
        
        socket.on('undo', () => {
            tracker.undo();
            refresh();
        })
    });
    
    return router;
};
