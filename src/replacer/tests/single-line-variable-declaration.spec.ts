import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function singleLineVariableDeclarationRuleTestSuite(): void {
    const inputSnippetWithBlanks = createMultilineString(
        '// non-blank-line',
        '',
        'var topLevelVar = "foo";',
        '',
        '// non-blank-line',
        '',
        'let topLevelLet = "foo";',
        '',
        '// non-blank-line',
        '',
        'const topLevelConst = "foo";',
        '',
        '// non-blank-line',
        '',
        '  var indentedLevelVar = "bar";',
        '',
        '// non-blank-line',
        '',
        '  let indentedLevelLet = "bar";',
        '',
        '// non-blank-line',
        '',
        '  const indentedLevelConst = "bar";',
        '',
        '// non-blank-line',
    );
    const inputSnippetWithoutBlanks = createMultilineString(
        '// non-blank-line',
        'var topLevelVar = "foo";',
        '// non-blank-line',
        'let topLevelLet = "foo";',
        '// non-blank-line',
        'const topLevelConst = "foo";',
        '// non-blank-line',
        '  var indentedLevelVar = "bar";',
        '// non-blank-line',
        '  let indentedLevelLet = "bar";',
        '// non-blank-line',
        '  const indentedLevelConst = "bar";',
        '// non-blank-line',
    );
    let expectedOutput: string;
    let config: LineLintConfig;

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'remove', 'before');
        });

        it('should remove blank lines before each single line variable declaration', () => {
            expectedOutput = createMultilineString(
                '// non-blank-line',
                'var topLevelVar = "foo";',
                '',
                '// non-blank-line',
                'let topLevelLet = "foo";',
                '',
                '// non-blank-line',
                'const topLevelConst = "foo";',
                '',
                '// non-blank-line',
                '  var indentedLevelVar = "bar";',
                '',
                '// non-blank-line',
                '  let indentedLevelLet = "bar";',
                '',
                '// non-blank-line',
                '  const indentedLevelConst = "bar";',
                '',
                '// non-blank-line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'remove', 'after');
        });

        it('should remove blank lines after each single line variable declaration', () => {
            expectedOutput = createMultilineString(
                '// non-blank-line',
                '',
                'var topLevelVar = "foo";',
                '// non-blank-line',
                '',
                'let topLevelLet = "foo";',
                '// non-blank-line',
                '',
                'const topLevelConst = "foo";',
                '// non-blank-line',
                '',
                '  var indentedLevelVar = "bar";',
                '// non-blank-line',
                '',
                '  let indentedLevelLet = "bar";',
                '// non-blank-line',
                '',
                '  const indentedLevelConst = "bar";',
                '// non-blank-line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'remove', 'both');
        });

        it('should remove blank lines both before and after each single line variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'insert', 'before');
        });

        it('should insert a blank line before each single line variable declaration', () => {
            expectedOutput = createMultilineString(
                '// non-blank-line',
                '',
                'var topLevelVar = "foo";',
                '// non-blank-line',
                '',
                'let topLevelLet = "foo";',
                '// non-blank-line',
                '',
                'const topLevelConst = "foo";',
                '// non-blank-line',
                '',
                '  var indentedLevelVar = "bar";',
                '// non-blank-line',
                '',
                '  let indentedLevelLet = "bar";',
                '// non-blank-line',
                '',
                '  const indentedLevelConst = "bar";',
                '// non-blank-line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'insert', 'after');
        });

        it('should insert a blank line after each single line variable declaration', () => {
            expectedOutput = createMultilineString(
                '// non-blank-line',
                'var topLevelVar = "foo";',
                '',
                '// non-blank-line',
                'let topLevelLet = "foo";',
                '',
                '// non-blank-line',
                'const topLevelConst = "foo";',
                '',
                '// non-blank-line',
                '  var indentedLevelVar = "bar";',
                '',
                '// non-blank-line',
                '  let indentedLevelLet = "bar";',
                '',
                '// non-blank-line',
                '  const indentedLevelConst = "bar";',
                '',
                '// non-blank-line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('single-line-variable-declaration', 'insert', 'both');
        });

        it('should insert blank lines both before and after each single line variable declaration', () => {
            expectedOutput = inputSnippetWithBlanks;

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'single-line-variable-declaration': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectedOutput = createMultilineString(
                '// non-blank-line',
                'var topLevelVar = "foo";',
                '',
                '// non-blank-line',
                'let topLevelLet = "foo";',
                '',
                '// non-blank-line',
                'const topLevelConst = "foo";',
                '',
                '// non-blank-line',
                '  var indentedLevelVar = "bar";',
                '',
                '// non-blank-line',
                '  let indentedLevelLet = "bar";',
                '',
                '// non-blank-line',
                '  const indentedLevelConst = "bar";',
                '',
                '// non-blank-line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

}
