import { LineLintConfig, LineLintRules } from '../config/line-lint-config';
import { concatRegExp } from '../utils/text-utils';
import { patternMap } from './pattern-map';

type ReplacementStep = [RegExp, string];
type ReplacementPipeline = Array<ReplacementStep>;

export class Replacer {
    private replacementPipeline: ReplacementPipeline;

    constructor(config: LineLintConfig) {
        this.replacementPipeline = this.prepareReplacementPipeline(config);
    }

    public fix(code: string): string {
        return this.applyReplacements(code, this.replacementPipeline);
    }

    private prepareReplacementPipeline(config: LineLintConfig): ReplacementPipeline {
        return [
            ...this.prepareBlockPaddingPipeline(config.rules),
            ...this.prepareRemovalPipeline(config.rules),
            ...this.prepareInsertionPipeline(config.rules),
            ...this.prepareCleanupPipeline(),
        ];
    }
    private prepareBlockPaddingPipeline(rules: LineLintRules): ReplacementPipeline {
        const blockPaddingPipeline: ReplacementPipeline = [];
        if (rules['block-padding']) {
            const removeOption = rules['block-padding'].remove;
            const insertOption = rules['block-padding'].insert;

            if (removeOption && (removeOption === 'before' || removeOption === 'both')) {
                blockPaddingPipeline.push([/({\n)\n+/mg, '$1']);
            }

            if (removeOption && (removeOption === 'after' || removeOption === 'both')) {
                blockPaddingPipeline.push([/\n+(\n[ \t]*})/mg, '$1']);
            }

            if (insertOption && (insertOption === 'before' || insertOption === 'both')) {
                blockPaddingPipeline.push([/({\n)/mg, '$1\n']);
            }

            if (insertOption && (insertOption === 'after' || insertOption === 'both')) {
                blockPaddingPipeline.push([/(\n[ \t]*})/mg, '\n$1']);
            }
        }

        return blockPaddingPipeline;
    }

    private prepareRemovalPipeline(rules: LineLintRules): ReplacementPipeline {
        const removalPipeline: ReplacementPipeline = [];
        for (const ruleName of Object.keys(patternMap)) {
            if (!rules[ruleName]) { continue; }

            const removeOption = rules[ruleName].remove;
            if (removeOption && removeOption !== 'none') {
                switch (removeOption) {
                    case 'before':
                        removalPipeline.push([concatRegExp(/^\n*/, patternMap[ruleName]), '$1']);
                        break;
                    case 'after':
                        removalPipeline.push([concatRegExp(patternMap[ruleName], /(\n*)/), '$1']);
                        break;
                    case 'both':
                        removalPipeline.push([concatRegExp(/^\n*/, patternMap[ruleName], /(\n*)/), '$1']);
                }
            }
        }

        return removalPipeline;
    }

    private prepareInsertionPipeline(rules: LineLintRules): ReplacementPipeline {
        const insertionPipeline: ReplacementPipeline = [];
        for (const ruleName of Object.keys(patternMap)) {
            if (!rules[ruleName]) { continue; }

            const insertOption = rules[ruleName].insert;
            if (insertOption && insertOption !== 'none') {
                switch (insertOption) {
                    case 'before':
                        insertionPipeline.push([patternMap[ruleName], '\n$1']);
                        break;
                    case 'after':
                        insertionPipeline.push([patternMap[ruleName], '$1\n']);
                        break;
                    case 'both':
                        insertionPipeline.push([patternMap[ruleName], '\n$1\n']);
                }
            }
        }

        return insertionPipeline;
    }

    private prepareCleanupPipeline(): ReplacementPipeline {
        return [
            [patternMap['leading-blank'], ''],
            [patternMap['duplicate-blanks'], '\n'],
            [patternMap['excess-trailing-blanks'], ''],
        ];
    }

    private applyReplacements(code: string, pipeline: ReplacementPipeline): string {
        return pipeline.reduce((result, step) => {
            const search = step[0];
            const replace = step[1];
            return String.prototype.replace.call(result, search, replace);
        }, code);
    }

}
