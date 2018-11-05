import { IndentType, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectLinterWithConfig } from './linter-expects';
import { createEmptyMockConfig, createIndentString, createMockConfig } from './linter-test-utils';

export function unitTestDescribeRuleTestSuite(indent: IndentType): void {
    let config: LineLintConfig;
    const noBlanksAround = createSnippetWithNoBlanksAroundDescribes();
    const blanksAround = createSnippetWithBlanksAroundDescribes();
    const blanksOnlyAfter = createSnippetWithBlanksOnlyAfterDescribes();
    const blanksOnlyBefore = createSnippetWithBlanksOnlyBeforeDescribes();

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

        it('should remove blank lines before each describe block', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'after', indent);
        });

        it('should remove blank lines after each describe block', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'remove', 'both', indent);
        });

        it('should remove blank lines both before and after each describe block', () => {
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

        it('should insert a blank line before each describe block', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'after', indent);
        });

        it('should insert a blank line after each describe block', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-describe-block', 'insert', 'both', indent);
        });

        it('should insert blank lines both before and after each describe block', () => {
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

    function createIndentedSnippetWithPlaceholderBlanks(): string {
        const ind = createIndentString(indent);
        return createMultilineString(
            '// non-blank line',
            '%BLANK_BEFORE%',
            'describe("top-level test suite", () => {',
            '  // tests',
            '});',
            '%BLANK_AFTER%',
            '// non-blank line',
            '%BLANK_BEFORE%',
            'describe("another top-level test suite", () => {',
            '%BLANK_BEFORE%',
            ind + 'describe("first level nested test suite", () => {',
            '%BLANK_BEFORE%',
            ind + ind + 'describe("second level nested test suite", () => {',
            '%BLANK_BEFORE%',
            ind + ind + ind + 'describe("third level nested test suite", () => {',
            ind + ind + ind + ind + '// tests',
            ind + ind + ind + ind + '',
            ind + ind + ind + ind + '// more tests',
            ind + ind + ind + '});',
            '%BLANK_AFTER%',
            ind + ind + '});',
            '%BLANK_AFTER%',
            ind + '});',
            '%BLANK_AFTER%',
            ind + '// non-blank line',
            '%BLANK_BEFORE%',
            ind + 'describe("another first level nested test suite", () => {',
            ind + ind + '// tests',
            ind + '});',
            '%BLANK_AFTER%',
            '});',
            '%BLANK_AFTER%',
            '// non-blank line',
        );
    }

    function createSnippetWithNoBlanksAroundDescribes(): string {
        return createIndentedSnippetWithPlaceholderBlanks()
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

    function createSnippetWithBlanksAroundDescribes(): string {
        return createIndentedSnippetWithPlaceholderBlanks()
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

    function createSnippetWithBlanksOnlyAfterDescribes(): string {
        return createIndentedSnippetWithPlaceholderBlanks()
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

    function createSnippetWithBlanksOnlyBeforeDescribes(): string {
        return createIndentedSnippetWithPlaceholderBlanks()
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

}
