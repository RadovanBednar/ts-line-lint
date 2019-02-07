import { expect, use as chaiUse } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../console-output/logger';
import { CommandLineOptionsParser } from './command-line-options-parser';

chaiUse(sinonChai);

describe('CommandLineOptionsParser', () => {
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

    describe('when the same flag was specified more than once', () => {

        it('should throw an "Error while parsing" error', () => {
            expect(() => initWithProcessArgs(['--flag', '--flag'])).to.throw('Error while parsing');
        });

    });

    describe('when getting directories', () => {
        const fallbackWarningMessage = 'No directory specified, using "." as fallback.';
        const onlyCurrentDirectory = ['.'];

        describe('and there were no args specified', () => {

            beforeEach(() => {
                initWithProcessArgs([]);
            });

            it('should return only the current directory', () => {
                expect(parser.getDirectories()).to.deep.equal(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                parser.getDirectories();
                expect(logWarningStub).to.have.been.calledOnceWith(fallbackWarningMessage);
            });

        });

        describe('and the first arg was a flag', () => {
            const flagAtTheBeginning = ['--flag'];

            beforeEach(() => {
                initWithProcessArgs(flagAtTheBeginning);
            });

            it('should return only the current directory', () => {
                expect(parser.getDirectories()).to.deep.equal(onlyCurrentDirectory);
            });

            it('should log a fallback warning', () => {
                parser.getDirectories();
                expect(logWarningStub).to.have.been.calledOnceWith(fallbackWarningMessage);
            });

        });

        describe('and there were only some dirs specified', () => {
            const dirs = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs(dirs);
            });

            it('should return all specified dirs', () => {
                expect(parser.getDirectories()).to.deep.equal(dirs);
            });

        });

        describe('and there were some dirs specified followed by a flag', () => {
            const dirs = ['dir1', 'dir2'];

            beforeEach(() => {
                initWithProcessArgs([...dirs, '--flag']);
            });

            it('should return only the dirs', () => {
                expect(parser.getDirectories()).to.deep.equal(dirs);
            });

        });

        describe('and there was a relative path starting with .. specified', () => {
            const argsWithPathToParentDir = ['valid-dir', '../invalid-dir'];

            beforeEach(() => {
                initWithProcessArgs(argsWithPathToParentDir);
            });

            it('should throw an "Invalid directory" error', () => {
                expect(() => parser.getDirectories()).to.throw('Invalid directory');
            });

        });

        describe('and there was an absolute path specified', () => {
            const argsWithAbsolutePath = ['valid-dir', '/absolute/path/is/invalid'];

            beforeEach(() => {
                initWithProcessArgs(argsWithAbsolutePath);
            });

            it('should throw an "Invalid directory" error', () => {
                expect(() => parser.getDirectories()).to.throw('Invalid directory');
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
                expect(parser.getIgnoredFiles()).to.deep.equal([]);
            });

        });

        describe('and there was an "--ignore" flag used without args', () => {
            const ignoreWithoutArgs = ['--ignore'];

            beforeEach(() => {
                initWithProcessArgs(ignoreWithoutArgs);
            });

            it('should throw a "Missing argument" error', () => {
                expect(() => parser.getIgnoredFiles()).to.throw('Missing argument');
            });

        });

        describe('and there was an "--ignore" flag used followed by another flag', () => {
            const ignoreFollowedByAnotherFlag = ['--ignore', '--flag'];

            beforeEach(() => {
                initWithProcessArgs(ignoreFollowedByAnotherFlag);
            });

            it('should throw a "Missing argument" error', () => {
                expect(() => parser.getIgnoredFiles()).to.throw('Missing argument');
            });

        });

        describe('and there was an "--ignore" flag used with some args', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--ignore', ...ignoredPaths]);
            });

            it('should return the args', () => {
                expect(parser.getIgnoredFiles()).to.deep.equal(ignoredPaths);
            });

        });

        describe('and there was an "--ignore" flag used with some args followed by another flag', () => {
            const ignoredPaths = ['ignored-file', 'ignored-dir'];

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--ignore', ...ignoredPaths, '--flag']);
            });

            it('should only contain the non-flag args', () => {
                expect(parser.getIgnoredFiles()).to.deep.equal(ignoredPaths);
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
                expect(parser.getConfigPath()).to.equal(undefined);
            });

        });

        describe('and there was a "--config" flag used without args', () => {
            const configWithoutArgs = ['--config'];

            beforeEach(() => {
                initWithProcessArgs(configWithoutArgs);
            });

            it('should throw a "Missing argument" error', () => {
                expect(() => parser.getConfigPath()).to.throw('Missing argument');
            });

        });

        describe('and there was a "--config" flag used followed by another flag', () => {
            const configFollowedByAnotherFlag = ['--config', '--flag'];

            beforeEach(() => {
                initWithProcessArgs(configFollowedByAnotherFlag);
            });

            it('should throw a "Missing argument" error', () => {
                expect(() => parser.getConfigPath()).to.throw('Missing argument');
            });

        });

        describe('and there was a "--config" flag used with one arg', () => {
            const configFile = 'path/to/config.json';

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--config', configFile]);
            });

            it('should return the value of the arg', () => {
                expect(parser.getConfigPath()).to.equal(configFile);
            });

        });

        describe('and there was a "--config" flag used with one arg followed by another flag', () => {
            const configFile = 'path/to/config.json';

            beforeEach(() => {
                initWithProcessArgs(['dir1', '--config', configFile, '--flag']);
            });

            it('should return the value of the arg', () => {
                expect(parser.getConfigPath()).to.equal(configFile);
            });

        });

        describe('and there was a "--config" flag used with more than one arg', () => {
            const configWithMultipleArgs = ['dir1', '--config', 'path/to/config.json', 'some-junk'];

            beforeEach(() => {
                initWithProcessArgs(configWithMultipleArgs);
            });

            it('should throw a "Wrong number of arguments" error', () => {
                expect(() => parser.getConfigPath()).to.throw('Wrong number of arguments');
            });

        });

    });

    function initWithProcessArgs(args: Array<string>): void {
        processArgvStub = sinon.stub(process, 'argv').value(['node', 'path/to/script', ...args]);
        parser = new CommandLineOptionsParser();
    }

});
