import { createMultilineString } from '../../../utils/text-utils';

export const propertyWithEffectDecoratorTestSnippet = createMultilineString(
    'class Foo {',
    '  // non-blank line',
    '  @Effect()',
    '  public barAction$ = this.actions$.pipe(',
    '    // code',
    '  );',
    '  // non-blank line',
    '  @Effect() public barAction$ = this.actions$.pipe(',
    '    // code',
    '  );',
    '  // non-blank line',
    '}',
    '',
);
