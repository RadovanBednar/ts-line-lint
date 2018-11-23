import { blockPaddingRuleTestSuite } from './test/block-padding.spec';
import { cleanupTestSuite } from './test/cleanup.spec';
import { indentSpecificRuleTestSuite } from './test/indent-specific-rule.spec';
import { simpleRuleTestSuite } from './test/simple-rule.spec';

describe('Linter', () => {
    describe('always at the end of a replacement pipeline', cleanupTestSuite);

    describe('when "block-padding" rule', blockPaddingRuleTestSuite);

    describe('when "individual-import" rule', () => simpleRuleTestSuite('individual-import'));

    describe('when "consecutive-imports" rule', () => simpleRuleTestSuite('consecutive-imports'));

    describe('when "individual-multiline-type-alias" rule',
        () => simpleRuleTestSuite('individual-multiline-type-alias'));

    describe('when "consecutive-single-line-type-aliases" rule',
        () => simpleRuleTestSuite('consecutive-single-line-type-aliases'));

    describe('when "interface-declaration" rule', () => simpleRuleTestSuite('interface-declaration'));

    describe('when "single-line-variable-declaration" rule',
        () => simpleRuleTestSuite('single-line-variable-declaration'));

    describe('when "multiline-variable-declaration" rule', () => simpleRuleTestSuite('multiline-variable-declaration'));

    describe('when "function-declaration" rule', () => simpleRuleTestSuite('function-declaration'));

    describe('when "class-declaration" rule', () => simpleRuleTestSuite('class-declaration'));

    describe('when "class-property-declaration" rule', () => simpleRuleTestSuite('class-property-declaration'));

    describe('when "method-or-accessor-declaration" rule', () => simpleRuleTestSuite('method-or-accessor-declaration'));

    describe('when "abstract-method-or-accessor" rule', () => simpleRuleTestSuite('abstract-method-or-accessor'));

    describe('when "property-with-effect-decorator" rule', () => simpleRuleTestSuite('property-with-effect-decorator'));

    describe('when indent is 2 spaces and "unit-test-describe-block" rule',
        () => indentSpecificRuleTestSuite('unit-test-describe-block', 2));

    describe('when indent is 5 spaces and "unit-test-describe-block" rule',
        () => indentSpecificRuleTestSuite('unit-test-describe-block', 5));

    describe('when indent is "tab" and "unit-test-describe-block" rule',
        () => indentSpecificRuleTestSuite('unit-test-describe-block', 'tab'));

    describe('when "unit-test-hook-statement" rule', () => simpleRuleTestSuite('unit-test-hook-statement'));

    describe('when "unit-test-it-statement" rule', () => simpleRuleTestSuite('unit-test-it-statement'));
});
