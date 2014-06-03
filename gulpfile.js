var gulp = require('gulp')
  , child_process = require('child_process')
  , jshint = require('gulp-jshint')
  , path = require('path')

  , _ghoulPath = path.join(__dirname, 'node_modules/.bin/ghoul');

gulp.task('lint', function () {
  return gulp.src(['./lib/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', ['lint'], function () {
  var ghoul = child_process.spawn(_ghoulPath, [], { stdio: 'inherit' });
  ghoul.on('close', function (code) {
    if (code !== 0) {
      console.log('ghoul exited with code:', code);
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);
