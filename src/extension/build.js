import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { promisify } from 'util';
import Glob from 'glob';

const glob = promisify(Glob);

const dirs = {
	src: (p = '') => path.join('./src/extension', p),
	dist: (p = '') => path.join('./dist/extension-base', p),
	distChrome: (p = '') => path.join('./dist/extension-chrome', p),
};

export const build = (isProd) => {
	makeDirs([dirs.dist(), dirs.dist('icons'), dirs.dist('settings')]);

	//create some resized logos
	[16, 32, 48, 96, 128].forEach((px) => {
		sharp('./src/static/assets/favicon.png')
			.resize(px)
			.toFile(dirs.dist(`icons/context-reviews-${px}.png`));
	});

	//copy files that have no webpack build
	['settings/settings.html'].forEach((file) => {
		fs.copyFileSync(dirs.src(file), dirs.dist(file));
	});

	//change the server hostname based on dev vs prod
	['background.js', 'phrase-stasher.js'].forEach((file) => {
		const filePath = dirs.dist(file),
			script = fs
				.readFileSync(filePath)
				.toString()
				.replace(/--server--/g, isProd ? 'https://context.reviews' : 'https://dev.context.reviews')
				.replace(/--server-websocket--/g, isProd ? 'wss://context.reviews' : 'wss://dev.context.reviews');
		fs.writeFileSync(filePath, script);
	});

	fs.copyFileSync(dirs.src('manifest-firefox.json'), dirs.dist('manifest.json'));

	packageChrome();

	console.log(`extension built for firefox (prod? ${isProd})`);
};

async function packageChrome() {
	// need to package a separate package with manifest verison 3 for Chrome

	makeDirs([dirs.distChrome()]);

	const files = await glob(dirs.dist('/**/*.{js,png,html}', {}));
	for (const file of files) {
		const pathInDist = path.relative(dirs.dist(), file),
			relativeDirName = path.dirname(pathInDist);
		await fs.promises.mkdir(dirs.distChrome(relativeDirName), { recursive: true });
		fs.copyFileSync(file, dirs.distChrome(pathInDist));
	}

	fs.copyFileSync(dirs.src('manifest-chrome.json'), dirs.distChrome('manifest.json'));
	console.log(`extension built for chrome`);
}

function makeDirs(dirs) {
	//ensure all the directories we need exist
	dirs.forEach((p) => {
		fs.mkdirSync(p, { recursive: true });
	});
}
