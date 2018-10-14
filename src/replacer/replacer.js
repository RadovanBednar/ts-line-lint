class Replacer {
    constructor(config) {
        this.indent = config.indent;
        this.replacementPipeline = prepareReplacementPipeline(config);
    }

    fix(code) {
        return applyReplacements(code, this.replacementPipeline);
    }
}

function prepareReplacementPipeline(config) {
    const patternMap = new Map([
        ['individual-import', /(^import {(.*|(?:\n(?:[ \t]*.*,?\n)+?))} from .*\n)/mg],
    ]);

    return [
        ...prepareRemovalPipeline(config.rules, patternMap),
        ...prepareInsertionPipeline(config.rules, patternMap)
    ];
}

function prepareRemovalPipeline(rules, patternMap) {
    const removalPipeline = [];
    for (const ruleName of patternMap.keys()) {
        if (!rules[ruleName]) continue;

        const removeOption = rules[ruleName].remove;
        if (removeOption && removeOption !== 'none') {
            switch (removeOption) {
                case 'before':
                removalPipeline.push([concatRegExp(/(\n*)/, patternMap.get(ruleName)), '$2']);
                break;
                case 'after':
                removalPipeline.push([concatRegExp(patternMap.get(ruleName), /(\n*)/), '$1']);
                break;
                case 'both':
                removalPipeline.push([concatRegExp(/(\n*)/, patternMap.get(ruleName), /(\n*)/), '$2']);
            }
        }
    }

    return removalPipeline;
}

function prepareInsertionPipeline(rules, patternMap) {
    const insertionPipeline = [];
    for (const ruleName of patternMap.keys()) {
        if (!rules[ruleName]) continue;

        const insertOption = rules[ruleName].insert;
        if (insertOption && insertOption !== 'none') {
            switch (insertOption) {
                case 'before':
                insertionPipeline.push([patternMap.get(ruleName), '\n$1']);
                break;
                case 'after':
                insertionPipeline.push([patternMap.get(ruleName), '$1\n']);
                break;
                case 'both':
                insertionPipeline.push([patternMap.get(ruleName), '\n$1\n']);
            }
        }
    }

    return insertionPipeline;
}

function concatRegExp(...patterns) {
    const combinedLiteral = patterns.reduce((result, pattern) => result + pattern.source, '');
    const combinedFlags = sortAndRemoveDuplicateChars(patterns.reduce((result, pattern) => result + pattern.flags, ''));

    return new RegExp(combinedLiteral, combinedFlags);
}

function sortAndRemoveDuplicateChars(str) {
    return str.split('').sort().join('').replace(/(.)(?=.*\1)/g, '')
}

function applyReplacements(code, pipeline) {
    return pipeline.reduce((result, step) => {
        const search = step[0];
        const replace = step[1];
        return String.prototype.replace.call(result, search, replace);
    }, code);
}

module.exports = Replacer;
