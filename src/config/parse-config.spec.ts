import { expect } from 'chai';
import * as fs from 'mock-fs';
import { createMultilineString } from '../utils/text-utils';
import { parseConfig } from './parse-config';

describe('parseConfig function', () => {

    afterEach(fs.restore);

    describe('when called with a non-existent file', () => {

        it('should throw a "Could not open config file" error', () => {
            whenCalledWith('non-existent.json').expectError('Could not open config file');
        });

    });

    describe('when called with a directory', () => {

        beforeEach(() => {
            fs({ 'some-directory': {} });
        });

        it('should throw a "Could not open config file" error', () => {
            whenCalledWith('some-directory').expectError('Could not open config file');
        });

    });

    describe('when called with a file that is not valid JSON', () => {

        beforeEach(() => {
            fs({ 'not.json': 'some rubbish' });
        });

        it('should throw a "Could not parse config file" error', () => {
            whenCalledWith('not.json').expectError('Could not parse config file');
        });

    });

    describe('when called with a JSON file not valid according to the schema', () => {

        beforeEach(() => {
            fs({ 'invalid-config.json': '{ "invalid-property": "invalid-value" }' });
        });

        it('should throw an "Invalid config file" error', () => {
            whenCalledWith('invalid-config.json').expectError('Invalid config file');
        });

    });

    describe('when called with a valid config file', () => {

        beforeEach(() => {
            const fileContent = createMultilineString(
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
            );
            fs({ 'config.json': fileContent });
        });

        it('should parse data correctly', () => {
            whenCalledWith('config.json').expectResult({
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
            });
        });

    });

});

// tslint:disable-next-line:typedef
function whenCalledWith(file: string) {
    return {
        expectResult(value: any): void {
            expect(parseConfig(file)).to.deep.equal(value);
        },
        expectError(message: string): void {
            expect(() => parseConfig(file)).to.throw(message);
        },
    };
}
