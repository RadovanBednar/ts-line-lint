const fs = require('mock-fs');
const expect = require('chai').expect;
const createMultilineString = require('./utils').createMultilineString;
const parseConfig = require('./parse-config');

describe.only('parseConfig function', () => {

    afterEach(fs.restore);

    describe('when called with a non-existent file', () => {

        it('should throw a "Could not open config file" error', () => {
            expect(() => parseConfig('non-existent.json')).to.throw('Could not open config file');
        });

    });

    describe('when called with a directory', () => {

        beforeEach(() => {
            fs({ 'some-directory': {} });
        });

        it('should throw a "Could not open config file" error', () => {
            expect(() => parseConfig('some-directory')).to.throw('Could not open config file');
        });

    });

    describe('when called with a file that is not valid JSON', () => {

        beforeEach(() => {
            fs({ 'not.json': 'some rubbish' });
        });

        it('should throw a "Could not parse config file" error', () => {
            expect(() => parseConfig('not.json')).to.throw('Could not parse config file');
        });

    });

    describe('when called with a JSON file not valid according to the schema', () => {

        beforeEach(() => {
            fs({ 'invalid-config.json': '{ "invalid-property": "invalid-value" }' });
        });

        it('should throw an "Invalid config file" error', () => {
            expect(() => parseConfig('invalid-config.json')).to.throw('Invalid config file');
        });

    });

    describe('when called with a valid config file', () => {

        describe('and the "indent" property in config', () => {

            describe('has value "tab"', () => {

                beforeEach(() => {
                    fs({ 'config.json': '{ "indent": "tab" }' });
                });

                it('should return "indent" property with value 0', () => {
                    expect(parseConfig('config.json').indent).to.equal(0);
                });

            });

            describe('has a numeric value', () => {

                it('should return "indent" property with the value from the config file', () => {
                    const minIndent = 1;
                    const maxIndent = 8;

                    for (let i = minIndent; i <= maxIndent; i++) {
                        fs({ 'config.json': `{ "indent": ${i} }` });

                        expect(parseConfig('config.json').indent).to.equal(i);
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
                expect(parseConfig('config.json')['remove-blank-lines']['consecutive-imports']).to.be.undefined;
            });

            it('should include properties with values ather than "none"', () => {
                expect(parseConfig('config.json')['remove-blank-lines']['individual-import']).to.equal('before');
                expect(parseConfig('config.json')['remove-blank-lines']['individual-multiline-type-alias']).to.equal('after');
                expect(parseConfig('config.json')['remove-blank-lines']['consecutive-uniline-type-aliases']).to.equal('both');
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
                expect(parseConfig('config.json')['insert-blank-lines']['consecutive-imports']).to.be.undefined;
            });

            it('should include properties with values ather than "none"', () => {
                expect(parseConfig('config.json')['insert-blank-lines']['individual-import']).to.equal('before');
                expect(parseConfig('config.json')['insert-blank-lines']['individual-multiline-type-alias']).to.equal('after');
                expect(parseConfig('config.json')['insert-blank-lines']['consecutive-uniline-type-aliases']).to.equal('both');
            });

        });

    });

});
