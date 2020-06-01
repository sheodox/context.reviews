const express = require('express'),
    router = express.Router(),
    tracker = require('../util/tracker'),
    lookup = require('../util/definition-lookup'),
    userId = req => req.user.user_id,
    baseLocals = {
        title: 'Context.reviews'
    };

let io;
function refresh() {
	return;
	//TODO re-enable? this needs to send the list only to clients for this user
    io.emit('refresh', tracker.list());
}

router.get('/', function(req, res, next) {
    if (!req.user) {
         res.render('landing', baseLocals)
    }
    else {
        res.render('index', baseLocals);
    }
});

router.get('/export', function(req, res, next) {
    res.render('export', { title: 'Anki Export'});
});

const defaultResponse = async (req, res) => {
    res.json(await tracker.list(userId(req)));
    refresh();
}
router.get('/add/:phrase', async (req, res) => {
    await tracker.add(userId(req), req.params.phrase);
    defaultResponse(req, res);
});

router.get('/list', async (req, res) => {
    res.json(await tracker.list(userId(req)));
});

router.get('/remove/:id', async (req, res) => {
    await tracker.remove(userId(req), req.params.id);
    defaultResponse(req, res);
});

router.get('/undo', async (req, res) => {
    await tracker.undo(userId(req));
    defaultResponse(req, res);
});

router.get('/hide/:id', async (req, res) => {
    await tracker.hide(userId(req), req.params.id);
    defaultResponse(req, res);
})

router.get('/show-all', async (req, res) => {
    await tracker.showAll(userId(req));
    defaultResponse(req, res);
})

function sendNoResults(res, source, word) {
    res.json({
        source, definitions: []
    })
}

router.get('/lookup/jisho/:word', async (req, res) => {
    const word = req.params.word,
        jishoResults = await lookup.jisho.search(word);
    if (jishoResults.definitions.length) {
        res.json(
            {source: 'Jisho', ...jishoResults}
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
    if (!jishoResults.definitions.length) {
        return noResults();
    }

    const gooResults = await lookup.goo.search(jishoResults.definitions[0].word);
    if (gooResults.definitions.length) {
        res.json(
            {source: 'Goo辞書', ...gooResults}
        );
    }
    else {
        noResults();
    }
});

module.exports = (sio) => {
    io = sio;

    return router;
};
