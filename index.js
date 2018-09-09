#!/usr/bin/env node
const findFiles = require('./src/find-files');
const processFile = require('./src/process-file');
const argvParser = require('./src/argv-parser');
const log = require('./src/logger');

let dirList, tsFileList;

try {
    dirList = argvParser.getDirectories();
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
