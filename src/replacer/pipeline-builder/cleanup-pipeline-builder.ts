import { LineLintConfig } from '../../config/line-lint-config';
import { cleanupPatternMap } from '../pattern-maps/cleanup-pattern-map';
import { ReplacementPipeline } from './../replacer';
import { PipelineBuilder } from './pipeline-builder';

export class CleanupPipelineBuilder extends PipelineBuilder {

    constructor(config: LineLintConfig) {
        super(config);
    }

    public get(): ReplacementPipeline {
        return this.pipeline;
    }

    protected build(): void {
        Array.prototype.push.apply(this.pipeline, [
            [cleanupPatternMap['tslint-disable-next-line-comment'], '$1'],
            [cleanupPatternMap['leading-blank'], ''],
            [cleanupPatternMap['duplicate-blanks'], '\n'],
            [cleanupPatternMap['excess-trailing-blanks'], ''],
        ]);
    }

}
