import { LineLintConfig, LineLintModificationOption, LineLintRuleOptions } from '../../config/line-lint-config';

export function createMockConfig(rule: string,
                                 property: keyof LineLintRuleOptions,
                                 option: LineLintModificationOption): LineLintConfig {
    return {
        indent: 4,
        rules: { [rule]: { [property]: option } },
    };
}
