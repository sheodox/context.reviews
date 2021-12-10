import { NextFunction, Response, Router } from 'express';
import { safeAsyncRoute } from '../middleware/error-handler.js';
import { AppRequest } from '../app.js';
import { validateSettingsSchema } from '../util/settings.js';
import { getUserId, requireAuth } from '../middleware/route-helpers.js';
import { prisma } from '../util/prisma.js';
import { tracker } from '../util/tracker.js';
import { UserStats } from '../../shared/types/app.js';

const router = Router();

router.use(requireAuth);

router.post(
	`/settings`,
	safeAsyncRoute(async (req: AppRequest, res: Response, next: NextFunction) => {
		const valid = validateSettingsSchema(req.body);

		if (!valid) {
			next({ status: 400 });
			return;
		}

		await prisma.settings.update({
			where: {
				userId: req.user.id,
			},
			data: req.body,
		});

		res.send();
	})
);

//used by the extension to show the active phrase count on the browser action button badge
router.get(
	'/stats',
	safeAsyncRoute(async (req, res) => {
		res.json({
			activePhrases: await tracker.countActive(getUserId(req)),
		});
	})
);

//used by the Stats modal to show interesting statistics
router.get(
	'/full-stats',
	safeAsyncRoute(async (req, res) => {
		const userId = getUserId(req),
			user = await prisma.user.findFirst({ where: { id: userId } }),
			activePhrases = await tracker.countActive(userId),
			totalPhrases = await tracker.countTotal(userId);
		res.json({
			activePhrases,
			totalPhrases,
			deletedPhrases: totalPhrases - activePhrases,
			userCreatedAt: user.createdAt,
		} as UserStats);
	})
);

export default router;
