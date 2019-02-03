import { createMultilineString } from '../../../../utils/text-utils';

export const abstractMethodOrAccessorSnippet = createMultilineString(
    'class Foo {',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  public abstract getBar(): Bar;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected abstract setBar(bar: Bar): void;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected abstract untyped();',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected abstract baz(firstParam: VeryLongTypeName,',
    '                         secondParam: EvenLongerTypeName,',
    '                         thirdParam: SomeMonstrouslyLongTypeName): Baz;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected abstract get value();',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  public abstract set value(v: number);',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  public async abstract getBar(): Promise<Bar>;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '%BLANK_BEFORE%',
    '  protected abstract async setBar(bar: Bar): Promise<void>;',
    '%BLANK_AFTER%',
    '  // non-blank line',
    '}',
);
