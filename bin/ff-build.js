'use strict';
const webpack = require('webpack');
const fse = require('fs-extra');
const log = require('../lib/util/log');
const output = require('../lib/util/outputWebpackStats');
const print = require('../lib/util/printWebpackStats');
const printConfig = require('../lib/util/printWebpackConfig');
const getWebpackConfig = require('../lib/config');
const options = require('./options');
const program = require('commander');
const context = require('../lib/context');

options.addCommandOption(program);
context.listen(program,options);
program.parse(process.argv);
context.parse();
const webpackConfig = getWebpackConfig(context);
const outputPath = webpackConfig.output.path;
// 清空目标文件夹
fse.emptyDirSync(outputPath);
fse.ensureDirSync(outputPath);
// 打印最终使用的config
printConfig(outputPath, webpackConfig);
const compiler = webpack(webpackConfig);
compiler.run(function (err, stats) {
  print(outputPath, stats, context);
  output(err, stats);
  if (err) {
    process.exit(1);
  }else{
    process.exit(0);
  }
});
