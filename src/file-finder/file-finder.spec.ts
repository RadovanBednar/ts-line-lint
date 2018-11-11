import { expect, use as chaiUse } from 'chai';
import * as mockfs from 'mock-fs';
import { Config } from 'mock-fs';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../logger';
import { generateRandomString } from '../utils/text-utils';
import { FileFinder } from './file-finder';

chaiUse(sinonChai);

describe.only('FileFinder.find method', () => {
    let logWarningStub: sinon.SinonStub;

    beforeEach(() => {
        logWarningStub = sinon.stub(log, 'warning').callsFake(() => null);
    });

    afterEach(() => {
        mockfs.restore();
        logWarningStub.restore();
    });

    describe('when the "dirs" parameter', () => {

        describe('contains a non-existent directory name', () => {
            const realDir = 'dir';
            const madeUpDir = 'nonexistent';

            beforeEach(() => {
                mockfs({
                    [realDir]: withFiles('some-file.ts'),
                });
            });

            it('should throw error', () => {
                whenCalledWith([realDir, madeUpDir]).expectError(`Couldn't find directory "${madeUpDir}".`);
            });

        });

        describe('contains a name of a non-directory file', () => {
            const dir = 'dir';
            const file = 'not-dir.json';

            beforeEach(() => {
                mockfs({
                    [dir]: withFiles('some-file.ts'),
                    ...withFiles(file),
                });
            });

            it('should throw error', () => {
                whenCalledWith([dir, file]).expectError(`Couldn't find directory "${file}".`);
            });

        });

        describe('contains a single directory which is empty', () => {
            const dirName = 'empty';

            beforeEach(() => {
                mockfs({ [dirName]: {} });
            });

            it('should return an empty array', () => {
                whenCalledWith([dirName]).expectEmptyResult();
            });

        });

        describe('contains a single directory with some files', () => {
            const dir = 'dir';
            const tsFile1 = 'some-file.ts';
            const tsFile2 = 'some-other-file.ts';

            beforeEach(() => {
                mockfs({
                    [dir]: withFiles(tsFile1, tsFile2, 'non-ts.json'),
                });

            });

            it('should return an array of all the paths to *.ts files in this directory', () => {
                const expectedFilePaths = [
                    `${dir}/${tsFile1}`,
                    `${dir}/${tsFile2}`,
                ];
                whenCalledWith([dir]).expectResult(expectedFilePaths);
            });

        });

        describe('contains two directories with some files', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            const dir2 = 'dir2';
            const dir2tsFile = 'another-file.ts';

            beforeEach(() => {
                mockfs({
                    [dir1]: withFiles(dir1tsFile1, dir1tsFile2, 'non-ts.json'),
                    [dir2]: withFiles(dir2tsFile, 'non-ts.css'),
                });
            });

            it('should return an array of all the paths to *.ts files in these directories', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                    `${dir2}/${dir2tsFile}`,
                ];
                whenCalledWith([dir1, dir2]).expectResult(expectedFilePaths);
            });

        });

        describe('contains a single directory with some files and subdirectories with their own files', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            const dir1subdir1 = 'subdir1';
            const dir1subdir1tsFile1 = 'file-a.ts';
            const dir1subdir1tsFile2 = 'file-b.ts';
            const dir1subdir2 = 'subdir2';
            const dir1subdir2tsFile = 'another-file.ts';

            beforeEach(() => {
                mockfs({
                    [dir1]: {
                        [dir1subdir1]: withFiles(dir1subdir1tsFile1, 'non-ts.css', dir1subdir1tsFile2),
                        [dir1subdir2]: withFiles('non-ts.html', dir1subdir2tsFile),
                        ...withFiles(dir1tsFile1, dir1tsFile2, 'non-ts.json'),
                    },
                });
            });

            it('should return an array of all the paths to *.ts files in this directory and its subdirectories', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                    `${dir1}/${dir1subdir1}/${dir1subdir1tsFile1}`,
                    `${dir1}/${dir1subdir1}/${dir1subdir1tsFile2}`,
                    `${dir1}/${dir1subdir2}/${dir1subdir2tsFile}`,
                ];
                whenCalledWith([dir1]).expectResult(expectedFilePaths);
            });

        });

        describe('contains a single directory with just a subdirectory whose name ends in ".ts"', () => {
            const dir = 'dir';
            const weirdlyNamedSubdir = 'weirdly-named-subdir.ts';

            beforeEach(() => {
                mockfs({
                    [dir]: { [weirdlyNamedSubdir]: {} },
                });
            });

            it('should return an empty array', () => {
                whenCalledWith([dir]).expectEmptyResult();
            });

        });

        describe('contains the "node_modules" directory', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';

            beforeEach(() => {
                mockfs({
                    [dir1]: withFiles(dir1tsFile1, dir1tsFile2),
                    node_modules: withFiles('node-modules-file.ts'),
                });
            });

            it('should log a warning', () => {
                FileFinder.find([dir1, 'node_modules']);
                expect(log.warning).to.have.been.calledOnceWith('Skipping excluded directory "node_modules".');
            });

            it('should not have any paths from "node_modules" in the result', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                ];
                whenCalledWith([dir1, 'node_modules']).expectResult(expectedFilePaths);
            });

        });

        describe('contains a hidden directory', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            const hiddenDir = `.${generateRandomString(5)}`;
            const hiddenDirTsFile1 = 'hidden-file.ts';

            beforeEach(() => {
                mockfs({
                    [hiddenDir]: withFiles(hiddenDirTsFile1),
                    [dir1]: withFiles(dir1tsFile1, dir1tsFile2),
                });
            });

            it('should log a warning', () => {
                FileFinder.find([dir1, hiddenDir]);
                expect(log.warning).to.have.been.calledOnceWith(`Skipping hidden directory "${hiddenDir}".`);
            });

            it('should not have any paths from the hidden directory in the result', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                ];
                whenCalledWith([dir1, hiddenDir]).expectResult(expectedFilePaths);
            });

        });

        describe('contains the dot', () => {
            const rootTsFile1 = 'root-file1.ts';
            const rootTsFile2 = 'root-file2.ts';
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            const dir2 = 'dir2';
            const dir2tsFile = 'another-file.ts';

            beforeEach(() => {
                mockfs({
                    [dir1]: withFiles(dir1tsFile1, dir1tsFile2),
                    [dir2]: withFiles(dir2tsFile),
                    'node_modules': withFiles('this-will-be-skipped.ts'),
                    '.hidden': withFiles('this-will-also-be-skipped.ts'),
                    ...withFiles(rootTsFile1, rootTsFile2),
                });
            });

            it('should return paths to *.ts files in the root directory and all non-excluded subdirectories', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                    `${dir2}/${dir2tsFile}`,
                    `${rootTsFile1}`,
                    `${rootTsFile2}`,
                ];
                whenCalledWith(['.']).expectResult(expectedFilePaths);
            });

        });

    });

    describe('when the "ignorePatterns" parameter', () => {
        const srcDir = 'src';
        const srcSubdirsContent = {
            'some-folder': ['first-file.ts', 'second-file.ts', 'style.css', 'third-file.ts'],
            'some-other-folder': ['some-file.ts', 'some-other-file.ts', 'yet-another-file.ts'],
            'third-folder': ['lonely-file.ts'],
        };
        const rootFolderFiles = ['app.ts', 'index.ts', 'tsconfig.json'];
        const rootFolderTsFiles = rootFolderFiles.filter((file) => file.endsWith('.ts'));
        const allTsFilePaths = [
            ...rootFolderTsFiles,
            ...getSrcSubdirsTsFilePaths('some-folder'),
            ...getSrcSubdirsTsFilePaths('some-other-folder'),
            ...getSrcSubdirsTsFilePaths('third-folder'),
        ];

        beforeEach(() => {
            mockfs({
                '.git': {},
                'node_modules': {},
                [srcDir]: {
                    'some-folder': withFiles(...srcSubdirsContent['some-folder']),
                    'some-other-folder': withFiles(...srcSubdirsContent['some-other-folder']),
                    'third-folder': withFiles(...srcSubdirsContent['third-folder']),
                },
                ...withFiles(...rootFolderFiles),
            });
        });

        describe('is not specified', () => {

            it('should return paths to all the *.ts files in specified directories', () => {
                whenCalledWith(['.']).expectResult(allTsFilePaths);
            });

        });

        describe('is an empty array', () => {

            it('should return paths to all the *.ts files in specified dirs', () => {
                whenCalledWith(['.'], []).expectResult(allTsFilePaths);
            });

        });

        describe('is an array containing a file path', () => {
            const ignoredFile = 'src/some-folder/second-file.ts';
            const expectedResult = allTsFilePaths.filter((file) => file !== ignoredFile);

            it('should return paths to all the *.ts files in specified dirs except the ignored one', () => {
                whenCalledWith(['.'], [ignoredFile]).expectResult(expectedResult);
            });

        });

        describe('is an array containing two file paths', () => {
            const ignoredFile1 = 'src/some-folder/second-file.ts';
            const ignoredFile2 = 'src/some-folder/second-file.ts';
            const expectedResult = allTsFilePaths
                .filter((file) => file !== ignoredFile1 && file !== ignoredFile2);

            it('should return paths to all the *.ts files in specified dirs except the ignored ones', () => {
                whenCalledWith(['.'], [ignoredFile1, ignoredFile2]).expectResult(expectedResult);
            });

        });

        describe('is an array containing a directory path', () => {
            const ignoredDir = 'src/some-other-folder';

            it('should return paths to all the *.ts files in specified dirs except those from the ignored dir', () => {
                whenCalledWith(['.'], [ignoredDir]).expectResult([
                    ...rootFolderTsFiles,
                    ...getSrcSubdirsTsFilePaths('some-folder'),
                    ...getSrcSubdirsTsFilePaths('third-folder'),
                ]);
            });

        });

        describe('is an array containing a file path and a directory path', () => {
            const ignoredFile = 'src/third-folder/lonely-file.ts';
            const ignoredDir = 'src/some-other-folder';

            it('should return paths to all the *.ts files in specified dirs except the ignored file \
and all files from the ignored dir', () => {
                    whenCalledWith(['.'], [ignoredFile, ignoredDir]).expectResult([
                        ...rootFolderTsFiles,
                        ...getSrcSubdirsTsFilePaths('some-folder'),
                    ]);
                });

        });

        function getSrcSubdirsTsFilePaths(subdir: keyof typeof srcSubdirsContent): Array<string> {
            return srcSubdirsContent[subdir]
                .filter((file) => file.endsWith('.ts'))
                .map((file) => `${srcDir}/${subdir}/${file}`);
        }

    });

});

function withFiles(...fileNames: Array<string>): Config {
    const mockDir: Config = {};
    fileNames.forEach((file) => {
        mockDir[file] = '';
    });
    return mockDir;
}

// tslint:disable-next-line:typedef
function whenCalledWith(dirNames: Array<string>, ignorePatterns?: Array<string>) {
    return {
        expectEmptyResult(): void {
            expect(FileFinder.find(dirNames, ignorePatterns)).to.deep.equal([]);
        },
        expectResult(filePaths: Array<string>): void {
            expect(FileFinder.find(dirNames, ignorePatterns)).to.deep.equal(filePaths);
        },
        expectError(message: string): void {
            expect(() => FileFinder.find(dirNames, ignorePatterns)).to.throw(message);
        },
    };
}
