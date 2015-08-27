var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: path.join(__dirname, 'src', 'client'),
  output: {
    path: path.join(__dirname, '.tmp'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
			'__CLIENT__': true
		}),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel?optional[]=runtime&stage=0'
      }
    ]
  }
};
