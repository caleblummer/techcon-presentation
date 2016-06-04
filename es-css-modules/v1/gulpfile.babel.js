//largely ripped from https://medium.com/@jacobp/tree-shaking-bootstrap-95d6301f61a9#.zcbup8kjk
import {camelCase} from 'lodash';
import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import transformClasses from 'postcss-transform-classes';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import esCssModules from 'es-css-modules';
import rimraf from 'rimraf';

const keywordsThatAppearInBootstrap = {
  in: '$in',
};

gulp.task('compile-sass', () => (
  gulp.src('./sass/**/*.scss')
    .pipe(sass())
    .pipe(postcss([
      transformClasses({
        transform: (name) => (
          name in keywordsThatAppearInBootstrap
            ? keywordsThatAppearInBootstrap[name]
            : camelCase(name)
        ),
      }),
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ]))
    .pipe(gulp.dest('styles'))
));

gulp.task('compile-css', ['compile-sass'], () => {
  return gulp.src('styles/**/*.css')
    .pipe(postcss([
      esCssModules({
        jsFiles: 'src/app.js',
        warnOnUnusedClasses: false
      })
    ]))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-js', ['compile-css'], (done) => {

  //First, clean the css files from styles, so webpack doesn't choke on them
  rimraf('./styles/*.css', () => {
    webpack({
      entry: './src/app',
      output: {
        path: './dist',
        filename: 'index.js',
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
          },
        ],
      },
    }, err => {
      done(err);
    })

  });
});

gulp.task('default', ['compile-js']);