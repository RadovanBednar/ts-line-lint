import { createMultilineString } from '../../utils/text-utils';
import { expectLinterToConvert } from './linter-test-utils';

export function cleanupTestSuite(): void {
    let inputSnippet: string;
    let expectedOutput: string;

    it('should remove empty lines after tslint:disable-next-line comment', () => {
        inputSnippet = createMultilineString(
            '// tslint:disable-next-line:typedef',
            '',
            'function someUntypeableFunction(params: any) {',
            '  // implementation',
            '}',
            '',
            '  /* tslint:disable-next-line:typedef */',
            '',
            '  public someUntypeableNestedMethod(params: any) {',
            '    // implementation',
            '  }',
            ''
        );
        expectedOutput = createMultilineString(
            '// tslint:disable-next-line:typedef',
            'function someUntypeableFunction(params: any) {',
            '  // implementation',
            '}',
            '',
            '  /* tslint:disable-next-line:typedef */',
            '  public someUntypeableNestedMethod(params: any) {',
            '    // implementation',
            '  }',
            ''
        );

        expectLinterToConvert(inputSnippet).to(expectedOutput);
    });

    it('should remove empty lines from the beginning of a file', () => {
        inputSnippet = createMultilineString(
            '',
            '',
            'function bar() {',
            '}',
            ''
        );
        expectedOutput = createMultilineString(
            'function bar() {',
            '}',
            ''
        );

        expectLinterToConvert(inputSnippet).to(expectedOutput);
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
            ''
        );
        expectedOutput = createMultilineString(
            'const foo = 666;',
            '',
            'function bar() {',
            '}',
            '',
            'function baz(param: type): type {',
            '}',
            ''
        );

        expectLinterToConvert(inputSnippet).to(expectedOutput);
    });

    it('should replace multiple trailing blank lines with a single one', () => {
        inputSnippet = createMultilineString(
            'function baz(param: type): type {',
            '}',
            '',
            ''
        );
        expectedOutput = createMultilineString(
            'function baz(param: type): type {',
            '}',
            ''
        );

        expectLinterToConvert(inputSnippet).to(expectedOutput);
    });

}
