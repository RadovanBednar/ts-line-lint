import { createMultilineString } from '../../../utils/text-utils';

export const consecutiveSingleLineTypeAliasesTestSnippet = createMultilineString(
    '// non-blank line',
    'export type AliasedType = type;',
    'export type AnotherAliasedType = type2;',
    '// non-blank line',
    '    type IndentedAlias = type3;',
    '// non-blank line',
);
