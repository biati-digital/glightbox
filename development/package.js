const fs = require('fs');
const os = require('os');
const jetpack = require('fs-jetpack');
const path = require('path');
const archiver = require('archiver');
const args = process.argv.slice(2);
const notify = require('./notifications');
const folder = path.join(__dirname, '/..');

/**
 * Realease new version
 * calling
 * node development/package.js versionhere
 * then npm publish
 */

async function createFolder() {
    jetpack.remove(path.join(folder, 'glightbox-master.zip'));

    const tmpfolder = path.join(os.tmpdir(), 'glightbox-master');
    const newVersion = args[0];

    await updateFileVersion({
        file: path.join(folder, 'index.html'),
        search: /download\/(.*)\/glightbox/g,
        replace: newVersion
    });

    await updateFileVersion({
        file: path.join(folder, 'package.json'),
        search: /"version":\s?"(.*)",/g,
        replace: newVersion
    });

    await updateFileVersion({
        file: path.join(folder, 'README.md'),
        search: /v([0-9-.]+)/g,
        replace: newVersion
    });

    await updateFileVersion({
        file: path.join(folder, 'src/js/glightbox.js'),
        search: /version\s?=\s?'(.*)';/g,
        replace: newVersion
    });

    jetpack.copy(folder, tmpfolder, {
        matching: [
            '!node_modules',
            '!node_modules/**/*',
            '!.git',
            '!.git/**/*',
            '!.github',
            '!.github/**/*',
            '!.vscode',
            '!icons.zip',
            '!.vscode/**/*',
            '!*.psd',
            '!.DS_Store'
        ]
    });
    notify('Created folder', `Created folder correctly`);

    const zip = await createZip(tmpfolder).catch(error => {
        jetpack.remove(tmpfolder);
    });

    const folderName = path.basename(folder);
    jetpack.remove(tmpfolder);
    jetpack.move(zip, path.join(folder, folderName +'-master.zip'));

    notify('Done', `Packaging process ended correctly`);
}
createFolder();



async function createZip(folder) {
    return new Promise((resolve, reject) => {
        const name = folder + '.zip';
        const output = fs.createWriteStream(name);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            notify('Zipped', `zip archive was created correctly`);
            resolve(name);
        });
        archive.on('error', (err) => {
            notify('Package Error', `The was an error creating the zip.`)
            reject(err);
        });

        archive.pipe(output);
        archive.directory(folder, false);
        archive.finalize();
    })
}


async function updateFileVersion(data) {
    return new Promise((resolve, reject) => {
        jetpack.readAsync(data.file).then((str) => {
            let regexp = new RegExp(data.search);

            while ((matches = regexp.exec(str)) !== null) {
                let foundLine = matches[0];
                let newLine = foundLine.replace(matches[1], data.replace)
                str = str.replace(foundLine, newLine);
            }

            jetpack.writeAsync(data.file, str).then(() => {
                resolve(data.file);
            });
        });
    })
}
