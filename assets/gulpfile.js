'use strict';
let gulp			= require('gulp'),
    sass			= require('gulp-sass'),
    plumber			= require('gulp-plumber'),
    sourcemaps		= require('gulp-sourcemaps'),
    uglify			= require('gulp-uglify-es').default,
    cleancss		= require('gulp-clean-css'),
    autoprefixer	= require('gulp-autoprefixer'),
    named			= require('vinyl-named-with-path'),
    webpack         = require('webpack'),
    webpackStream	= require('webpack-stream');

// Set the browser that you want to support
const SUPPORTED_BROWSERS = [
    ">= 0.35%",
    "not dead",
    "iOS >= 11",
    "Firefox >= 60",
    "Safari >= 11",
    "Android >= 4.4",
    "Opera >= 50"
];

gulp.task('build-js', gulp.series(function() {
    return gulp.src('js/**/*.js')
    .pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(named())
    .pipe(webpackStream({
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                ["@babel/plugin-proposal-class-properties"],
                                ["@babel/plugin-syntax-class-properties"],
                                ["@babel/plugin-transform-regenerator"],
                                ["@babel/plugin-proposal-object-rest-spread"]
                            ],
                            presets: [
                                ["@babel/preset-env", {
                                    useBuiltIns: "usage",
                                    targets: {
                                        browsers: SUPPORTED_BROWSERS
                                    }
                                }],
                                ["@babel/react", {
                                    useBuiltIns: "usage",
                                    targets: {
                                        browsers: SUPPORTED_BROWSERS
                                    }
                                }]
                            ]
                        }
                    }
                }
            ]
        }
    }))
    .pipe(sourcemaps.init({largeFile: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('../../public/maps'))
    .pipe(gulp.dest('../public/js'));
}));

gulp.task('build-css', gulp.series(function() {
    return gulp.src('scss/**/*.scss')
    .pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(named())
    .pipe(sourcemaps.init({largeFile: true}))  // Process the original sources
    .pipe(sass())
    .pipe(autoprefixer({browsers: SUPPORTED_BROWSERS}))
    .pipe(cleancss({log:false}))
    .pipe(sourcemaps.write('../../public/maps')) // Add the map to modified source.
    .pipe(gulp.dest('../public/css'));
}));

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', gulp.series(function() {
    gulp.watch('js/**/*.js', gulp.parallel(['build-js']));
    gulp.watch('scss/**/*.scss', gulp.parallel(['build-css']));
}));

// define the default task and add the watch task to it
gulp.task('default', gulp.series(['watch']));

