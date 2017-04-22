var webpack = require('webpack');
var _ = require('lodash');

/**
 * 描述了common chunk的打包规则
 * 
 * @param env
 * @returns {webpack.optimize.CommonsChunkPlugin}
 */
module.exports = function (env) {
  return new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
      var context = module.context;
      if (context) {
        var result = CHUNK.test(context);
        //if(!result){
        //  console.log(context);
        //}
        return result;
      }
      return false;
    },
    filename: 'vendor.js'
  });
}

const CHUNK = /(@|\/)(react|react-dom|object-assign|fbjs|process|webpack\/buildin|classnames|preact|preact-compact)($|\/)/;