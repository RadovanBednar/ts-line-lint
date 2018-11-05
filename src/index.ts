import { defaultConfig } from './config/default-config';
import { parseConfig } from './config/parse-config';
import { FileProcessor } from './file-processor/file-processor';
import { findFiles } from './find-files';
import { Linter } from './linter/linter';
import { log } from './logger';
import { parseProcessArgv } from './parse-process-argv';

try {
    const argv = parseProcessArgv();
    const tsFileList = findFiles(argv.directories, argv.ignore);
    const total = tsFileList.length;

    log.info(`Found ${total} files to process...`);

    const config = argv.config ? parseConfig(argv.config) : defaultConfig;
    const fileProcessor = new FileProcessor(new Linter(config));

    tsFileList.forEach((file, index) => {
        log.rewriteLastLine(`Processing file "${file}" (${index + 1} of ${total})...`);
        fileProcessor.process(file);
    });

    log.newline(total ? 2 : 1);
    log.info(`Line-linting complete, ${fileProcessor.getModified()} of ${total} files were modified.`);
} catch (e) {
    log.error(e.message).usage();
    process.exit(1);
}

process.exit(0);
