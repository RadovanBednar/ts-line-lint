#!/usr/bin/env node
import { CommandLineOptionsParser } from './command-line-options/command-line-options-parser';
import { ConfigFileParser } from './config/config-file-parser';
import { log } from './console-output/logger';
import { FileFinder } from './file-system/file-finder';
import { FileProcessor } from './file-system/file-processor';
import { Linter } from './linter/linter';

try {
    const optionsParser = new CommandLineOptionsParser();
    const config = new ConfigFileParser(optionsParser.getConfigPath()).getConfig();

    const fileFinder = new FileFinder(optionsParser.getDirectories(), optionsParser.getIgnoredFiles());
    const filesToProcess = fileFinder.getFiles();
    const total = filesToProcess.length;

    log.info(total ? `Found ${total} files to process...` : 'There are no files to process.');

    const fileProcessor = new FileProcessor(new Linter(config));

    filesToProcess.forEach((file, index) => {
        log.rewriteLastLine(`Processing file "${file}" (${index + 1} of ${total})...`);
        fileProcessor.process(file);
    });

    log.rewriteLastLine('')
        .newline()
        .info(`Line-linting complete, ${fileProcessor.getModified()} of ${total} files were modified.`);
} catch (e) {
    log.error(e.message)
        .newline()
        .usage();
    process.exit(1);
}

process.exit(0);
