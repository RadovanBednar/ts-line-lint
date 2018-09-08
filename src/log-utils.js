module.exports = {
    newline: (number) => {
        for (let i = 0; i < number; i++) {
            process.stdout.write('\n');
        }
    },
    info: (msg) => {
        process.stdout.write(msg + '\n');
    },
    warn: (msg) => {
        process.stdout.write(`\u{1b}[33mWarn: ${msg}\u{1b}[0m\n`);
    },
    error: (msg) => {
        process.stdout.write(`\u{1b}[31mError: ${msg}\u{1b}[0m\n`);
    },
    rewriteLastLine: (msg) => {
        process.stdout.write(`\r\u{1b}[K${msg}`);
    },
};

