'use strict';

const webpack = require('webpack');

module.exports = env => {
  // https://github.com/mishoo/UglifyJS2/
  return new webpack.optimize.UglifyJsPlugin({
    compress: {
      sequences: true,  // join consecutive statemets with the “comma operator”
      properties: true,  // optimize property access: a["foo"] → a.foo
      dead_code: true,  // discard unreachable code
      drop_debugger: true,  // discard “debugger” statements
      unsafe: false, // some unsafe optimizations (see below)
      conditionals: true,  // optimize if-s and conditional expressions
      comparisons: true,  // optimize comparisons
      evaluate: true,  // evaluate constant expressions
      booleans: true,  // optimize boolean expressions
      loops: true,  // optimize loops
      unused: true,  // drop unused variables/functions
      hoist_funs: true,  // hoist function declarations
      hoist_vars: false, // hoist variable declarations
      if_return: true,  // optimize if-s followed by return/continue
      join_vars: true,  // join var declarations
      cascade: true,  // try to cascade `right` into `left` in sequences
      collapse_vars: true, // Collapse single-use var and const definitions when possible.
      reduce_vars: true, // Improve optimization on variables assigned with and used as constant values.
      side_effects: true,  // drop side-effect-free statements
      warnings: false,  // warn about potentially dangerous optimizations/code
      global_defs: {}, // global definitions 
      drop_console: true
    },
    output: {
      comments: false
    }
  })
}