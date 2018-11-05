import { IndentType, LineLintConfig } from '../../config/line-lint-config';
import { RuleName } from '../pattern-maps/rule-pattern-map';
import { ReplacementPipeline, ReplacementStep } from './../linter';
import { filterRulesConfiguredFor, preparePatterns } from './pipeline-builder-utils';

export class InsertionPipelineBuilder {

    public static build(config: LineLintConfig): ReplacementPipeline {
        const insertionPipeline = [];
        for (const rule of filterRulesConfiguredFor('insert', config.rules)) {
            switch (config.rules[rule].insert) {
                case 'before':
                    insertionPipeline.push(...InsertionPipelineBuilder.createInsertBeforeSteps(rule, config.indent));
                    break;
                case 'after':
                    insertionPipeline.push(...InsertionPipelineBuilder.createInsertAfterSteps(rule, config.indent));
                    break;
                case 'both':
                    insertionPipeline.push(...InsertionPipelineBuilder.createInsertBothSteps(rule, config.indent));
            }
        }
        return insertionPipeline;
    }

    private static createInsertBeforeSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [pattern, '\n$1']);
    }

    private static createInsertAfterSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [pattern, '$1\n']);
    }

    private static createInsertBothSteps(rule: RuleName, indent: IndentType): ReplacementPipeline {
        return preparePatterns(rule, indent)
            .map((pattern): ReplacementStep => [pattern, '\n$1\n']);
    }

}
