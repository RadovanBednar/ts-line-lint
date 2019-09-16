import { expect, use as chaiUse } from 'chai';
import * as realFs from 'fs';
import * as mockFs from 'mock-fs';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { ILinter } from '../linter/linter';
import { FileProcessor } from './file-processor';

chaiUse(sinonChai);

describe('FileProcessor', () => {
    const lintMethodStub = sinon.stub();
    const mockLinter: ILinter = { lint: lintMethodStub };
    let fileProcessor: FileProcessor;

    beforeEach(() => {
        fileProcessor = new FileProcessor(mockLinter);
    });

    describe('when instantiated', () => {

        it('should have its modified counter at zero', () => {
            expect(fileProcessor.getModified()).to.equal(0);
        });

    });

    describe('when asked to process a file', () => {
        const fileName1 = 'some-file.ts';
        const fileName2 = 'some-otherfile.ts';
        const originalFileContent = 'original file content';

        beforeEach(() => {
            mockFs({
                [fileName1]: mockFs.file({ content: originalFileContent }),
                [fileName2]: 'irrelevant file content',
            });
        });

        afterEach(mockFs.restore);

        it('should call linter\'s lint method with the file\'s content', () => {
            fileProcessor.process(fileName1);

            expect(mockLinter.lint).to.have.been.calledWith(originalFileContent);
        });

        describe('and linter returns the same content', () => {
            let originalMtime: Date;

            beforeEach(() => {
                originalMtime = realFs.statSync(fileName1).mtime;
                lintMethodStub.returns(originalFileContent);
                fileProcessor.process(fileName1);
            });

            it('should not modify the file', () => {
                expectFile(fileName1).toHaveContent(originalFileContent);
                expectFile(fileName1).toHaveModificationTime(originalMtime);
            });

            it('should not increment its modified counter', () => {
                expect(fileProcessor.getModified()).to.equal(0);
            });

        });

        describe('and linter returns modified content', () => {
            const newFileContent = 'changed file content';

            beforeEach(() => {
                lintMethodStub.returns(newFileContent);
                fileProcessor.process(fileName1);
            });

            it('should rewrite the file with the new content', () => {
                expectFile(fileName1).toHaveContent(newFileContent);
            });

            it('should increment its modified counter for each modified file', () => {
                expect(fileProcessor.getModified()).to.equal(1);
                fileProcessor.process(fileName2);
                expect(fileProcessor.getModified()).to.equal(2);
            });

        });

    });

});

// tslint:disable-next-line:typedef
function expectFile(fileName: string) {
    return {
        toHaveContent(content: string): void {
            expect(realFs.readFileSync(fileName, 'utf-8')).to.equal(content);
        },
        toHaveModificationTime(mtime: Date): void {
            expect(realFs.statSync(fileName).mtime).to.deep.equal(mtime);
        },
    };
}
