'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rigger = require('gulp-rigger');
const del = require('del');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/scss/styles.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "Wooder Landing"
};


gulp.task('default', function() {
    console.log('Gulp default task');
    return gulp.src('src/**/*.*')
        .pipe(gulp.dest('dest'));
});

gulp.task('html:build', () => {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('styles:build', () => {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean', () => {
    return del('build');
});

gulp.task('build', gulp.series(
        'clean',
        gulp.parallel(
            'html:build',
            'js:build',
            'styles:build',
            'fonts:build',
            'image:build'
        )
    )
);
gulp.task('watch', () => {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.style, gulp.series('styles:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('serve', () => {
    browserSync.init(config);
    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
