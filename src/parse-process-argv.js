const log = require('./logger');

module.exports = function(args) {
    const testRun = !!args;
    args = (args || process.argv).slice(2);

    function getDirs() {
        let dirs = args.some(isArgFlag) ? args.slice(0, args.findIndex(isArgFlag)) : args;

        if (dirs.length) {
            assertOnlyRelativePathsToSubdirectoriesSpecified(dirs);
            return dirs;
        } else {
            if (!testRun) {
                log.warn('No directory specified, using "." as fallback.');
            }
            return ['.'];
        }
    }

    function assertOnlyRelativePathsToSubdirectoriesSpecified(dirs) {
        dirs.forEach((dir) => {
            if (dir.startsWith('..') || dir.startsWith('/')) {
                throw Error(`Invalid directory "${dir}". Only relative paths to project subdirectories are allowed.`);
            }
        });
    }

    function getIgnored() {
        const flag = '--ignore';

        if (isFlagPresent(flag)) {
            assertFlagHasArgs(flag);
            return getFlagArgs(flag);
        }

        return [];
    }

    function isArgFlag(arg) {
        return arg.indexOf('--') === 0;
    }

    function isFlagPresent(flag) {
        return args.indexOf(flag) !== -1;
    }

    function assertFlagHasArgs(flag) {
        const nextArg = args[args.indexOf(flag) + 1];
        if (!nextArg || isArgFlag(nextArg)) {
            throw Error(`Missing arguments for "${flag}".`);
        }
    }

    function getFlagArgs(flag) {
        const flagArgs = args.slice(args.indexOf(flag) + 1);

        if (flagArgs.some(isArgFlag)) {
            return flagArgs.slice(0, flagArgs.findIndex(isArgFlag))
        }
        return flagArgs;
    }

    return {
        directories: getDirs(),
        ignore: getIgnored(),
    }
};
