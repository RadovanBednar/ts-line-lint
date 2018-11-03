import { Dictionary } from '../utils/types';

export const patternMap: Dictionary<RegExp> = {
    'individual-import': /(^import {(.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)/mg,
    'consecutive-imports': /((?:^import {(?:.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)+)/mg,
    'individual-multiline-type-alias': /(^([ \t]*)(?:export )?type .*\n(?:[ \t]+.*\n)+?\2[^;]*;\n)/mg,
    'consecutive-single-line-type-aliases': /((?:^[ \t]*(?:export )?type .*;\n)+)/mg,
    'interface-declaration': /(^([ \t]*)(?:export )?interface \w+ {\n(?:.*\n)*?\2}\n)/mg,
    'single-line-variable-declaration': /(^[ \t]*(?:var|let|const) [^;\n]*;\n)/mg,
    'multiline-variable-declaration': /(^[ \t]*(?:var|let|const) [^;]*\n[^;]*;\n)/mg,
    'function-declaration': /(^([ \t]*)(?:async )?function .*[{,]\n(?:.*\n)*?\2}\n)/mg,
    'class-declaration': /(^([ \t]*)(?:@\w+\([^)]*\)\n\2)?.*\bclass\b.*\n(?:.*\n)*?\2}\n)/mg,
    'class-property-declaration':
        /(^([ \t]+)(?:@.* )?(?:private|protected|public) .*(?:;|[\[{]\n(?:\2[ \t]+.*\n)+\2[\]}];)\n)/mg,
    'method-or-accessor-declaration':
        // tslint:disable-next-line:max-line-length
        /(^([ \t]+)(?:@.*\n\2)?(?:public |protected |private |get |set |constructor\().*[{,]\n(?:(?!\2};).*\n)*?\2}\n)/mg,
    'abstract-method-or-accessor': /(^([ \t]*)(?:public |protected |private )?(?:async )?abstract [^(\n]*\([^;]*;\n)/mg,
    'property-with-effect-decorator': /(^([ \t]+)@Effect\([^)]*\)(?:\n\2| ).*\n(?:.*\n)*?\2\S.*\n)/mg,
    'unit-test-describe-block': /(^(%INDENT%)describe\(.*{\n(?:.*\n)*?\2}\);\n)/mg,
    // 'unit-test-single-line-hook-statement': //mg,
    // 'unit-test-hook-statement-block': //mg,
    // 'unit-test-it-statement': //mg,

    'tslint-disable-next-line-comment': /(^[ \t]*\/(?:\/|\*) tslint:disable-next-line.*\n)\n+/mg,
    'leading-blank': /^\n+/g,
    'duplicate-blanks': /(?<=\n)(\n+)/g,
    'excess-trailing-blanks': /(?<=\n)(\n+)$/g,
};
