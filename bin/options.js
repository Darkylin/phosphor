'use strict';
const _ = require('lodash');

const options = {
  short: {
    a: {
      name: 'absolute',
      description: '使用资源绝对路径作为webpack模块id'
    },
    b: {
      name: 'beautify',
      description: '使用生产环境时，强制不压缩混淆'
    },
    d: {
      name: 'dev',
      description: '强制使用开发环境进行构建'
    },
    p: {
      name: 'prod',
      description: '强制使用生产环境进行构建'
    },
    t: {
      name: 'tree-shaking',
      description: '使用tree-shaking特性，但这样将导致不支持在一个js中同时使用ES6和CommonJS的包引用方式，会报错：exports is not defined'
    },
    r: {
      name: 'react',
      description: '使用react打包，默认使用preact'
    }
  },
  noShort: [
    {
      name: 'debug',
      description: '打印构建源文件至stats中，仅在debug Phosphor时使用'
    }
  ],
  forEach: callback => {
    _.forIn(options.short, (opt, short) => callback(opt.name, opt.description, short));
    _.forEach(options.noShort, (opt) => callback(opt.name, opt.description));
  },
  addCommandOption: program => {
    options.forEach((name, description, short) =>
      short ? program.option(`-${short},--${name}`, description) :
        program.option(`--${name}`, description)
    )
  }
};

module.exports = options;