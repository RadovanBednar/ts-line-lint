import { createMultilineString } from '../../../utils/text-utils';

export const methodOrAccessorDeclarationTestSnippet = createMultilineString(
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
