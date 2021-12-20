import fs from 'fs/promises';
import path from 'path';

let cachedManifest: any;

const isProd = process.env.NODE_ENV === 'production';

async function loadManifests() {
	if (!cachedManifest) {
		const manifestPath = path.join(process.cwd(), 'public/manifest.json'),
			assetManifestPath = path.join(process.cwd(), 'public/asset-manifest.json');

		cachedManifest = {
			// rollup manifest (scripts)
			manifest: isProd ? JSON.parse((await fs.readFile(manifestPath)).toString()) : {},
			// extra-build.js manifest (images etc)
			assetManifest: JSON.parse((await fs.readFile(assetManifestPath)).toString()),
		};
	}
	return cachedManifest;
}

// gets data from the rollup manifest and asset manifest for very cacheable files
export async function getManifest(entryPath?: string) {
	const { manifest, assetManifest } = await loadManifests();

	// only the production build uses the manifest, in development files are served by vite
	if (!entryPath || process.env.NODE_ENV === 'development') {
		return { assetManifest };
	}

	const entry = manifest[entryPath],
		css = [...entry.css],
		{ imports } = entry;

	// script imports are loaded automatically via es imports, but we
	// need to figure out all of the dependent styles for all imports
	for (const imp of imports) {
		manifest[imp].css.forEach((importCss: string) => {
			css.push(importCss);
		});
	}
	return {
		scriptEntryFile: entry.file,
		cssImports: css,
		assetManifest,
	};
}
