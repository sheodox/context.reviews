/*
This file is a general build file for any custom build steps for
website assets that aren't covered by 'tsc' or 'webpack'
 */
const fs = require('fs'),
	path = require('path'),
	pug = require('pug'),
	crypto = require('crypto'),
	{promisify} = require('util'),
	glob = promisify(require('glob')),
	sharp = require('sharp');

async function generateFileHash(filePath) {
	const hash = crypto.createHash('md4'),
		fileContents = fs.readFileSync(filePath).toString();
	hash.update(fileContents);
	return hash.digest('hex');
}

module.exports = async function build(isProd) {
	//compress all images as webp for extra good compression
	const pngFiles = await glob('./public-src/**/*.png');
	for (const pngFile of pngFiles) {
		const destFile = pngFile.replace('public-src', 'public')
			.replace(/\.png$/, '.webp');
		await sharp(pngFile)
			.webp()
			.toFile(destFile);
	}

	//for dev tint the icon red so it's obvious you're on a dev environment
	if (!isProd) {
		await sharp('./public-src/favicon.png')
			.webp()
			.tint('rgb(255, 0, 0)')
			.toFile('./public/favicon.webp');
	}

	//the webpack build generates js files with content hashes so they can be cached indefinitely,
	//this just mimics that so we can use the same strategy for media files
	const manifestPath = './public/manifest.json',
		manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

	//we need to search in public-src, otherwise we'll keep re-hashing old files and get increasingly long names.
	//also search for png files, but know that the file we're also hashing a webp already in public/
	const images = await glob('./public-src/**/*.png'),
		videos = await glob('./public-src/**/*.mp4'),
		cacheableFiles = [
			...videos,
			...images,
			...images.map(path => path.replace(/\.png$/, '.webp'))
		];

	for (const file of cacheableFiles) {
		const matchingPublicFile = file.replace('./public-src', './public'),
			webPath = matchingPublicFile.replace('./public/', ''),
			{dir, name, ext} = path.parse(webPath),
			hash = await generateFileHash(matchingPublicFile),
			hashedPath = path.join(dir, `${name}.${hash}${ext}`);

		manifest[webPath] = hashedPath;
		fs.copyFileSync(matchingPublicFile, path.join('./public', hashedPath));
	}
	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

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
				title: `${error.message} - Context.Reviews`,
				manifest
			},
			error));
		fs.writeFileSync(`./public/${error.status}.html`, html);
	}

	console.log('extra-build done');
}