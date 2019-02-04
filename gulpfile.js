const gulp = require('gulp');
const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const cssnesting = require('postcss-nesting');
const cssdiscard = require('postcss-discard-empty');
const cssmqpacker = require('css-mqpacker');
const cssimport = require('postcss-smart-import');
const cssprettify = require('postcss-prettify');
const cssnested = require('postcss-nested');
const cssfixes = require('postcss-fixes');
const cssmin = require('gulp-cssmin');
const csslost = require('lost');
const rucksack = require('rucksack-css');
const gulpbabel = require('gulp-babel');
const terser = require('gulp-terser');
const zip = require('gulp-zip');

const postCSSPlugins = [
    cssimport(),
    cssnested(),
    csslost(),
    cssnext({
        browsers: ['last 2 version'],
        features: {
            calc: false
        }
    }),
    rucksack(),
    cssfixes({ preset: 'safe' }),
    cssmqpacker({ sort: true }),
    cssdiscard(),
    cssprettify()
];

//CSS
gulp.task('postcss', function() {
    return gulp.src('src/postcss/*.css')
        .pipe(cache('postcss'))
        .pipe(postcss(postCSSPlugins))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ title: 'CSS Task', message: 'PostCSS compiled and minified' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(['./src/js/*.js', '!./**/*.min.js'])
        .pipe(plumber())
        .pipe(cache('scripts'))
        .pipe(gulpbabel({
            "plugins": ["transform-es2015-modules-umd"],
            "presets": [["es2015", { "modules": false }]],
            "moduleId": "GLightbox"
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(terser())
        .pipe(gulp.dest('dist/js'))
        .pipe(plumber.stop())
        .pipe(notify({ title: 'Scripts Task', message: 'Scripts compiled and minified' }));
});

// Release
gulp.task('release', function() {
    return gulp.src(['./**', '!node_modules', '!node_modules/**', '!package-lock.json', '!**/*.psd', '!**/.DS_Store'])
        .pipe(zip('glightbox-master.zip'))
        .pipe(gulp.dest('./'))
        .pipe(notify({ title: 'Release Ready', message: 'Release file created' }));
});

// Watch
gulp.task('watch', function(done) {
    gulp.watch('src/postcss/*.css', gulp.series('postcss'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    done();
});
gulp.task('default', gulp.series('watch'));
