import {Router} from 'express';
import serialize from 'serialize-javascript';
import lookupRouter from './lookup';
import phrasesRouter from './phrases';
import {exportServed, landingServed, listServed, privacyServed} from "../metrics";

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
		landingServed.inc();
		res.render('landing', baseLocals);
	}
	else {
	    listServed.inc();
		res.render('index', baseLocals);
	}
});

router.get('/export', function(req, res, next) {
	if (!req.user) {
		res.redirect('/');
	}
	else {
		exportServed.inc();
		res.render('export', {
			...baseLocals,
			title: 'Anki Export - Context.Reviews'
		});
	}
});

router.get('/privacy', (req, res) => {
	privacyServed.inc();
	res.render('privacy', {
		...baseLocals
	})
})

router.use('/lookup', lookupRouter);
router.use('/phrases', phrasesRouter);

export default router;
