#!/usr/bin/env node
import {fixLines} from './fix-lines';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function () {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        input += chunk;
    }
});

process.stdin.on('end', () => {
    process.stdout.write(fixLines(input));
    process.exit(0);
});
