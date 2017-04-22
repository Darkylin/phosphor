'use strict';
const resolve = require.resolve;
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const scssSyntax = require('postcss-scss');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
  const useArr = [
    {
      loader: resolve('css-loader'),
      options: {
        url: false,
        minimize: env.isProduction,
        //importLoaders: 3
      }
    },
    {
      loader: resolve('postcss-loader'),
      options: {
        plugins: [
          postcssImport({
            resolve: resolveScss
          }),
          autoprefixer()
        ],
        syntax: scssSyntax
      }
    },
    resolve('resolve-url-loader'),
    {
      loader: resolve('sass-loader'),
      options: {sourceMap: true}
    }
  ];
  if (!env.isProduction) {
    useArr.unshift(resolve('style-loader'));
  }
  return {
    test: /\.scss$/,
    // exclude: /node_modules/,
    use: env.isProduction? ExtractTextPlugin.extract(useArr): useArr
  }
};


var nodeModuleCache = {}
function findNodeModules(basedir) {
  var result = nodeModuleCache[basedir];
  if (result) {
    return result;
  }
  var dir = basedir;
  do {
    result = path.join(dir, 'node_modules');
    if (fs.existsSync(result)) {
      nodeModuleCache[basedir] = result;
      return result;
    }
  } while ((dir = path.join(dir, '../')) !== '/');
  throw new Error('找不到node_modules:' + basedir);
}
function guessExt(path) {
  if (!/\.s?css$/.test(path)) {
    if (fs.existsSync(path + '.scss')) {
      return {path: path + '.scss', status: 1};
    } else if (fs.existsSync(path + '.css')) {
      return {path: path + '.css', status: 1};
    }
    return {path, status: -1};
  }
  if (fs.existsSync(path)) {
    return {path, status: 1};
  }
  return {path, status: -1};
}

function resolveScss(id, basedir) {
  var finalPath;
  var guessResult;
  // 只要以@开头或~开头 则在basedir的node_modules中寻址
  if (/^(~|@)/.test(id)) {
    id = id.replace(/^~/, '');
    finalPath = path.join(findNodeModules(basedir), id);
  } else {
    finalPath = path.join(basedir, id);
  }
  // 如果不带后缀则尝试补充后缀
  guessResult = guessExt(finalPath);
  if (guessResult.status === 1) {
    return guessResult.path;
  }
  // 可能有_作为文件名前缀
  finalPath = finalPath.replace(/\/([^/]+)$/, '\/_$1');
  guessResult = guessExt(finalPath);
  if (guessResult.status === 1) {
    return guessResult.path;
  }
}