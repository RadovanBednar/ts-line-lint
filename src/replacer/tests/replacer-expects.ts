import { expect } from 'chai';
import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { Replacer } from '../replacer';

export function expectReplacerWithConfig(config: LineLintConfig) {
    const replacer = new Replacer(config);
    const cleanupOnlyReplacer = new Replacer(EMPTY_RULES_CONFIG);

    return {
        toConvert(snippet: string) {
            return {
                to(output: string): void {
                    expect(replacer.fix(snippet)).to.equal(output);
                },
            };
        },
        toOnlyApplyCleanupReplacementsTo(snippet: string) {
            expect(replacer.fix(snippet)).to.equal(cleanupOnlyReplacer.fix(snippet));
        },
    };
}

export function expectReplacerToConvert(snippet: string) {
    return expectReplacerWithConfig(EMPTY_RULES_CONFIG).toConvert(snippet);
}
