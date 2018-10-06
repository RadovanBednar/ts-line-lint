const fs = require('mock-fs');
const expect = require('chai').expect;
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
    
});
