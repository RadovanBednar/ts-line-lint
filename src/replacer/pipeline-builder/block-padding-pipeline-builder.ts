import { LineLintConfig } from '../../config/line-lint-config';
import { appendBlankLines } from '../../utils/text-utils';
import { ReplacementPipeline } from './../replacer';
import { PipelineBuilder } from './pipeline-builder';

export class BlockPaddingPipelineBuilder extends PipelineBuilder {

    constructor(config: LineLintConfig) {
        super(config);
    }

    public get(): ReplacementPipeline {
        return this.pipeline;
    }

    protected build(): void {
        const startOfBlockPattern: RegExp = /({\n)/mg;

        if (this.rules['block-padding']) {
            const removeOption = this.rules['block-padding'].remove;
            const insertOption = this.rules['block-padding'].insert;

            if (removeOption) {
                if (removeOption === 'before' || removeOption === 'both') {
                    this.pipeline.push([appendBlankLines(startOfBlockPattern), '$1']);
                }
                if (removeOption === 'after' || removeOption === 'both') {
                    this.pipeline.push([/\n+(\n[ \t]*})/mg, '$1']);
                }
            }

            if (insertOption) {
                if (insertOption === 'before' || insertOption === 'both') {
                    this.pipeline.push([startOfBlockPattern, '$1\n']);
                }
                if (insertOption === 'after' || insertOption === 'both') {
                    this.pipeline.push([/(\n[ \t]*})/mg, '\n$1']);
                }
            }
        }
    }

}
