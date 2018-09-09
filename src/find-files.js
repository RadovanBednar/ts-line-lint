const path = require('path');
const fs = require('fs');
const log = require('./logger');

function findFiles(dirs, pattern) {
    return [].concat(...dirs.map((dir) => {
        return findRecursively(dir, pattern);
    }));
}

function findRecursively(dir, pattern) {
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
                found.push(...findRecursively(filename, pattern));
            }
            else if (pattern.test(filename)) {
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

module.exports = findFiles;
