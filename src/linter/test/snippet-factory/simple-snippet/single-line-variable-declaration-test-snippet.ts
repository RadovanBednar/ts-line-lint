import { createMultilineString } from '../../../../utils/text-utils';

export const singleLineVariableDeclarationSnippet = createMultilineString(
    '// non-blank line',
    '%BLANK_BEFORE%',
    'var topLevelVar = "foo";',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    'let topLevelLet = "foo";',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    'const topLevelConst = "foo";',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '  var indentedLevelVar = "bar";',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '  let indentedLevelLet = "bar";',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '  const indentedLevelConst = "bar";',
    '%BLANK_AFTER%',
    '// non-blank line'
);
