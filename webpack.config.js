const path = require('path'),
	CopyPlugin = require('copy-webpack-plugin'),
	ManifestPlugin = require('webpack-manifest-plugin'),
	isProd = process.argv.includes('production'),
	buildUserscript = require('./util/build-userscript');

module.exports = {
	watch: !isProd,
	mode: isProd ? 'production' : 'development',
	entry: {
		list: './public-src/javascripts/list-app/list-app.js',
		export: './public-src/javascripts/export-app/export-app.js',
		landing: './public-src/javascripts/landing/landing-app.js',
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, './public')
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				exclude: /node_modules/,
				use: 'svelte-loader'
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},
	plugins: [
		new CopyPlugin([{
			from: '**.png',
			context: './public-src',
		},
			{from: '**/*.user.js', context: './public-src'},
			{from: '**/*.mp4', context: './public-src'},
		]), {
			apply: compiler => {
				compiler.hooks.afterEmit.tap('UserscriptTweaks', compilation => {
					buildUserscript(isProd);
				})
			}
		},
		new ManifestPlugin()
	]
};
