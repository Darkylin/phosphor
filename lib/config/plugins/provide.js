'use strict';

const webpack = require('webpack');

module.exports = env =>
  new webpack.ProvidePlugin({
    Promise: 'es6-promise'
  });
