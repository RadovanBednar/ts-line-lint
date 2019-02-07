import { log } from '../console-output/logger';
import { hasDuplicates } from '../utils/array-utils';

type ValidFlag = '--ignore' | '--config';

export class CommandLineOptionsParser {
    private args: Array<string>;
    private flags: Array<string>;

    constructor() {
        this.args = process.argv.slice(2);
        this.flags = this.args.filter((value) => this.isFlag(value));
        this.assertFlagsUnique();
    }

    public getDirectories(): Array<string> {
        const dirArgs = this.args.slice(0, this.firstFlagIndex());

        if (dirArgs.length) {
            this.assertOnlyRelativePathsToSubdirectoriesSpecified(dirArgs);
            return dirArgs;
        }

        log.warning('No directory specified, using "." as fallback.');
        return ['.'];
    }

    public getIgnoredFiles(): Array<string> {
        const flag = '--ignore';

        if (!this.isFlagPresent(flag)) {
            return [];
        }

        this.assertFlagHasArgs(flag);
        return this.getFlagArgs(flag);
    }

    public getConfigPath(): string | undefined {
        const flag = '--config';

        if (!this.isFlagPresent(flag)) {
            return undefined;
        }

        this.assertFlagHasArgs(flag);
        this.assertFlagHasExactlyArgs(flag, 1);

        return this.getFlagArgs(flag)[0];
    }

    private isFlag(arg: string): boolean {
        return arg.indexOf('--') === 0;
    }

    private firstFlagIndex(): number | undefined {
        return this.flags.length ? this.args.indexOf(this.flags[0]) : undefined;
    }

    private isFlagPresent(flag: ValidFlag): boolean {
        return this.flags.includes(flag);
    }

    private getFlagArgs(flag: ValidFlag): Array<string> {
        const flagArgs = this.args.slice(this.args.indexOf(flag) + 1);

        if (flagArgs.some(this.isFlag)) {
            return flagArgs.slice(0, flagArgs.findIndex(this.isFlag));
        }
        return flagArgs;
    }

    private assertFlagsUnique(): void {
        if (hasDuplicates(this.flags)) {
            throw Error('Error while parsing command line options: no duplicate flags allowed');
        }
    }

    private assertOnlyRelativePathsToSubdirectoriesSpecified(dirs: Array<string>): void {
        dirs.forEach((dir) => {
            if (dir.startsWith('..') || dir.startsWith('/')) {
                throw Error(`Invalid directory "${dir}". Only relative paths to project subdirectories are allowed.`);
            }
        });
    }

    private assertFlagHasArgs(flag: ValidFlag): void {
        if (this.getFlagArgs(flag).length === 0) {
            throw Error(`Missing arguments for "${flag}".`);
        }
    }

    private assertFlagHasExactlyArgs(flag: ValidFlag, n: number): void {
        const argCount = this.getFlagArgs(flag).length;
        if (argCount !== n) {
            throw Error(`Wrong number of arguments for "${flag}": expected ${n}, got ${argCount}.`);
        }
    }

}
