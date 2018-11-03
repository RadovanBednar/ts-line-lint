import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectReplacerWithConfig } from './replacer-expects';
import { createMockConfig } from './replacer-test-utils';

export function methodOrAccessorDeclarationRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        'class Foo {',
        '  // non-blank line',
        '  constructor() {',
        '  }',
        '  // non-blank line',
        '  public constructor() {',
        '    // implementation',
        '  }',
        '  // non-blank line',
        '  protected constructor() {',
        '  }',
        '  // non-blank line',
        '  private constructor(private firstDependency: FirstDependency,',
        '                      private secondDependency: SecondDependency,',
        '                      private thirdDependency: ThirdDependency) {',
        '  }',
        '  // non-blank line',
        '  public static foo(): bar {',
        '    // implementation',
        '',
        '    // return statement',
        '  }',
        '  // non-blank line',
        '  protected bar(protected firstParam: VeryLongTypeName,',
        '                protected secondParam: EvenLongerTypeName,',
        '                protected thirdParam: SomeMonstrouslyLongTypeName): bar {',
        '    // implementation',
        '',
        '    // return statement',
        '  }',
        '  // non-blank line',
        '  @HostListener("click", ["$event.target"])',
        '  public onClick(btn) {',
        '    // implementation',
        '  }',
        '  // non-blank line',
        '  private baz(): void {',
        '    // implementation',
        '  }',
        '  // non-blank line',
        '  get foo() {',
        '    return this _foo;',
        '  }',
        '  // non-blank line',
        '  @Input()',
        '  set foo(param: type) {',
        '    this _foo = param;',
        '  }',
        '  // non-blank line',
        '}',
        '',
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
            config = createMockConfig('method-or-accessor-declaration', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'remove', 'before');
        });

        it('should remove blank lines before each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'remove', 'after');
        });

        it('should remove blank lines after each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'remove', 'both');
        });

        it('should remove blank lines both before and after each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'insert', 'before');
        });

        it('should insert a blank line before each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'insert', 'after');
        });

        it('should insert a blank line after each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('method-or-accessor-declaration', 'insert', 'both');
        });

        it('should insert blank lines both before and after each method or property accessor declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'method-or-accessor-declaration': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
