let gulp = require('gulp');
let Mocha = require('mocha');
let sourcemaps = require('gulp-sourcemaps');
let babel = require('gulp-babel');
let spawn = require('child_process').spawn;
let node;

gulp.task('clean', () => {
  spawn('rm', ['-rf', 'build/']);
});

gulp.task('babel', ['clean'], () => {
  return gulp.src('./{test,src}/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build/'));
});

gulp.task('server', ['babel'], () => {
  // https://gist.github.com/webdesserts/5632955

  if (node) {
    node.kill();
  }
  node = spawn('node', ['--harmony', './build/src/index.js'], {
    stdio: 'inherit'
  });
  node.on('close', code => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', ['server'], () => {
  gulp.watch('src/**', ['server']);
  gulp.watch('test/**', ['server']);
});

gulp.task('test', ['babel'], () => {
  let testDir = './build/test';
  let mocha = new Mocha();
  require('fs')
    .readdirSync(testDir)
    .filter(file => {
      return file.substr(-3) === '.js';
    })
    .forEach(file => {
      mocha.addFile(require('path').join(testDir, file));
    });

  let m = mocha.run();

  m.on('end', () => {
    process.exit();
  });
});

gulp.task('default', ['babel'], () => {
  console.log('default gulp');
});

process.on('exit', () => {
  if (node) {
    node.kill(); // hack, avoid memory leak
  }
});
