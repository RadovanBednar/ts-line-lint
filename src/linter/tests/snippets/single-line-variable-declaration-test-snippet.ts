import { createMultilineString } from '../../../utils/text-utils';

export const singleLineVariableDeclarationTestSnippet = createMultilineString(
    '// non-blank line',
    'var topLevelVar = "foo";',
    '// non-blank line',
    'let topLevelLet = "foo";',
    '// non-blank line',
    'const topLevelConst = "foo";',
    '// non-blank line',
    '  var indentedLevelVar = "bar";',
    '// non-blank line',
    '  let indentedLevelLet = "bar";',
    '// non-blank line',
    '  const indentedLevelConst = "bar";',
    '// non-blank line',
);
