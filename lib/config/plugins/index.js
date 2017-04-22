'use strict';
const webpack = require('webpack');
const commonChunk = require('./common-chunk');
//const postcssOption = require('./postcss-option');
//const cssEntry = require('./css-entry');
const uglifyJs = require('./uglify-js');
const Visualizer = require('webpack-visualizer-plugin');
const provide = require('./provide');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
//const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = function (env) {
  let result = [
    // 定义postcss的执行参数
    //postcssOption(env),
    // 修改polyfill使用的三方库
    provide(env),
    //cssEntry(env),
    // 定义编译环境
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify(env.env)}
    }),
    // 进度条
    new ProgressBarPlugin(),
    // 顺序优化
    new webpack.optimize.OccurrenceOrderPlugin()
    
  ];
  if (env.hasJavascriptEntry) {
    // common chunk 抽取
    result.push(commonChunk(env));
    if (env.isProduction) {
      // 混淆压缩 包含去除console
      result.push(uglifyJs(env));
    }
  }
  if (env.isProduction) {
    // 抽取css
    result.push(new ExtractTextPlugin('style.css'));
  }
  // 输出打包资源大小占比饼状图
  if (env.options.debug) {
    result.push(new Visualizer());
  }
  
  if (env.options.absolute) {
    // 使用绝对路径作为id编译
    result.push(new webpack.NamedModulesPlugin());
  }
  
  if (env.command === 'serve') {
    result.push(new webpack.HotModuleReplacementPlugin());
  }
  
  return result;
};
