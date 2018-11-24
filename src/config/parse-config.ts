import * as fs from 'fs';
import { validate } from 'jsonschema';
import { configSchema } from './config-schema';
import { LineLintConfig } from './line-lint-config';

export function parseConfig(configFile: string): LineLintConfig {
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
    const validationErrors = validate(configObject, configSchema).errors;

    if (validationErrors.length > 0) {
        throw Error(`Invalid config file "${configFile}" (${validationErrors.join(', ')})`);
    } else {
        return configObject;
    }
}
