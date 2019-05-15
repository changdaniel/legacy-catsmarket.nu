const path = require('path')
const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const config = {
	context: path.resolve('./src'),
	devtool: 'eval',
	entry: { app: '.' },
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					{ loader: MiniCSSExtractPlugin.loader },
					'css-loader'
				]
			}
		]
	},
	output: {
		filename: '[name].js',	// [name] resolves to name of bundle (e.g., app)
		path: path.resolve('./build'),
		publicPath: path.resolve('./build/public')
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new MiniCSSExtractPlugin({ filename: '[name].css' })
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			path.resolve('./src'),
			'node_modules'
		]
	},
	target: 'web'
}

module.exports = config
