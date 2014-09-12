## lessbuildify

[![travis](http://img.shields.io/travis/deepsweet/lessbuildify.svg?style=flat-square)](https://travis-ci.org/deepsweet/lessbuildify)
[![coverage](http://img.shields.io/coveralls/deepsweet/lessbuildify.svg?style=flat-square)](https://coveralls.io/r/deepsweet/lessbuildify)
[![npm](http://img.shields.io/npm/v/lessbuildify.svg?style=flat-square)](https://www.npmjs.org/package/lessbuildify)
[![deps](http://img.shields.io/david/deepsweet/lessbuildify.svg?style=flat-square)](https://david-dm.org/deepsweet/lessbuildify)
[![dev deps](http://img.shields.io/david/dev/deepsweet/lessbuildify.svg?style=flat-square)](https://david-dm.org/deepsweet/lessbuildify#info=devDependencies)

Browserify plugin for compiling Less to the **external file**. Also applies [autoprefixer](https://github.com/postcss/autoprefixer) and [clean-css](https://github.com/jakubpawlowicz/clean-css).

### cli

[subarg](https://github.com/substack/subarg) syntax:

```sh
$ browserify -p [ lessbuildify --dest out.css ] in.js -o out.js
```

### module

```javascript
var fs = require('fs'),
    browserify = require('browserify'),
    lessbuildify = require('lessbuildify');

var b = browserify('in.js');
b.plugin(lessbuildify, { dest: 'out.css' });
b.bundle().pipe(fs.createWriteStream('out.js'))
```

### grunt

```javascript
browserify: {
    files: {
        'out.js': 'in.js'
    },
    options: {
        plugin: [
            [ 'lessbuildify', {
                dest: 'out.css',
                less: {
                    sourceMap: true
                },
                autoprefixer: {
                    map: 'inline'
                },
                cleancss: false
            } ]
        ]
    }
}
```

### options

#### `options.dest`

Destination `.css`-file to write out compiled and processed required `.less`-files. No default value.

#### `options.less`

defaults:

```javascript
less: {
    compress: false,
    cleancss: false,
    ieCompat: false,
    syncImport: true,
    sourceMap: false
}
```

Less parser's and compiler's options are combined into one hash.

#### `options.autoprefixer`

defaults:

```javascript
autoprefixer: {
    cascade: true,
    map: false
}
```

#### `options.cleancss`

defaults:

```javascript
cleancss: {
    processImport: false,
    noRebase: true,
    keepSpecialComments: 0
}
```

### license

[MIT](https://github.com/deepsweet/lessbuildify/blob/master/LICENSE)
