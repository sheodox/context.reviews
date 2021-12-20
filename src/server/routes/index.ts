import { Router, Response } from 'express';
import serialize from 'serialize-javascript';
import lookupRouter from './lookup.js';
import phrasesRouter from './phrases.js';
import { appServed, landingServed, privacyServed } from '../metrics.js';
import { AppRequest, UserWithSettings } from '../app.js';
import { prisma } from '../util/prisma.js';
import { tracker } from '../util/tracker.js';
import { getManifest } from '../util/manifest.js';
import { safeAsyncRoute } from '../middleware/error-handler.js';

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

async function serveApp(req: AppRequest, res: Response) {
	const { cssImports, scriptEntryFile, assetManifest } = await getManifest('src/static/main.ts');
	appServed.inc();

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

router.get(
	'/',
	safeAsyncRoute(async (req: AppRequest, res) => {
		if (!req.user) {
			landingServed.inc();

			const { cssImports, scriptEntryFile, assetManifest } = await getManifest(
				'src/static/landing-app/landing-main.ts'
			);
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
			serveApp(req, res);
		}
	})
);

['/export', '/settings', '/about'].forEach((frontendRoute) => {
	router.get(
		frontendRoute,
		safeAsyncRoute(async (req: AppRequest, res) => {
			if (!req.user) {
				res.redirect('/');
			} else {
				serveApp(req, res);
			}
		})
	);
});

router.get(
	'/privacy',
	safeAsyncRoute(async (req, res) => {
		privacyServed.inc();
		const { assetManifest } = await getManifest();

		res.render('privacy', {
			assetManifest,
			...baseLocals,
		});
	})
);

router.use('/lookup', lookupRouter);
router.use('/phrases', phrasesRouter);

export default router;
