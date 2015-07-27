/* eslint-disable */

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'redux-graphql': [
      path.join(__dirname, 'src')
    ]
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?optional[]=runtime&stage=0'
      }
    ]
  }
};
