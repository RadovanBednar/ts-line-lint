const expect = require('chai').expect;
const ArgvParser = require('./argv-parser');

describe('ArgvParser', () => {
    const mandatoryArgs = ['node', 'path/to/script'];
    let argvParser;

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

            it('should assign all but the first two values from the argument to its argv property', () => {
                const array = ['first', 'second', 'third'];

                argvParser = new ArgvParser(array);

                expect(argvParser.argv).to.deep.equal(['third']);
            });

        });

    });

    describe('when asked for directories', () => {

        describe('and there were no directories and no flags specified in argv', () => {

            it('should return an array with the current directory', () => {
                argvParser = new ArgvParser(mandatoryArgs);

                expect(argvParser.directories).to.deep.equal(['.']);
            });

        });

        describe('and there were no directories, but some flag specified in argv', () => {
            const args = mandatoryArgs.concat('--some-flag');

            it('should return an array with the current directory', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.directories).to.deep.equal(['.']);
            });

        });

        describe('and there were some directories specified in argv', () => {
            const dirs = ['dir1', 'dir2'];
            const args = mandatoryArgs.concat(dirs);

            it('should return an array with those directories', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.directories).to.deep.equal(dirs);
            });

        });

        describe('and there were some directories specified in argv followed by a flag', () => {
            const dirs = ['dir1', 'dir2'];
            const args = mandatoryArgs.concat(dirs, '--some-flag');

            it('should return an array with those directories', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.directories).to.deep.equal(dirs);
            });

        });

        describe('and there was a directory outside the CWD specified in argv', () => {
            const args = mandatoryArgs.concat('valid', '../invalid');

            it('should throw error', () => {
                argvParser = new ArgvParser(args);

                expect(() => argvParser.directories).to.throw();
            });

        });

    });

    describe('when asked for ignored files', () => {
        const ignoreFlag = '--ignore';

        describe('and there was no "--ignore" flag used', () => {

            it('should return an empty array', () => {
                argvParser = new ArgvParser(mandatoryArgs);

                expect(argvParser.ignored).to.deep.equal([]);
            });

        });

        describe('and there was an "--ignore" flag used without arguments', () => {
            const args = mandatoryArgs.concat(ignoreFlag);

            it('should throw error', () => {
                argvParser = new ArgvParser(args);

                expect(() => argvParser.ignored).to.throw();
            });

        });

        describe('and there was an "--ignore" flag used followed by another flag', () => {
            const args = mandatoryArgs.concat(ignoreFlag, '--other-flag');

            it('should throw error', () => {
                argvParser = new ArgvParser(args);

                expect(() => argvParser.ignored).to.throw();
            });

        });

        describe('and there was an "--ignore" flag used followed by one argument', () => {
            const ignoredPath = 'path/to/ignore';
            const args = mandatoryArgs.concat(ignoreFlag, ignoredPath);

            it('should return an array containing that argument', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.ignored).to.deep.equal([ignoredPath]);
            });

        });

        describe('and there was an "--ignore" flag used followed by two arguments', () => {
            const ignoredPaths = ['path/to/ignore', 'another/path/to/ignore'];
            const args = mandatoryArgs.concat(ignoreFlag, ignoredPaths);

            it('should return an array containing those arguments', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.ignored).to.deep.equal(ignoredPaths);
            });

        });

        describe('and there was an "--ignore" flag used followed by two arguments and another flag', () => {
            const ignoredPaths = ['path/to/ignore', 'another/path/to/ignore'];
            const args = mandatoryArgs.concat(ignoreFlag, ignoredPaths, '--other-flag');

            it('should return an array containing only those arguments', () => {
                argvParser = new ArgvParser(args);

                expect(argvParser.ignored).to.deep.equal(ignoredPaths);
            });

        });

    });

});
