const express = require('express'),
    router = express.Router(),
    tracker = require('../util/tracker'),
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
	if (!req.user) {
	    res.redirect('/');
    }
	else {
		res.render('export', {title: 'Anki Export'});
	}
});

router.use('/lookup', require('./lookup'));
router.use('/phrases', require('./phrases'));

module.exports = (sio) => {
    io = sio;

    return router;
};
