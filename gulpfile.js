const path = require('path');
const gulp = require('gulp');
const Mocha = require('mocha');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const spawn = require('child_process').spawn;
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
let node;

gulp.task('clean', () => {
  spawn('rm', ['-rf', 'build/']);
});

gulp.task('front', ['clean'], () => {
  return gulp.src('./src/{views,public}/**/*.{html,css}')
    .pipe(gulp.dest('build/src/'));
});

gulp.task('babel', ['clean'], () => {
  return gulp.src('./{test,src}/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build/'));
});

gulp.task('browserify', ['babel'], () => {
  // https://scotch.io/tutorials/getting-started-with-browserify
  const config = {
    src: './build/src/public/js/main.js',
    outputDir: './build/src/public/js/',
    outputFile: 'bundle.js'
  };
  return browserify(config.src)
    .bundle()
    .pipe(source(config.src))
    .pipe(buffer())
    .pipe(rename(config.outputFile))
    .pipe(gulp.dest(config.outputDir));
})

gulp.task('server', ['default'], () => {
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

gulp.task('test', ['default'], () => {
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

gulp.task('default', ['browserify', 'babel', 'front'], () => {
  console.log('The default gulp task compiles the source code and generates `./build`.');
});

process.on('exit', () => {
  if (node) {
    node.kill(); // hack, avoid memory leak
  }
});
