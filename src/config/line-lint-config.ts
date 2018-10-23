export interface LineLintConfig {
    indent: number;
    rules: LineLintRules;
}

export interface LineLintRules {
    [key: string]: LineLintRuleOptions;
}

export interface LineLintRuleOptions {
    remove?: LineLintModificationOption;
    insert?: LineLintModificationOption;
}

export type LineLintModificationOption = 'before' | 'after' | 'both' | 'none';

export const EMPTY_RULES_CONFIG: LineLintConfig = {
    indent: 4,
    rules: {},
};
