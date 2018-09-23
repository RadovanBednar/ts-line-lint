const fs = require('fs');

module.exports = function(configFile) {
    let fileContent, configObject;

    try {
        fileContent = fs.readFileSync(configFile);
    } catch (e) {
        throw Error(`Could not open config file "${configFile}" (${e.message})`)
    }

    try {
        configObject = JSON.parse(fileContent);
    } catch (e) {
        throw Error(`Could not parse config file "${configFile}" (${e.message})`)
    }

    return {
        indent: 4,
    }
}
