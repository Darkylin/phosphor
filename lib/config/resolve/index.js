'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function (env) {
  //const projectPath = env.projectPath;
  const modules = [
    'node_modules',
    path.resolve(__dirname, '../../../node_modules')
  ];
  let alias = {
    //'@alife/mext/0.x': path.join(projectPath, 'node_modules/@alife/mext'),
    //'@alife/mext/0.x': '@alife/mext'
  }
  if (!env.options.react) {
    alias = Object.assign(alias, {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    });
  }
  return {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    modules,
    alias: alias
  }
}