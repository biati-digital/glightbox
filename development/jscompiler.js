const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');

global.rollupCache = global.rollupCache || {};


function camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|[-_])/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

function jscompiler(config) {
    const {
        file,
        dest
    } = config;

    const fileName = path.basename(file);
    const extension = path.extname(fileName);
    const singleFileName = fileName.replace(extension, '');
    const cache = global.rollupCache[fileName] ? global.rollupCache[fileName] : null;
    const format = (config.hasOwnProperty('format') ? config.format : 'iife');
    const strict = (config.hasOwnProperty('strict') ? config.strict : true);
    const sourcemap = (config.hasOwnProperty('sourcemap') ? config.sourcemap : false);
    const moduleID = (config.hasOwnProperty('moduleID') ? config.moduleID : false);

    let name = (config.hasOwnProperty('name') ? config.name : camelCase(singleFileName));
    let outPutFile = path.join(__dirname, '../', dest, fileName);
    let customFileName = (config.hasOwnProperty('fileName') ? config.fileName : false);

    if (customFileName) {
        customFileName = customFileName.replace('{name}', singleFileName);
        outPutFile = outPutFile.replace(fileName, customFileName);
    }

    return new Promise((res, rej) => {
        rollup({
            input: file,
            cache: cache,
            plugins: [
                resolve({
                    mainFields: ['module', 'main'],
                    browser: true,
                }),
                commonjs(),
                babel({
                    comments: false,
                    exclude: 'node_modules/**',
                    presets: [
                        ['@babel/preset-env', {
                            modules: false
                        }]
                    ]
                }),
            ]
        }).then((bundle) => {
            global.rollupCache[fileName] = bundle.cache;
            bundle.write({
                file: outPutFile,
                format: format, // amd, cjs, esm, iife, umd
                strict: strict,
                sourcemap: sourcemap,
                name: (moduleID ? moduleID : name)
            }).then(() => {
                res(true);
            }).catch(error => {
                console.error(error)
                rej(error);
            });

            return outPutFile;

        }).catch(error => {
            console.log(error)
            throw new Error(error);
        })
    })
}

module.exports = jscompiler;
