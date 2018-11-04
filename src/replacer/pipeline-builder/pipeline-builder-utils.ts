import { IndentType, LineLintRuleOption, LineLintRules } from '../../config/line-lint-config';
import { RuleName, rulePatternMap } from '../pattern-maps/rule-pattern-map';

export function filterRulesConfiguredFor(option: LineLintRuleOption, rules: LineLintRules): Array<RuleName> {
    return Object.keys(rulePatternMap).filter(
        (rule) => rules[rule] && rules[rule][option],
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
