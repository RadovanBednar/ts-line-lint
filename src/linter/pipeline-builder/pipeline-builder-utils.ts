import { IndentType, LineLintRuleOption, LineLintRules } from '../../config/line-lint-config';
import { ruleApplicationOrder, RuleName, rulePatternMap } from '../rules';

export function filterRulesConfiguredFor(option: LineLintRuleOption, definedRules: LineLintRules): Array<RuleName> {
    return ruleApplicationOrder.filter(
        (ruleName) => {
            const rule = definedRules[ruleName];
            return rule && rule[option];
        }
    );
}

export function preparePatterns(rule: RuleName, indent: IndentType): Array<RegExp> {
    const pattern = rulePatternMap[rule];
    if (pattern.source.includes('%INDENT%')) {
        return makeIndentSpecificPatterns(pattern, indent);
    } else {
        return [pattern];
    }
}

function makeIndentSpecificPatterns(pattern: RegExp, indent: IndentType): Array<RegExp> {
    const specificPatterns = [];
    for (let indentLevel = 0; indentLevel <= 4; indentLevel++) {
        const indentPattern = indent === 'tab' ? `\\t{${indentLevel}}` : ` {${indent * indentLevel}}`;
        specificPatterns.push(new RegExp(pattern.source.replace('%INDENT%', indentPattern), pattern.flags));
    }

    return specificPatterns;
}

export function prependBlankLines(pattern: RegExp): RegExp {
    return new RegExp(/^\n+/.source + pattern.source, pattern.flags);
}

export function appendBlankLines(pattern: RegExp): RegExp {
    return new RegExp(pattern.source + /\n+/.source, pattern.flags);
}

export function surroundWithBlankLines(pattern: RegExp): RegExp {
    return new RegExp(/^\n*/.source + pattern.source + /\n+/.source, pattern.flags);
}
