const postcss = require('postcss');
const cssnext = require('postcss-preset-env');
const cssnested = require('postcss-nested');
const cssmqpacker = require('css-mqpacker');
const cssprettify = require('postcss-prettify');
const cssclean = require('clean-css');
const path = require('path');
const fs = require('fs');

function postcssCompiler(config) {
    const { file, dest, minify = true } = config;
    const fileName = path.basename(file);
    const from = path.join(__dirname, '../', file);
    const to = path.join(__dirname, '../', dest, fileName);
    const fileNameMin = path.extname(fileName);
    const min = path.join(__dirname, '../', dest, fileName.replace(fileNameMin, `.min${fileNameMin}`));
    const css = fs.readFileSync(from, 'utf8');

    return new Promise((resolve, reject) => {
        return postcss([
            cssnested(),
            cssnext({
                stage: 0,
                browsers: ['last 2 version'],
                features: {
                    calc: false
                }
            }),
            cssmqpacker({
                sort: true
            }),
            cssprettify()
        ])
            .process(css, {
                from,
                to
            })
            .then((result) => {
                if (result && result.css) {
                    fs.writeFile(to, result.css, 'utf8', (err) => reject(err));

                    if (minify) {
                        const minified = new cssclean({}).minify(result.css);
                        fs.writeFile(min, minified.styles, 'utf8', (err) => reject(err));

                        if (result.map) {
                            fs.writeFile(to + '.map', result.map, 'utf8', (err) => reject(err));
                        }
                    }

                    resolve(to);
                } else {
                    reject(result);
                }
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

module.exports = postcssCompiler;
