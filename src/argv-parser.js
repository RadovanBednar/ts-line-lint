const log = require('./logger');

module.exports = {
    getDirectories: () => {
        const dirs = process.argv.slice(2);
        if (dirs.length) {
            dirs.forEach((dir) => {
                if (dir.indexOf('..') === 0) {
                    throw Error(`Wrong directory "${dir}". Directories outside of CWD are not allowed.`);
                }
            });
        } else {
            log.warn('No directory specified, using "." as fallback.');
            dirs.push('.');
        }

        return dirs;
    }
};
