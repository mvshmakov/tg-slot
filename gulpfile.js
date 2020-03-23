'use strict';

// Autoprefixer config
const autoprefixerConf = {
	browsers: [
		'last 2 versions',
		'safari 5',
		'ie 9',
		'opera 12.1',
		'ios 6',
		'android 4'
	],
	cascade: true
};

// JS config
const jsConf = {
	src: ['./client/src/website/scripts/*.js', './client/src/games/**/scripts/*.js'],
	dest: './client/dist/'
};

// LESS config
const lessConf = {
	src: ['./client/src/website/styles/*.less', './client/src/games/**/styles/*.less'],
	dest: './client/dist/'
};

// Browser Sync config
const bsyncConf = {
	base: './client/dist/'
};

// Watch config
const watchConf = {
	html: ['./client/src/website/*.html', './client/src/games/**/*.html'],
	less: ['./client/src/website/styles/*.less', './client/src/games/**/styles/*.less'],
	js: ['./client/src/website/scripts/*.js', './client/src/games/**/scripts/*.js']
};

// Plugins config
const pluginsConf = {
	scope: ['dependencies', 'devDependencies', 'peerDependencies'],
	rename: {
		'gulp-babel': 'babel',
		'gulp-less': 'less',
		'gulp-plumber': 'plumber',
		'gulp-sourcemaps': 'sourcemaps'
	}
}

// Plugins
var gulp = require('gulp');

var bsync = require('browser-sync');
var plugins = require('gulp-load-plugins')(pluginsConf);

// General
gulp.task('default', ['watch']);

// Build
gulp.task('build', ['icons', 'less'], function() {
	console.log('BUILD DONE');
});

// HTML
gulp.task('html', function() {
	bsync.reload();
});

// LESS
gulp.task('less', function() {
	return gulp.src(lessConf.src)
		.pipe(plugins.plumber({
			errorHandler: onPlumberError
		}))
		.pipe(plugins.less())
		.pipe(plugins.autoprefixer(autoprefixerConf))
		.pipe(gulp.dest(lessConf.dest))
		.pipe(bsync.stream());
});

// JS
gulp.task('js:compile', () => {
	return gulp.src(jsConf.src)
		.pipe(plugins.plumber({
			errorHandler: onPlumberError
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel({
			presets: ['es2015']
		}))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(jsConf.dest))
});

gulp.task('js', ['js:compile'], function() {
	bsync.reload();
});

// Browser sync
gulp.task('bsync', function() {
	bsync.init({
		server: {
			baseDir: bsyncConf.base,
			directory: true
		},
		startPath: bsyncConf.start
	});
});

// Watch
gulp.task('watch', ['bsync'], function() {
	gulp.watch(watchConf.html, ['html']);
	gulp.watch(watchConf.less, ['less']);
	gulp.watch(watchConf.icons, ['icons']);
	gulp.watch(watchConf.js, ['js']);
});

// Error Handlers
process.on('uncaughtException', function(err) {
	console.error(err.message, err.stack, err.errors);
});

gulp.on('err', function(gulpErr) {
	if (gulpErr.err) {
		console.error('Gulp error details', [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors].filter(Boolean));
	}
});

// Helpers
function onPlumberError(error) {
	console.log(error, 'In-gulp plumber Error');
	this.emit('end');
}
