import {Router} from 'express';
import serialize from 'serialize-javascript';
import lookupRouter from './lookup';
import phrasesRouter from './phrases';
import {exportServed, landingServed, listServed, privacyServed} from "../metrics";
import {User} from "../entity/User";
import {AppRequest} from "../app";
import {connection} from "../entity";
import {Phrase} from "../entity/Phrase";

const router = Router(),
	manifest = require('../../public/manifest.json'),
	baseLocals = {
		title: 'Context.Reviews',
		site: 'Context.Reviews',
		description: 'Study Japanese with any resource!',
		manifest,
		manifestSerialized: serialize(manifest)
	};

const phraseRepository = connection.then(connection => {
	return connection.getRepository(Phrase);
});

// no need to copy the user's UUID to them, so clone the object minus that property
function copyAllButId(obj: any) {
	const cleanedObject: any = {};

	for (const [key, val] of Object.entries(obj)) {
		if (key !== 'id') {
			cleanedObject[key] = val;
		}
	}
	return cleanedObject;
}

async function getUserLocals(user: User) {
	// do a query to see if they've added at least one phrase as a basic
	// check to see if they've used the site before
	const maybeAPhrase = await (await phraseRepository)
		.find({
			where: {
				userId: user.id
			},
			take: 1
		});

	return {
	    userMetadata: serialize({
			user: {
				displayName: user.displayName,
				profileImage: user.profileImage,
                settings: copyAllButId(user.settings)
			},
			usage: {
				hasAddedPhrases: maybeAPhrase.length > 0
			}
		}),
	};
}

router.get('/', async (req: AppRequest, res, next) => {
	if (!req.user) {
		landingServed.inc();
		res.render('landing', baseLocals);
	}
	else {
	    listServed.inc();
		res.render('index', {
			...baseLocals,
			...(await getUserLocals(req.user))
		});
	}
});

router.get('/export', async (req: AppRequest, res, next) => {
	if (!req.user) {
		res.redirect('/');
	}
	else {
		exportServed.inc();
		res.render('export', {
			...baseLocals,
			...(await getUserLocals(req.user)),
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
