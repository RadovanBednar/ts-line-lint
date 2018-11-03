import { LineLintConfig } from '../../config/line-lint-config';
import { appendBlankLines, prependBlankLines, surroundWithBlankLines } from '../../utils/text-utils';
import { RuleName } from './../pattern-map';
import { ReplacementPipeline, ReplacementStep } from './../replacer';
import { PipelineBuilder } from './pipeline-builder';

export class RemovalPipelineBuilder extends PipelineBuilder {

    constructor(config: LineLintConfig) {
        super(config);
    }

    public get(): ReplacementPipeline {
        return this.pipeline;
    }

    protected build(): void {
        for (const rule of this.filterRulesConfiguredFor('remove')) {
            switch (this.rules[rule].remove) {
                case 'before':
                    this.pipeline.push(...this.createRemoveBeforeSteps(rule));
                    break;
                case 'after':
                    this.pipeline.push(...this.createRemoveAfterSteps(rule));
                    break;
                case 'both':
                    this.pipeline.push(...this.createRemoveBothSteps(rule));
            }
        }
    }

    private createRemoveBeforeSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [prependBlankLines(pattern), '$1']);
    }

    private createRemoveAfterSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [appendBlankLines(pattern), '$1']);
    }

    private createRemoveBothSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [surroundWithBlankLines(pattern), '$1']);
    }

}
