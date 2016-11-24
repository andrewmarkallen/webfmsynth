var webpack = require('webpack');
var path = require('path');

export default
{
	entry: './src/App.js',
	output:
	{
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: 'public/'
	},

	module:
	{
		loaders:
		[
			{test: /\.js/, loader: 'babel'},
			{test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
			{test: /\.css/, loader: 'style-loader!css-loader'},
			{test: /\.(woff2|woff|ttf|svg|eot)$/, loader: 'file-loader'}
		]
	}
};