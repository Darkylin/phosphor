var fse = require('fs-extra');
var path = require('path');
var _ = require('lodash');

const RULES_PATH = ['module', 'rules'];
module.exports = function (outputPath, finalConfig, filename) {
  var conf = _.cloneDeep(finalConfig);
  _.set(conf,
    RULES_PATH,
    _.chain(conf).get(RULES_PATH, [])
      .map(rule => {
        rule.test = rule.test.toString();
        return rule;
      })
      .value()
  );
  fse.writeJsonSync(path.join(outputPath, filename || 'config.json'), conf);
}