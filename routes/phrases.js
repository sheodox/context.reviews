const router = require('express').Router(),
	tracker = require('../util/tracker'),
	{getUserId, requireAuth} = require('./routeHelpers');

router.use(requireAuth);

const defaultResponse = async (req, res) => {
	res.json(await tracker.list(getUserId(req)));
}

router.get('/add/:phrase', async (req, res) => {
	await tracker.add(getUserId(req), req.params.phrase);
	defaultResponse(req, res);
});

router.get('/list', async (req, res) => {
	res.json(await tracker.list(getUserId(req)));
});

router.get('/remove/:id', async (req, res) => {
	await tracker.remove(getUserId(req), req.params.id);
	defaultResponse(req, res);
});

// remove as a POST is a batch operation, it expects an array of phrase IDs to be sent as the body
router.post('/remove', async (req, res) => {
	await tracker.remove(getUserId(req), req.body);
	defaultResponse(req, res);
});

router.get('/undo', async (req, res) => {
	await tracker.undo(getUserId(req));
	defaultResponse(req, res);
});

router.get('/hide/:id', async (req, res) => {
	await tracker.hide(getUserId(req), req.params.id);
	defaultResponse(req, res);
})

router.get('/show-all', async (req, res) => {
	await tracker.showAll(getUserId(req));
	defaultResponse(req, res);
})

module.exports = router;
