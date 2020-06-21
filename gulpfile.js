const { series } = require('gulp');
const gulp = require('gulp');
const { exec } = require('child_process');
const conventionalChangelog = require('gulp-conventional-changelog');
const conventionalRecommendedBump = require('conventional-recommended-bump');
const bump = require('gulp-bump');
const git = require('gulp-git');
const packageJson = require('./package.json');
// const runSequence = require('run-sequence');
// const git = require('gulp-git-streamed')


function clean(cb) {
  cb();
}

function build(cb) {
  exec('npm run-script build', function(error, stdout, stderr) {
    if (error) {
      console.log(stderr);
      cb(true);
    } else {
      console.log(stdout);
      cb();
    }
  });
}

function copyToDest(cb) {
  gulp.src('./build/*.*').pipe(
    gulp.dest('/home/nabla/unipiazza/unipiazza-web-landing/public', {
      overwrite: true,
    }),
  );
  cb();
}

function generateChangelog(cb) {
  gulp
    .src('Changelog.md')
    .pipe(
      conventionalChangelog({
        preset: 'angular',
        append: true,
      }),
    )
      .pipe(gulp.dest('./'))
      .on('end', () => cb());
}

function bumpVersion(cb) {
  conventionalRecommendedBump(
    {
      preset: 'angular',
    },
    function(err, result) {
      console.log(result.releaseType);
      console.log(result);
      gulp
        .src('./package.json')
        .pipe(bump({ type: result.releaseType }))
        .pipe(gulp.dest('./'));
      cb();
    },
  );
}


function commitChanges(cb) {
    gulp.src('.')
        .pipe(git.add())
        .pipe(git.commit(`[Prerelease] Bumped version number to ${packageJson.version}`))
        .on('end', function () {
            console.log(git.status())
            console.log("ok")
            // git.push('origin', 'master', function(err) {
            //     if (err) throw (err);
            //     cb(err)
            //   });
        })
        // .pipe(git.push('origin', 'master', (err) => {
        //     console.log("dio poroc")
        //     if (err) console.log(err)
        //     else cb()
        // }))
        
}

function pushChanges(cb) {
    git.push('origin', 'master', cb)
}

function updateVersion(cb) {
    
}

// prova prova prova
exports.build = build;
exports.default = series(generateChangelog, bumpVersion, commitChanges);
