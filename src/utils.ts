export function resolveNestedValue(object: any, path: Array<string>): any {
    return path.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, object);
}
