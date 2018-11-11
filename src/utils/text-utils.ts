export function createMultilineString(...lines: Array<string>): string {
    return lines.join('\n');
}

export function generateRandomString(length: number): string {
    return (+new Date() * Math.random()).toString(36).substring(0, length);
}
