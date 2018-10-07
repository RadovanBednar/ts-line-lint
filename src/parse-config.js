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
        configObject = JSON.parse(fileContent, (_, value) => value === 'none' ? undefined : value );
    } catch (e) {
        throw Error(`Could not parse config file "${configFile}" (${e.message})`);
    }

    assertConfigObjectIsValidAccordingToSchema(configObject, configFile);

    return {
        ...configObject,
        indent: configObject.indent === "tab" ? 0 : configObject.indent,
    }
}

function assertConfigObjectIsValidAccordingToSchema(parsedObj, sourceFile) {
    const validationErrors = validate(parsedObj, schema).errors;

    if (validationErrors.length > 0) {
        throw Error(`Invalid config file "${sourceFile}" (${validationErrors.join(', ')})`);
    }
}
