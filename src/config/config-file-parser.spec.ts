import { expect, use as chaiUse } from 'chai';
import * as fs from 'mock-fs';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../console-output/logger';
import { createMultilineString } from '../utils/text-utils';
import { defaultConfig } from './default-config';
import { ConfigFileParser } from './config-file-parser';

chaiUse(sinonChai);

describe('ConfigFileParser', () => {
    let logInfoStub: sinon.SinonStub;

    beforeEach(() => {
        logInfoStub = sinon.stub(log, 'info').callsFake(() => null);
    });

    afterEach(() => {
        logInfoStub.restore();
    });

    afterEach(fs.restore);

    describe('when getting config from a non-existent file', () => {

        it('should throw a "Could not open config file" error', () => {
            whenCalledWith('non-existent.json').expectError('Could not open config file');
        });

    });

    describe('when getting config from a directory', () => {

        beforeEach(() => {
            fs({ 'some-directory': {} });
        });

        it('should throw a "Could not open config file" error', () => {
            whenCalledWith('some-directory').expectError('Could not open config file');
        });

    });

    describe('when getting config from a file that is not valid JSON', () => {

        beforeEach(() => {
            fs({ 'not.json': 'some rubbish' });
        });

        it('should throw a "Could not parse config file" error', () => {
            whenCalledWith('not.json').expectError('Could not parse config file');
        });

    });

    describe('when getting config from a JSON file not valid according to the schema', () => {

        beforeEach(() => {
            fs({ 'invalid-config.json': '{ "invalid-property": "invalid-value" }' });
        });

        it('should throw an "Invalid config file" error', () => {
            whenCalledWith('invalid-config.json').expectError('Invalid config file');
        });

    });

    describe('when getting config from a valid config file', () => {
        const fileName = 'config.json';
        const { fileContent, expectedConfig } = createValidTestData();

        beforeEach(() => {
            fs({ [fileName]: fileContent });
        });

        it('should parse data correctly', () => {
            whenCalledWith('config.json').expectResult(expectedConfig);
        });

        it('should log info', () => {
            whenCalledWith('config.json').expectInfo(`Parsing config file "${fileName}"...`);
        });

    });

    describe('when getting config with no config file provided', () => {

        describe('and there is a base config file present', () => {
            const { fileContent, expectedConfig } = createValidTestData();

            beforeEach(() => {
                fs({ [ConfigFileParser.baseConfigFile]: fileContent });
            });

            it('should parse the base file', () => {
                whenCalledWith().expectResult(expectedConfig);
            });

            it('should log info', () => {
                whenCalledWith().expectInfo(`Parsing config file "${ConfigFileParser.baseConfigFile}"...`);
            });

        });

        describe('and there is no default config file present', () => {

            it('should return the default config', () => {
                whenCalledWith().expectResult(defaultConfig);
            });

            it('should log info about falling back to the default config', () => {
                whenCalledWith().expectInfo('No config file provided, using default config...');
            });

        });

    });

});

function createValidTestData(): { fileContent: string, expectedConfig: object } {
    return {
        fileContent: createMultilineString(
            '{',
            '  "indent": "tab",',
            '  "rules": {',
            '    "individual-import": {',
            '      "remove": "before"',
            '    },',
            '    "consecutive-imports": {',
            '      "insert": "after"',
            '    },',
            '    "individual-multiline-type-alias": {',
            '      "insert": "both"',
            '    },',
            '    "consecutive-single-line-type-aliases": {',
            '      "remove": "before",',
            '      "insert": "none"',
            '    }',
            '  }',
            '}',
        ),
        expectedConfig: {
            indent: 'tab',
            rules: {
                'individual-import': {
                    remove: 'before',
                },
                'consecutive-imports': {
                    insert: 'after',
                },
                'individual-multiline-type-alias': {
                    insert: 'both',
                },
                'consecutive-single-line-type-aliases': {
                    remove: 'before',
                    insert: 'none',
                },
            },
        },
    };
}

// tslint:disable-next-line:typedef
function whenCalledWith(file?: string) {
    const parser = new ConfigFileParser(file);

    return {
        expectResult(value: any): void {
            expect(parser.getConfig()).to.deep.equal(value);
        },
        expectInfo(message: string): void {
            parser.getConfig();
            expect(log.info).to.have.been.calledOnceWith(message);
        },
        expectError(message: string): void {
            expect(() => parser.getConfig()).to.throw(message);
        },
    };
}
