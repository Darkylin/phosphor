'use strict';

const fse = require('fs-extra');
const path = require('path');
const log = require('../log');
const _ = require('lodash');

module.exports = function (projectPath) {
  const configFilePath = path.join(projectPath, 'package.json');
  try {
    const json = fse.readJsonSync(configFilePath);
    const entry = _.get(json, 'just.amdBuilder.entry') || _.get(json, 'main');
    if (
      !_.isArray(entry) ||
      entry.length === 0 ||
      entry.some(function (str) {
        return typeof str !== 'string';
      })
    ) {
      log.error('just.amdBuilder.entry 不是一个非空字符串数组，请使用 phosphor.config.js 配置或在package.json中正确添加just配置！');
      process.exit(1);
    }
    return {entry: entry};
  } catch (e) {

  }
}