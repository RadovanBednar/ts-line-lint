import { expect } from 'chai';
import { EMPTY_RULES_CONFIG, LineLintConfig, LineLintModificationOption, LineLintRuleOptions } from '../../config/line-lint-config';
import { Linter } from '../linter';
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

// tslint:disable-next-line:typedef
export function expectLinterWithConfig(config: LineLintConfig) {
    const linter = new Linter(config);

    return {
        // tslint:disable-next-line:typedef
        toConvert(snippet: string) {
            return {
                to(output: string): void {
                    expect(linter.lint(snippet)).to.equal(output);
                },
            };
        },
        toOnlyApplyCleanupReplacementsTo(snippet: string): void {
            const cleanupOnlyLinter = new Linter(EMPTY_RULES_CONFIG);
            expect(linter.lint(snippet)).to.equal(cleanupOnlyLinter.lint(snippet));
        },
    };
}

// tslint:disable-next-line:typedef
export function expectLinterToConvert(snippet: string) {
    return expectLinterWithConfig(EMPTY_RULES_CONFIG).toConvert(snippet);
}
