import { Response, Router } from 'express';
import { JishoSearch } from '../util/definition-lookup.js';
import { requireAuth } from '../middleware/route-helpers.js';
import { lookupLogger } from '../util/logger.js';
import { safeAsyncRoute } from '../middleware/error-handler.js';
import { AppRequest } from '../app.js';

const router = Router(),
	// some set phrases could be pretty long, just try to prevent stupid long searches at least
	MAX_REASONABLE_LOOKUP_LENGTH = 30;

router.use(requireAuth);

function sendNoResults(res: Response, source: string, word: string) {
	res.json({
		word,
		source,
		definitions: [],
	});
}

router.get(
	'/jisho/:word',
	safeAsyncRoute(async (req: AppRequest, res: Response) => {
		const word = req.params.word;

		// it's pretty easy to just select the entire page or something, if that happens we don't want to
		// try and do a lookup for something obviously way too long
		if (word.length > MAX_REASONABLE_LOOKUP_LENGTH) {
			res.status(413);
			res.json({ message: 'That looks like more than one word, try searching for something shorter!' });
			return;
		}
		const jishoResults = await JishoSearch.search(word);

		lookupLogger.debug(`Lookup requested for "${word}"`);

		if (jishoResults.definitions.length) {
			res.json({ source: 'Jisho', ...jishoResults });
		} else {
			lookupLogger.debug(`No results for lookup "${word}"`);
			sendNoResults(res, 'Jisho', word);
		}
	})
);

export default router;
