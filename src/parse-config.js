const fs = require('fs');
const validate = require('jsonschema').validate;
const schema = require ('./config.schema.json');

module.exports = function(configFile) {
    let fileContent, configObject;

    try {
        fileContent = fs.readFileSync(configFile);
    } catch (e) {
        throw Error(`Could not open config file "${configFile}" (${e.message})`);
    }

    try {
        configObject = JSON.parse(fileContent);
    } catch (e) {
        throw Error(`Could not parse config file "${configFile}" (${e.message})`);
    }

    const validationErrors = validate(configObject, schema).errors;

    if (validationErrors.length > 0) {
        throw Error(`Invalid config file "${configFile}" (${validationErrors.join(', ')})`);
    }

    return {
        indent: 4,
    }
}
