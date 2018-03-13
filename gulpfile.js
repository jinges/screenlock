const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');

gulp.task('clean', function (cb) {
  del('dist', cb);
});

gulp.task('build', () =>
  gulp.src('src/screenLock.js')
    // .pipe(rename("ScreenLock.js"))
    // .pipe(gulp.dest('dist'))
    .pipe(babel({
      presets: [['es2015'], 'stage-1']
    }))
    .pipe(rename("screen_lock.js"))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('connect', function () {
  connect.server({
    livereload: true,
    port: 80
  });
  livereload.listen()
});

gulp.task('watch', function () {
  gulp.watch('src/screenLock.js', ['build']);
  livereload.listen();
});

gulp.task('default', ['clean', 'build', 'connect', 'watch'], ()=>{
  console.log('success!')
})