import { IndentType, LineLintConfig } from '../../config/line-lint-config';
import { RuleName } from '../pattern-maps/rule-pattern-map';
import { ReplacementPipeline, ReplacementStep } from './../replacer';
import { appendBlankLines, filterRulesConfiguredFor, preparePatterns, prependBlankLines, surroundWithBlankLines } from './pipeline-builder-utils';

export class RemovalPipelineBuilder {

    public static build(config: LineLintConfig): ReplacementPipeline {
        const removalPipeline = [];
        for (const rule of filterRulesConfiguredFor('remove', config.rules)) {
            switch (config.rules[rule].remove) {
                case 'before':
                    removalPipeline.push(...RemovalPipelineBuilder.createRemoveBeforeSteps(rule, config.indent));
                    break;
                case 'after':
                    removalPipeline.push(...RemovalPipelineBuilder.createRemoveAfterSteps(rule, config.indent));
                    break;
                case 'both':
                    removalPipeline.push(...RemovalPipelineBuilder.createRemoveBothSteps(rule, config.indent));
            }
        }
        return removalPipeline;
    }

    private static createRemoveBeforeSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [prependBlankLines(pattern), '$1']);
    }

    private static createRemoveAfterSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [appendBlankLines(pattern), '$1']);
    }

    private static createRemoveBothSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [surroundWithBlankLines(pattern), '$1']);
    }

}
