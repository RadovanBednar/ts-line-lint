import { cleanupPatternMap } from '../pattern-maps/cleanup-pattern-map';
import { ReplacementPipeline } from './../linter';

export class CleanupPipelineBuilder {

    public static build(): ReplacementPipeline {
        return [
            [cleanupPatternMap['tslint-disable-next-line-comment'], '$1'],
            [cleanupPatternMap['leading-blank'], ''],
            [cleanupPatternMap['duplicate-blanks'], '\n'],
            [cleanupPatternMap['excess-trailing-blanks'], ''],
        ];
    }

}
