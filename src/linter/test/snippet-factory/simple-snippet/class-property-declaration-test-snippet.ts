import { createMultilineString } from '../../../../utils/text-utils';

export const classPropertyDeclarationSnippet = createMultilineString(
    'class Foo {',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  private static foo = 123;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected static fooObject = {',
    '    key1: "value1",',
    '    key2: "value2",',
    '  };',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  public static fooArray = [',
    '    "some very long array memeber",',
    '    "some even longer array memeber",',
    '  ];',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  public abstract fooAbstract: string;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  @Input() public fooDecorated!: Foo;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  @Output() public bar = new EventEmitter<Bar>();',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '}',
);
