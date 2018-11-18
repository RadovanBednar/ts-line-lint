import { SimpleRuleName } from '../../../rules';
import { abstractMethodOrAccessorSnippet } from './abstract-method-or-accessor-test-snippet';
import { classDeclarationSnippet } from './class-declaration-test-snippet';
import { classPropertyDeclarationSnippet } from './class-property-declaration-test-snippet';
import { consecutiveImportsSnippet } from './consecutive-imports-test-snippet';
import { consecutiveSingleLineTypeAliasesSnippet } from './consecutive-single-line-type-aliases-test-snippet';
import { functionDeclarationSnippet } from './function-declaration-test-snippet';
import { individualImportSnippet } from './individual-import-test-snippet';
import { individualMultilineTypeAliasSnippet } from './individual-multiline-type-alias-test-snippet';
import { interfaceDeclarationSnippet } from './interface-declaration-test-snippet';
import { methodOrAccessorDeclarationSnippet } from './method-or-accessor-declaration-test-snippet';
import { multilineVariableDeclarationSnippet } from './multiline-variable-declaration-test-snippet';
import { propertyWithEffectDecoratorSnippet } from './property-with-effect-decorator-test-snippet';
import { singleLineVariableDeclarationSnippet } from './single-line-variable-declaration-test-snippet';
import { unitTestHookStatementSnippet } from './unit-test-hook-statement-test-snippet';
import { unitTestItStatementSnippet } from './unit-test-it-statement-test-snippet';

export const simpleSnippetMap: { readonly [key in SimpleRuleName]: string } = {
    'individual-import': individualImportSnippet,
    'consecutive-imports': consecutiveImportsSnippet,
    'individual-multiline-type-alias': individualMultilineTypeAliasSnippet,
    'consecutive-single-line-type-aliases': consecutiveSingleLineTypeAliasesSnippet,
    'interface-declaration': interfaceDeclarationSnippet,
    'single-line-variable-declaration': singleLineVariableDeclarationSnippet,
    'multiline-variable-declaration': multilineVariableDeclarationSnippet,
    'function-declaration': functionDeclarationSnippet,
    'class-declaration': classDeclarationSnippet,
    'class-property-declaration': classPropertyDeclarationSnippet,
    'method-or-accessor-declaration': methodOrAccessorDeclarationSnippet,
    'abstract-method-or-accessor': abstractMethodOrAccessorSnippet,
    'property-with-effect-decorator': propertyWithEffectDecoratorSnippet,
    'unit-test-hook-statement': unitTestHookStatementSnippet,
    'unit-test-it-statement': unitTestItStatementSnippet,
};
