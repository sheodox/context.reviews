//svelte seems to purposely ignore grabbing from the assetManifest directly
//in components, you'll just get no 'src' on images because it thinks it's undefined
export const asset = assetPath => {
	if (!(assetPath in window.assetManifest)) {
		console.error(`missing "${assetPath}" in asset manifest!`)
	}
	return window.assetManifest[assetPath];
}