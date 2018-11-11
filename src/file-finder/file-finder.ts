import * as fs from 'fs';
import * as path from 'path';
import { log } from '../logger';

export class FileFinder {
    private static readonly pattern = /\.ts$/;
    private static readonly hiddenDirectoryPattern = /(^|\/)\.[^\/.]+\/?$/;
    private static ignorePatterns: Array<string> | undefined;

    public static find(dirs: Array<string>, ignorePatterns?: Array<string>): Array<string> {
        FileFinder.ignorePatterns = ignorePatterns;
        const files: Array<string> = [];

        for (const dir of dirs) {
            FileFinder.assertDirectoryExists(dir);

            if (FileFinder.isSkipped(dir)) {
                FileFinder.logWarning(dir);
            } else {
                for (const file of fs.readdirSync(dir)) {
                    const fileName = path.join(dir, file);

                    if (fs.lstatSync(fileName).isDirectory()) {
                        files.push(...FileFinder.find([fileName], ignorePatterns));
                    } else if (FileFinder.pattern.test(fileName) && !FileFinder.isIgnored(fileName)) {
                        files.push(fileName);
                    }
                }
            }

        }

        return files;
    }

    private static assertDirectoryExists(dir: string): void {
        if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
            throw Error(`Couldn't find directory "${dir}".`);
        }
    }

    private static isHiddenDirectory(dir: string): boolean {
        return FileFinder.hiddenDirectoryPattern.test(dir);
    }

    private static isSkipped(dir: string): boolean {
        return dir === 'node_modules' || FileFinder.isHiddenDirectory(dir);
    }

    private static logWarning(dir: string): void {
        if (dir === 'node_modules') {
            log.warning('Skipping excluded directory "node_modules".');
        } else {
            log.warning(`Skipping hidden directory "${dir}".`);
        }
    }

    private static isIgnored(fileName: string): boolean {
        return FileFinder.ignorePatterns
            ? FileFinder.ignorePatterns.some((pattern) => fileName.indexOf(pattern) === 0)
            : false;
    }

}
