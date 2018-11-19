import { parseCommandLineOptions } from './command-line-options/parse-command-line-options';
import { defaultConfig } from './config/default-config';
import { parseConfig } from './config/parse-config';
import { log } from './console-output/logger';
import { FileFinder } from './file-system/file-finder';
import { FileProcessor } from './file-system/file-processor';
import { Linter } from './linter/linter';

try {
    const argv = parseCommandLineOptions();
    const fileFinder = new FileFinder(argv.directories, argv.ignore);
    const filesToProcess = fileFinder.getFiles();
    const total = filesToProcess.length;

    log.info(`Found ${total} files to process...`);

    const config = argv.config ? parseConfig(argv.config) : defaultConfig;
    const fileProcessor = new FileProcessor(new Linter(config));

    filesToProcess.forEach((file, index) => {
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
