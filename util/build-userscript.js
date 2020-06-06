const fs = require('fs'),
	userscriptSrc = `./public-src/javascripts/jisho-phrase-stasher.user.js`,
	userscriptDest = `./public/javascripts/jisho-phrase-stasher.user.js`;

module.exports = (isProd) => {
	const script = fs
		.readFileSync(userscriptSrc)
		.toString()
		.replace(/{{--server--}}/g, isProd ?
			'https://context.reviews' : 'http://dev.context.reviews'
		);
	console.log(script);

	fs.writeFileSync(userscriptDest, script);
}
