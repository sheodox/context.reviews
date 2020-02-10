const path = require('path'),
	CopyPlugin = require('copy-webpack-plugin'),
	isProd = process.argv.includes('production');

module.exports = {
	watch: !isProd,
	mode: isProd ? 'production' : 'development',
	entry: './public-src/javascripts/ui.js',
	output: {
		filename: '[name].js',
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
		new CopyPlugin([
			{from: '**.png', context: './public-src'},
			{from: '**/*.user.js', context: './public-src'},
		])
	]
};