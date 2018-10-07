module.exports = {
    createMultilineString: (...lines) => lines.join('\n'),
    resolveNestedValue: (object, path) => path.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, object),
}
