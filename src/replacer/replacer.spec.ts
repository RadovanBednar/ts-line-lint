import { blockPaddingRuleTestSuite } from './tests/block-padding.spec';
import { cleanupTestSuite } from './tests/cleanup.spec';
import { consecutiveImportsRuleTestSuite } from './tests/consecutive-imports.spec';
import { consecutiveSingleLineTypeAliasesRuleTestSuite } from './tests/consecutive-single-line-type-aliases.spec';
import { individualImportRuleTestSuite } from './tests/individual-import.spec';
import { individualMultilineTypeAliasRuleTestSuite } from './tests/individual-multiline-type-alias.spec';
import { interfaceDeclarationRuleTestSuite } from './tests/interface-declaration.spec';
import { singleLineVariableDeclarationRuleTestSuite } from './tests/single-line-variable-declaration.spec';

describe('Replacer', () => {
    describe('always at the end of a replacement pipeline', cleanupTestSuite);
    describe('when "block-padding" rule', blockPaddingRuleTestSuite);
    describe('when "individual-import" rule', individualImportRuleTestSuite);
    describe('when "consecutive-imports" rule', consecutiveImportsRuleTestSuite);
    describe('when "individual-multiline-type-alias" rule', individualMultilineTypeAliasRuleTestSuite);
    describe('when "consecutive-single-line-type-aliases" rule', consecutiveSingleLineTypeAliasesRuleTestSuite);
    describe('when "interface-declaration" rule', interfaceDeclarationRuleTestSuite);
    describe('when "single-line-variable-declaration" rule', singleLineVariableDeclarationRuleTestSuite);
});
