import * as fs from 'fs';
import * as path from 'path';
import { log } from '../logger';

export class FileFinder {
    private static readonly pattern = /\.ts$/;
    private static readonly hiddenDirectoryPattern = /(^|\/)\.[^\/.]+\/?$/;

    public static find(dirs: Array<string>, ignore?: Array<string>): Array<string> {
        const files: Array<string> = [];

        dirs.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                throw Error(`Couldn't find directory "${dir}".`);
            }
            if (!fs.lstatSync(dir).isDirectory()) {
                throw Error(`File "${dir}" is not a directory.`);
            }
            if (dir === 'node_modules') {
                log.warning('Skipping excluded directory "node_modules".');
                return;
            }
            if (FileFinder.hiddenDirectoryPattern.test(dir)) {
                log.warning(`Skipping hidden directory "${dir}".`);
                return;
            }

            for (const file of fs.readdirSync(dir)) {
                const filename = path.join(dir, file);

                if (fs.lstatSync(filename).isDirectory()) {
                    files.push(...FileFinder.find([filename], ignore));
                }
                if (FileFinder.pattern.test(filename) && !fs.lstatSync(filename).isDirectory()) {
                    files.push(filename);
                }
            }
        });

        return files;
    }

}
