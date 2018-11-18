import { createMultilineString } from '../../../utils/text-utils';

export const individualMultilineTypeAliasTestSnippet = createMultilineString(
    '// non-blank line',
    'export type ExtendedType<T> = T & {',
    '  [P in keyof T]: T[P] & BaseType<T>;',
    '};',
    '// non-blank line',
    'export type UnionType =',
    '  SomeType |',
    '  AnotherType;',
    '// non-blank line',
);
