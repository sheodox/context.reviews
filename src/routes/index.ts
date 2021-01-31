import {Router} from 'express';
import serialize from 'serialize-javascript';
import lookupRouter from './lookup';
import phrasesRouter from './phrases';
import {exportServed, landingServed, listServed, privacyServed} from "../metrics";
import {AppRequest, UserWithSettings} from "../app";
import {User, Settings} from '@prisma/client';
import {prisma} from "../util/prisma";

const router = Router(),
	manifest = require('../../public/manifest.json'),
	baseLocals = {
		title: 'Context.Reviews',
		site: 'Context.Reviews',
		description: 'Study Japanese with any resource!',
		manifest,
		manifestSerialized: serialize(manifest)
	};

// no need to copy the user's UUID to them, so clone the object minus that property
function cloneExcept(obj: any, skipProperties: string[]) {
	const cleanedObject: any = {};

	for (const [key, val] of Object.entries(obj)) {
		if (!skipProperties.includes(key)) {
			cleanedObject[key] = val;
		}
	}
	return cleanedObject;
}

async function getUserLocals(user: UserWithSettings) {
	// do a query to see if they've added at least one phrase as a basic
	// check to see if they've used the site before
	const maybeAPhrase = await prisma.phrase.findFirst({
			where: {
				userId: user.id
			}
		});

	return {
	    userMetadata: serialize({
			user: {
				displayName: user.displayName,
				profileImage: user.profileImage,
                settings: cloneExcept(user.settings, ['id', 'userId'])
			},
			usage: {
				hasAddedPhrases: !!maybeAPhrase
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
