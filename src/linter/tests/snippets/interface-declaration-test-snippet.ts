import { createMultilineString } from '../../../utils/text-utils';

export const interfaceDeclarationTestSnippet = createMultilineString(
    '// non-blank line',
    'interface LocalInterface {',
    '  prop1: type;',
    '  prop2: type;',
    '}',
    '// non-blank line',
    '  interface IndentedInterface {',
    '    prop1: type;',
    '    prop2: type;',
    '  }',
    '// non-blank line',
    'export interface ExportedInterface {',
    '  method1(param: type): type;',
    '',
    '  method2(param: type): type;',
    '}',
    '// non-blank line',
);
