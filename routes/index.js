const express = require('express'),
    router = express.Router(),
    tracker = require('../util/tracker');

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
});

router.get('/remove/:id', (req, res) => {
    tracker.remove(req.params.id);
    res.json(tracker.list());
});

router.get('/list', (req, res) => {
    res.json(tracker.list());
});

module.exports = router;
