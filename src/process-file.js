const fs = require('fs');
const fixLines = require('./fix-lines');

function processFile(file) {
    const content = fs.readFileSync(file, 'utf-8');

    const newContent = fixLines(content);

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf-8');
        return true;
    }

    return false;
}

module.exports = processFile;
