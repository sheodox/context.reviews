import { Router } from 'express';
import serialize from 'serialize-javascript';
import lookupRouter from './lookup.js';
import phrasesRouter from './phrases.js';
import { exportServed, landingServed, listServed, privacyServed } from '../metrics.js';
import { AppRequest, UserWithSettings } from '../app.js';
import { prisma } from '../util/prisma.js';
import { tracker } from '../util/tracker.js';
import { getManifest } from '../util/manifest.js';

const router = Router(),
	baseLocals = {
		title: 'Context.Reviews',
		site: 'Context.Reviews',
		description: 'Study Japanese with any resource!',
		development: process.env.NODE_ENV === 'development',
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
			userId: user.id,
		},
	});

	return {
		user: {
			displayName: user.displayName,
			profileImage: user.profileImage,
			settings: cloneExcept(user.settings, ['id', 'userId']),
		},
		usage: {
			hasAddedPhrases: !!maybeAPhrase,
		},
	};
}

async function getUserBootstrapData(userId: string) {
	return {
		phrases: await tracker.list(userId),
	};
}

router.get('/', async (req: AppRequest, res) => {
	if (!req.user) {
		landingServed.inc();

		const { cssImports, scriptEntryFile, assetManifest } = await getManifest('src/static/landing-app/landing-main.ts');
		res.render('landing', {
			...baseLocals,
			cssImports,
			scriptEntryFile,
			appBootstrap: serialize({
				assetManifest,
			}),
			assetManifest,
		});
	} else {
		listServed.inc();

		const { cssImports, scriptEntryFile, assetManifest } = await getManifest('src/static/list-app/list-main.ts');
		res.render('index', {
			...baseLocals,
			appBootstrap: serialize({
				...(await getUserLocals(req.user)),
				initialState: await getUserBootstrapData(req.user.id),
				assetManifest,
			}),
			assetManifest,
			cssImports,
			scriptEntryFile,
		});
	}
});

router.get('/export', async (req: AppRequest, res) => {
	if (!req.user) {
		res.redirect('/');
	} else {
		exportServed.inc();

		const { cssImports, scriptEntryFile, assetManifest } = await getManifest('src/static/export-app/export-main.ts');
		res.render('export', {
			...baseLocals,
			appBootstrap: serialize({
				...(await getUserLocals(req.user)),
				initialState: await getUserBootstrapData(req.user.id),
				assetManifest,
			}),
			title: 'Anki Export - Context.Reviews',
			assetManifest,
			cssImports,
			scriptEntryFile,
		});
	}
});

router.get('/privacy', (req, res) => {
	privacyServed.inc();
	res.render('privacy', {
		...baseLocals,
	});
});

router.use('/lookup', lookupRouter);
router.use('/phrases', phrasesRouter);

export default router;
