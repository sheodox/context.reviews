const router = require('express').Router(),
	lookup = require('../util/definition-lookup'),
	{requireAuth} = require('./routeHelpers');

router.use(requireAuth);

function sendNoResults(res, source, word) {
	res.json({
		source, definitions: []
	})
}

router.get('/jisho/:word', async (req, res) => {
	const word = req.params.word,
		jishoResults = await lookup.jisho.search(word);
	if (jishoResults.definitions.length) {
		res.json(
			{source: 'Jisho', ...jishoResults}
		);
	}
	else {
		sendNoResults(res, 'Jisho', word);
	}
});


module.exports = router;
