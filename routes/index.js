const express = require('express'),
    router = express.Router(),
	manifest = require('../public/manifest.json'),
	serialize = require('serialize-javascript'),
    baseLocals = {
        title: 'Context.Reviews',
		site: 'Context.Reviews',
		description: 'Study Japanese with any resource!',
		manifest,
		manifestSerialized: serialize(manifest)
    };

router.get('/', function(req, res, next) {
    if (!req.user) {
         res.render('landing', baseLocals);
    }
    else {
        res.render('index', baseLocals);
    }
});

router.get('/export', function(req, res, next) {
	if (!req.user) {
	    res.redirect('/');
    }
	else {
		res.render('export', {
			...baseLocals,
			title: 'Anki Export - Context.Reviews'
		});
	}
});

router.use('/lookup', require('./lookup'));
router.use('/phrases', require('./phrases'));

module.exports = (sio) => {
    io = sio;

    return router;
};
