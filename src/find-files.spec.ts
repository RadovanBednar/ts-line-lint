import * as fs from 'mock-fs';
import { expect } from 'chai';
import { findFiles } from './find-files';

describe('findFiles function', () => {

    beforeEach(setMockFileStructure);

    afterEach(fs.restore);

    describe('when the "ignore" parameter', () => {
        const someFolderTsFiles = [
            'src/some-folder/first-file.ts',
            'src/some-folder/second-file.ts',
            'src/some-folder/third-file.ts'
        ];
        const someOtherFolderTsFiles = [
            'src/some-other-folder/another-file.ts',
            'src/some-other-folder/some-file.ts',
            'src/some-other-folder/yet-another-file.ts'
        ];
        const thirdFolderTsFile = 'src/third-folder/lonely-file.ts';
        const allSrcTsFiles = [...someFolderTsFiles, ...someOtherFolderTsFiles, thirdFolderTsFile];

        describe('is not specified', () => {

            it('should return an array of all the *.ts files', () => {
                expect(findFiles(['src'])).to.deep.equal(allSrcTsFiles);
            });

        });

        describe('is an empty array', () => {

            it('should return an array of all the *.ts files', () => {
                expect(findFiles(['src'], [])).to.deep.equal(allSrcTsFiles);
            });

        });

        describe('is an array containing a file path', () => {
            const ignoredFile = 'src/some-folder/second-file.ts';
            const expectedArray = allSrcTsFiles.filter((file) => file !== ignoredFile);

            it('should return an array of all the *.ts files except for the ignored one', () => {
                expect(findFiles(['src'], [ignoredFile])).to.deep.equal(expectedArray);
            });

        });

        describe('is an array containing two file paths', () => {
            const ignoredFile1 = 'src/some-folder/second-file.ts';
            const ignoredFile2 = 'src/some-folder/second-file.ts';
            const expectedArray = allSrcTsFiles.filter((file) => file !== ignoredFile1 && file !== ignoredFile2);

            it('should return an array of all the *.ts files except for the two ignored ones', () => {
                expect(findFiles(['src'], [ignoredFile1, ignoredFile2])).to.deep.equal(expectedArray);
            });

        });

        describe('is an array containing a directory path', () => {
            const ignoredDir = 'src/some-other-folder';
            const expectedArray = [...someFolderTsFiles, thirdFolderTsFile];

            it('should return an array of all the *.ts files except for those from the ignored directory', () => {
                expect(findFiles(['src'], [ignoredDir])).to.deep.equal(expectedArray);
            });

        });

        describe('is an array containing a file path and a directory path', () => {
            const ignoredDir = 'src/some-other-folder';

            it('should return an array of all the *.ts files except for the ignored file and all those from the ignored directory', () => {
                expect(findFiles(['src'], [thirdFolderTsFile, ignoredDir])).to.deep.equal(someFolderTsFiles);
            });

        });

    });

});

function setMockFileStructure() {
    fs({
        'src': {
            'some-folder': {
                'first-file.ts': 'import {...} ...',
                'second-file.ts': 'import {...} ...',
                'third-file.ts': 'import {...} ...',
                'style.css': 'div {...}',
            },
            'some-other-folder': {
                'some-file.ts': 'import {...} ...',
                'another-file.ts': 'import {...} ...',
                'yet-another-file.ts': 'import {...} ...',
            },
            'third-folder': {
                'lonely-file.ts': 'import {...} ...',
            }
        }
    });
}
