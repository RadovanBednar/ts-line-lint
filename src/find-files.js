const path = require('path');
const fs = require('fs');
const log = require('./logger');

function findFiles(dirs, ignore) {
    ignore = Array.isArray(ignore) ? ignore : [];
    return [].concat(...dirs.map((dir) => {
        return findRecursively(dir, ignore);
    }));
}

function findRecursively(dir, ignore) {
    const pattern = /\.ts$/;
    const nodeModulesPattern = /(^|\/)node_modules\/?$/;
    const hiddenDirectoryPattern = /(^|\/)\.[^\/.]+\/?$/;
    let found = [];

    assertDirectoryExists(dir);

    if (nodeModulesPattern.test(dir)) {
        log.warn('Skipping excluded directory "node_modules".');
    } else if (hiddenDirectoryPattern.test(dir)) {
        log.warn(`Skipping hidden directory "${dir}".`);
    } else {
        for (const file of fs.readdirSync(dir)) {
            let filename = path.join(dir, file);

            if (fs.lstatSync(filename).isDirectory()) {
                found.push(...findRecursively(filename, ignore));
            }
            else if (pattern.test(filename) && !isIgnored(filename, ignore)) {
                found.push(filename);
            }
        }
    }

    return found;
}

function assertDirectoryExists(dirname) {
    if (!fs.existsSync(dirname)) {
        throw Error(`Couldn't find directory "${dirname}".`)
    }
}

function isIgnored(filename, ignorePatterns) {
    return ignorePatterns.some((pattern) => filename.indexOf(pattern) === 0);
}

module.exports = findFiles;
