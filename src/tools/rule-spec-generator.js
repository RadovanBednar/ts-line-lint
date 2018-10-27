const fs = require('fs');
const rule = process.argv[2];
const snippetDesc = process.argv[3];

if (!rule) {
    console.log("No rule specified. Terminating.");
    process.exit(1);
}

if (!snippetDesc) {
    console.log("No snippet description specified. Terminating.");
    process.exit(1);
}

const ruleCamel = rule[0] + rule.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join('').slice(1);
const specTemplate = `import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function %RULE_NAME_CAMEL_CASE%RuleTestSuite(): void {
    const inputSnippetWithBlanks = createMultilineString(
        // REPLACE THIS MANUALLY
    );
    const inputSnippetWithoutBlanks = createMultilineString(
        // REPLACE THIS MANUALLY
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
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'before');
        });

        it('should remove blank lines before each %SNIPPET_DESC%', () => {
            expectedOutput = createMultilineString(
                // REPLACE THIS MANUALLY
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'after');
        });

        it('should remove blank lines after each %SNIPPET_DESC%', () => {
            expectedOutput = createMultilineString(
                // REPLACE THIS MANUALLY
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'both');
        });

        it('should remove blank lines both before and after each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithBlanks);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippetWithoutBlanks);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'before');
        });

        it('should insert a blank line before each %SNIPPET_DESC%', () => {
            expectedOutput = createMultilineString(
                // REPLACE THIS MANUALLY
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'after');
        });

        it('should insert a blank line after each %SNIPPET_DESC%', () => {
            expectedOutput = createMultilineString(
                // REPLACE THIS MANUALLY
            );

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'both');
        });

        it('should insert blank lines both before and after each %SNIPPET_DESC%', () => {
            expectedOutput = inputSnippetWithBlanks;

            expectReplacerWithConfig(config).toConvert(inputSnippetWithoutBlanks).to(expectedOutput);
        });

    });

    describe('has options "remove: after, insert: before"', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { '%RULE_NAME_KEBAB_CASE%': { remove: 'before', insert: 'after' } },
            };
        });

        it('should first remove all blank lines before and \
        then insert one blank line after each %SNIPPET_DESC%', () => {
                expectedOutput = createMultilineString(
                    // REPLACE THIS MANUALLY
                );

                expectReplacerWithConfig(config).toConvert(inputSnippetWithBlanks).to(expectedOutput);
            });

    });

}
`.replace(/%RULE_NAME_KEBAB_CASE%/g, rule)
.replace(/%RULE_NAME_CAMEL_CASE%/g, ruleCamel)
.replace(/%SNIPPET_DESC%/g, snippetDesc);

fs.writeFileSync(`src/replacer/tests/${rule}.spec.ts`, specTemplate, 'utf-8')
process.exit(0);
