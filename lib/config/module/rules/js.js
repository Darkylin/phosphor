'use strict';
const _ = require('lodash');
const resolve = require.resolve;
const path = require('path');

/**
 * 对 js 和 jsx 的处理
 * @param env
 * @returns {{test: RegExp, loader, options: {presets: (Array|Iterable<K, M>), plugins: (Array|Iterable<K, M>), cacheDirectory: boolean, babelrc: boolean}}}
 */
module.exports = function (env) {
  const es2015Path = resolve('babel-preset-es2015');
  // 针对es6 import写法的模块，不转换为commonjs，由webpack.optimise进行 tree-shaking
  const es2015Preset = env.options['tree-shaking'] ? [es2015Path, {modules: false}] : es2015Path;
  const presets = [
    es2015Preset,
    resolve('babel-preset-react'),
    resolve('babel-preset-stage-0')
  ];
  
  const plugins = [
    resolve('babel-plugin-transform-class-properties'),
    resolve('babel-plugin-syntax-decorators'),
    resolve('babel-plugin-transform-decorators-legacy')
  ];

  if (env.isDevelopment && env.options.react) {
    presets.push(resolve('babel-preset-react-hmre'));
    plugins.push(resolve('react-hot-loader/babel'));
  }


  return {
    test: /\.jsx?$/,
    loader: resolve('babel-loader'),
    options: {
      presets: presets,
      plugins: plugins,
      // 是否开启缓存加速
      cacheDirectory: true,
      // 禁用项目自定义的babelrc文件
      babelrc: false
    }
  }
};