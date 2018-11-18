import { createMultilineString } from '../../../utils/text-utils';

export const consecutiveImportsTestSnippet = createMultilineString(
    '// non-blank line',
    'import {SingleImportedItem} from "abc";',
    'import {ExportedItem as AliasedItem} from "def";',
    '// non-blank line',
    'import { FirstItem, SecondItem } from "ghi";',
    '// non-blank line',
    'import * as jkl from "mno";',
    'import {',
    '  FirstOfSeveralLongNameImportedItems,',
    '  SecondOfSeveralLongNameImportedItems',
    '} from "../pqr";',
    'import {',
    '  AnotherLongNameImportedItems,',
    '  YetAnotherLongNameImportedItems',
    '} from "../pqr";',
    '// non-blank line',
);
