import { IndentType, LineLintConfig, LineLintModificationOption, LineLintRuleOptions } from '../../config/line-lint-config';
import { RuleName } from '../rules';

export function getPatternDescription(ruleName: RuleName): string {
    const description = ruleName.replace(/(?<!single)-/g, ' ');
    return ruleName.startsWith('consecutive') ? 'group of ' + description : description;
}

export function createMockConfig(rule: RuleName,
                                 property: keyof LineLintRuleOptions,
                                 option: LineLintModificationOption,
                                 indent: 'tab' | number = 4): LineLintConfig {
    return {
        indent: indent,
        rules: { [rule]: { [property]: option } },
    };
}

export function createEmptyMockConfig(indent: 'tab' | number): LineLintConfig {
    return {
        indent: indent,
        rules: {},
    };
}
