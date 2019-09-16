import { createMultilineString } from '../../../../utils/text-utils';

export const individualMultilineTypeAliasSnippet = createMultilineString(
    '// non-blank line',
    '%BLANK_BEFORE%',
    'export type ExtendedType<T> = T & {',
    '  [P in keyof T]: T[P] & BaseType<T>;',
    '};',
    '%BLANK_AFTER%',
    '// non-blank line',
    '%BLANK_BEFORE%',
    'export type UnionType =',
    '  SomeType |',
    '  AnotherType;',
    '%BLANK_AFTER%',
    '// non-blank line'
);
