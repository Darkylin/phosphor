'use strict';
const resolve = require.resolve;
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function (env) {
  const useArr = [
    {
      loader: resolve('css-loader'),
      options: {
        url: false,
        minimize: env.isProduction
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
  if (!env.isProduction) {
    useArr.unshift(resolve('style-loader'));
  }
  return {
    test: /\.css$/,
    // exclude: /node_modules/,
    use: env.isProduction? ExtractTextPlugin.extract(useArr): useArr
  }
};