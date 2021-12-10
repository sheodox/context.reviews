const assetManifest = (window as any).__APP_BOOTSTRAP__.assetManifest;

//svelte seems to purposely ignore grabbing from the assetManifest directly
//in components, you'll just get no 'src' on images because it thinks it's undefined
export const asset = (assetPath: string) => {
	if (!(assetPath in assetManifest)) {
		console.error(`missing "${assetPath}" in asset manifest!`);
	}
	return assetManifest[assetPath];
};
