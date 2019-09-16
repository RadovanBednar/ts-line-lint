import { createMultilineString } from '../../../../utils/text-utils';

export const consecutiveSingleLineTypeAliasesSnippet = createMultilineString(
    '// non-blank line',
    '%BLANK_BEFORE%',
    'export type AliasedType = type;',
    'export type AnotherAliasedType = type2;',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    '    type IndentedAlias = type3;',
    '%BLANK_AFTER%',
    '// non-blank line'
);
