'use strict';
const resolve = require.resolve;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function (context) {
  const useArr = [
    {
      loader: resolve('css-loader'),
      options: {
        url: false,
        minimize: context.isProduction
      }
    },
    {
      loader: resolve('postcss-loader'),
      options: {
        plugins: [
          autoprefixer()
        ]
      }
    }
  ];
  if (!context.isProduction) {
    useArr.unshift(resolve('style-loader'));
  }
  return {
    test: /\.css$/,
    // exclude: /node_modules/,
    use: context.isProduction? ExtractTextPlugin.extract(useArr): useArr
  }
};