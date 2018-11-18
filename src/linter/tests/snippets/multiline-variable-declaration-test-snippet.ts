import { createMultilineString } from '../../../utils/text-utils';

export const multilineVariableDeclarationTestSnippet = createMultilineString(
    '// non-blank line',
    'const someArray = [',
    '  "some long string",',
    '  "another long string",',
    '];',
    '// non-blank line',
    'let someObject = {',
    '  key1: "value1",',
    '  key2: "value2",',
    '};',
    '// non-blank line',
    '  var indentedObject = {',
    '    key1: "value1",',
    '    key2: "value2",',
    '  };',
    '// non-blank line',
);
