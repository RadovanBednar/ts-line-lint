const path = require('path');
const fs = require('fs');
const log = require('./log-utils');

function findFiles(dirs, pattern) {
    return arrayify(dirs).reduce((files, dir) => {
        return files.concat(findRecursively(dir, pattern))
    }, []);
}

function findRecursively(dir, filter) {
    let found = [];

    assertDirectoryExists(dir);

    let files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {
        let filename = path.join(dir, files[i]);

        if (fs.lstatSync(filename).isDirectory()) {
            if (filename === 'node_modules') {
                log.warn('Skipping directory "node_modules".');
            } else {
                found = found.concat(findRecursively(filename, filter));
            }
        }
        else if (filter.test(filename)) {
            found.push(filename);
        }
    }

    return found;
}

function arrayify(value) {
    return [].concat(value || []);
}

function assertDirectoryExists(dirname) {
    if (!fs.existsSync(dirname)) {
        throw Error(`Couldn't find directory "${dirname}"!`)
    }
}

module.exports = findFiles;
