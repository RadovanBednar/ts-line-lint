import { IndentType, LineLintConfig } from '../../config/line-lint-config';
import { IndentSpecificRuleName } from '../rules';
import { createEmptyMockConfig, createMockConfig, expectLinterWithConfig, getPatternDescription } from './linter-test-utils';
import { IndentSpecificSnippetFactory } from './snippet-factory/indent-specific-snippet-factory';

export function indentSpecificRuleTestSuite(ruleName: IndentSpecificRuleName, indent: IndentType): void {
    const snippetFactory = new IndentSpecificSnippetFactory(ruleName, indent);
    const noBlanksAround = snippetFactory.createSnippetWithNoBlanksAround();
    const blanksAround = snippetFactory.createSnippetWithBlanksAround();
    const blanksOnlyAfter = snippetFactory.createSnippetWithBlanksOnlyAfter();
    const blanksOnlyBefore = snippetFactory.createSnippetWithBlanksOnlyBefore();
    const patternDescription = getPatternDescription(ruleName);
    let config: LineLintConfig;

    describe('is not specified', () => {

        beforeEach(() => {
            config = createEmptyMockConfig(indent);
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'none', indent);
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'before', indent);
        });

        it(`should remove blank lines before each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'after', indent);
        });

        it(`should remove blank lines after each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'both', indent);
        });

        it(`should remove blank lines both before and after each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'none', indent);
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'before', indent);
        });

        it(`should insert a blank line before each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'after', indent);
        });

        it(`should insert a blank line after each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'both', indent);
        });

        it(`should insert blank lines both before and after each ${patternDescription}`, () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                indent: indent,
                rules: { 'unit-test-describe-block': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
