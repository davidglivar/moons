var gulp = require('gulp')
  , child_process = require('child_process')
  , jsdoc = require('gulp-jsdoc')
  , jshint = require('gulp-jshint')
  , path = require('path')
  , server = require('http-server')

  , _ghoulPath = path.join(__dirname, 'node_modules/.bin/ghoul');

gulp.task('clean-docs', function (done) {
  var rm = child_process.spawn('rm', ['-rf', 'docs']);
  rm.on('close', done);
});

gulp.task('docs', ['clean-docs'], function () {
  return gulp.src(['./moons/**/*.js'])
    .pipe(jsdoc('./docs'));
});

gulp.task('docs-server', ['docs'], function () {
  var s = server.createServer({ root: path.join(__dirname, 'docs') });
  s.listen(3001);
});

gulp.task('lint', function () {
  return gulp.src(['./moons/**/*.js', './test/**/*.js'])
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
  gulp.watch(['./moons/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'docs', 'watch']);
