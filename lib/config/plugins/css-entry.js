var CssEntryPlugin = require('css-entry-webpack-plugin');

/**
 * 因为 css-entry-webpack-plugin 转译到ES6 DEF云编译的Node版本是 4.6 不支持部分语法，只能遗憾的弃用了
 * @param env
 * @returns {*}
 */
module.exports = function (env) {
  return new CssEntryPlugin({
    output: {
      filename: function (getPath) {
        //return getPath('[name].[hash]').replace(/\.s?css/, '') + '.css';
        return getPath('[name]').replace(/\.s?css/, '') + '.css';
      }
    }
  })
};