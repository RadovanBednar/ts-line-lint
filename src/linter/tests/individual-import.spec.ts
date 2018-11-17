import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectLinterWithConfig } from './linter-expects';
import { createMockConfig } from './linter-test-utils';

export function individualImportRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
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
    const blanksAround = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1\n').slice(1, -1);
    const blanksOnlyAfter = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1').slice(1);
    const blanksOnlyBefore = noBlanksAround.replace(/(\/\/ non-blank line)/g, '$1\n').slice(0, -1);

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'before');
        });

        it('should remove blank lines before each individual import', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'after');
        });

        it('should remove blank lines after each individual import', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'remove', 'both');
        });

        it('should remove blank lines both before and after each individual import', () => {
            expectLinterWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectLinterWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'before');
        });

        it('should insert a blank line before each individual import', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'after');
        });

        it('should insert a blank line after each individual import', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('individual-import', 'insert', 'both');
        });

        it('should insert blank lines both before and after each individual import', () => {
            expectLinterWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
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
            expectLinterWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
