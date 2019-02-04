import { expect, use as chaiUse } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../console-output/logger';
import { CommandLineOptionsParser } from './command-line-options-parser';

chaiUse(sinonChai);

describe.only('CommandLineOptionsParser', () => {
    let processArgvStub: sinon.SinonStub;
    let logWarningStub: sinon.SinonStub;
    let parser: CommandLineOptionsParser;

    beforeEach(() => {
        logWarningStub = sinon.stub(log, 'warning');
    });

    afterEach(() => {
        logWarningStub.restore();
        processArgvStub.restore();
    });

    describe('when getting directories', () => {
        const fallbackWarningMessage = 'No directory specified, using "." as fallback.';
        const onlyCurrentDirectory = ['.'];

        describe('and there were no args specified', () => {

            beforeEach(() => {
                initWithProcessArgs([]);
            });

            it('should return only the current directory', () => {
                onCallToMethod('getDirectories').expectResult(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                onCallToMethod('getDirectories').expectWarning(fallbackWarningMessage);
            });

        });

        describe('and the first arg was a flag', () => {
            const flagAtTheBeginning = ['--flag'];

            beforeEach(() => {
                initWithProcessArgs(flagAtTheBeginning);
            });

            it('should return only the current directory', () => {
                onCallToMethod('getDirectories').expectResult(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                onCallToMethod('getDirectories').expectWarning(fallbackWarningMessage);
            });

        });

        describe('and there were only some dirs specified', () => {
            const dirs = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs(dirs);
            });

            it('should return all specified dirs', () => {
                onCallToMethod('getDirectories').expectResult(dirs);
            });

        });

        describe('and there were some dirs specified followed by a flag', () => {
            const dirs = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs([...dirs, '--flag']);
            });

            it('should return only the dirs', () => {
                onCallToMethod('getDirectories').expectResult(dirs);
            });

        });

        describe('and there was a relative path starting with .. specified', () => {
            const argsWithPathToParentDir = ['valid-dir', '../invalid-dir'];

            beforeEach(() => {
                initWithProcessArgs(argsWithPathToParentDir);
            });

            it('should throw an "Invalid directory" error', () => {
                onCallToMethod('getDirectories').expectError('Invalid directory');
            });

        });

        describe('and there was an absolute path specified', () => {
            const argsWithAbsolutePath = ['valid-dir', '/absolute/path/is/invalid'];

            beforeEach(() => {
                initWithProcessArgs(argsWithAbsolutePath);
            });

            it('should throw an "Invalid directory" error', () => {
                onCallToMethod('getDirectories').expectError('Invalid directory');
            });

        });

    });

    describe('when getting ignored files', () => {

        describe('and there was no "--ignore" flag used', () => {
            const noIgnoreFlag = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs(noIgnoreFlag);
            });

            it('should return an empty array', () => {
                onCallToMethod('getIgnoredFiles').expectResult([]);
            });

        });

        describe('and there was an "--ignore" flag used without args', () => {
            const ignoreWithoutArgs = ['--ignore'];

            beforeEach(() => {
                initWithProcessArgs(ignoreWithoutArgs);
            });

            it('should throw a "Missing argument" error', () => {
                onCallToMethod('getIgnoredFiles').expectError('Missing argument');
            });

        });

        describe('and there was an "--ignore" flag used followed by another flag', () => {
            const ignoreFollowedByAnotherFlag = ['--ignore', '--flag'];

            beforeEach(() => {
                initWithProcessArgs(ignoreFollowedByAnotherFlag);
            });

            it('should throw a "Missing argument" error', () => {
                onCallToMethod('getIgnoredFiles').expectError('Missing argument');
            });

        });

        describe('and there was an "--ignore" flag used with some args', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--ignore', ...ignoredPaths]);
            });

            it('should return the args', () => {
                onCallToMethod('getIgnoredFiles').expectResult(ignoredPaths);
            });

        });

        describe('and there was an "--ignore" flag used with some args followed by another flag', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--ignore', ...ignoredPaths, '--flag']);
            });

            it('should only contain the non-flag args', () => {
                onCallToMethod('getIgnoredFiles').expectResult(ignoredPaths);
            });

        });

    });

    describe('when getting config path', () => {

        describe('and there was no "--config" flag used', () => {
            const noConfigFlag = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs(noConfigFlag);
            });

            it('should return undefined', () => {
                onCallToMethod('getConfigPath').expectResult(undefined);
            });

        });

        describe('and there was a "--config" flag used without args', () => {
            const configWithoutArgs = ['--config'];

            beforeEach(() => {
                initWithProcessArgs(configWithoutArgs);
            });

            it('should throw a "Missing argument" error', () => {
                onCallToMethod('getConfigPath').expectError('Missing argument');
            });

        });

        describe('and there was a "--config" flag used followed by another flag', () => {
            const configFollowedByAnotherFlag = ['--config', '--flag'];

            beforeEach(() => {
                initWithProcessArgs(configFollowedByAnotherFlag);
            });

            it('should throw a "Missing argument" error', () => {
                onCallToMethod('getConfigPath').expectError('Missing argument');
            });

        });

        describe('and there was a "--config" flag used with one arg', () => {
            const configFile = 'path/to/config.json';

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--config', configFile]);
            });

            it('should return the value of the arg', () => {
                onCallToMethod('getConfigPath').expectResult(configFile);
            });

        });

        describe('and there was a "--config" flag used with one arg followed by another flag', () => {
            const configFile = 'path/to/config.json';

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--config', configFile, '--flag']);
            });

            it('should return the value of the arg', () => {
                onCallToMethod('getConfigPath').expectResult(configFile);
            });

        });

        describe('and there was a "--config" flag used with more than one arg', () => {
            const configWithMultipleArgs = ['dir1', '--config', 'path/to/config.json', 'some-junk'];

            beforeEach(() => {
                initWithProcessArgs(configWithMultipleArgs);
            });

            it('should throw a "Wrong number of arguments" error', () => {
                onCallToMethod('getConfigPath').expectError('Wrong number of arguments');
            });

        });

    });

    function initWithProcessArgs(args: Array<string>): void {
        processArgvStub = sinon.stub(process, 'argv').value(['node', 'path/to/script', ...args]);
        parser = new CommandLineOptionsParser();
    }

    // tslint:disable-next-line:typedef
    function onCallToMethod(method: keyof CommandLineOptionsParser) {
        const testedMethod = parser[method].bind(parser);

        return {
            expectResult(value: any): void {
                expect(testedMethod()).to.deep.equal(value);
            },
            expectWarning(message: string): void {
                testedMethod();
                expect(log.warning).to.have.been.calledOnceWith(message);
            },
            expectError(message: string): void {
                expect(() => testedMethod()).to.throw(message);
            },
        };
    }

});
