const fs = require('fs');

function listDirectories() {
    let files = fs.readdirSync(process.cwd());

    return files.filter((file) => fs.lstatSync(file).isDirectory());
}

module.exports = listDirectories;
