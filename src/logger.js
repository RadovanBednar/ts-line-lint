module.exports = {
    newline: (number) => {
        for (let i = 0; i < number; i++) {
            process.stdout.write('\n');
        }
        return module.exports;
    },
    info: (msg) => {
        process.stdout.write(msg + '\n');
        return module.exports;
    },
    warn: (msg) => {
        process.stdout.write(`\u{1b}[33mWarning: ${msg}\u{1b}[0m\n`);
        return module.exports;
    },
    error: (msg) => {
        process.stdout.write(`\u{1b}[01;31mError: ${msg}\u{1b}[0m\n`);
        return module.exports;
    },
    rewriteLastLine: (msg) => {
        process.stdout.write(`\r\u{1b}[K${msg}`);
        return module.exports;
    },
    usage: () => {
        process.stdout.write('Usage: ts-line-lint [DIR]... [--config FILE] [--ignore PATH...]\n');
        return module.exports;
    },
};
