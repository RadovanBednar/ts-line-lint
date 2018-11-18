import { createMultilineString } from '../../../utils/text-utils';

export const functionDeclarationTestSnippet = createMultilineString(
    '// non-blank line',
    'function someFunction(foo: ExcruciatinglyLongTypeName,',
    '                      bar: AnotherExcruciatinglyLongTypeName) {',
    '  return "foo";',
    '}',
    '// non-blank line',
    '  function indentedFunction(param: type): type {',
    '    return "foo";',
    '  }',
    '// non-blank line',
    'async function asyncFunction(): Promise<void> {',
    '  await foo();',
    '}',
    '// non-blank line',
);
