import * as fs from 'fs';
import * as path from 'path';
import { log } from '../console-output/logger';

export class FileFinder {
    private readonly pattern = /\.ts$/;
    private readonly hiddenDirectoryPattern = /(^|\/)\.[^\/.]+\/?$/;
    private readonly files: Array<string> = [];

    constructor(dirs: Array<string>, private ignorePatterns?: Array<string>) {
        this.searchRecursively(dirs);
    }

    public getFiles(): Array<string> {
        return this.files;
    }

    private searchRecursively(dirs: Array<string>): void {
        for (const dir of dirs) {
            this.assertDirectoryExists(dir);

            if (this.isSkipped(dir)) {
                this.logWarning(dir);
            } else {
                for (const file of fs.readdirSync(dir)) {
                    const fileName = path.join(dir, file);

                    if (fs.lstatSync(fileName).isDirectory()) {
                        this.searchRecursively([fileName]);
                    } else if (this.pattern.test(fileName) && !this.isIgnored(fileName)) {
                        this.files.push(fileName);
                    }
                }
            }

        }
    }

    private assertDirectoryExists(dir: string): void {
        if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
            throw Error(`Couldn't find directory "${dir}".`);
        }
    }

    private isHiddenDirectory(dir: string): boolean {
        return this.hiddenDirectoryPattern.test(dir);
    }

    private isSkipped(dir: string): boolean {
        return dir === 'node_modules' || this.isHiddenDirectory(dir);
    }

    private logWarning(dir: string): void {
        if (dir === 'node_modules') {
            log.warning('Skipping excluded directory "node_modules".');
        } else {
            log.warning(`Skipping hidden directory "${dir}".`);
        }
    }

    private isIgnored(fileName: string): boolean {
        return this.ignorePatterns
            ? this.ignorePatterns.some((pattern) => fileName.indexOf(pattern) === 0)
            : false;
    }

}
