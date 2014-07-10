var gulp = require('gulp')
  , browserify = require('browserify')
  , child_process = require('child_process')
  , fs = require('fs')
  , Ghoul = require('ghoul')
  , jsdoc = require('gulp-jsdoc')
  , jshint = require('gulp-jshint')
  , path = require('path')
  , server = require('http-server')
  , source = require('vinyl-source-stream');

gulp.task('clean-docs', function (done) {
  var rm = child_process.spawn('rm', ['-rf', 'docs']);
  rm.on('close', done);
});

gulp.task('docs', ['clean-docs'], function () {
  return gulp.src(['./moons/**/*.js', 'README.md'])
    .pipe(
      jsdoc(
        './docs', 
        {}, // template
        {},
        { 
          showPrivate: true
        }
      )
    );
});

gulp.task('docs-server', ['docs'], function () {
  var s = server.createServer({ root: path.join(__dirname, 'docs') });
  s.listen(3001);
});

gulp.task('lint', function () {
  return gulp.src('./moons/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sandbox', function () {
  var build = child_process.spawn('./bin/moons', ['init', 'sandbox']);
  build.on('close', function (code) {
    if (code === 0) {
      var sandpath = path.join(__dirname, 'sandbox')
        , files = fs.readdirSync(sandpath)
        , count = 0;
      files = files.filter(function (file) {
        if (path.extname(file) === '.js' &&
            !file.match(/main/ig)) {
          return file;
        }
      });
      files.forEach(function (file) {
        var base = path.basename(file, '.js');
        browserify(path.join(sandpath, file))
          .bundle()
          .pipe(source(base + '.main.js'))
          .pipe(gulp.dest(sandpath))
          .on('close', function () {
            count += 1;
            if (count === files.length) {
              var s = server.createServer({ root: path.join(__dirname, 'sandbox') }).listen(3000);
              console.log('sandbox server is listening on port 3000');
            }
          });
      });
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
