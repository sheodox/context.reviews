import {Response, Router} from 'express';
import {JishoSearch} from '../util/definition-lookup';
import {requireAuth} from '../middleware/route-helpers';
import {lookupLogger} from "../util/logger";
import {safeAsyncRoute} from "../middleware/error-handler";
import {AppRequest} from "../app";

const router = Router();
router.use(requireAuth);

function sendNoResults(res: Response, source: string, word: string) {
	res.json({
		source, definitions: []
	})
}

router.get('/jisho/:word', safeAsyncRoute(async (req: AppRequest, res: Response) => {
	const word = req.params.word,
		jishoResults = await JishoSearch.search(word);

	lookupLogger.debug(`Lookup requested for "${word}"`);

	if (jishoResults.definitions.length) {
		res.json(
			{source: 'Jisho', ...jishoResults}
		);
	}
	else {
	    lookupLogger.debug(`No results for lookup "${word}"`);
		sendNoResults(res, 'Jisho', word);
	}
}));


export default router;
