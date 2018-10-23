export function createMultilineString(...lines: Array<string>): string {
    return lines.join('\n');
}

export function concatRegExp(...patterns: Array<RegExp>): RegExp {
    const combinedLiteral = patterns.reduce((result, pattern) => result + pattern.source, '');
    const combinedFlags = sortAndRemoveDuplicateChars(patterns.reduce((result, pattern) => result + pattern.flags, ''));

    return new RegExp(combinedLiteral, combinedFlags);
}

export function sortAndRemoveDuplicateChars(str: string): string {
    return str.split('').sort().join('').replace(/(.)(?=.*\1)/g, '');
}
