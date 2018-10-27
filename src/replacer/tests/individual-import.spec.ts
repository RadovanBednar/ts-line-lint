import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function individualImportRuleTestSuite(): void {
    const inputSnippet = createMultilineString(
        'import {SingleImportedItem} from "abc";',
        '',
        'import {AnotherSingleImportedItem} from "./def";',
        'import {YetAnotherSingleImportedItem} from "./ghi";',
        '',
        'import {',
        '  FirstOfSeveralImportedItems,',
        '  SecondOfSeveralImportedItems',
        '} from "../jkl";',
        '',
        '// non-blank line',
    );
    let expectedOutput: string;
    let config: LineLintConfig;

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'before');
        });

        it('should remove blank lines before each individual import', () => {
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

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'after');
        });

        it('should remove blank lines after each individual import', () => {
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

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'both');
        });

        it('should remove blank lines both before and after each individual import', () => {
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

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(inputSnippet);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'before');
        });

        it('should insert a blank line before each individual import', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                '',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                '',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'after');
        });

        it('should insert a blank line after each individual import', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                '',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                '',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'both');
        });

        it('should insert blank lines both before and after each individual import', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                '',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                '',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'individual-import': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectedOutput = createMultilineString(
                'import {SingleImportedItem} from "abc";',
                '',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {YetAnotherSingleImportedItem} from "./ghi";',
                '',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../jkl";',
                '',
                '// non-blank line',
            );

            expectReplacerWithConfig(config).toConvert(inputSnippet).to(expectedOutput);
        });

    });

}
