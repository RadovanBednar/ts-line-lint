import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectLinterWithConfig } from './linter-expects';
import { createMockConfig } from './linter-test-utils';

export function blockPaddingRuleTestSuite(): void {
    const inputSnippetWithBlanks = createMultilineString(
        'const objectLiteral = {',
        '',
        '  foo: "bar",',
        '  baz: "foo",',
        '',
        '};',
        '',
        '  function indentedFunction() {',
        '',
        '    const foo = "foo";',
        '',
        '    return foo + "bar";',
        '',
        '  }',
        '',
    );
    const inputSnippetWithoutBlanks = createMultilineString(
        'const objectLiteral = {',
        '  foo: "bar",',
        '  baz: "foo",',
        '};',
        '',
        '  function indentedFunction() {',
        '    const foo = "foo";',
        '',
        '    return foo + "bar";',
        '  }',
        '',
    );
    let expectedOutput: string;
    let config: LineLintConfig;

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'remove', 'before');
        });

        it('should remove blank lines at the beginning of each block', () => {
            expectedOutput = createMultilineString(
                'const objectLiteral = {',
                '  foo: "bar",',
                '  baz: "foo",',
                '',
                '};',
                '',
                '  function indentedFunction() {',
                '    const foo = "foo";',
                '',
                '    return foo + "bar";',
                '',
                '  }',
                '',
            );

            expectLinterWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'remove', 'after');
        });

        it('should remove blank lines at the end of each block', () => {
            expectedOutput = createMultilineString(
                'const objectLiteral = {',
                '',
                '  foo: "bar",',
                '  baz: "foo",',
                '};',
                '',
                '  function indentedFunction() {',
                '',
                '    const foo = "foo";',
                '',
                '    return foo + "bar";',
                '  }',
                '',
            );

            expectLinterWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'remove', 'both');
        });

        it('should remove blank lines both at the beginning and at the end of each block', () => {
            expectLinterWithConfig(config).toConvert(inputSnippetWithBlanks).to(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'insert', 'before');
        });

        it('should insert a blank line to the beginning of each block', () => {
            expectedOutput = createMultilineString(
                'const objectLiteral = {',
                '',
                '  foo: "bar",',
                '  baz: "foo",',
                '};',
                '',
                '  function indentedFunction() {',
                '',
                '    const foo = "foo";',
                '',
                '    return foo + "bar";',
                '  }',
                '',
            );

            expectLinterWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'insert', 'after');
        });

        it('should insert a blank line to the end of each block', () => {
            expectedOutput = createMultilineString(
                'const objectLiteral = {',
                '  foo: "bar",',
                '  baz: "foo",',
                '',
                '};',
                '',
                '  function indentedFunction() {',
                '    const foo = "foo";',
                '',
                '    return foo + "bar";',
                '',
                '  }',
                '',
            );

            expectLinterWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('block-padding', 'insert', 'both');
        });

        it('should insert blank lines both to the beginning and to the end of each block', () => {
            expectedOutput = inputSnippetWithBlanks;

            expectLinterWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'block-padding': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectedOutput = createMultilineString(
                'const objectLiteral = {',
                '  foo: "bar",',
                '  baz: "foo",',
                '',
                '};',
                '',
                '  function indentedFunction() {',
                '    const foo = "foo";',
                '',
                '    return foo + "bar";',
                '',
                '  }',
                '',
            );

            expectLinterWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

}
