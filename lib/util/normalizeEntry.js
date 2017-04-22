var _ = require('lodash');

// 统一处理entry
module.exports = function normalizeEntry(entry) {
  if(_.isArray(entry)){
    return getEntryObjFromArray(entry);
  }
  return entry;
}


function fixEntryPath(path) {
  if (!_.startsWith(path, './')) {
    return './' + path;
  }
}
var IS_JS = /\.jsx?$/;
function fixEntryName(name) {
  if (IS_JS.test(name)) {
    return name.replace(IS_JS, '');
  }
  return name;
}

function getEntryObjFromArray(entry) {
  var entryObj = {};
  entry.forEach(function (value) {
    if (value) {
      entryObj[fixEntryName(value)] = fixEntryPath(value);
    }
  });
  return entryObj;
}