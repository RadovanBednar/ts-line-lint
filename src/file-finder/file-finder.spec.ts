import { expect, use as chaiUse } from 'chai';
import * as mockfs from 'mock-fs';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { log } from '../logger';
import { FileFinder } from './file-finder';

chaiUse(sinonChai);

describe('FileFinder.find method', () => {
    // beforeEach(setMockFileStructure);

    afterEach(mockfs.restore);

    describe('when the "dirs" parameter', () => {

        describe('contains a non-existent directory name', () => {
            const dirName = 'nonexistent';

            beforeEach(() => {
                mockfs({ src: { 'some-file.ts': '' } });
            });

            it('should throw error', () => {
                whenCalledWith(['src', dirName]).expectError(`Couldn't find directory "${dirName}".`);
            });

        });

        describe('contains a name of a non-directory file', () => {
            const fileName = 'not-dir.json';

            beforeEach(() => {
                mockfs({
                    src: { 'some-file.ts': '' },
                    [fileName]: '',
                });
            });

            it('should throw error', () => {
                whenCalledWith(['src', fileName]).expectError(`File "${fileName}" is not a directory.`);
            });

        });

        describe('contains just an empty directory', () => {
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
                    [dir]: {
                        [tsFile1]: '',
                        [tsFile2]: '',
                        'non-ts.json': '',
                    },
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
                    [dir1]: {
                        [dir1tsFile1]: '',
                        [dir1tsFile2]: '',
                        'non-ts.json': '',
                    },
                    [dir2]: {
                        [dir2tsFile]: '',
                        'non-ts.css': '',
                    },
                });
            });

            it('should return an array of all the paths to *.ts files in both these directories', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                    `${dir2}/${dir2tsFile}`,
                ];
                whenCalledWith([dir1, dir2]).expectResult(expectedFilePaths);
            });

        });

        describe('contains a directory with some files and subdirectories with their own files', () => {
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
                        [dir1subdir1]: {
                            [dir1subdir1tsFile1]: '',
                            'non-ts.css': '',
                            [dir1subdir1tsFile2]: '',
                        },
                        [dir1subdir2]: {
                            'non-ts.html': '',
                            [dir1subdir2tsFile]: '',
                        },
                        [dir1tsFile1]: '',
                        [dir1tsFile2]: '',
                        'non-ts.json': '',
                    },
                });
            });

            it('should return an array of all the paths to *.ts files in both these directories', () => {
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
                mockfs({ [dir]: { [weirdlyNamedSubdir]: {} } });
            });

            it('should return an empty array', () => {
                whenCalledWith([dir]).expectEmptyResult();
            });

        });

        describe('contains the "node_modules" directory', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            let foundFiles: Array<string>;
            let logStub: sinon.SinonStub;

            beforeEach(() => {
                mockfs({
                    node_modules: { 'node-modules-file.ts': '' },
                    [dir1]: {
                        [dir1tsFile1]: '',
                        [dir1tsFile2]: '',
                    },
                });
                logStub = sinon.stub(log, 'warning').callsFake(() => null);
                foundFiles = FileFinder.find([dir1, 'node_modules']);
            });

            afterEach(() => {
                logStub.restore();
            });

            it('should log a warning', () => {
                expect(log.warning).to.have.been.calledOnceWith('Skipping excluded directory "node_modules".');
            });

            it('should not return any paths from "node_modules"', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                ];
                expect(foundFiles).to.deep.equal(expectedFilePaths);
            });

        });

        describe('contains a hidden directory', () => {
            const dir1 = 'dir1';
            const dir1tsFile1 = 'file1.ts';
            const dir1tsFile2 = 'file2.ts';
            const hiddenDir = `.${generateRandomString(5)}`;
            const hiddenDirTsFile1 = 'hidden-file.ts';
            let foundFiles: Array<string>;
            let logStub: sinon.SinonStub;

            beforeEach(() => {
                mockfs({
                    [hiddenDir]: { [hiddenDirTsFile1]: '' },
                    [dir1]: {
                        [dir1tsFile1]: '',
                        [dir1tsFile2]: '',
                    },
                });
                logStub = sinon.stub(log, 'warning').callsFake(() => null);
                foundFiles = FileFinder.find([dir1, hiddenDir]);
            });

            afterEach(() => {
                logStub.restore();
            });

            it('should log a warning', () => {
                expect(log.warning).to.have.been.calledOnceWith(`Skipping hidden directory "${hiddenDir}".`);
            });

            it('shshould not return any paths from the hidden directory', () => {
                const expectedFilePaths = [
                    `${dir1}/${dir1tsFile1}`,
                    `${dir1}/${dir1tsFile2}`,
                ];
                expect(foundFiles).to.deep.equal(expectedFilePaths);
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
                    [dir1]: {
                        [dir1tsFile1]: '',
                        [dir1tsFile2]: '',
                    },
                    [dir2]: {
                        [dir2tsFile]: '',
                    },
                    [rootTsFile1]: '',
                    [rootTsFile2]: '',
                });
            });

            it('should return an array of all the paths to *.ts files in the root directory and all subdirectories', () => {
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
    //
    // describe('when the "ignore" parameter', () => {
    //     const someFolderTsFiles = [
    //         'src/some-folder/first-file.ts',
    //         'src/some-folder/second-file.ts',
    //         'src/some-folder/third-file.ts',
    //     ];
    //     const someOtherFolderTsFiles = [
    //         'src/some-other-folder/some-file.ts',
    //         'src/some-other-folder/some-other-file.ts',
    //         'src/some-other-folder/yet-another-file.ts',
    //     ];
    //     const thirdFolderTsFile = 'src/third-folder/lonely-file.ts';
    //     const allSrcTsFiles = [...someFolderTsFiles, ...someOtherFolderTsFiles, thirdFolderTsFile];
    //
    //     describe('is not specified', () => {
    //
    //         it('should return an array of all the *.ts files', () => {
    //             expect(FileFinder.find(['src'])).to.deep.equal(allSrcTsFiles);
    //         });
    //
    //     });
    //
    //     describe('is an empty array', () => {
    //
    //         it('should return an array of all the *.ts files', () => {
    //             expect(FileFinder.find(['src'], [])).to.deep.equal(allSrcTsFiles);
    //         });
    //
    //     });
    //
    //     describe('is an array containing a file path', () => {
    //         const ignoredFile = 'src/some-folder/second-file.ts';
    //         const expectedArray = allSrcTsFiles.filter((file) => file !== ignoredFile);
    //
    //         it('should return an array of all the *.ts files except for the ignored one', () => {
    //             expect(FileFinder.find(['src'], [ignoredFile])).to.deep.equal(expectedArray);
    //         });
    //
    //     });
    //
    //     describe('is an array containing two file paths', () => {
    //         const ignoredFile1 = 'src/some-folder/second-file.ts';
    //         const ignoredFile2 = 'src/some-folder/second-file.ts';
    //         const expectedArray = allSrcTsFiles.filter((file) => file !== ignoredFile1 && file !== ignoredFile2);
    //
    //         it('should return an array of all the *.ts files except for the two ignored ones', () => {
    //             expect(FileFinder.find(['src'], [ignoredFile1, ignoredFile2])).to.deep.equal(expectedArray);
    //         });
    //
    //     });
    //
    //     describe('is an array containing a directory path', () => {
    //         const ignoredDir = 'src/some-other-folder';
    //         const expectedArray = [...someFolderTsFiles, thirdFolderTsFile];
    //
    //         it('should return an array of all the *.ts files except for those from the ignored directory', () => {
    //             expect(FileFinder.find(['src'], [ignoredDir])).to.deep.equal(expectedArray);
    //         });
    //
    //     });
    //
    //     describe('is an array containing a file path and a directory path', () => {
    //         const ignoredDir = 'src/some-other-folder';
    //
    //         it('should return an array of all the *.ts files except for the ignored file \
    //         and all those from the ignored directory', () => {
    //                 expect(FileFinder.find(['src'], [thirdFolderTsFile, ignoredDir])).to.deep.equal(someFolderTsFiles);
    //             });
    //
    //     });

});

// tslint:disable-next-line:typedef
function whenCalledWith(dirNames: Array<string>) {
    return {
        expectEmptyResult(): void {
            expect(FileFinder.find(dirNames)).to.deep.equal([]);
        },
        expectResult(filePaths: Array<string>): void {
            expect(FileFinder.find(dirNames)).to.deep.equal(filePaths);
        },
        expectError(message: string): void {
            expect(() => FileFinder.find(dirNames)).to.throw(message);
        },
    };
}

function generateRandomString(length: number): string {
    return (+new Date() * Math.random()).toString(36).substring(0, length);
}

function setMockFileStructure(): void {
    mockfs({
        '.git': {},
        'e2e': { 'e2e-test.spec.ts': '' },
        'node_modules': {},
        'src': {
            'some-folder': {
                'first-file.ts': 'import {...} ...',
                'second-file.ts': 'import {...} ...',
                'style.css': 'div {...}',
                'third-file.ts': 'import {...} ...',
            },
            'some-other-folder': {
                'some-file.ts': 'import {...} ...',
                'some-other-file.ts': 'import {...} ...',
                'yet-another-file.ts': 'import {...} ...',
            },
            'third-folder': {
                'lonely-file.ts': 'import {...} ...',
            },
        },
        'index.ts': 'import {...} ...',
        'tsconfig.json': '...',
    });
}
