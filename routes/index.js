const express = require('express'),
    router = express.Router(),
    tracker = require('../util/tracker'),
    lookup = require('../util/definition-lookup');
let io;

function refresh() {
    io.emit('refresh', tracker.list());
}

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Japanese Context Sentence Review'});
});

const defaultResponse = res => {
    res.json(tracker.list());
    refresh();
}
router.get('/add/:phrase', (req, res) => {
    tracker.add(req.params.phrase);
    defaultResponse(res);
});

router.get('/list', (req, res) => {
    res.json(tracker.list());
});

router.get('/remove/:id', (req, res) => {
    tracker.remove(req.params.id);
    defaultResponse(res);
});

router.get('/undo', (req, res) => {
    tracker.undo();
    defaultResponse(res);
});

router.get('/hide/:id', (req, res) => {
    tracker.hide(req.params.id);
    defaultResponse(res);
})

router.get('/show-all', (req, res) => {
    tracker.showAll();
    defaultResponse(res);
})

function sendNoResults(res, source, word) {
    res.json({
        source, data: []
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
