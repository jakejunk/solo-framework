const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const merge = require("merge-stream");
const tap = require("gulp-tap");
const rename = require("gulp-rename");
const mustache = require("gulp-mustache");
const connect = require("gulp-connect");
const replace = require("gulp-replace");
const path = require("path");
const crypto = require("crypto");
const filter = require("gulp-filter");
const package = require("./package.json");

const frameworkProj = ts.createProject("src/tsconfig.json");
const integrationProj = ts.createProject("tests/integration/tsconfig.json");

gulp.task("build-framework", BuildFramework);
gulp.task("build-integration-tests", gulp.series(BuildTests, BuildTestHtmlFiles, CopyAssets));
gulp.task("serve-integration-tests", ServeTests);

function BuildFramework()
{
    const buildInfoFilter = filter("**/buildInfo.ts", {restore: true});

    const compiled = frameworkProj.src()
        .pipe(buildInfoFilter)
        .pipe(replace("_INJECT_BUILD_VERSION_HERE_", `v${package.version}`))
        .pipe(buildInfoFilter.restore)
        .pipe(sourcemaps.init())
        .pipe(frameworkProj());

    const jsFiles = compiled.js
        .pipe(replace(/(import .* from\s+['"])(.*)(?=['"])/g, "$1$2.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/solo"));

    const defFiles = compiled.dts
        .pipe(gulp.dest("build/solo"));

    return merge(jsFiles, defFiles);
}

/**
 * @type Vinyl
 */
const files = [];

function BuildTests()
{
    return integrationProj.src()
        .pipe(sourcemaps.init())
        .pipe(integrationProj()).js
        .pipe(replace(/(import .* from\s+['"])(.*)(?=['"])/g, "$1$2.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/tests"))
        .pipe(tap(function(file) {
            files.push(file);
        }));
}

function BuildTestHtmlFiles()
{
    const integrationTests = [];
    const htmlFiles = [];
    const buildDirAbsolute = path.join(process.cwd(), "build");

    for (const file of files)
    {
        // E.g. given someTest.js ...
        // testName      = someTest
        // testJsFile    = someTest.js
        // embedFileName = someTest.embed.html
        // testFileName  = someTest.html

        const testName = file.stem;
        const testJsFile = file.basename;
        const embedFileName = `${testName}.embed.html`;
        const testFileName = `${testName}.html`;

        const relativeToBuildDir = path.relative(buildDirAbsolute, file.dirname);
        const testFileUri = path.join("/", relativeToBuildDir, testFileName);

        // Add query string with hash for caching/":visited" reasons
        const fileHash = crypto
            .createHash("md5")
            .update(file.sourceMap.sourcesContent[0])
            .digest("hex");

        integrationTests.push({
            testName: file.stem,
            testLink: `${testFileUri}?v=${fileHash}`
        });

        // Create a copy of the embed template for every integration test
        const embedFile = gulp.src("assets/htmlTemplates/embedTemplate.html")
            .pipe(rename(embedFileName))
            .pipe(mustache({
                testFile: testJsFile
            }))
            .pipe(gulp.dest(file.dirname));

        // Create a an associated test file to host the "embeds"
        const testFile = gulp.src("assets/htmlTemplates/testTemplate.html")
            .pipe(rename(testFileName))
            .pipe(mustache({
                testName: testName,
                embedFileName: embedFileName
            }))
            .pipe(gulp.dest(file.dirname));
        
        htmlFiles.push(merge(embedFile, testFile));
    }

    const indexFile = gulp.src("assets/htmlTemplates/index.html")
        .pipe(mustache({
            integrationTests: integrationTests
        }))
        .pipe(gulp.dest("build"));

    return merge(htmlFiles, indexFile);
}

function CopyAssets()
{
    return gulp.src(["assets/**/*", "!assets/{htmlTemplates,htmlTemplates/**}"])
        .pipe(gulp.dest("build/_assets"));
}

function ServeTests()
{
    connect.server({
        host: "0.0.0.0",
        port: 8000,
        root: "build"
    });
}