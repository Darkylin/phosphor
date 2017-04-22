'use strict';
const js = require('./rules/js');
const css = require('./rules/css');
const scss = require('./rules/scss');
const image = require('./rules/image');

module.exports = function (env) {
  return {
    rules: [
      js,
      css,
      scss,
      image
    ].map(fn => fn(env))
  }
}