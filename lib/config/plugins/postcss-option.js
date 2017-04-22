var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var webpack = require('webpack');
var postcssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var scssSyntax = require('postcss-scss');

/**
 * postcss的配置
 *    包含了对scss或css中import的文件对应关系
 *    以及autoprefixer的配置
 *    
 * @param env
 * @returns {webpack.LoaderOptionsPlugin}
 */
module.exports = function (env) {
  return new webpack.LoaderOptionsPlugin({
    options: {
      postcss: {
        plugins: [
          postcssImport({
            resolve: resolve
          }),
          autoprefixer({
            browsers: [
              '> 0%'
            ]
          })
        ],
        syntax: scssSyntax
      }
    }
  });
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

function resolve(id, basedir) {
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