import { Dictionary } from '../utils/types';

export const patternMap: Dictionary<RegExp> = {
    'individual-import': /(^import {(.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)/mg,
    'consecutive-imports': /((?:^import {(?:.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)+)/mg,
    'individual-multiline-type-alias': /(^([ \t]*)(?:export )?type .*\n(?:[ \t]+.*\n)+?\2[^;]*;\n)/mg,
    'consecutive-single-line-type-aliases': /((?:^[ \t]*(?:export )?type .*;\n)+)/mg,
    // 'interface-declaration': //mg,
    // 'variable-declaration': //mg,
    // 'block-content': //mg,
    // 'function-declaration': //mg,
    // 'class-declaration': //mg,
    // 'class-property-declaration': //mg,
    // 'method-or-accessor-declaration': //mg,
    // 'abstract-method-or-accessor': //mg,
    // 'property-with-effect-decorator': //mg,
    // 'unit-test-describe': //mg,
    // 'unit-test-single-line-hook-statement': //mg,
    // 'unit-test-hook-statement-block': //mg,
    // 'unit-test-it-statement': //mg,

    'leading-blank': /^\n+/g,
    'duplicate-blanks': /(?<=\n)(\n+)/g,
    'excess-trailing-blanks': /(?<=\n)(\n+)$/g,
};
