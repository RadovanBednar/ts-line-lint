import { IndentType } from '../../../config/line-lint-config';
import { createMultilineString } from '../../../utils/text-utils';
import { createIndentString } from '../linter-test-utils';

export function unitTestDescribeBlockTestSnippetPlaceholderFactory(indent: IndentType): string {
    const ind = createIndentString(indent);
    return createMultilineString(
        '// non-blank line',
        '%BLANK_BEFORE%',
        'describe("top-level test suite", () => {',
        '  // tests',
        '});',
        '%BLANK_AFTER%',
        '// non-blank line',
        '%BLANK_BEFORE%',
        'describe("another top-level test suite", () => {',
        '%BLANK_BEFORE%',
        ind + 'describe("first level nested test suite", () => {',
        '%BLANK_BEFORE%',
        ind + ind + 'describe("second level nested test suite", () => {',
        '%BLANK_BEFORE%',
        ind + ind + ind + 'describe("third level nested test suite", () => {',
        ind + ind + ind + ind + '// tests',
        ind + ind + ind + ind + '',
        ind + ind + ind + ind + '// more tests',
        ind + ind + ind + '});',
        '%BLANK_AFTER%',
        ind + ind + '});',
        '%BLANK_AFTER%',
        ind + '});',
        '%BLANK_AFTER%',
        ind + '// non-blank line',
        '%BLANK_BEFORE%',
        ind + 'describe("another first level nested test suite", () => {',
        ind + ind + '// tests',
        ind + '});',
        '%BLANK_AFTER%',
        '});',
        '%BLANK_AFTER%',
        '// non-blank line',
    );
}
