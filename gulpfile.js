const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const merge = require("merge-stream");
const tap = require("gulp-tap");
const rename = require("gulp-rename");
const mustache = require("gulp-mustache");
const connect = require("gulp-connect");

const frameworkProj = ts.createProject("src/tsconfig.json");
const integrationProj = ts.createProject("tests/integration/tsconfig.json");

gulp.task("build-framework", Build);
gulp.task("build-integration-tests", gulp.series(BuildTests, BuildTestHtmlFiles));
gulp.task("serve-integration-tests", ServeTests);

function Build()
{
    const compiled = frameworkProj.src()
        .pipe(sourcemaps.init())
        .pipe(frameworkProj());

    const jsFiles = compiled.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/solo"));

    const defFiles = compiled.dts
        .pipe(gulp.dest("build/solo"));

    return merge(jsFiles, defFiles);
}

/**
 * @type File
 */
const files = [];

function BuildTests()
{
    return integrationProj.src()
        .pipe(sourcemaps.init())
        .pipe(integrationProj()).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/tests"))
        .pipe(tap(function(file) {
            files.push(file);
        }));
}

function BuildTestHtmlFiles()
{
    const htmlFileStreams = [];

    for (const file of files)
    {
        // Create a copy of the html template for every integration test
        const stream = gulp.src("tests/integration/template.html")
            .pipe(rename(`${file.stem}.html`))
            .pipe(mustache({
                testFile: file.basename
            }))
            .pipe(gulp.dest(file.dirname));
        
        htmlFileStreams.push(stream);
    }

    return merge(htmlFileStreams);
}

function ServeTests()
{
    connect.server({
        host: "0.0.0.0",
        port: 8000,
        root: "build",
        directoryListing: true
    });
}