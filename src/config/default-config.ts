import { LineLintConfig } from './line-lint-config';

export const defaultConfig: LineLintConfig = {
    indent: 4,
    rules: {
        'block-padding': {
            remove: 'both',
        },
        'individual-import': {
            remove: 'before',
        },
        'consecutive-imports': {
            insert: 'after',
        },
        'individual-multiline-type-alias': {
            insert: 'both',
        },
        'consecutive-single-line-type-aliases': {
            insert: 'both',
        },
        'interface-declaration': {
            insert: 'both',
        },
        'single-line-variable-declaration': {
            remove: 'none',
        },
        'multiline-variable-declaration': {
            remove: 'none',
        },
        'function-declaration': {
            insert: 'both',
        },
        'class-declaration': {
            insert: 'both',
        },
        'class-property-declaration': {
            remove: 'before',
        },
        'method-or-accessor-declaration': {
            insert: 'both',
        },
        'abstract-method-or-accessor': {
            insert: 'both',
        },
        'property-with-effect-decorator': {
            insert: 'both',
        },
        'unit-test-describe-block': {
            insert: 'both',
        },
        'unit-test-hook-statement': {
            insert: 'both',
        },
        'unit-test-it-statement': {
            insert: 'both',
        },
    },
};
