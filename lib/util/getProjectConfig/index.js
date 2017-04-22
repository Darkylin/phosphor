'use strict';

const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const log = require('../log');
const _ = require('lodash');

const phosphorParser = require('./phosphorParser');
const webpackParser = require('./webpackParser');
const packageJsonParser = require('./packageJsonParser');

/**
 * 获取项目配置
 */
module.exports = function getProjectConfig() {
  const projectPath = process.cwd();
  const config = phosphorParser(projectPath) || webpackParser(projectPath) || packageJsonParser(projectPath);
  
  if(!config){
    log.error('未找到项目配置文件（phosphor.config.js），请在项目目录下执行。');
    process.exit(1);
  }
  
  return config;
}
