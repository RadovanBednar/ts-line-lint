import { createMultilineString } from '../../../utils/text-utils';

export const individualImportTestSnippet = createMultilineString(
    '// non-blank line',
    'import {SingleImportedItem} from "abc";',
    '// non-blank line',
    'import {ExportedItem as AliasedItem} from "def";',
    '// non-blank line',
    'import { FirstItem, SecondItem } from "ghi";',
    '// non-blank line',
    'import * as jkl from "mno";',
    '// non-blank line',
    'import {',
    '  FirstOfSeveralLongNameImportedItems,',
    '  SecondOfSeveralLongNameImportedItems',
    '} from "../pqr";',
    '// non-blank line',
);
