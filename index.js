'use strict';

var fs = require('fs'),
    path = require('path'),
    through = require('through2'),
    extend = require('extend'),
    less = require('less'),
    autoprefixer = require('autoprefixer-core'),
    CleanCSS = require('clean-css');

// default config
var defaults = {
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

module.exports = function(browserify, options) {

    var lessFiles = '',
        tmpStreams = [],
        opts = extend(true, {}, defaults, options);

    browserify.on('bundle', function(bundle) {

        bundle.on('end', function() {

            // parse less
            var parser = new less.Parser(opts.less);

            parser.parse(lessFiles, function(err, ast) {

                if (err) {
                    throw err;
                }

                var stream;
                // Ideally the file event would be emitted while the file is
                // inside the transform, but that would require parsing the
                // required less files individually, and then parsing the
                // collection of them here.
                var files = Object.keys(parser.imports.files);
                while (tmpStreams.length > 1) {
                    stream = tmpStreams.pop();
                    for (var i = 0; i < files.length; i++) {
                        // This will tell watchify that the file associated
                        // with `stream` depends on `dep`.
                        stream.emit('file', files[i]);
                    }
                }

                // compile less
                var css = ast.toCSS(opts.less);

                browserify.emit('lessbuildify:tocss', css);

                // autoprefixer
                if (opts.autoprefixer !== false) {
                    css = autoprefixer(opts.autoprefixer).process(css, opts.autoprefixer).css;
                    browserify.emit('lessbuildify:autoprefixer', css);
                }

                // clean-css
                if (opts.cleancss !== false) {
                    css = new CleanCSS(opts.cleancss).minify(css);
                    browserify.emit('lessbuildify:cleancss', css);
                }

                // output
                if (opts.dest) {
                    fs.writeFileSync(opts.dest, css);
                }

                browserify.emit('lessbuildify:end', css);

            });

        });

    });

    browserify.transform(function(file) {

        // do nothing and pass non .less files through
        if (path.extname(file) !== '.less') {
            return through();
        }

        // process read/write stream
        var stream = through(null, function() {

            browserify.emit('lessbuildify:file', file);

            // collect .less files as `@import`s with absolute paths
            // so Less can deal with the inner relative `@import`s by himself
            lessFiles += '@import "' + file + '";\n';

            // info placement
            this.push('// lessbuildify: ' + path.relative(process.cwd(), file));
            // do not put CSS content to the resulting JS file
            this.push(null);

        });
        tmpStreams.push(stream);
        return stream;

    });

};
