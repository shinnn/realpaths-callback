# realpaths-callback

[![NPM version](https://img.shields.io/npm/v/realpaths-callback.svg)](https://www.npmjs.com/package/realpaths-callback)
[![Build Status](https://travis-ci.org/shinnn/realpaths-callback.svg?branch=master)](https://travis-ci.org/shinnn/realpaths-callback)
[![Build status](https://ci.appveyor.com/api/projects/status/faycw72q6pw3inrd/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/realpaths-callback/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/realpaths-callback.svg)](https://coveralls.io/r/shinnn/realpaths-callback)
[![Dependency Status](https://david-dm.org/shinnn/realpaths-callback.svg)](https://david-dm.org/shinnn/realpaths-callback)
[![devDependency Status](https://david-dm.org/shinnn/realpaths-callback/dev-status.svg)](https://david-dm.org/shinnn/realpaths-callback#info=devDependencies)

[Callback](http://thenodeway.io/posts/understanding-error-first-callbacks/)-style version of [realpaths](https://www.npmjs.com/package/realpaths):

> Like [fs.realpath][realpath], but resolves multiple paths at once

```javascript
const realpathsCallback = require('realpaths-callback');

// symlink1 <<===>> /path/to/foo.txt
// symlink2 <<===>> /path/to/bar.txt

realpaths(['symlink1', 'symlink2'], (err, paths) => {
  if (err) {
    throw err;
  }

  paths; //=> ['/path/to/foo.txt', '/path/to/bar.txt']
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install realpaths-callback
```

## API

```javascript
const realpathsCallback = require('realpaths-callback');
```

### realpathsCallback(*paths* [, *cache*], *callback*)

*paths*: `Array` of strings (file paths)  
*cache*: `Object` (used as [`fs.realpath`](https://github.com/nodejs/node/blob/c339fa36f5493c2bd2e108463910122ef82843c4/lib/fs.js#L1568-L1570) cache)  
*callback*: `Function` (called after the paths are resolved)

It's API is very similar to [`fs.realpath`][realpath]. The only difference is *realpaths-callback* takes an array as its first argument and resolves multiple paths at once.

```javascript
'use strict';

const path = require('path');
const realpaths = require('realpaths-callback');

realpaths(['symlink1', 'symlink2'], {
  cache: {
    [path.resolve('symlink1')]: '/path/to/foo.txt',
    [path.resolve('symlink2')]: '/path/to/bar.txt'
  }
}, (err, paths) => {
  if (err) {
    throw err;
  }
  paths; //=> ['/path/to/foo.txt', '/path/to/bar.txt']
});
```

If at least one of the paths cannot be resolved, it immediately passes an error to its callback function without considering the rest of paths.

## Related project

* [realpaths](https://github.com/shinnn/realpaths) ([Promises/A+](https://promisesaplus.com/) version)

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[realpath]: https://nodejs.org/api/fs.html#fs_fs_realpath_path_cache_callback
