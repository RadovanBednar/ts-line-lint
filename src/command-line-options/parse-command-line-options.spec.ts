import { expect, use as chaiUse } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../console-output/logger';
import { CommandLineOptions } from './command-line-options';
import { parseCommandLineOptions } from './parse-command-line-options';

chaiUse(sinonChai);

describe('parseCommandLineOptions function', () => {
    let logWarningStub: sinon.SinonStub;

    beforeEach(() => {
        logWarningStub = sinon.stub(log, 'warning');
    });

    afterEach(() => {
        logWarningStub.restore();
    });

    describe('directories array', () => {
        const fallbackWarningMessage = 'No directory specified, using "." as fallback.';
        const onlyCurrentDirectory = ['.'];

        describe('when there were no args specified', () => {

            it('should contain only the current directory', () => {
                whenCalledWith([]).expect('directories').toEqual(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                whenCalledWith([]).expectWarning(fallbackWarningMessage);
            });

        });

        describe('when the first arg was a flag', () => {
            const flagAtTheBeginning = ['--flag'];

            it('should contain only the current directory', () => {
                whenCalledWith(flagAtTheBeginning).expect('directories').toEqual(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                whenCalledWith([]).expectWarning(fallbackWarningMessage);
            });

        });

        describe('when there were only some dirs specified', () => {
            const dirs = ['dir1', 'dir2'];

            it('should contain all the dirs', () => {
                whenCalledWith(dirs).expect('directories').toEqual(dirs);
            });

        });

        describe('when there were some dirs specified followed by a flag', () => {
            const dirs = ['dir1', 'dir2'];
            const args = [...dirs, '--flag'];

            it('should contain only the dirs', () => {
                whenCalledWith(args).expect('directories').toEqual(dirs);
            });

        });

        describe('when there was a relative path starting with .. specified', () => {
            const argsWithPathToParentDir = ['valid-dir', '../invalid-dir'];

            it('should throw an "Invalid directory" error', () => {
                whenCalledWith(argsWithPathToParentDir).expectError('Invalid directory');
            });

        });

        describe('when there was an absolute path specified', () => {
            const argsWithAbsolutePath = ['valid-dir', '/absolute/path/is/invalid'];

            it('should throw an "Invalid directory" error', () => {
                whenCalledWith(argsWithAbsolutePath).expectError('Invalid directory');
            });

        });

    });

    describe('ignored files array', () => {

        describe('when there was no "--ignore" flag used', () => {
            const noIgnoreFlag = ['dir1', 'dir2'];

            it('should be empty', () => {
                whenCalledWith(noIgnoreFlag).expect('ignore').toEqual([]);
            });

        });

        describe('when there was an "--ignore" flag used without args', () => {
            const ignoreWithoutArgs = ['--ignore'];

            it('should throw a "Missing argument" error', () => {
                whenCalledWith(ignoreWithoutArgs).expectError('Missing argument');
            });

        });

        describe('when there was an "--ignore" flag used followed by another flag', () => {
            const ignoreFollowedByAnotherFlag = ['--ignore', '--flag'];

            it('should throw a "Missing argument" error', () => {
                whenCalledWith(ignoreFollowedByAnotherFlag).expectError('Missing argument');
            });

        });

        describe('when there was an "--ignore" flag used with some args', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];
            const ignoreWithArgs = ['dir1', '--ignore', ...ignoredPaths];

            it('should contain the args', () => {
                whenCalledWith(ignoreWithArgs).expect('ignore').toEqual(ignoredPaths);
            });

        });

        describe('when there was an "--ignore" flag used with some args followed by another flag', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];
            const ignoreWithArgs = ['dir1', '--ignore', ...ignoredPaths, '--flag'];

            it('should only contain the non-flag args', () => {
                whenCalledWith(ignoreWithArgs).expect('ignore').toEqual(ignoredPaths);
            });

        });

    });

    describe('config path', () => {

        describe('when there was no "--config" flag used', () => {
            const noConfigFlag = ['dir1', 'dir2'];

            it('should be undefined', () => {
                whenCalledWith(noConfigFlag).expect('config').toBeUndefined();
            });

        });

        describe('when there was a "--config" flag used without args', () => {
            const configWithoutArgs = ['--config'];

            it('should throw a "Missing argument" error', () => {
                whenCalledWith(configWithoutArgs).expectError('Missing argument');
            });

        });

        describe('when there was a "--config" flag used followed by another flag', () => {
            const configFollowedByAnotherFlag = ['--config', '--flag'];

            it('should throw a "Missing argument" error', () => {
                whenCalledWith(configFollowedByAnotherFlag).expectError('Missing argument');
            });

        });

        describe('when there was a "--config" flag used with one arg', () => {
            const configFile = 'path/to/config.json';
            const configWithArg = ['dir1', '--config', configFile];

            it('should be the value of the arg', () => {
                whenCalledWith(configWithArg).expect('config').toBe(configFile);
            });

        });

        describe('when there was a "--config" flag used with one arg followed by another flag', () => {
            const configFile = 'path/to/config.json';
            const configWithArg = ['dir1', '--config', configFile, '--flag'];

            it('should be the value of the arg', () => {
                whenCalledWith(configWithArg).expect('config').toBe(configFile);
            });

        });

        describe('when there was a "--config" flag used with more than one arg', () => {
            const configArgs = ['path/to/config.json', 'some-junk'];
            const configWithMultipleArgs = ['dir1', '--config', ...configArgs];

            it('should throw a "Wrong number of arguments" error', () => {
                whenCalledWith(configWithMultipleArgs).expectError('Wrong number of arguments');
            });

        });

    });

});

// tslint:disable-next-line:typedef
function whenCalledWith(args: Array<string>) {
    return {
        // tslint:disable-next-line:typedef
        expect(property: keyof CommandLineOptions) {
            return {
                toEqual(value: Array<string>): void {
                    expect(parseCommandLineOptions(args)[property]).to.deep.equal(value);
                },
                toBe(value: string): void {
                    expect(parseCommandLineOptions(args)[property]).to.equal(value);
                },
                toBeUndefined(): void {
                    expect(parseCommandLineOptions(args)[property]).to.be.undefined;
                },
            };
        },
        expectWarning(message: string): void {
            parseCommandLineOptions(args);
            expect(log.warning).to.have.been.calledOnceWith(message);
        },
        expectError(message: string): void {
            expect(() => parseCommandLineOptions(args)).to.throw(message);
        },
    };
}
