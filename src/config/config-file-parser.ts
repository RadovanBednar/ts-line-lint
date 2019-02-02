import * as fs from 'fs';
import { validate } from 'jsonschema';
import { log } from '../console-output/logger';
import { configSchema } from './config-schema';
import { defaultConfig } from './default-config';
import { LineLintConfig } from './line-lint-config';

export class ConfigFileParser {
    public static readonly baseConfigFile = '.linelint';
    private readonly configFile: string;
    private readonly useDefault: boolean;

    private static existsBaseConfigFile(): boolean {
        return fs.existsSync(ConfigFileParser.baseConfigFile);
    }

    constructor(configFile?: string) {
        this.configFile = configFile || ConfigFileParser.baseConfigFile;
        this.useDefault = !configFile && !ConfigFileParser.existsBaseConfigFile();
    }

    public getConfig(): LineLintConfig {
        if (this.useDefault) {
            log.info('(No config file provided, the default config will be used.)');
            return defaultConfig;
        }

        const configObject = this.parseFile();
        this.assertConfigValid(configObject);

        return configObject;
    }

    private parseFile(): LineLintConfig {
        const fileContent = this.readFileContent();
        try {
            log.info(`Parsing config file "${this.configFile}"...`);
            return JSON.parse(fileContent);
        } catch (e) {
            throw Error(`Could not parse config file "${this.configFile}" (${e.message})`);
        }
    }

    private readFileContent(): string {
        try {
            return fs.readFileSync(this.configFile, 'utf-8');
        } catch (e) {
            throw Error(`Could not open config file "${this.configFile}" (${e.message})`);
        }
    }

    private assertConfigValid(configObject: LineLintConfig): void {
        const validationErrors = validate(configObject, configSchema).errors;

        if (validationErrors.length > 0) {
            throw Error(`Invalid config file "${this.configFile}" (${validationErrors.join(', ')})`);
        }
    }

}
