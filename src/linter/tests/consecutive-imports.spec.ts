import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectLinterWithConfig } from './linter-expects';
import { createMockConfig } from './linter-test-utils';

export function consecutiveImportsRuleTestSuite(): void {
    const inputSnippet = createMultilineString(
        'import {SingleImportedItem} from "abc";',
        'import {AnotherSingleImportedItem} from "./def";',
        '',
        'import {YetAnotherSingleImportedItem} from "./ghi";',
        'import {',
        '  FirstOfSeveralImportedItems,',
        '  SecondOfSeveralImportedItems',
        '} from "../jkl";',
        '// non-blank line',
    );
    let expectedOutput: string;
    let config: LineLintConfig;

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'remove', 'before');
        });

        it('should remove blank lines before each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'remove', 'after');
        });

        it('should remove blank lines after each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'remove', 'both');
        });

        it('should remove blank lines both before and after each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'insert', 'before');
        });

        it('should insert a blank line before each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'insert', 'after');
        });

        it('should insert a blank line after each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('consecutive-imports', 'insert', 'both');
        });

        it('should insert blank lines both before and after each group of consecutive imports', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'consecutive-imports': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectLinterWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

}
