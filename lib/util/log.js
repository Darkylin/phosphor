var chalk = require('chalk');
var splitLine = chalk.inverse;
var _ = require('lodash');

exports.obj = function (name, obj) {
  if (obj === undefined) {
    obj = name;
    name = '';
  }
  console.log(splitLine('=================' + name + '==================='));
  console.log(chalk.cyan(JSON.stringify(obj, null, 2)));
  console.log(splitLine('======================================'));
};

exports.error = function () {
  var args = _.toArray(arguments);
  if (args.length === 0 || (args.length === 1 && args[0] === undefined)) {
    console.error(chalk.red('恭喜你找到一个bug，请钉钉联系: ') + chalk.yellow('宇寰'));
  } else {
    console.error.apply(console, args.map(function (str) {
      return chalk.red(str);
    }));
  }
}