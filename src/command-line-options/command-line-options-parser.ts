import { log } from '../console-output/logger';

export class CommandLineOptionsParser {
    private static ignoreFlag = '--ignore';
    private static configFlag = '--config';

    private readonly args: Array<string>;

    constructor() {
        this.args = process.argv.slice(2);
    }

    public getDirectories(): Array<string> {
        const dirs = this.args.some(this.isArgFlag) ? this.args.slice(0, this.args.findIndex(this.isArgFlag)) : this.args;

        if (dirs.length) {
            this.assertOnlyRelativePathsToSubdirectoriesSpecified(dirs);
            return dirs;
        } else {
            log.warning('No directory specified, using "." as fallback.');
            return ['.'];
        }
    }

    public getIgnoredFiles(): Array<string> {
        const flag = CommandLineOptionsParser.ignoreFlag;

        if (this.isFlagPresent(flag)) {
            this.assertFlagHasArgs(flag);
            return this.getFlagArgs(flag);
        }

        return [];
    }

    public getConfigPath(): string | undefined {
        const flag = CommandLineOptionsParser.configFlag;

        if (this.isFlagPresent(flag)) {
            this.assertFlagHasArgs(flag);
            this.assertFlagHasExactlyArgs(flag, 1);

            return this.args[this.args.indexOf(flag) + 1];
        }
    }

    private isArgFlag(arg: string): boolean {
        return arg.indexOf('--') === 0;
    }

    private isFlagPresent(flag: string): boolean {
        return this.args.indexOf(flag) !== -1;
    }

    private getFlagArgs(flag: string): Array<string> {
        const flagArgs = this.args.slice(this.args.indexOf(flag) + 1);

        if (flagArgs.some(this.isArgFlag)) {
            return flagArgs.slice(0, flagArgs.findIndex(this.isArgFlag));
        }
        return flagArgs;
    }

    private assertOnlyRelativePathsToSubdirectoriesSpecified(dirs: Array<string>): void {
        dirs.forEach((dir) => {
            if (dir.startsWith('..') || dir.startsWith('/')) {
                throw Error(`Invalid directory "${dir}". Only relative paths to project subdirectories are allowed.`);
            }
        });
    }

    private assertFlagHasArgs(flag: string): void {
        const nextArg = this.args[this.args.indexOf(flag) + 1];
        if (!nextArg || this.isArgFlag(nextArg)) {
            throw Error(`Missing arguments for "${flag}".`);
        }
    }

    private assertFlagHasExactlyArgs(flag: string, n: number): void {
        const argCount = this.getFlagArgs(flag).length;
        if (argCount !== n) {
            throw Error(`Wrong number of arguments for "${flag}": expected 1, got ${argCount}.`);
        }
    }

}
