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
import { createMockConfig } from './replacer-test-utils';
import { expectReplacerWithConfig } from './replacer-expects';

export function %RULE_NAME_CAMEL_CASE%RuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
       // FILL IN MANUALLY
    );
    const blanksAround = noBlanksAround
        .replace(/((?<!{\\n)  \\/\\/ non-blank line)/g, '\\n$1')
        .replace(/(  \\/\\/ non-blank line(?!\\n}))/g, '$1\\n');
    const blanksOnlyAfter = noBlanksAround.replace(/((?<!{\\n)  \\/\\/ non-blank line)/g, '\\n$1');
    const blanksOnlyBefore = noBlanksAround.replace(/(  \\/\\/ non-blank line(?!\\n}))/g, '$1\\n');
console.log(noBlanksAround);
console.log(blanksAround);
    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'before');
        });

        it('should remove blank lines before each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'after');
        });

        it('should remove blank lines after each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'remove', 'both');
        });

        it('should remove blank lines both before and after each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'before');
        });

        it('should insert a blank line before each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'after');
        });

        it('should insert a blank line after each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('%RULE_NAME_KEBAB_CASE%', 'insert', 'both');
        });

        it('should insert blank lines both before and after each %SNIPPET_DESC%', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { '%RULE_NAME_KEBAB_CASE%': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
`.replace(/%RULE_NAME_KEBAB_CASE%/g, rule)
.replace(/%RULE_NAME_CAMEL_CASE%/g, ruleCamel)
.replace(/%SNIPPET_DESC%/g, snippetDesc);

fs.writeFileSync(`src/replacer/tests/${rule}.spec.ts`, specTemplate, 'utf-8')
process.exit(0);
