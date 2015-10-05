/*!
 * realpaths-callback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/realpaths-callback
*/
'use strict';

var filteredArrayToSentence = require('filtered-array-to-sentence');
var fs = require('graceful-fs');
var mapAsync = require('map-async');
var oneTime = require('one-time');

function isNotString(item) {
  return typeof item !== 'string';
}

module.exports = function realpathsCallback(filePaths, cache, cb) {
  if (cb === undefined) {
    cb = cache;
    cache = null;
  }

  if (!Array.isArray(filePaths)) {
    throw new TypeError(
      String(filePaths) +
      ' is not an array. Expected an array of file paths.'
    );
  }

  var nonStringValues = filteredArrayToSentence(filePaths, isNotString);

  if (nonStringValues !== '') {
    throw new TypeError(
      'The array includes non-string value(s): ' +
      nonStringValues +
      '. Expected every item in the array to be a path.'
    );
  }

  if (typeof cb !== 'function') {
    throw new TypeError(
      String(cb) +
      ' is not a function. Expected a callback function.'
    );
  }

  mapAsync(filePaths, function iterator(filePath, done) {
    fs.realpath(filePath, cache, done);
  }, oneTime(cb));
};
