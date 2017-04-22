var fse = require('fs-extra');
var path = require('path');

module.exports = function (outputPath, stats, env) {
  var conf = {
    // Add asset Information
    assets: true,
    // Add information about cached (not built) modules
    cached: true,
    // Add children information
    children: true,
    // Add built modules information to chunk information
    chunkModules: true,
    // Add the origins of chunks and chunk merging info
    chunkOrigins: true,
    // Display the distance from the entry point for each module
    depth: false,
    // Display the entry points with the corresponding bundles
    entrypoints: false,
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    // Exclude modules which match one of the given strings or regular expressions
    exclude: [],
    // Add the hash of the compilation
    hash: true,
    // Add built modules information
    modules: true,
    // Show performance hint when file size exceeds `performance.maxAssetSize`
    performance: true,
    // Show the exports of the modules
    providedExports: true,
    // Add public path information
    publicPath: true,
    // Add information about the reasons why modules are included
    reasons: true,
    // Add the source code of modules
    source: false,
    // Add timing information
    timings: true,
    // Show which exports of a module are used
    usedExports: false,
    // Add webpack version information
    version: true,
    // Add warnings
    warnings: true
  };
  if(env.isDebug){
    conf.source = true;
  }
  fse.writeJsonSync(path.join(outputPath, 'stats.json'), stats.toJson(conf));
}