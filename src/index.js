#!/usr/bin/env node
const findFiles = require('./find-files');
const processFile = require('./process-file');
const ArgvParser = require('./argv-parser');
const log = require('./logger');

let dirList, tsFileList;

try {
    dirList = new ArgvParser(process.argv).directories;
} catch (e) {
    log
      .error(e.message)
      .usage();
    process.exit(1);
}

try {
    tsFileList = findFiles(dirList, /\.ts$/);
} catch (e) {
    log
      .error(e.message)
      .usage();
    process.exit(2);
}

const total = tsFileList.length;
let modified = 0;

log.info(`Found ${total} files to process...`);

tsFileList.forEach((file, index) => {
    log.rewriteLastLine(`Processing file "${file}" (${index + 1} of ${total})...`);
    if (processFile(file)) {
        modified++;
    }
});

log
  .newline(total ? 2 : 1)
  .info(`Line-linting complete, ${modified} of ${total} files were modified.`);

process.exit(0);
