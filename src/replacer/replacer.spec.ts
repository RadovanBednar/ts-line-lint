import { cleanupTestSuite } from './tests/cleanup.spec';
import { consecutiveImportsRuleTestSuite } from './tests/consecutive-imports.spec';
import { consecutiveSingleLineTypeAliasesRuleTestSuite } from './tests/consecutive-single-line-type-aliases.spec';
import { individualImportRuleTestSuite } from './tests/individual-import.spec';
import { individualMultilineTypeAliasRuleTestSuite } from './tests/individual-multiline-type-alias.spec';

describe('Replacer', () => {
    describe('always at the end of a replacement pipeline', cleanupTestSuite);
    describe('when "individual-import" rule', individualImportRuleTestSuite);
    describe('when "consecutive-imports" rule', consecutiveImportsRuleTestSuite);
    describe('when "individual-multiline-type-alias" rule', individualMultilineTypeAliasRuleTestSuite);
    describe('when "consecutive-single-line-type-aliases" rule', consecutiveSingleLineTypeAliasesRuleTestSuite);
});
