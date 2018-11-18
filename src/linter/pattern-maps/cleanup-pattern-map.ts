import { Dictionary } from '../../utils/types';

export const cleanupPatternMap: Readonly<Dictionary<RegExp>> = {
    'tslint-disable-next-line-comment': /(^[ \t]*\/(?:\/|\*) tslint:disable-next-line.*\n)\n+/mg,
    'leading-blank': /^\n+/g,
    'duplicate-blanks': /(?<=\n)(\n+)/g,
    'excess-trailing-blanks': /(?<=\n)(\n+)$/g,
};
