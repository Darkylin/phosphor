'use strict';
const _ = require('lodash');


module.exports = function (env) {
  return {
    test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
    loader: require.resolve('url-loader'),
    options: {
      limit: 9999999
    }
  };
};