import { createMultilineString } from '../../../../utils/text-utils';

export const propertyWithEffectDecoratorSnippet = createMultilineString(
    'class Foo {',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  @Effect()',
    '  public barAction$ = this.actions$.pipe(',
    '    // code',
    '  );',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  @Effect() public barAction$ = this.actions$.pipe(',
    '    // code',
    '  );',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '}',
    '',
);
