import * as fs from 'fs';
import fixLines = require('./fix-lines');

export function processFile(file: string): boolean {
    const content = fs.readFileSync(file, 'utf-8');
    const newContent = fixLines(content);

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf-8');
        return true;
    }

    return false;
}
