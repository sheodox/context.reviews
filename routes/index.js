const express = require('express'),
    router = express.Router(),
    baseLocals = {
        title: 'Context.Reviews',
		site: 'Context.Reviews',
		description: 'Study Japanese with any resource!',
		manifest: require('../public/manifest.json')
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
		res.render('export', {title: 'Anki Export - Context.Reviews'});
	}
});

router.use('/lookup', require('./lookup'));
router.use('/phrases', require('./phrases'));

module.exports = (sio) => {
    io = sio;

    return router;
};
