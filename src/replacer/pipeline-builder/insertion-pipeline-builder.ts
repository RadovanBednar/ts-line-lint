import { LineLintConfig } from '../../config/line-lint-config';
import { RuleName } from './../pattern-map';
import { ReplacementPipeline, ReplacementStep } from './../replacer';
import { PipelineBuilder } from './pipeline-builder';

export class InsertionPipelineBuilder extends PipelineBuilder {

    constructor(config: LineLintConfig) {
        super(config);
    }

    public get(): ReplacementPipeline {
        return this.pipeline;
    }

    protected build(): void {
        for (const rule of this.filterRulesConfiguredFor('insert')) {
            switch (this.rules[rule].insert) {
                case 'before':
                    this.pipeline.push(...this.createInsertBeforeSteps(rule));
                    break;
                case 'after':
                    this.pipeline.push(...this.createInsertAfterSteps(rule));
                    break;
                case 'both':
                    this.pipeline.push(...this.createInsertBothSteps(rule));
            }
        }
    }

    private createInsertBeforeSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [pattern, '\n$1']);
    }

    private createInsertAfterSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [pattern, '$1\n']);
    }

    private createInsertBothSteps(rule: RuleName): ReplacementPipeline {
        return this.preparePatterns(rule)
            .map((pattern): ReplacementStep => [pattern, '\n$1\n']);
    }

}
