import { createMultilineString } from '../../../../utils/text-utils';

export const interfaceDeclarationSnippet = createMultilineString(
    '// non-blank line',
    '%BLANK_BEFORE%',
    'interface LocalInterface {',
    '  prop1: type;',
    '  prop2: type;',
    '}',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '  interface IndentedInterface {',
    '    prop1: type;',
    '    prop2: type;',
    '  }',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    'export interface ExportedInterface {',
    '  method1(param: type): type;',
    '',
    '  method2(param: type): type;',
    '}',
    '%BLANK_AFTER%',
    '// non-blank line'
);
