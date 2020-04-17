const gulp = require('gulp');
const spriteImg = require('gulp.spritesmith');
const plumber = require('gulp-plumber');
const base64 = require('gulp-base64');
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const merge = require('merge-stream');

//雪碧图
const spriteSrc = "./miniprogram/asset/images/icon/*.png";
gulp.task("sprite",()=> {
    const spriteData  = gulp.src(spriteSrc)
        .pipe(plumber())
        .pipe(spriteImg({
            imgPath: '../icon-sprites.png',
            imgName: "icon-sprites.png",
            cssName: "./icon.scss",
            padding: 8,
            algorithm:"binary-tree",//"binary-tree",//"left-right", //"alt-diagonal",//top-down
            cssTemplate: './miniprogram/asset/sprite/cssTemplateTouch.handlebars'
        }));
    const img = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest("./miniprogram/asset/images"));
    const css = spriteData.css
        .pipe(sass())
        .pipe(rename((path)=>{
            path.basename = '_icon';
            path.extname = '.wxss'
        }))
        .pipe(gulp.dest('./miniprogram/asset/images/sprite'))
    return merge(img, css);
});
// 生成base64
gulp.task("base64", ()=> {
    return gulp.src('./miniprogram/asset/images/sprite/_icon.wxss')
        .pipe(base64({
            // extensions:['png'],
            debug: true,
            maxImageSize:100*1024
        }))
        .pipe(gulp.dest('./miniprogram/asset/images/sprite'));
})

gulp.task('sprite64', gulp.series("sprite", "base64"));

gulp.task('watch', done => {
    gulp.watch(spriteSrc, gulp.series("sprite64"));
});
gulp.task("default", gulp.series("sprite64"));


