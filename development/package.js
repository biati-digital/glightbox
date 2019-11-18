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
 * then npm update
 */

async function createFolder() {
    const tmpfolder = path.join(os.tmpdir(), 'glightbox-master');

    await updateIndexVersion(args[0]);
    await updatePackageVersion(args[0]);

    jetpack.copy(folder, tmpfolder, {
        matching: ['!node_modules', '!node_modules/**/*', '!.git', '!.git/**/*', '!.github', '!.github/**/*', '!.vscode', '!.vscode/**/*', '!*.psd', '!.DS_Store']
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


async function updateIndexVersion(version) {
    return new Promise((resolve, reject) => {
        const file = path.join(folder, 'index.html');

        jetpack.readAsync(file).then((str) => {
            let regexp = /download\/(.*)\/glightbox/g;

            while ((matches = regexp.exec(str)) !== null) {
                let foundLine = matches[0];
                let newLine = foundLine.replace(matches[1], version)
                str = str.replace(foundLine, newLine);
            }

            jetpack.writeAsync(file, str, ).then(() => {
                notify('Updated index version', `Updated index version`);
                resolve(file);
            });
        });
    })
}


async function updatePackageVersion(version) {
    return new Promise((resolve, reject) => {
        const file = path.join(folder, 'package.json');

        jetpack.readAsync(file).then((str) => {
            let regexp = /"version":\s?"(.*)",/g;

            while ((matches = regexp.exec(str)) !== null) {
                let foundLine = matches[0];
                let newLine = foundLine.replace(matches[1], version)
                str = str.replace(foundLine, newLine);
            }

            jetpack.writeAsync(file, str, ).then(() => {
                notify('Updated package version', `Updated package version`);
                resolve(file);
            });
        });
    })
}
