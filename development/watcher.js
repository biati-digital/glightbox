const fs = require('node:fs');
const chokidar = require('chokidar');
const path = require('node:path');
const jscompiler = require('./jscompiler');
const postcssCompiler = require('./postcss');
const terser = require('terser');

let config = {
    js: {
        src: 'src/js',
        dest: 'dist/js',
    },
    css: {
        src: 'src/postcss',
        dest: 'dist/css',
    }
};

/**
 * Handle Javascript files
 * compile the javascript files
 * to es2015, minify and sync the files
 *
 * @param {string} file path
 */
async function handleJavascript(file) {
    file = path.join(config.js.src, 'glightbox.js');

    const name = path.basename(file);

    const res = await jscompiler({
        file,
        dest: config.js.dest,
        format: 'umd',
        sourcemap: false,
        moduleID: 'GLightbox'
    }).catch(error => console.log(error));

    if (!res) {
        console.log('Build Error', `View logs for more info`);
        console.log(res)
        return false;
    }

    const minName = name.replace('.js', '.min.js');
    const processed = path.join(config.js.dest, name);
    const code = fs.readFileSync(processed, 'utf8');
    const minified = terser.minify(code);
    const minifyPath = path.join(config.js.dest, minName);
    fs.writeFileSync(minifyPath, minified.code);

    console.log('Javascript Build', `Compiled and Minified ${name}`);
}


/**
 * Handle Postcss files
 * compile the css files
 *
 * @param {string} file path
 */
async function handlePostCSS(file) {
    const name = path.basename(file);
    const dest = config.css.dest;

    let res = await postcssCompiler({
        file,
        dest,
        minify: true
    }).catch(error => console.log(error));
    if (!res) {
        return false;
    }
    console.log('PostCSS Build', `Compiled and Minified ${name}`);
}



/**
 * Watcher
 * what the files for the backedn
 * this includes js and css files
 */
function filesWatcher() {
    const watcher = chokidar.watch(['src'], {
        ignored: ['.DS_Store', 'src/js/.jshintrc', 'src/js/.babelrc'],
        persistent: true,
        depth: 3,
        awaitWriteFinish: {
            stabilityThreshold: 500,
            pollInterval: 500
        },
    });

    watcher.on('change', path => {
        if (path.endsWith('.js')) {
           return handleJavascript(path);
        }
        if (path.endsWith('.css')) {
            return handlePostCSS(path);
        }
    })
    watcher.on('ready', () => console.log('Watching files', 'Initial scan complete. Ready for changes'))
}
filesWatcher();
