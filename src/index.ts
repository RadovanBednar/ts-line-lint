import { findFiles } from './find-files';
import { processFile } from './process-file';
import { parseProcessArgv } from './parse-process-argv';
import { log } from './logger';

try {
    const argv = parseProcessArgv();
    const tsFileList = findFiles(argv.directories, argv.ignore);
    const total = tsFileList.length;
    let modified = 0;

    log.info(`Found ${total} files to process...`);

    tsFileList.forEach((file, index) => {
        log.rewriteLastLine(`Processing file "${file}" (${index + 1} of ${total})...`);
        if (processFile(file)) {
            modified++;
        }
    });

    log.newline(total ? 2 : 1).info(`Line-linting complete, ${modified} of ${total} files were modified.`);
} catch (e) {
    log.error(e.message).usage();
    process.exit(1);
}

process.exit(0);
