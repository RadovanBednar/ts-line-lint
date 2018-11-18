import { createMultilineString } from '../../../../utils/text-utils';

export const functionDeclarationSnippet = createMultilineString(
    '// non-blank line',
    '%BLANK_BEFORE%',
    'function someFunction(foo: ExcruciatinglyLongTypeName,',
    '                      bar: AnotherExcruciatinglyLongTypeName) {',
    '  return "foo";',
    '}',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '  function indentedFunction(param: type): type {',
    '    return "foo";',
    '  }',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    'async function asyncFunction(): Promise<void> {',
    '  await foo();',
    '}',
    '%BLANK_AFTER%',
    '// non-blank line',
);
