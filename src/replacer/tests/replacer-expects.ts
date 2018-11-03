import { expect } from 'chai';
import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { Replacer } from '../replacer';

// tslint:disable-next-line:typedef
export function expectReplacerWithConfig(config: LineLintConfig) {
    const replacer = new Replacer(config);

    return {
        // tslint:disable-next-line:typedef
        toConvert: function(snippet: string) {
            return {
                to: function(output: string): void {
                    expect(replacer.fix(snippet)).to.equal(output);
                },
            };
        },
        toOnlyApplyCleanupReplacementsTo: function(snippet: string): void {
            const cleanupOnlyReplacer = new Replacer(EMPTY_RULES_CONFIG);
            expect(replacer.fix(snippet)).to.equal(cleanupOnlyReplacer.fix(snippet));
        },
    };
}

// tslint:disable-next-line:typedef
export function expectReplacerToConvert(snippet: string) {
    return expectReplacerWithConfig(EMPTY_RULES_CONFIG).toConvert(snippet);
}
