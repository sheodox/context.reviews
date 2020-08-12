/*
This file is a general build file for any custom build steps for
website assets that aren't covered by 'tsc' or 'webpack'
 */
const fs = require('fs'),
	pug = require('pug'),
	{promisify} = require('util'),
	glob = promisify(require('glob')),
	isDev = process.argv.includes('dev'),
	sharp = require('sharp');

async function build() {
	/*
	Generate static error page HTML files, they're served by nginx
	because they're static files, but also because some errors (like 502)
	might happen when the express app is down, we don't want to fall
	back to the super plain nginx error pages.
	 */
	const httpErrors = [{
		status: 403,
		message: 'Forbidden',
		description: `You don't have permission to do that.`
	}, {
		status: 404,
		message: 'Not Found',
		description: `I'm not sure how you got here, but there doesn't seem to be anything here.`
	}, {
		//gateway error. usually happens when the app image doesn't boot, or is being replaced
		status: 502,
		message: 'Site is down!',
		description: `Context.Reviews is down, try again in a moment.`
	}];

	const genErrorHtml = pug.compileFile('./src/views/error.pug')
	for (const error of httpErrors) {
		const html = genErrorHtml(Object.assign({
				title: `${error.message} - Context.Reviews`
			},
			error));
		fs.writeFileSync(`./public/${error.status}.html`, html);
	}

	const pngFiles = await glob('./public-src/**/*.png');

	//compress all png images as webp for extra good compression
	for (const pngFile of pngFiles) {
		const destFile = pngFile.replace('public-src', 'public')
			.replace(/\.png$/, '.webp');
		await sharp(pngFile)
			.webp()
			.toFile(destFile);
	}

	//for dev tint the icon red so it's obvious you're on a dev environment
	if (isDev) {
		await sharp('./public-src/favicon.png')
			.webp()
			.tint('rgb(255, 0, 0)')
			.toFile('./public/favicon.webp');
	}

	console.log('extra-build done');
}
build();
