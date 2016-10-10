/*
 * -> Custom gulp settings for GAP Demo
 * -> TODO: divide and conquer
 */

var gulp         = require('gulp');
var bower        = require('gulp-bower');
var browsersync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss    = require('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');
var rename       = require('gulp-rename');
var notify       = require('gulp-notify');
var uglify       = require('gulp-uglify');
var eslint       = require('gulp-eslint');
var imagemin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var flatten      = require('gulp-flatten');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var ngannotate   = require('gulp-ng-annotate');


// ### Config
var buildPath    = './builds';
var sourcePath   = './source';

var config = {
  env      : buildPath + '/dev',
  assets   : buildPath + '/dev/assets',
  sassPath : sourcePath + '/sass',
  appPath  : sourcePath + '/app',
  imgPath  : sourcePath + '/img',
  fontPath : sourcePath + '/fonts',
  npmDir   : './node_modules' ,
  devUrl   : 'gaptest.dev'
};


// ### Compile Styles
gulp.task('styles', function() { 
  return gulp.src(config.sassPath + '/**/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({ includePaths : [ config.npmDir + '/bootstrap-sass/assets/stylesheets' ] }) )
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifycss())
    .pipe(rename({suffix : '.min'}))
    .pipe(sourcemaps.write('./_sourcemaps'))
    .pipe(gulp.dest(config.assets))
    .pipe(browsersync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
});


// ### Compile Scripts
gulp.task('scripts', [/*'eslint',*/ 'ngAnnotate'], function() {
  var b = browserify({
    entries: config.appPath + '/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({mangle: false}))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./_sourcemaps'))
    .pipe(gulp.dest(config.assets))
    .pipe(notify({ message: 'Scripts task complete' }));
});


// ### Add angularjs dependency injection annotations
gulp.task('ngAnnotate', function () {
  return gulp.src(config.appPath + '/**/*.js')
    .pipe(ngannotate({
      add: true,
      single_quotes: true
    }));
});


// ### Lint the jsvascript
gulp.task('eslint', function() {
  return gulp.src(config.appPath + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


// ### Compress images
gulp.task('images', function() {
  return gulp.src(config.imgPath + '/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.assets + '/img'));
});


// ### Move files to final destination
gulp.task('movefiles',function(){
  return gulp.src([
      sourcePath + '/index.html',
      config.appPath + '/**/*.{html,json}'
    ])
    //.pipe(flatten())
    .pipe(gulp.dest(config.env))
    .pipe(notify({ message : 'Files copied' }));
});


// ### Fonts
gulp.task('fonts', function() {
  return gulp.src([
      config.npmDir + '/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}',
      config.fontPath + '/*.{eot,svg,ttf,woff,woff2}'
    ])
    .pipe(flatten())
    .pipe(gulp.dest(config.assets + '/fonts'));
});


// ### Clean
// `gulp clean` - Deletes the build folder entirely.
gulp.task('clean', require('del').bind(null, [buildPath]));


// ### Watch
// See: http://www.browsersync.io
gulp.task('watch', ['build'], function() {
  browsersync.init({
    server : config.env
    //proxy  : config.devUrl
  });
  gulp.watch([config.sassPath + '/**/*.scss'], ['styles']);
  gulp.watch([config.appPath  + '/**/*.js'], ['scripts']);
  gulp.watch([config.imgPath  + '/**/*'], ['images']);
  gulp.watch([sourcePath      + '/**/*.html'], ['movefiles']).on('change', browsersync.reload);
});


// ### Build
gulp.task('build', ['styles', 'scripts', 'images', 'fonts', 'movefiles']);


// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
