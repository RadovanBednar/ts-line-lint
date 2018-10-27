import { expect } from 'chai';
import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { Replacer } from '../replacer';

// tslint:disable-next-line:typedef
export function expectReplacerWithConfig(config: LineLintConfig) {
    const replacer = new Replacer(config);
    const cleanupOnlyReplacer = new Replacer(EMPTY_RULES_CONFIG);

    return {
        // tslint:disable-next-line:typedef
        toConvert(snippet: string) {
            return {
                to(output: string): void {
                    expect(replacer.fix(snippet)).to.equal(output);
                },
            };
        },
        toOnlyApplyCleanupReplacementsTo(snippet: string): void {
            expect(replacer.fix(snippet)).to.equal(cleanupOnlyReplacer.fix(snippet));
        },
    };
}

// tslint:disable-next-line:typedef
export function expectReplacerToConvert(snippet: string) {
    return expectReplacerWithConfig(EMPTY_RULES_CONFIG).toConvert(snippet);
}
