export type RuleName = SimpleRuleName | IndentSpecificRuleName | BlockPaddingRuleName;
export type IndentSpecificRuleName = 'unit-test-describe-block';
export type BlockPaddingRuleName = 'block-padding';

export type SimpleRuleName =
    'individual-import' |
    'consecutive-imports' |
    'individual-multiline-type-alias' |
    'consecutive-single-line-type-aliases' |
    'interface-declaration' |
    'single-line-variable-declaration' |
    'multiline-variable-declaration' |
    'function-declaration' |
    'class-declaration' |
    'class-property-declaration' |
    'method-or-accessor-declaration' |
    'abstract-method-or-accessor' |
    'property-with-effect-decorator' |
    'unit-test-hook-statement' |
    'unit-test-it-statement';
