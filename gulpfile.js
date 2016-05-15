/**
 * Created by administrator on 4/19/16.
 */
var gulp = require('gulp'),
    minify = require('gulp-minify'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    karma = require('karma');

gulp.task('compress',function(){
    return gulp.src(['js/*.js'])
        .pipe(debug())
        .pipe(minify({
            ignoreFiles: ['-min.js','min-*.js']
        }))
        .pipe(gulp.dest('dest/js'));
});

gulp.task('make-dist',['compress'],function(){
    console.log('DONE');
});

gulp.task('tests', function (done) {
    console.log(__dirname )
    var config = {
            configFile: __dirname + '/karma-services.conf.js',
            singleRun: true
        },
        server = new karma.Server(config,done);
    return server.start();
});

