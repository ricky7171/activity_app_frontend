"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const glob = require('glob');
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const browserify = require('browserify');
const babelify = require('babelify');
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
// var nunjucks = require('./js/app/infra/nunjucks');
var nunjucks = require('nunjucks');
var gnunjucks = require('gulp-nunjucks');
var config = require('./config')

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/StartBootstrap/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');



// BrowserSync
function browserSync(done) {
  return browsersync.init({
    // proxy: config.PROXY,
    // host: config.HOST,
    // open: 'external',
    server: {
      baseDir: config.DESTINATION_PATH
    },
    port: process.env.PORT || 8080
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  
  done();
}

// Clean vendor
function clean() {
  return del(config.DESTINATION_PATH + '/**', {force:true});
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap JS
  var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/*')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/bootstrap/js'));
  // Bootstrap SCSS
  var bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/bootstrap/scss'));
  // ChartJS
  var chartJS = gulp.src('./node_modules/chart.js/dist/*.js')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/chart.js'));
  // dataTables
  var dataTables = gulp.src([
    './node_modules/datatables.net/js/*.js',
    './node_modules/datatables.net-bs4/js/*.js',
    './node_modules/datatables.net-bs4/css/*.css'
  ])
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/datatables'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/jquery-easing'));
  // jQuery
  var jquery = gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/jquery'));
  // Sweetalert JS
  var sweetalert2 = gulp.src('./node_modules/sweetalert2/dist/**/*')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/sweetalert2'));
  // Colorpicker JS
  var colorPicker = gulp.src('./node_modules/spectrum-colorpicker/**/*')
  .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/spectrum-colorpicker'));
  // Tinycolor JS
  var tinyColor = gulp.src('./node_modules/tinycolor2/dist/**/*')
  .pipe(gulp.dest(config.DESTINATION_PATH+'/vendor/tinycolor2'));

  return merge(bootstrapJS, bootstrapSCSS, chartJS, dataTables, fontAwesome, jquery, jqueryEasing, sweetalert2, tinyColor);
}

// CSS task
function css() {
  return gulp
    .src(["./scss/**/*.scss", "./css/**/*.css"])
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    // .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.DESTINATION_PATH+"/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  var files = glob.sync("./js/**/*.js");
  return merge(files.map(function(file) {
    var b = browserify(file)
      .transform("babelify", { presets: ['@babel/preset-env'] });
    return b.bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.DESTINATION_PATH));
  }));

  
  
  
  // browserify({
  //   entries: jsFiles,
  //   debug: true,
  //   transform: [babelify.configure({
  //     presets: ['es2015']
  //   })]
  // });

  // return b.bundle()
  //   .pipe(uglify())
  //   .pipe(header(banner, {
  //     pkg: pkg
  //   }))
  //   .pipe(rename({
  //     suffix: '.min'
  //   }))
  //   .pipe(gulp.dest('./js'))
  //   .pipe(browsersync.stream());
}

// SERVE task
function serve() {
  console.log("check port");
  console.log(process.env.PORT);
  return connect.server({
    root: "./dist",
    port: process.env.PORT || 8000, // localhost:8000
    livereload: false
  });
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
  // gulp.watch("./**/*.html", browserSyncReload);
  gulp.watch("./dist/**/*", browserSyncReload);
  gulp.watch(config.VIEW_PATH+"**/*", compileNunjucks)
}

// Compile nunjucks file
function compileNunjucks() {
  var PAGE_PATH = config.PAGE_PATH;
  var opts = {
    env:  new nunjucks.Environment(new nunjucks.FileSystemLoader('js/app/views/'))
  }
  var extensions = '**/*.+(html|njk|nunj|nunjucks)';
  var listPath = [
    `${PAGE_PATH}${extensions}`,
    `!${PAGE_PATH}*/components/${extensions}`,
  ]

  return gulp.src(listPath)
  .pipe(gnunjucks.compile({name: 'Sindre'}, opts))
  .pipe(rename(function(path){
    if(path.dirname == 'home') {
      path.dirname = '.';
    }
  }))
  .pipe(gulp.dest(config.DESTINATION_PATH));
}

// copy assets
function copyAssets() {
  return gulp.src('./assets/**/*')
    .pipe(gulp.dest(config.DESTINATION_PATH+'/assets'));
}

// Define complex tasks
const build = gulp.series(clean, modules, gulp.parallel(css, js, copyAssets, compileNunjucks));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
const dev = gulp.series(build, gulp.parallel(watchFiles, serve));
// const watch = gulp.series(watchFiles)

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
// exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.compile = compileNunjucks;
exports.serve = serve;
exports.dev = dev;
