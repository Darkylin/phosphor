'use strict';
/**
 * 与ff 命令对应的 context 解析方法
 * 解析命令配置项及项目配置文件到 context 中
 */
const _ = require('lodash');
const path = require('path');
const getProjectConfig = require('./util/getProjectConfig');

const DEV = 'development';
const PROD = 'production';
class Env {
  constructor() {
    this.options = {};
  }

  listen(program, options) {
    // this.optionsConfig = options;
    options.forEach(name =>
        program.addListener(name, () => this.options[name] = true));
  }

  // 对监听到的options进行处理
  parse() {
    const commandPath = process.argv[1];
    const command = commandPath.slice(commandPath.lastIndexOf('-') + 1);
    const options = this.options;
    const env = calcEnv(command, options);
    const projectPath = this.projectPath = process.cwd();
    const projectConfig = getProjectConfig(projectPath);
    const enableServer = command === 'serve';
    this.env = env;
    this.entry = projectConfig.entry;
    this.beautify = !!(options.beautify || enableServer);
    // this.command = command;
    // 源自 package.json 或 webapack.config.js 的配置项
    this.projectConfig = projectConfig;
    this.commonChunk = projectConfig.commonChunk;
    this.hasJavascriptEntry = hasJavascriptEntry(projectConfig.entry);
    this.isProduction = env === PROD;
    this.isDevelopment = env === DEV;
    this.isDebug = options.debug;
    this.devServer = {
      enable: enableServer
    };
    // 输出目录
    this.distPath = path.join(projectPath, process.env.BUILD_DEST || 'dist')
  }

}

/**
 * 计算当前是开发还是线上环境
 * @param command
 * @param options
 * @returns {*}
 */
function calcEnv(command, options) {
  let env;
  switch (command) {
    case 'serve':
      env = DEV;
      break;
    case 'build':
      env = PROD;
      break;
    default:
      env = DEV;
  }
  if (options.dev) {
    env = DEV;
  }
  if (options.prod) {
    env = PROD;
  }
  return env;
}
const IS_JS = /\.jsx?$/;
function hasJavascriptEntry(entry) {
  return !!_.find(entry, o => IS_JS.test(o));
}

const env = new Env();

module.exports = env;