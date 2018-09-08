#!/usr/bin/env node
const listDirectories = require('./src/list-directories');
const findFiles = require('./src/find-files');
const processFile = require('./src/process-file');
const log = require('./src/log-utils');

let dirs = process.argv.slice(2);
let tsFiles = [];

try {
    tsFiles = findFiles(dirs, /\.ts$/);
} catch (e) {
    log.error(e.message);
    process.exit(2);
}

const total = tsFiles.length;
let modified = 0;

log.info(`Found ${total} files to process...`);

tsFiles.forEach((file, index) => {
    log.rewriteLastLine(`Processing file ${index + 1} of ${total}...`);
    if (processFile(file)) {
        modified++;
    }
});

log.newline(2);
log.info(`Line-linting complete, ${modified} of ${total} files were modified.`);
process.exit(0);