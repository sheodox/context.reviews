import {NextFunction, Response, Router} from 'express';
import {safeAsyncRoute} from "../middleware/error-handler";
import {AppRequest} from "../app";
import {validateSettingsSchema} from "../entity/Settings";
import {requireAuth} from "../middleware/route-helpers";
import {settingsRepository} from "../entity";
const router = Router();

router.use(requireAuth);

router.post(`/settings`, safeAsyncRoute(async (req: AppRequest, res: Response, next: NextFunction) => {
    const valid = validateSettingsSchema(req.body);

    if (!valid) {
        next({status: 400});
        return;
    }

    Object.assign(req.user.settings, req.body);
    await (await settingsRepository).save(req.user.settings);

    res.send();
}));

export default router;