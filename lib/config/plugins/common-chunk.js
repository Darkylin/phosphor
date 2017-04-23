'use strict';

const webpack = require('webpack');
const _ = require('lodash');
const path = require('path');

/**
 * 描述了common chunk的打包规则
 *
 * @param context
 * @returns {webpack.optimize.CommonsChunkPlugin}
 */
module.exports = function (context) {
  // 获取 common chunks
  const commonChunk = makeCommonChunk(context);
  // 将 common chunks 生成的 entry 通知 context
  // 如生成 stable.js lib.js ，则调用后 context.realEntry=['stable.js','lib.js']
  notifyContextChunk(context, commonChunk);
  return _.chain(commonChunk).map(function (config) {
    let chunks = config.chunks;
    if (!_.isArray(chunks) && !chunks.length) {
      return null;
    }
    const chunkRegExp = new RegExp(
        // cnpm 或 tnpm 安装依赖后实际引用的路径形如 node_modules/.8.1.0@preact/dist
        // 中划线-也能触发\b 所以结尾判断只能写 ($|/)
        `(@|/)(${chunks.join('|')})($|/)`
    );

    const filename = config.filename;
    return new webpack.optimize.CommonsChunkPlugin({
      name: config.name,
      minChunk: function (module) {
        // console.log(chunkRegExp.source);
        // console.log(module.context, chunkRegExp.test(module.context));
        return chunkRegExp.test(module.context);
      },
      filename: filename
    });
  }).compact().value();;
};

const defaultStable = [
  'react',
  'react-dom',
  'fbjs',
  'process', // TODO 删掉
  'webpack', // webpack/buildin
  'classnames',
  'preact',
  'preact-compact',
  'lodash',
  'lodash-es'
];

const stablePlusRegExp = /\bstable\+/;
function makeCommonChunk(context) {
  let commonChunk = context.commonChunk;
  // 处理 stable+ 及默认 vendors
  // chunks 如果是 package.json dependencies 对象 也在这里转换为数组
  if (_.isArray(commonChunk) && commonChunk.length) {
    commonChunk = commonChunk.map(function (config) {
      let name = config.name;
      let filename = config.filename;
      let chunks = config.chunks;
      // TODO 配置错误的提示
      if (!name) {
        name = path.basename(filename);
      }
      if (!filename) {
        filename = name + '.js';
      }
      if (_.isPlainObject(chunks)) {
        chunks = _.keys(chunks);
      }
      if (stablePlusRegExp.test(name)) {
        chunks = _.chain(chunks)
            .concat(defaultStable)
            .compact()
            .uniq()
            .value();
        name = name.replace(stablePlusRegExp, 'stable');
        filename = filename.replace(stablePlusRegExp, 'stable');
      }
      return {
        name: name,
        filename: filename,
        chunks: chunks
      };
    })
  } else {
    commonChunk = [{name: 'stable', filename: 'stable.js', chunks: defaultStable}];
  }
  return commonChunk;
}
function notifyContextChunk(context, commonChunk) {
  context.chunkEntry = commonChunk.map(function (config) {
    return config.filename;
  });
}