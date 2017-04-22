'use strict';
const options = require('./options');
const program = require('commander');
const context = require('../lib/context');
const getWebpackConfig = require('../lib/config');
const printConfig = require('../lib/util/printWebpackConfig');
const path = require('path');
const startServer = require('../lib/server');
const fse = require('fs-extra');


options.addCommandOption(program);
context.listen(program, options);
program.parse(process.argv);
context.parse();
const webpackConfig = getWebpackConfig(context);
const tempPath = path.join(context.projectPath, 'temp');
fse.emptyDirSync(tempPath);
fse.ensureDirSync(tempPath);

printConfig(tempPath, webpackConfig, 'serve.webpack.config.js');

const app = startServer(webpackConfig);