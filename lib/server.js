'use strict';
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const _ = require('lodash');
const hbs = require('hbs');
const path = require('path');
const context = require('./ff-context');

module.exports = function (webpackConfig, middlewareConfig = {}) {
  const app = express();
  const compiler = webpack(webpackConfig);
  const publicPath = webpackConfig.output.publicPath;

  app.use(webpackMiddleware(compiler, _.merge({
    // public path to bind the middleware to
    // use the same as in webpack
    // publicPath is required, whereas all other options are optional
    publicPath: publicPath,
    // display no info to console (only warnings and errors)
    noInfo: !context.isDebug,
    // display nothing to the console
    quiet: false,
    // switch into lazy mode
    // that means no watching, but recompilation on every request
    lazy: false,
    // watch options (only lazy: false)
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    // the index path for web server
    index: 'index.html',
    // custom headers
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // options for formating the statistics
    stats: {
      colors: true
    },
    // Provide a custom reporter to change the way how logs are shown.
    reporter: null,
    // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
    serverSideRender: false
  }, middlewareConfig)));
  app.use(webpackHotMiddleware(compiler));

  app.listen(3000, function () {
    console.log('Listening on port 3000!');
  });
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../tpl'));

  let scripts;
  app.get('/', function (req, res) {
    if (!scripts) {
      scripts = context.chunkEntry
          .concat(_.keys(webpackConfig.entry).map(function (entryName) {
            const ext = path.extname(entryName);
            if (!ext) {
              return entryName + '.js';
            } else {
              return entryName;
            }
          }))
          .map(function (filename) {
            return path.join(publicPath, filename);
          });
    }
    const data = {scripts: scripts};
    injectDataFromProjectConfig(data);
    res.render('index', data);
  });
  return app;
};

function injectDataFromProjectConfig(data) {
  const projectServerConfig = context.projectConfig.devServer;
  [
    'beforeLink', 'afterLink',
    'beforeScript', 'afterScript',
    'body'
  ].forEach(function (configKey) {
    data[configKey] = _.get(projectServerConfig, configKey);
  });
  return data;
}
