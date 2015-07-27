/* eslint-disable */

var path = require('path');
var webpack = require('webpack');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};

module.exports = {
  externals: {
    'react': reactExternal
  },
  entry: path.join(__dirname, 'src'),
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'redux-graphql.js',
    library: 'ReduxGraphQL',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('production')
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
        exclude: /(node_modules)/,
        loader: 'babel?optional[]=runtime&stage=0'
      }
    ]
  }
};
