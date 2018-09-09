const log = require('./logger');

module.exports = class ArgvParser {

    constructor(argv) {
        if (!Array.isArray(argv)) {
            throw Error(`Expected an array of strings, got ${typeof argv}.`)
        }
        this.argv = argv;
    }

    get directories() {
        const dirs = this.argv.slice(2);
        if (dirs.length) {
            dirs.forEach((dir) => {
                if (dir.indexOf('..') === 0) {
                    throw Error(`Invalid directory "${dir}". Directories outside of CWD are not allowed.`);
                }
            });
        } else {
            log.warn('No directory specified, using "." as fallback.');
            dirs.push('.');
        }

        return dirs;
    }

};
