import { SimpleRuleName } from '../rules';
import { abstractMethodOrAccessorTestSnippet } from './snippets/abstract-method-or-accessor-test-snippet';
import { classDeclarationTestSnippet } from './snippets/class-declaration-test-snippet';
import { classPropertyDeclarationTestSnippet } from './snippets/class-property-declaration-test-snippet';
import { consecutiveImportsTestSnippet } from './snippets/consecutive-imports-test-snippet';
import { consecutiveSingleLineTypeAliasesTestSnippet } from './snippets/consecutive-single-line-type-aliases-test-snippet';
import { functionDeclarationTestSnippet } from './snippets/function-declaration-test-snippet';
import { individualImportTestSnippet } from './snippets/individual-import-test-snippet';
import { individualMultilineTypeAliasTestSnippet } from './snippets/individual-multiline-type-alias-test-snippet';
import { interfaceDeclarationTestSnippet } from './snippets/interface-declaration-test-snippet';
import { methodOrAccessorDeclarationTestSnippet } from './snippets/method-or-accessor-declaration-test-snippet';
import { multilineVariableDeclarationTestSnippet } from './snippets/multiline-variable-declaration-test-snippet';
import { propertyWithEffectDecoratorTestSnippet } from './snippets/property-with-effect-decorator-test-snippet';
import { singleLineVariableDeclarationTestSnippet } from './snippets/single-line-variable-declaration-test-snippet';
import { unitTestHookStatementTestSnippet } from './snippets/unit-test-hook-statement-test-snippet';
import { unitTestItStatementTestSnippet } from './snippets/unit-test-it-statement-test-snippet';

export const testSnippetMap: { [key in SimpleRuleName]: string } = {
    'individual-import': individualImportTestSnippet,
    'consecutive-imports': consecutiveImportsTestSnippet,
    'individual-multiline-type-alias': individualMultilineTypeAliasTestSnippet,
    'consecutive-single-line-type-aliases': consecutiveSingleLineTypeAliasesTestSnippet,
    'interface-declaration': interfaceDeclarationTestSnippet,
    'single-line-variable-declaration': singleLineVariableDeclarationTestSnippet,
    'multiline-variable-declaration': multilineVariableDeclarationTestSnippet,
    'function-declaration': functionDeclarationTestSnippet,
    'class-declaration': classDeclarationTestSnippet,
    'class-property-declaration': classPropertyDeclarationTestSnippet,
    'method-or-accessor-declaration': methodOrAccessorDeclarationTestSnippet,
    'abstract-method-or-accessor': abstractMethodOrAccessorTestSnippet,
    'property-with-effect-decorator': propertyWithEffectDecoratorTestSnippet,
    'unit-test-hook-statement': unitTestHookStatementTestSnippet,
    'unit-test-it-statement': unitTestItStatementTestSnippet,
};
