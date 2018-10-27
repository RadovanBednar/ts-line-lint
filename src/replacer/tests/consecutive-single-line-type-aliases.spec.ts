import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function consecutiveSingleLineTypeAliasesRuleTestSuite(): void {
    const inputSnippetWithBlanks = createMultilineString(
        '// non-blank line before first group',
        '',
        'export type AliasedType = type;',
        'export type AnotherAliasedType = type2;',
        '',
        '// non-blank line between groups',
        '',
        '    type IndentedAlias = type3;',
        '',
        '// non-blank line after second group',
    );
    const inputSnippetWithoutBlanks = createMultilineString(
        '// non-blank line before first group',
        'export type AliasedType = type;',
        'export type AnotherAliasedType = type2;',
        '// non-blank line between groups',
        '    type IndentedAlias = type3;',
        '// non-blank line after second group',
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
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'before');
        });

        it('should remove blank lines before each group of consecutive single line type aliases', () => {
            expectedOutput = createMultilineString(
                '// non-blank line before first group',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '',
                '// non-blank line between groups',
                '    type IndentedAlias = type3;',
                '',
                '// non-blank line after second group',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'after');
        });

        it('should remove blank lines after each group of consecutive single line type aliases', () => {
            expectedOutput = createMultilineString(
                '// non-blank line before first group',
                '',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '// non-blank line between groups',
                '',
                '    type IndentedAlias = type3;',
                '// non-blank line after second group',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'both');
        });

        it('should remove blank lines both before and after each group of consecutive single line type aliases', () => {
            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'before');
        });

        it('should insert a blank line before each group of consecutive single line type aliases', () => {
            expectedOutput = createMultilineString(
                '// non-blank line before first group',
                '',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '// non-blank line between groups',
                '',
                '    type IndentedAlias = type3;',
                '// non-blank line after second group',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'after');
        });

        it('should insert a blank line after each group of consecutive single line type aliases', () => {
            expectedOutput = createMultilineString(
                '// non-blank line before first group',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '',
                '// non-blank line between groups',
                '    type IndentedAlias = type3;',
                '',
                '// non-blank line after second group',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'both');
        });

        it('should insert blank lines both before and after each group of consecutive single line type aliases', () => {
            expectedOutput = inputSnippetWithBlanks;

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'consecutive-single-line-type-aliases': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectedOutput = createMultilineString(
                '// non-blank line before first group',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '',
                '// non-blank line between groups',
                '    type IndentedAlias = type3;',
                '',
                '// non-blank line after second group',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

}
