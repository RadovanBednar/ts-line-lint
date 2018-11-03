import { LineLintConfig } from '../config/line-lint-config';
import { patternMap } from './pattern-map';
import { BlockPaddingPipelineBuilder } from './pipeline-builder/block-padding-pipeline-builder';
import { InsertionPipelineBuilder } from './pipeline-builder/insertion-pipeline-builder';
import { RemovalPipelineBuilder } from './pipeline-builder/removal-pipeline-builder';

export type ReplacementStep = [RegExp, string];
export type ReplacementPipeline = Array<ReplacementStep>;

export class Replacer {
    private replacementPipeline: ReplacementPipeline;
    private blockPaddingPipelineBuilder: BlockPaddingPipelineBuilder;
    private removalPipelineBuilder: RemovalPipelineBuilder;
    private insertionPipelineBuilder: InsertionPipelineBuilder;

    constructor(config: LineLintConfig) {
        this.blockPaddingPipelineBuilder = new BlockPaddingPipelineBuilder(config);
        this.removalPipelineBuilder = new RemovalPipelineBuilder(config);
        this.insertionPipelineBuilder = new InsertionPipelineBuilder(config);
        this.replacementPipeline = this.prepareReplacementPipeline();
    }

    public fix(code: string): string {
        return this.applyReplacements(code, this.replacementPipeline);
    }

    private prepareReplacementPipeline(): ReplacementPipeline {
        return [
            ...this.blockPaddingPipelineBuilder.get(),
            ...this.removalPipelineBuilder.get(),
            ...this.insertionPipelineBuilder.get(),
            ...this.prepareCleanupPipeline(),
        ];
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
