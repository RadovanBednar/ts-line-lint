class Replacer {
    constructor(config) {
        this.indent = config.indent;
        this.rules = config.rules;

        this.replacementPipeline = prepareReplacementPipeline(config);
    }

    fix(code) {
        return this.replacementPipeline
            .reduce((result, step) => String.prototype.replace.call(result, step.search, step.replace), code);
    }
}

function prepareReplacementPipeline(config) {
    const pipeline = [];
    const patterns = {
        'blanks': /(\n*)/,
        'individual-import': /(^import {(.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)/,
    };
    
    if (config.rules['individual-import']) {
        if (config.rules['individual-import'].remove === "before") {
            pipeline.push({
                 search: new RegExp(patterns.blanks.source + patterns['individual-import'].source, 'mg'),
                 replace: '$2',
             });
        } else if (config.rules["individual-import"].remove === "after") {
            pipeline.push({
                 search: new RegExp(patterns['individual-import'].source + patterns.blanks.source, 'mg'),
                 replace: '$1',
             });
        } else if (config.rules["individual-import"].remove === "both") {
            pipeline.push({
                 search: new RegExp(patterns.blanks.source + patterns['individual-import'].source + patterns.blanks.source, 'mg'),
                 replace: '$2',
             });
        } else if (config.rules['individual-import'].insert === "before") {
            pipeline.push({
                 search: new RegExp(patterns['individual-import'].source, 'mg'),
                 replace: '\n$1',
             });
        } else if (config.rules['individual-import'].insert === "after") {
            pipeline.push({
                 search: new RegExp(patterns['individual-import'].source, 'mg'),
                 replace: '$1\n',
             });
        } else if (config.rules['individual-import'].insert === "both") {
            pipeline.push({
                 search: new RegExp(patterns['individual-import'].source, 'mg'),
                 replace: '\n$1\n',
             });
        }
    }

    return pipeline;
}

module.exports = Replacer;
