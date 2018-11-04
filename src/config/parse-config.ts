import * as fs from 'fs';
import { validate } from 'jsonschema';
import { LineLintConfig } from './line-lint-config';

export function parseConfig(configFile: string): LineLintConfig {
    const schema = require('./config.schema.json');
    let fileContent: string;
    let configObject: LineLintConfig;

    try {
        fileContent = fs.readFileSync(configFile, 'utf-8');
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
    } else {
        return configObject;
    }
}