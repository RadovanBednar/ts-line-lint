const fs = require('mock-fs');
const expect = require('chai').expect;
const createMultilineString = require('./utils').createMultilineString;
const resolveNestedValue = require('./utils').resolveNestedValue;
const parseConfig = require('./parse-config');

describe.only('parseConfig function', () => {

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

        describe('and the "indent" property in config', () => {

            describe('has value "tab"', () => {

                beforeEach(() => {
                    fs({ 'config.json': '{ "indent": "tab" }' });
                });

                it('should return "indent" property with value 0', () => {
                    whenCalledWith('config.json').expectProperty('indent').toHaveValue(0);
                });

            });

            describe('has a numeric value', () => {

                it('should return "indent" property with the value from the config file', () => {
                    const minIndent = 1;
                    const maxIndent = 8;

                    for (let i = minIndent; i <= maxIndent; i++) {
                        fs({ 'config.json': `{ "indent": ${i} }` });

                         whenCalledWith('config.json').expectProperty('indent').toHaveValue(i);
                    }
                });

            });

        });

        describe('and the "remove-blank-lines" property in config contains properties with various values', () => {

            beforeEach(() => {
                const fileContent = createMultilineString(
                    '{',
                    '  "indent": "tab",',
                    '  "remove-blank-lines": {',
                    '    "individual-import": "before",',
                    '    "consecutive-imports": "none",',
                    '    "individual-multiline-type-alias": "after",',
                    '    "consecutive-uniline-type-aliases": "both"',
                    '  }',
                    '}'
                );
                fs({ 'config.json': fileContent });
            });

            it('should not include properties with value "none"', () => {
                whenCalledWith('config.json').expectProperty('remove-blank-lines', 'consecutive-imports').toBeUndefined;
            });

            it('should include properties with values ather than "none"', () => {
                whenCalledWith('config.json').expectProperty('remove-blank-lines', 'individual-import').toHaveValue('before');
                whenCalledWith('config.json').expectProperty('remove-blank-lines', 'individual-multiline-type-alias').toHaveValue('after');
                whenCalledWith('config.json').expectProperty('remove-blank-lines', 'consecutive-uniline-type-aliases').toHaveValue('both');
            });

        });

        describe('and the "insert-blank-lines" property in config contains properties with various values', () => {

            beforeEach(() => {
                const fileContent = createMultilineString(
                    '{',
                    '  "indent": "tab",',
                    '  "insert-blank-lines": {',
                    '    "individual-import": "before",',
                    '    "consecutive-imports": "none",',
                    '    "individual-multiline-type-alias": "after",',
                    '    "consecutive-uniline-type-aliases": "both"',
                    '  }',
                    '}'
                );
                fs({ 'config.json': fileContent });
            });

            it('should not include properties with value "none"', () => {
                whenCalledWith('config.json').expectProperty('insert-blank-lines', 'consecutive-imports').toBeUndefined;
            });

            it('should include properties with values ather than "none"', () => {
                whenCalledWith('config.json').expectProperty('insert-blank-lines', 'individual-import').toHaveValue('before');
                whenCalledWith('config.json').expectProperty('insert-blank-lines', 'individual-multiline-type-alias').toHaveValue('after');
                whenCalledWith('config.json').expectProperty('insert-blank-lines', 'consecutive-uniline-type-aliases').toHaveValue('both');
            });

        });

    });

});

function whenCalledWith(file) {
    return {
        expectProperty: function(...path) {
            return {
                toHaveValue: function(value) {
                    expect(resolveNestedValue(parseConfig(file), path)).to.equal(value);
                },
                toBeUndefined: () => {
                    expect(resolveNestedValue(parseConfig(file), path)).to.be.undefined;
                }
            }
        },
        expectError: function(msg) {
            expect(() => parseConfig(file)).to.throw(msg);
        }
    }
}
