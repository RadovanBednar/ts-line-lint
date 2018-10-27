import { expect } from 'chai';
import { CommandLineOptions, parseProcessArgv } from './parse-process-argv';

process.env.NODE_ENV = 'test';

describe('parseProcessArgv function', () => {

    describe('directories array', () => {
        const onlyCurrentDirectory = ['.'];

        describe('when there were no args specified', () => {

            it('should contain only the current directory', () => {
                whenCalledWith([]).expect('directories').toEqual(onlyCurrentDirectory);
            });

        });

        describe('when the first arg was a flag', () => {
            const flagAtTheBeginning = ['--flag'];

            it('should contain only the current directory', () => {
                whenCalledWith(flagAtTheBeginning).expect('directories').toEqual(onlyCurrentDirectory);
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

            it('should throw a "Missing arguments" error', () => {
                whenCalledWith(ignoreWithoutArgs).expectError('Missing arguments');
            });

        });

        describe('when there was an "--ignore" flag used followed by another flag', () => {
            const ignoreFollowedByAnotherFlag = ['--ignore', '--flag'];

            it('should throw a "Missing arguments" error', () => {
                whenCalledWith(ignoreFollowedByAnotherFlag).expectError('Missing arguments');
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

});

function whenCalledWith(args: Array<string>) {
    return {
        expect(property: keyof CommandLineOptions) {
            return {
                toEqual(value: Array<string>) {
                    expect(parseProcessArgv(args)[property]).to.deep.equal(value);
                },
            };
        },
        expectError(message: string) {
            expect(() => parseProcessArgv(args)).to.throw(message);
        },
    };
}
