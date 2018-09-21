const log = require('./logger');

module.exports = class ArgvParser {

    constructor(argv) {
        if (!Array.isArray(argv)) {
            throw Error(`Expected an array of strings, got ${typeof argv}.`)
        }
        this.argv = argv.slice(2);
    }

    get directories() {
        const dirs = this.getFlagArgs();

        if (dirs.length) {
            if (dirs.some((dir) => dir.indexOf('..') === 0)) {
                throw Error(`Invalid directory "${dir}". Directories outside of CWD are not allowed.`);
            }
        } else {
            log.warn('No directory specified, using "." as fallback.');
            dirs.push('.');
        }

        return dirs;
    }

    get ignored() {
        const flag = '--ignore';

        if (this.isFlagPresent(flag)) {
            this.assertFlagHasArgs(flag);
            return this.getFlagArgs(flag);
        }

        return [];
    }

    isArgFlag(arg) {
        return arg.indexOf('--') === 0;
    }

    isFlagPresent(flag) {
        return this.argv.indexOf(flag) !== -1;
    }

    getFlagArgs(flag) {
        const args = this.argv.slice(this.argv.indexOf(flag) + 1);

        if (args.some(this.isArgFlag)) {
            return args.slice(0, args.findIndex(this.isArgFlag))
        } else {
            return args;
        }
    }

    assertFlagHasArgs(flag) {
        const nextArg = this.argv[this.argv.indexOf(flag) + 1];
        if (!nextArg || this.isArgFlag(nextArg)) {
            throw Error(`Missing argument for "${flag}".`);
        }
    }

};
