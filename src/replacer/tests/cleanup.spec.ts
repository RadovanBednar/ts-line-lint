import { expectReplacerToConvert } from './replacer-expects';
import { createMultilineString } from '../../utils/text-utils';

export function cleanupTestSuite() {
    let inputSnippet: string;
    let expectedOutput: string;

    it('should remove empty lines from the beginning of a file', () => {
        inputSnippet = createMultilineString(
            '',
            '',
            'function bar() {',
            '}',
            '',
        );
        expectedOutput = createMultilineString(
            'function bar() {',
            '}',
            '',
        );

        expectReplacerToConvert(inputSnippet).to(expectedOutput);
    });

    it('should replace multiple consecutive blank lines with a single one', () => {
        inputSnippet = createMultilineString(
            'const foo = 666;',
            '',
            '',
            'function bar() {',
            '}',
            '',
            '',
            'function baz(param: type): type {',
            '}',
            '',
        );
        expectedOutput = createMultilineString(
            'const foo = 666;',
            '',
            'function bar() {',
            '}',
            '',
            'function baz(param: type): type {',
            '}',
            '',
        );

        expectReplacerToConvert(inputSnippet).to(expectedOutput);
    });

    it('should replace multiple trailing blank lines with a single one', () => {
        inputSnippet = createMultilineString(
            'function baz(param: type): type {',
            '}',
            '',
            '',
        );
        expectedOutput = createMultilineString(
            'function baz(param: type): type {',
            '}',
            '',
        );

        expectReplacerToConvert(inputSnippet).to(expectedOutput);
    });

}
