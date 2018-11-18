import { LineLintConfig } from '../../config/line-lint-config';
import { ReplacementPipeline } from './../linter';
import { appendBlankLines } from './pipeline-builder-utils';

export class BlockPaddingPipelineBuilder {

    public static build(config: LineLintConfig): ReplacementPipeline {
        const startOfBlockPattern: RegExp = /({\n)/mg;
        const blockPaddingPipeline: ReplacementPipeline = [];
        const blockPaddingRuleConfig = config.rules['block-padding'];

        if (blockPaddingRuleConfig) {
            const removeOption = blockPaddingRuleConfig.remove;
            const insertOption = blockPaddingRuleConfig.insert;

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
