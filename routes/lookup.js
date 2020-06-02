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


router.get('/goo/:word', async (req, res) => {
	const word = req.params.word,
		noResults = () => sendNoResults(res, 'Goo辞書', word),
		//the jisho search should be cached
		jishoResults = await lookup.jisho.search(word);
	if (!jishoResults.definitions.length) {
		return noResults();
	}

	const gooResults = await lookup.goo.search(jishoResults.definitions[0].word);
	if (gooResults.definitions.length) {
		res.json(
			{source: 'Goo辞書', ...gooResults}
		);
	}
	else {
		noResults();
	}
});

module.exports = router;
