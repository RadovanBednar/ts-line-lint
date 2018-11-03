import { IndentType, LineLintConfig, LineLintRules } from '../config/line-lint-config';
import { appendBlankLines, prependBlankLines, surroundWithBlankLines } from '../utils/text-utils';
import { patternMap } from './pattern-map';

type ReplacementStep = [RegExp, string];
type ReplacementPipeline = Array<ReplacementStep>;

export class Replacer {
    private indent: IndentType;
    private replacementPipeline: ReplacementPipeline;

    constructor(config: LineLintConfig) {
        this.indent = config.indent;
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
                        this.addRemoveBeforeStep(removalPipeline, ruleName);
                        break;
                    case 'after':
                        this.addRemoveAfterStep(removalPipeline, ruleName);
                        break;
                    case 'both':
                        this.addRemoveBothStep(removalPipeline, ruleName);
                }
            }
        }

        return removalPipeline;
    }

    private addRemoveBeforeStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([prependBlankLines(pattern), '$1']);
            });
        } else {
            pipeline.push([prependBlankLines(patternMap[rule]), '$1']);
        }
    }

    private addRemoveAfterStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([appendBlankLines(pattern), '$1']);
            });
        } else {
            pipeline.push([appendBlankLines(patternMap[rule]), '$1']);
        }
    }

    private addRemoveBothStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([surroundWithBlankLines(pattern), '$1']);
            });
        } else {
            pipeline.push([surroundWithBlankLines(patternMap[rule]), '$1']);
        }
    }

    private prepareInsertionPipeline(rules: LineLintRules): ReplacementPipeline {
        const insertionPipeline: ReplacementPipeline = [];
        for (const ruleName of Object.keys(patternMap)) {
            if (!rules[ruleName]) { continue; }

            const insertOption = rules[ruleName].insert;
            if (insertOption && insertOption !== 'none') {
                switch (insertOption) {
                    case 'before':
                        this.addInsertBeforeStep(insertionPipeline, ruleName);
                        // insertionPipeline.push([patternMap[ruleName], '\n$1']);
                        break;
                    case 'after':
                        this.addInsertAfterStep(insertionPipeline, ruleName);
                        // insertionPipeline.push([patternMap[ruleName], '$1\n']);
                        break;
                    case 'both':
                        this.addInsertBothStep(insertionPipeline, ruleName);
                    // insertionPipeline.push([patternMap[ruleName], '\n$1\n']);
                }
            }
        }

        return insertionPipeline;
    }

    private addInsertBeforeStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([pattern, '\n$1']);
            });
        } else {
            pipeline.push([patternMap[rule], '\n$1']);
        }
    }

    private addInsertAfterStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([pattern, '$1\n']);
            });
        } else {
            pipeline.push([patternMap[rule], '$1\n']);
        }
    }

    private addInsertBothStep(pipeline: ReplacementPipeline, rule: keyof typeof patternMap): void {
        if (patternMap[rule].source.includes('%INDENT%')) {
            this.makeIndentSpecificPatterns(patternMap[rule]).forEach((pattern) => {
                pipeline.push([pattern, '\n$1\n']);
            });
        } else {
            pipeline.push([patternMap[rule], '\n$1\n']);
        }
    }

    private makeIndentSpecificPatterns(basePattern: RegExp): Array<RegExp> {
        const specificPatterns = [];
        for (let indentLevel = 0; indentLevel <= 4; indentLevel++) {
            const indentPattern = this.indent === 'tab' ? `\\t{${indentLevel}}` : ` {${this.indent * indentLevel}}`;
            specificPatterns.push(new RegExp(basePattern.source.replace('%INDENT%', indentPattern), basePattern.flags));
        }
        return specificPatterns;
    }

    private prepareCleanupPipeline(): ReplacementPipeline {
        return [
            [patternMap['tslint-disable-next-line-comment'], '$1'],
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
