import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function multilineVariableDeclarationRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        '// non-blank line',
        'const someArray = [',
        '  "some long string",',
        '  "another long string",',
        '];',
        '// non-blank line',
        'let someObject = {',
        '  key1: "value1",',
        '  key2: "value2",',
        '};',
        '// non-blank line',
        '  var indentedObject = {',
        '    key1: "value1",',
        '    key2: "value2",',
        '  };',
        '// non-blank line',
    );
    const blanksAround = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1\n').slice(1, -1);
    const blanksOnlyAfter = noBlanksAround.replace(/(\/\/ non-blank line)/g, '\n$1').slice(1);
    const blanksOnlyBefore = noBlanksAround.replace(/(\/\/ non-blank line)/g, '$1\n').slice(0, -1);

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'remove', 'before');
        });

        it('should remove blank lines before each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'remove', 'after');
        });

        it('should remove blank lines after each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'remove', 'both');
        });

        it('should remove blank lines both before and after each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'insert', 'before');
        });

        it('should insert a blank line before each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'insert', 'after');
        });

        it('should insert a blank line after each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('multiline-variable-declaration', 'insert', 'both');
        });

        it('should insert blank lines both before and after each multiline variable declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'multiline-variable-declaration': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
