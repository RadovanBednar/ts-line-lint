import { Dictionary } from '../../utils/types';
import { ReplacementPipeline } from './../linter';

const cleanupPatternMap: Readonly<Dictionary<RegExp>> = {
    'tslint-disable-next-line-comment': /(^[ \t]*\/(?:\/|\*) tslint:disable-next-line.*\n)\n+/mg,
    'leading-blank': /^\n+/g,
    'duplicate-blanks': /(?<=\n)(\n+)/g,
    'excess-trailing-blanks': /(?<=\n)(\n+)$/g,
};

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
