import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function individualMultilineTypeAliasRuleTestSuite(): void {
    const inputSnippetWithBlanks = createMultilineString(
        '// preceding non-blank line',
        '',
        'export type ExtendedType<T> = T & {',
        '  [P in keyof T]: T[P] & BaseType<T>;',
        '};',
        '',
        'export type UnionType =',
        '  SomeType |',
        '  AnotherType;',
        '',
        '// following non-blank line',
    );
    const inputSnippetWithoutBlanks = createMultilineString(
        '// preceding non-blank line',
        'export type ExtendedType<T> = T & {',
        '  [P in keyof T]: T[P] & BaseType<T>;',
        '};',
        'export type UnionType =',
        '  SomeType |',
        '  AnotherType;',
        '// following non-blank line',
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
            config = createMockConfig('individual-multiline-type-alias', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'remove', 'before');
        });

        it('should remove blank lines before each individual multiline type alias', () => {
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                'export type ExtendedType<T> = T & {',
                '  [P in keyof T]: T[P] & BaseType<T>;',
                '};',
                'export type UnionType =',
                '  SomeType |',
                '  AnotherType;',
                '',
                '// following non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'remove', 'after');
        });

        it('should remove blank lines after each individual multiline type alias', () => {
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'export type ExtendedType<T> = T & {',
                '  [P in keyof T]: T[P] & BaseType<T>;',
                '};',
                'export type UnionType =',
                '  SomeType |',
                '  AnotherType;',
                '// following non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'remove', 'both');
        });

        it('should remove blank lines both before and after each individual multiline type alias', () => {
            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'insert', 'before');
        });

        it('should insert a blank line before each individual multiline type alias', () => {
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'export type ExtendedType<T> = T & {',
                '  [P in keyof T]: T[P] & BaseType<T>;',
                '};',
                '',
                'export type UnionType =',
                '  SomeType |',
                '  AnotherType;',
                '// following non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'insert', 'after');
        });

        it('should insert a blank line after each individual multiline type alias', () => {
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                'export type ExtendedType<T> = T & {',
                '  [P in keyof T]: T[P] & BaseType<T>;',
                '};',
                '',
                'export type UnionType =',
                '  SomeType |',
                '  AnotherType;',
                '',
                '// following non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-multiline-type-alias', 'insert', 'both');
        });

        it('should insert blank lines both before and after each individual multiline type alias', () => {
            expectedOutput = inputSnippetWithBlanks;

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has options "remove: after, insert: before"', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'individual-multiline-type-alias': { remove: 'before', insert: 'after' } },
            };
        });

        it('should first remove all blank lines before and \
        then insert one blank line after each individual multiline type alias', () => {
                expectedOutput = createMultilineString(
                    '// preceding non-blank line',
                    'export type ExtendedType<T> = T & {',
                    '  [P in keyof T]: T[P] & BaseType<T>;',
                    '};',
                    '',
                    'export type UnionType =',
                    '  SomeType |',
                    '  AnotherType;',
                    '',
                    '// following non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
            });

    });

}
