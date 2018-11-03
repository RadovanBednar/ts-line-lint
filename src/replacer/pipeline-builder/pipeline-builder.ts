import { IndentType, LineLintConfig, LineLintRuleOption, LineLintRules } from '../../config/line-lint-config';
import { patternMap, RuleName } from './../pattern-map';
import { ReplacementPipeline } from './../replacer';

export abstract class PipelineBuilder {
    protected readonly pipeline: ReplacementPipeline = [];
    protected readonly rules: LineLintRules;
    private readonly indent: IndentType;

    constructor(config: LineLintConfig) {
        this.indent = config.indent;
        this.rules = config.rules;
        this.build();
    }

    public abstract get(): ReplacementPipeline;

    protected abstract build(): void;

    protected filterRulesConfiguredFor(option: LineLintRuleOption): Array<RuleName> {
        return Object.keys(patternMap).filter(
            (rule) => this.isRuleSpecified(rule) && this.isOptionSpecified(rule, option),
        );
    }

    protected preparePatterns(rule: RuleName): Array<RegExp> {
        const pattern = patternMap[rule];
        if (pattern.source.includes('%INDENT%')) {
            return this.makeIndentSpecificPatterns(pattern);
        } else {
            return [pattern];
        }
    }

    private makeIndentSpecificPatterns(pattern: RegExp): Array<RegExp> {
        const specificPatterns = [];
        for (let indentLevel = 0; indentLevel <= 4; indentLevel++) {
            const indentPattern = this.indent === 'tab' ? `\\t{${indentLevel}}` : ` {${this.indent * indentLevel}}`;
            specificPatterns.push(new RegExp(pattern.source.replace('%INDENT%', indentPattern), pattern.flags));
        }
        return specificPatterns;
    }

    private isRuleSpecified(rule: RuleName): boolean {
        return !!this.rules[rule];
    }

    private isOptionSpecified(rule: RuleName, option: LineLintRuleOption): boolean {
        return !!this.rules[rule][option] && this.rules[rule][option] !== 'none';
    }

}
