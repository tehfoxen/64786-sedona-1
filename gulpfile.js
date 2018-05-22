"use strict";

var gulp = require("gulp");
var webp = require("gulp-webp");
var imagemin= require("gulp-imagemin");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var run = require("run-sequence");

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
	.pipe(minify())
	.pipe(rename("style.min.css"))
	.pipe(gulp.dest("source/css"))
	
    .pipe(server.stream())
});
gulp.task("images", function (){
	return gulp.src("source/img/**/*.{png, jpg, svg}")
	.pipe(imagemin([
	imagemin.optipng({optimizationLevel : 3}),
	imagemin.jpegtran({progressive: true}),
	imagemin.svgo()
	]))
	.pipe(gulp.dest("source/img"))
});

/*gulp.task("sprite", function(){
	return gulp.src(source/img/icon-*.svg)
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("sprite.svg"))
	.pipe(gulp.dest("source/img"));
});*/

gulp.task("webp", function(){
	return gulp.src("source/img/**/*.{png, jpg}")
	.pipe(gulp.dest("source/img"));
});
gulp.task("serve", ["style"], function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
gulp.task("copy", function(){
	return gulp.src([
	"source/fonts/**/*.{woff, woff2}",
	"source/img/**",
	"source/js/**"
	], {
		base: "source"
	})
	.pipe(gulp.dest("build"));
	
});
  gulp.watch("source/less/**/*.less", ["style"]);
  gulp.watch("source/*.html").on("change", server.reload);
});
