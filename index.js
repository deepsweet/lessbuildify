var fs = require('fs'),
    path = require('path'),
    through = require('through2'),
    extend = require('extend'),
    less = require('less'),
    autoprefixer = require('autoprefixer-core'),
    CleanCSS = require('clean-css');

module.exports = function(browserify, options) {

    var lessFiles = '',
        // default config
        defaults = {
            less: {
                compress: false,
                cleancss: false,
                ieCompat: false,
                syncImport: true,
                sourceMap: false
            },
            autoprefixer: {
                cascade: true,
                map: false
            },
            cleancss: {
                processImport: false,
                noRebase: true,
                keepSpecialComments: 0
            }
        };

    // get options
    options = extend(true, {}, defaults, options);

    browserify.on('bundle', function(bundle) {

        bundle.on('end', function() {

            // parse less
            var parser = new less.Parser(options.less);

            parser.parse(lessFiles, function(err, ast) {

                if (err) {
                    throw err;
                }

                // compile less
                var css = ast.toCSS(options.less);

                // autoprefixer
                if (options.autoprefixer !== false) {
                    css = autoprefixer(options.autoprefixer).process(css, options.autoprefixer).css;
                }

                // clean-css
                if (options.cleancss !== false) {
                    css = new CleanCSS(options.cleancss).minify(css);
                }

                fs.writeFileSync(options.dest, css);

            });

        });

    });

    browserify.transform(function(file) {

        // do nothing and pass non .less files through
        if (path.extname(file) !== '.less') {
            return through();
        }

        // process read/write stream
        return through(null, function() {

            // collect .less files as `@import`s with absolute paths
            // so Less can deal with the inner relative `@import`s by himself
            lessFiles += '@import "' + file + '";\n';

            // info placement
            this.push('// stylify: ' + file);
            // do not put CSS content to the resulting JS file
            this.push(null);

        });

    });

}
