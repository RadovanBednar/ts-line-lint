import { RuleName } from '../linter/rules';

export type IndentType = 'tab' | number;

export interface LineLintConfig {
    indent: IndentType;
    rules: LineLintRules;
}

export type LineLintRules = {
    [P in RuleName]?: LineLintRuleOptions
};

export type LineLintRuleOption = 'remove' | 'insert';

export type LineLintRuleOptions = {
    [P in LineLintRuleOption]?: LineLintModificationOption;
};

export type LineLintModificationOption = 'before' | 'after' | 'both' | 'none';

export const EMPTY_RULES_CONFIG: LineLintConfig = {
    indent: 4,
    rules: {},
};
