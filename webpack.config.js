import path from 'path';
import SveltePreprocess from 'svelte-preprocess';
import { build } from './src/extension/build.js';
// Vite is used for building the site, but because the extension needs to build to a directory,
// and Vite doesn't emit files during development, so using Webpack seems easier.

export default (env) => {
	return [
		{
			name: 'extension',
			// don't minify the extension code
			mode: 'development',
			devtool: 'hidden-source-map',
			entry: {
				'phrase-stasher': './src/extension/phrase-stasher.ts',
				settings: './src/extension/settings/settings.ts',
				background: './src/extension/background.ts',
			},
			output: {
				filename: '[name].js',
				path: path.resolve(process.cwd(), './dist/extension'),
				publicPath: '',
			},
			resolve: {
				alias: {
					svelte: path.resolve('node_modules', 'svelte'),
				},
				extensions: ['.mjs', '.js', '.svelte', '.ts'],
				mainFields: ['svelte', 'browser', 'module', 'main'],
			},
			module: {
				rules: [
					{
						test: /\.ts?$/,
						use: 'ts-loader',
						exclude: /node_modules/,
					},
					{
						test: /\.(html|svelte)$/,
						use: {
							loader: 'svelte-loader',
							options: {
								preprocess: SveltePreprocess({
									scss: true,
									sass: true,
								}),
							},
						},
					},
					{
						test: /\.scss$/,
						use: ['style-loader', 'css-loader', 'sass-loader'],
					},
				],
			},
			plugins: [
				{
					apply: (compiler) => {
						compiler.hooks.afterEmit.tap('extension-tweaks', (compilation) => {
							build(env.SITE_TARGET === 'prod');
						});
					},
				},
			],
		},
	];
};
