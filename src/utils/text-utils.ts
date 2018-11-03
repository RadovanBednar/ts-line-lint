export function createMultilineString(...lines: Array<string>): string {
    return lines.join('\n');
}

export function prependBlankLines(pattern: RegExp): RegExp {
    return new RegExp(/^\n+/.source + pattern.source, pattern.flags);
}

export function appendBlankLines(pattern: RegExp): RegExp {
    return new RegExp(pattern.source + /\n+/.source, pattern.flags);
}

export function surroundWithBlankLines(pattern: RegExp): RegExp {
    return new RegExp(/^\n*/.source + pattern.source + /\n+/.source, pattern.flags);
}
