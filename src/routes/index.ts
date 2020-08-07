import {Router} from 'express';
import serialize from 'serialize-javascript';

const router = Router(),
	manifest = require('../../public/manifest.json'),
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

router.get('/privacy', (req, res) => {
	res.render('privacy', {
		...baseLocals
	})
})

import lookupRouter from './lookup';
import phrasesRouter from './phrases';
router.use('/lookup', lookupRouter);
router.use('/phrases', phrasesRouter);

export default router;
