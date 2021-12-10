import fs from 'fs/promises';
import path from 'path';
import pug from 'pug';
import crypto from 'crypto';
import { promisify } from 'util';
import globImport from 'glob';
import sharp from 'sharp';

const glob = promisify(globImport),
	isProd = process.argv.includes('production');

async function createFolders(paths) {
	for (const folder of paths) {
		try {
			await fs.mkdir(folder, { recursive: true });
		} catch (e) {}
	}
}

async function generateFileHash(filePath) {
	const hash = crypto.createHash('md4'),
		fileContents = await fs.readFile(filePath).toString();
	hash.update(fileContents);
	return hash.digest('hex');
}

//compress all images as webp for extra good compression
const pngFiles = await glob('./public-src/**/*.png');
for (const pngFile of pngFiles) {
	const destFile = pngFile.replace('public-src', 'public').replace(/\.png$/, '.webp');
	await sharp(pngFile).webp().toFile(destFile);
}

//for dev tint the icon red so it's obvious you're on a dev environment
if (!isProd) {
	await sharp('./src/static/assets/favicon.png').tint('rgb(255, 0, 0)').toFile('./public/favicon.png');
}

const manifestPath = './public/asset-manifest.json',
	manifest = {},
	assetSrcPath = './src/static/assets',
	assetDestPath = './public',
	images = await glob(`${assetSrcPath}/**/*.png`),
	videos = await glob(`${assetSrcPath}/**/*.mp4`),
	cacheableFiles = [...videos, ...images, ...images.map((path) => path.replace(/\.png$/, '.webp'))];

for (const file of cacheableFiles) {
	const matchingPublicFile = file.replace(assetSrcPath, assetDestPath),
		webPath = matchingPublicFile.replace(assetDestPath + '/', ''),
		{ dir, name, ext } = path.parse(webPath),
		hash = await generateFileHash(matchingPublicFile),
		hashedPath = path.join(dir, `${name}.${hash}${ext}`);

	manifest[webPath] = hashedPath;
	await fs.copyFile(matchingPublicFile, path.join('./public', hashedPath));
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

/*
	Generate static error page HTML files, they're served by nginx
	because they're static files, but also because some errors (like 502)
	might happen when the express app is down, we don't want to fall
	back to the super plain nginx error pages.
	 */
const httpErrors = [
	{
		status: 403,
		message: 'Forbidden',
		description: `You don't have permission to do that.`,
	},
	{
		status: 404,
		message: 'Not Found',
		description: `I'm not sure how you got here, but there doesn't seem to be anything here.`,
	},
	{
		//gateway error. usually happens when the app image doesn't boot, or is being replaced
		status: 502,
		message: 'Site is down!',
		description: `Context.Reviews is down, try again in a moment.`,
	},
	{
		//gateway timeout. usually happens when an error is thrown when trying to handle a request
		status: 504,
		message: "Site isn't responding",
		description: `Context.Reviews isn't responding for some reason. If this keeps happening please contact support at the link below.`,
	},
];

const genErrorHtml = pug.compileFile('./src/server/views/error.pug');
for (const error of httpErrors) {
	const html = genErrorHtml(
		Object.assign(
			{
				title: `${error.message} - Context.Reviews`,
				manifest,
				cssImports: [],
			},
			error
		)
	);
	await fs.writeFile(`./public/${error.status}.html`, html);
}

//copy fontawesome files to a static directory. they're not loaded with a bundler
//and to avoid having to serve them with express.static() they should be copied to
//the static files directory so nginx can handle serving them
createFolders(['./public/fontawesome', './public/fontawesome/css', './public/fontawesome/webfonts']);
const faPath = './node_modules/@fortawesome/fontawesome-free/',
	faFiles = await glob(`${faPath}{css,webfonts}/*`);
for (const file of faFiles) {
	const newPath = file.replace(faPath, './public/fontawesome/');
	await fs.copyFile(file, newPath);
}

console.log('extra-build done');
