import * as fs from 'fs';
import * as path from 'path';
import { log } from './logger';

export function findFiles(dirs: Array<string>, ignore?: Array<string>): Array<string> {
    return dirs
        .map((dir) => findRecursively(dir, ignore))
        .reduce((allFiles, filesInDir) => allFiles.concat(filesInDir));
}

function findRecursively(dir: string, ignore?: Array<string>): Array<string> {
    const pattern = /\.ts$/;
    const nodeModulesPattern = /(^|\/)node_modules\/?$/;
    const hiddenDirectoryPattern = /(^|\/)\.[^\/.]+\/?$/;
    const found: Array<string> = [];

    assertDirectoryExists(dir);

    if (nodeModulesPattern.test(dir)) {
        log.warning('Skipping excluded directory "node_modules".');
    } else if (hiddenDirectoryPattern.test(dir)) {
        log.warning(`Skipping hidden directory "${dir}".`);
    } else {
        for (const file of fs.readdirSync(dir)) {
            const filename = path.join(dir, file);

            if (fs.lstatSync(filename).isDirectory()) {
                found.push(...findRecursively(filename, ignore));
            } else if (pattern.test(filename) && !isIgnored(filename, ignore)) {
                found.push(filename);
            }
        }
    }

    return found;
}

function assertDirectoryExists(dirname: string): void {
    if (!fs.existsSync(dirname)) {
        throw Error(`Couldn't find directory "${dirname}".`);
    }
}

function isIgnored(filename: string, ignorePatterns?: Array<string>): boolean {
    return ignorePatterns
        ? ignorePatterns.some((pattern) => filename.indexOf(pattern) === 0)
        : false;
}
