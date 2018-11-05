import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectLinterWithConfig } from './linter-expects';
import { createMockConfig } from './linter-test-utils';

export function consecutiveSingleLineTypeAliasesRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        '// non-blank line',
        'export type AliasedType = type;',
        'export type AnotherAliasedType = type2;',
        '// non-blank line',
        '    type IndentedAlias = type3;',
        '// non-blank line',
    );
    const blanksAround = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1\n').slice(1, -1);
    const blanksOnlyAfter = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1').slice(1);
    const blanksOnlyBefore = noBlanksAround.replace(/(\/\/ non-blank line)/g, '$1\n').slice(0, -1);

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'before');
        });

        it('should remove blank lines before each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'after');
        });

        it('should remove blank lines after each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'remove', 'both');
        });

        it('should remove blank lines both before and after each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'before');
        });

        it('should insert a blank line before each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'after');
        });

        it('should insert a blank line after each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-single-line-type-aliases', 'insert', 'both');
        });

        it('should insert blank lines both before and after each group of consecutive single line type aliases', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
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
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
