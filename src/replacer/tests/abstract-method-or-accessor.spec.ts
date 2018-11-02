import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function abstractMethodOrAccessorRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        'class Foo {',
        '  // non-blank line',
        '  public abstract getBar(): Bar;',
        '  // non-blank line',
        '  protected abstract setBar(bar: Bar): void;',
        '  // non-blank line',
        '  protected abstract untyped();',
        '  // non-blank line',
        '  protected abstract baz(firstParam: VeryLongTypeName,',
        '                         secondParam: EvenLongerTypeName,',
        '                         thirdParam: SomeMonstrouslyLongTypeName): Baz;',
        '  // non-blank line',
        '  protected abstract get value();',
        '  // non-blank line',
        '  public abstract set value(v: number);',
        '  // non-blank line',
        '  public async abstract getBar(): Promise<Bar>;',
        '  // non-blank line',
        '  protected abstract async setBar(bar: Bar): Promise<void>;',
        '  // non-blank line',
        '}',
    );
    const blanksAround = noBlanksAround
        .replace(/((?<!{\n)  \/\/ non-blank line)/g, '\n$1')
        .replace(/(  \/\/ non-blank line(?!\n}))/g, '$1\n');
    const blanksOnlyAfter = noBlanksAround.replace(/((?<!{\n)  \/\/ non-blank line)/g, '\n$1');
    const blanksOnlyBefore = noBlanksAround.replace(/(  \/\/ non-blank line(?!\n}))/g, '$1\n');

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'remove', 'before');
        });

        it('should remove blank lines before each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'remove', 'after');
        });

        it('should remove blank lines after each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'remove', 'both');
        });

        it('should remove blank lines both before and after each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'insert', 'before');
        });

        it('should insert a blank line before each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'insert', 'after');
        });

        it('should insert a blank line after each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('abstract-method-or-accessor', 'insert', 'both');
        });

        it('should insert blank lines both before and after each abstract method or property accessor', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'abstract-method-or-accessor': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
