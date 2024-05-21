import gulp from "gulp";
const { src, dest, series, parallel } = gulp;

import imagemin from "gulp-imagemin";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import clean from "gulp-clean";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import bsc from "browser-sync";
const browserSync = bsc.create();
const sassCompiler = gulpSass(sass);

const jsTaskHandler = () => {
  return src("./src/js/*.js").pipe(dest("./dist/js"));
};

const htmlTaskHandler = () => {
  return src("./src/html/*.html").pipe(dest("./dist"));
};

const cssTaskHandler = () => {
  return src("./src/scss/**/*.scss") // Взять все SCSS файлы из каталога src/scss и его подкаталогов
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
};

const imagesTaskHandler = () => {
  return src("./src/images/**/*.*")
    .pipe(imagemin())
    .pipe(dest("./dist/images"));
};

const cleanDistTaskHandler = () => {
  return src("./dist", { allowEmpty: true, read: false }).pipe(clean());
};

const faviconTaskHandler = () => {
  return src("./src/favicon/**/*").pipe(dest("./dist/favicon"));
};

const fontTaskHandler = () => {
  return src("./src/fonts/**/*").pipe(dest("./dist/fonts"));
};

function watcher() {
  gulp
    .watch("./src/html/*.html", htmlTaskHandler)
    .on("all", browserSync.reload);
  gulp
    .watch("./src/scss/**/*.{scss, sass, css}", cssTaskHandler)
    .on("all", browserSync.reload);
  gulp
    .watch("./src/scripts/**/*.js", jsTaskHandler)
    .on("all", browserSync.reload);
  gulp
    .watch("./src/images/**/*.*", imagesTaskHandler)
    .on("all", browserSync.reload);
  gulp.watch("./src/fonts/**/*", fontTaskHandler).on("all", browserSync.reload);
}

export const font = fontTaskHandler;
export const favicon = faviconTaskHandler;
export const js = jsTaskHandler;
export const cleaning = cleanDistTaskHandler;
export const html = htmlTaskHandler;
export const css = cssTaskHandler;
export const images = imagesTaskHandler;

export const build = series(
  cleanDistTaskHandler,
  parallel(
    htmlTaskHandler,
    cssTaskHandler,
    imagesTaskHandler,
    faviconTaskHandler,
    fontTaskHandler
  )
);

export const dev = series(
  build,
  parallel(browserSyncTaskHandler, watcher, jsTaskHandler)
);

function browserSyncTaskHandler() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}
