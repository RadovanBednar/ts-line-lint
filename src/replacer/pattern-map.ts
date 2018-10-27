import { Dictionary } from '../utils/types';

export const patternMap: Dictionary<RegExp> = {
    'individual-import': /(^import {(.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)/mg,
    'consecutive-imports': /((?:^import {(?:.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)+)/mg,
    'individual-multiline-type-alias': /(^([ \t]*)(?:export )?type .*\n(?:[ \t]+.*\n)+?\2[^;]*;\n)/mg,

    'leading-blank': /^\n+/g,
    'duplicate-blanks': /(?<=\n)(\n+)/g,
    'excess-trailing-blanks': /(?<=\n)(\n+)$/g,
};
