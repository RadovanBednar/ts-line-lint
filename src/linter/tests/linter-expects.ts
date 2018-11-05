import { expect } from 'chai';
import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { Linter } from '../linter';

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
