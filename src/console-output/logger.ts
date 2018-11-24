class Logger {

    public newline(n: number): Logger {
        for (let i = 0; i < n; i++) {
            process.stdout.write('\n');
        }
        return this;
    }

    public info(message: string): Logger {
        process.stdout.write(message + '\n');
        return this;
    }

    public warning(message: string): Logger {
        process.stdout.write(`\u{1b}[33mWarning: ${message}\u{1b}[0m\n`);
        return this;
    }

    public error(message: string): Logger {
        process.stdout.write(`\u{1b}[01;31mError: ${message}\u{1b}[0m\n`);
        return this;
    }

    public rewriteLastLine(message: string): Logger {
        process.stdout.write(`\r\u{1b}[K${message}`);
        return this;
    }

    public usage(): Logger {
        process.stdout.write('Usage: ts-line-lint [DIR]... [--ignore PATH...] [--config PATH]\n');
        return this;
    }

}

export const log = new Logger();
