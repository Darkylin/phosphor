var log = require('./log');

module.exports=function(err, stats){
  err = err || stats.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  });
  err && console.error(err);
}