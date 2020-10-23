import {Router, Response} from 'express';
import {tracker} from '../util/tracker';
import {getUserId, requireAuth} from "../middleware/route-helpers";
import {broadcastToUser} from '../util/server-socket';
import {safeAsyncRoute} from "../middleware/error-handler";
import {AppRequest} from "../app";

const router = Router();
router.use(requireAuth);

//send an updated phrase list to user's connected client(s) over websocket if the list changes
const sendListToUser = async (req: AppRequest) => {
		const userId = getUserId(req);
		broadcastToUser(userId, 'list', await tracker.list(userId))
	},
	//send nothing in response, but broadcast the list to the user, used when the response isn't
	//important, but the phrase list for the user has changed
	defaultResponse = async (req: AppRequest, res: Response) => {
		res.json({});
		sendListToUser(req);
	}

const addHandler = safeAsyncRoute(async function(req: AppRequest, res: Response) {
	const phraseText = req.params.phrases || (typeof req.body === 'object' ? req.body.phraseText : ''),
		addedPhrases = await tracker.add(getUserId(req), phraseText);

	sendListToUser(req);

	//return only the phrases that were added for the userscript. it will show
	//them individually and show delete buttons for each phrase to undo adding
	if (req.query.diff === 'true') {
		res.json(addedPhrases);
	}
		//allow versioning by extension if incompatible responses are expected
	// in the future this number can be incremented
	else if (req.query.extension) {
		res.json({
			addedPhrases: addedPhrases.map(({phrase, id}) => {
				//the extension expects 'phrase_id' (old db table implementation), and it's easier
				//to give it that than publish a new version of the extension
				return {
					phrase,
					phrase_id: id
				}
			}),
			stats: {
				totalPhrases: (await tracker.list(getUserId(req))).length
			}
		})
	}
	else {
		res.send();
	}
});

router.get('/add/:phrases', addHandler);
router.post('/add/', addHandler);

router.get('/list', safeAsyncRoute(async (req: AppRequest, res: Response) => {
	res.json(await tracker.list(getUserId(req)));
}));

router.get('/remove/:id', safeAsyncRoute(async (req: AppRequest, res: Response) => {
	await tracker.remove(getUserId(req), req.params.id);
	defaultResponse(req, res);
}));

// remove as a POST is a batch operation, it expects an array of phrase IDs to be sent as the body
router.post('/remove', safeAsyncRoute(async (req: AppRequest, res: Response) => {
	await tracker.remove(getUserId(req), req.body);
	defaultResponse(req, res);
}));

router.get('/undo', safeAsyncRoute(async (req: AppRequest, res: Response) => {
	await tracker.undo(getUserId(req));
	defaultResponse(req, res);
}));

export default router;
