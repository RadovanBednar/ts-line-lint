import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { createMockConfig } from './create-mock-config';
import { expectReplacerWithConfig } from './replacer-expects';

export function classPropertyDeclarationRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        'class Foo {',
        '  // non-blank line',
        '  private static foo = 123;',
        '  // non-blank line',
        '  protected static fooObject = {',
        '    key1: "value1",',
        '    key2: "value2",',
        '  };',
        '  // non-blank line',
        '  public static fooArray = [',
        '    "some very long array memeber",',
        '    "some even longer array memeber",',
        '  ];',
        '  // non-blank line',
        '  public abstract fooAbstract: string;',
        '  // non-blank line',
        '  @Input() public fooDecorated!: Foo;',
        '  // non-blank line',
        '  @Output() public bar = new EventEmitter<Bar>();',
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
            config = createMockConfig('class-property-declaration', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'remove', 'before');
        });

        it('should remove blank lines before each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'remove', 'after');
        });

        it('should remove blank lines after each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'remove', 'both');
        });

        it('should remove blank lines both before and after each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'insert', 'before');
        });

        it('should insert a blank line before each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'insert', 'after');
        });

        it('should insert a blank line after each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('class-property-declaration', 'insert', 'both');
        });

        it('should insert blank lines both before and after each class property declaration', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'class-property-declaration': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}
