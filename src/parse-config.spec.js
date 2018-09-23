const fs = require('mock-fs');
const expect = require('chai').expect;
const parseConfig = require('./parse-config');

describe('parseConfig function', () => {

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

    describe('when called with an invalid JSON file', () => {

        beforeEach(() => {
            fs({ 'config.json': 'not JSON' });
        });

        it('should throw a "Could not parse config file" error', () => {
            expect(() => parseConfig('config.json')).to.throw('Could not parse config file');
        });

    });

    describe.only('when called with a valid JSON file', () => {

        describe('and the "indent" property', () => {

            describe('was not specified', () => {

                // beforeEach(() => {
                //     fs({ 'config.json': '{}' })
                // });

                it('should equal 4', () => {
                    fs({ 'config.json': '{}' })

                    expect(parseConfig('config.json').indent).to.equal(4);
                });

            });

            describe('set to value from 1 to 8', () => {

                it('should equal the given value', () => {
                    expect(parseConfig('config.json').indent).to.equal(4);
                });

            });

        });

    });

    // describe('"indent" property', () => {
    //

    //
    //     describe('when it was specified in config file with value from 1 to 8', () => {
    //
    //         it('should equal the given value', () => {
    //             for (let i = 1; i <= 8; i++) {
    //                 const configFile = `{"indent":${i}}`;
    //
    //                 expect(parseConfig(configFile).indent).to.equal(i);
    //             }
    //         });
    //
    //     });
    //
    // });

});
