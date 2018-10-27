import { log } from './logger';

export interface CommandLineOptions {
    directories: Array<string>;
    ignore: Array<string>;
    config?: string;
}

export function parseProcessArgv(testArgs?: Array<string>): CommandLineOptions {
    const args = testArgs || process.argv.slice(2);

    return {
        config: getConfig(),
        directories: getDirs(),
        ignore: getIgnored(),
    };

    function getDirs(): Array<string> {
        const dirs = args.some(isArgFlag) ? args.slice(0, args.findIndex(isArgFlag)) : args;

        if (dirs.length) {
            assertOnlyRelativePathsToSubdirectoriesSpecified(dirs);
            return dirs;
        } else {
            if (process.env.NODE_ENV !== 'test') {
                log.warning('No directory specified, using "." as fallback.');
            }
            return ['.'];
        }
    }

    function assertOnlyRelativePathsToSubdirectoriesSpecified(dirs: Array<string>): void {
        dirs.forEach((dir) => {
            if (dir.startsWith('..') || dir.startsWith('/')) {
                throw Error(`Invalid directory "${dir}". Only relative paths to project subdirectories are allowed.`);
            }
        });
    }

    function getIgnored(): Array<string> {
        const flag = '--ignore';

        if (isFlagPresent(flag)) {
            assertFlagHasArgs(flag);
            return getFlagArgs(flag);
        }

        return [];
    }

    function getConfig(): string | undefined {
        const flag = '--config';

        if (isFlagPresent(flag)) {
            assertFlagHasArgs(flag);
            assertFlagHasExactlyArgs(flag, 1);

            return args[args.indexOf(flag) + 1];
        }
    }

    function isArgFlag(arg: string): boolean {
        return arg.indexOf('--') === 0;
    }

    function isFlagPresent(flag: string): boolean {
        return args.indexOf(flag) !== -1;
    }

    function assertFlagHasArgs(flag: string): void {
        const nextArg = args[args.indexOf(flag) + 1];
        if (!nextArg || isArgFlag(nextArg)) {
            throw Error(`Missing arguments for "${flag}".`);
        }
    }

    function assertFlagHasExactlyArgs(flag: string, n: number): void {
        const argCount = getFlagArgs(flag).length;
        if (argCount !== n) {
            throw Error(`Wrong number of arguments for "${flag}": expected 1, got ${argCount}.`);
        }
    }

    function getFlagArgs(flag: string): Array<string> {
        const flagArgs = args.slice(args.indexOf(flag) + 1);

        if (flagArgs.some(isArgFlag)) {
            return flagArgs.slice(0, flagArgs.findIndex(isArgFlag));
        }
        return flagArgs;
    }

}
