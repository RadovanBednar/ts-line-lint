const expect = require('chai').expect;
const ArgvParser = require('./argv-parser');

describe('ArgvParser', () => {

    describe('when instantiated', () => {

        describe('with a non-array argument', () => {

            it('should throw error', () => {
                const invalidArgs = [123, 'string', false, {}];

                invalidArgs.forEach((arg) => {
                    expect(() => new ArgvParser(arg)).to.throw();
                });
            });

        });

        describe('with an array argument', () => {

            it('should assign the argument to its argv property', () => {
                const array = ['string'];

                const argvParser = new ArgvParser(array);

                expect(argvParser.argv).to.deep.equal(array);
            });

        });

    });

    describe('when asked for directories', () => {
        const argsWithoutDirs = ['node', 'path/to/script'];
        let argvParser;

        describe('and there were no directories specified in argv', () => {

            it('should return an array with the current directory', () => {
                argvParser = new ArgvParser(argsWithoutDirs);

                expect(argvParser.directories).to.deep.equal(['.']);
            });

        });

        describe('and there were some directories specified in argv', () => {
            const dirs = ['dir1', 'dir2'];
            const args = argsWithoutDirs.concat(dirs);

            it('should return an array with those directories', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.directories).to.deep.equal(dirs);
            });

        });

        describe('and there was a directory outside the CWD specified in argv', () => {
            const args = argsWithoutDirs.concat('valid', '../invalid');

            it('should return an empty array', () => {
                argvParser = new ArgvParser(args);

                expect(() => argvParser.directories).to.throw();
            });

        });

    });

});
