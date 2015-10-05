'use strict';

const path = require('path');
const assert = require('assert');

const fs = require('graceful-fs');
const realpathsCallback = require('.');
const test = require('tape');

fs.symlink(__filename, 'tmp', symlinkErr => {
  assert.ifError(symlinkErr);

  test('realpathsCallback()', t => {
    t.plan(9);

    realpathsCallback(['tmp'], (...args) => {
      t.deepEqual(args, [null, [__filename]], 'should expand a symbolic link.');
    });

    realpathsCallback(['tmp', 'index.js'], null, (...args) => {
      t.deepEqual(
        args,
        [null, [__filename, path.resolve('index.js')]],
        'should support multiple paths.'
      );
    });

    realpathsCallback(['tmp', 'index.js', 'foobarbazqux', 'tmp'], null, (...args) => {
      t.strictEqual(
        args[0].path,
        path.resolve('foobarbazqux'),
        'should pass an error to the callback when it fails to resolve a path.'
      );
      t.strictEqual(
        args.length,
        1,
        'should not pass the second argument to the callback when it fails to resolve a path.'
      );
    });

    realpathsCallback(['tmp'], {[path.resolve('tmp')]: path.resolve('a')}, (...args) => {
      t.deepEqual(args, [null, [path.resolve('a')]], 'should use cache as possible.');
    });

    t.throws(
      () => realpathsCallback('foo', {}, t.fail),
      /TypeError.*foo is not an array\. Expected an array of file paths\./,
      'should throw a type error when the first argument is not an array.'
    );

    t.throws(
      () => realpathsCallback(['tmp', 123], t.fail),
      /TypeError.*The array includes non-string value\(s\): 123 \(index: 1\)\. /,
      'should throw a type error when the array includes a non-string value.'
    );

    t.throws(
      () => realpathsCallback(['tmp', true, null], t.fail),
      /true \(index: 1\) and null \(index: 2\)\. Expected every item in the array to be a path\./,
      'should throw a type error when the array includes non-string values.'
    );

    t.throws(
      () => realpathsCallback(['tmp'], undefined, 1),
      /TypeError.*1 is not a function\. Expected a callback function\./,
      'should throw a type error when the last argument is not a funtion.'
    );

    t.on('end', () => fs.unlink('tmp', unlinkErr => {
      assert.ifError(unlinkErr);
    }));
  });
});
