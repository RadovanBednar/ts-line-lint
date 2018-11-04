import { LineLintConfig } from '../../config/line-lint-config';
import { ReplacementPipeline } from './../replacer';
import { appendBlankLines } from './pipeline-builder-utils';

export class BlockPaddingPipelineBuilder {

    public static build(config: LineLintConfig): ReplacementPipeline {
        const startOfBlockPattern: RegExp = /({\n)/mg;
        const blockPaddingPipeline: ReplacementPipeline = [];

        if (config.rules['block-padding']) {
            const removeOption = config.rules['block-padding'].remove;
            const insertOption = config.rules['block-padding'].insert;

            if (removeOption) {
                if (removeOption === 'before' || removeOption === 'both') {
                    blockPaddingPipeline.push([appendBlankLines(startOfBlockPattern), '$1']);
                }
                if (removeOption === 'after' || removeOption === 'both') {
                    blockPaddingPipeline.push([/\n+(\n[ \t]*})/mg, '$1']);
                }
            }

            if (insertOption) {
                if (insertOption === 'before' || insertOption === 'both') {
                    blockPaddingPipeline.push([startOfBlockPattern, '$1\n']);
                }
                if (insertOption === 'after' || insertOption === 'both') {
                    blockPaddingPipeline.push([/(\n[ \t]*})/mg, '\n$1']);
                }
            }
        }
        return blockPaddingPipeline;
    }

}
