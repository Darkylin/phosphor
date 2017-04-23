'use strict';
// 为了防止变量名冲突，这里统一使用超长变量名
const getWebpackModuleConfig = require('./module');
const getWebpackResolveConfig = require('./resolve');
const getWebpackPluginsConfig = require('./plugins');
const _ = require('lodash');
const path = require('path');
const resolve = require.resolve;
const normalizeEntry = require('../util/normalizeEntry');


// 消除loader 使用过期API的提示
process.noDeprecation = true;
/**
 * 组装所有的配置项。
 * 具体配置内容由每个配置项根据context中的内容自行决定是否添加及merge用户自定义选项
 * @param context
 * @returns {Object}
 */
module.exports = function (context) {
  const projectPath = context.projectPath;
  const isProduction = context.isProduction;
  const entryForHotReload = [resolve('webpack-hot-middleware/client')];
  // preact 用react-hot-loader会报错：Cannot read property _pendingForceUpdate of undefined
  if (context.options.react) {
    entryForHotReload.push(resolve('react-hot-loader/patch'));
  }
  let entry = normalizeEntry(context.entry);
  if (context.devServer.enable) {
    if (_.isArray(entry)) {
      entry = entry.concat(entryForHotReload);
    } else {
      entry = _.mapValues(entry, function (value, key) {
        if (/\.s?css/.test(key)) {
          return value;
        }
        return entryForHotReload.concat(value);
      })
    }
  }
  return _.mapValues({
      entry: entry,
      context: projectPath,
      devtool: isProduction ? false : 'cheap-module-source-map',
      output: {
        filename: '[name].js',
        path: context.distPath,
        publicPath: '/assets/'
      },
      module: getWebpackModuleConfig,
      resolve: getWebpackResolveConfig,
      plugins: getWebpackPluginsConfig
    },
    fn => _.isFunction(fn) ? fn(context) : fn
  );
};