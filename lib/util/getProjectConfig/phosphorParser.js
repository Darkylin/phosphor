'use strict';

const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const log = require('../log');
const _ = require('lodash');

module.exports = function (projectPath) {
  const configFilePath = path.join(projectPath, 'phosphor.config.js');
  try {
    fs.accessSync(configFilePath, fs.R_OK);
    return require(configFilePath);
  } catch (e) {
    console.error(e)
  }
}