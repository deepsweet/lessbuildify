var fs = require('fs'),
    sinon = require('sinon'),
    browserify = require('browserify'),
    lessbuildify = require('../');

describe('lessbuildify', function() {

    beforeEach(function() {
        this.b = browserify('./test/fixtures/main.js');
        this.spy = sinon.spy();
    });

    describe('events', function() {

        it('must compile Less to CSS', function(done) {

            var that = this;

            this.model = fs.readFileSync('./test/fixtures/models/tocss.css', 'utf-8');
            this.b.plugin(lessbuildify);
            this.b.on('lessbuildify:tocss', this.spy);
            this.b.on('bundle', function(bundle) {
                bundle.on('end', function() {
                    that.spy.calledOnce.must.be.true();
                    that.spy.calledWith(that.model).must.be.true();

                    done();
                });
            });
            this.b.bundle().pipe(fs.createWriteStream('/dev/null'));

        });

        it('must apply Autoprefixer', function(done) {

            var that = this;

            this.model = fs.readFileSync('./test/fixtures/models/autoprefixer.css', 'utf-8');
            this.b.plugin(lessbuildify);
            this.b.on('lessbuildify:autoprefixer', this.spy);
            this.b.on('bundle', function(bundle) {
                bundle.on('end', function() {
                    that.spy.calledOnce.must.be.true();
                    that.spy.calledWith(that.model).must.be.true();

                    done();
                });
            });
            this.b.bundle().pipe(fs.createWriteStream('/dev/null'));

        });

        it('must apply CleanCSS', function(done) {

            var that = this;

            this.model = fs.readFileSync('./test/fixtures/models/cleancss.css', 'utf-8');
            this.b.plugin(lessbuildify);
            this.b.on('lessbuildify:cleancss', this.spy);
            this.b.on('bundle', function(bundle) {
                bundle.on('end', function() {
                    that.spy.calledOnce.must.be.true();
                    that.spy.calledWith(that.model).must.be.true();

                    done();
                });
            });
            this.b.bundle().pipe(fs.createWriteStream('/dev/null'));

        });

    });

    describe('file', function() {

        before(function() {
            this.dest = './test/fixtures/out.css';
        });

        it('must apply CleanCSS', function(done) {

            var that = this;

            this.model = fs.readFileSync('./test/fixtures/models/cleancss.css', 'utf-8');
            this.b.plugin(lessbuildify, { dest: this.dest });
            this.b.on('lessbuildify:end', this.spy);
            this.b.on('bundle', function(bundle) {
                bundle.on('end', function() {
                    that.spy.calledOnce.must.be.true();
                    fs.readFileSync(that.dest, 'utf-8').must.be.equal(that.model);

                    done();
                });
            });
            this.b.bundle().pipe(fs.createWriteStream('/dev/null'));

        });

        after(function() {
            fs.unlinkSync(this.dest);
        });

    });

});
