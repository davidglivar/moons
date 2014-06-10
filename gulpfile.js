var gulp = require('gulp')
  , child_process = require('child_process')
  , Ghoul = require('ghoul')
  , jsdoc = require('gulp-jsdoc')
  , jshint = require('gulp-jshint')
  , path = require('path')
  , server = require('http-server');

gulp.task('clean-docs', function (done) {
  var rm = child_process.spawn('rm', ['-rf', 'docs']);
  rm.on('close', done);
});

gulp.task('docs', ['clean-docs'], function () {
  return gulp.src('./moons/**/*.js')
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

gulp.task('sandbox', function () {
  var build = child_process.spawn('./bin/moons', ['init', 'sandbox']);
  build.on('close', function (code) {
    if (code === 0) {
      var s = server.createServer({ root: path.join(__dirname, 'sandbox') })
      s.listen(3000);
    } else {
      console.log('build exited with code: ' + code);
    }
  });
});

gulp.task('test', ['lint'], function () {
  var ghoul = new Ghoul({
    reporter: 'spec',
    libs: [
      //path.join(__dirname, 'node_modules/sinon/pkg/sinon.js')
    ]
  });
  ghoul.run();
});

gulp.task('watch', function () {
  gulp.watch(['./moons/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'docs', 'watch']);
