function fixLines(inputCode, indentSize = 4) {
    // search patterns
    const newlineFollowedPropertyDecorator = /(^[ \t]+@\w+\([\w'"]*\))\n[ \t]+(?!.*\b(set|get)\b.*)/mg;
    const blankPrecededImport = /\n(\n^import {.*$)/mg;
    const blankPrecededVariableDeclaration = /(?<!})\n(\n[ \t]*(?:var|const|let|(@.* )?(private|protected|public)) )/mg;
    const blankFollowedStartOfBlock = /({\n)\n+/mg;
    const blankPrecededEndOfBlock = /\n+(\n[ \t]*})/mg;
    const blankUnfollowedLastImport = /(^import .*\n|^} from .*\n)(?!^(?:import|[ \t]+|\n))/mg;
    const consecutiveTypeAliases = /((?:^(export )?type .*;\n)+)/mg;
    const multilineTypeAlias = /(^(export )?type .*\n(?:[ \t]+.*\n)+?^.*;)/mg;
    const interfaceDeclaration = /(^(?:export )?interface \w+ {\n(?:(?:[ \t]+.*)?\n)*?^})/mg;
    const functionDeclaration = /(^([ \t]*)(?:(?:\/\/|\/\*) .*\n\2)?(?:async )?function .*[{,]\n(?:.*\n)*?\2})/mg;
    const classDeclarationWithOptionalDecorator = /(^([ \t]*)(?:@\w+\((?:{\n(?:.*\n)*?\2})?\)\n\2)?.*\bclass\b.*\n(?:.*\n)*?\2})/mg;
    const blockInsideClass = /(^([ \t]*)(?:@\w+\([\w'"]*\)\n\2)?(?:public |protected |private |get |set |constructor\().*[{,]\n(?:.*\n)*?\2})/mg;
    const propertyWithEffectDecorator = /(^([ \t]*)@Effect\([^)]*\)) (.*\n(?:(?:\2[ \t]*.*)?\n)*?\2\);)/mg;
    const blockInsideDescribe = /(^([ \t]*)(before(Each|All)?\(|after(Each|All)?\(|it\().*\n(?:.*\n)*?\2}\)+;)/mg;
    const variouslyIndentedDescribeBlocks = generateNestedDescribeBlockPatterns(indentSize, 4);
    const leadingBlank = /^\n+/g;
    const duplicateBlanks = /(?<=\n)(\n+)/g;
    const excessTrailingBlanks = /(?<=\n)(\n+)$/g;
    // replacements
    const inlineWithDeclaration = '$1 $2';
    const removePrecedingBlank = '$1';
    const removeFollowingBlank = '$1';
    const surroundWithBlanks = '\n$1\n';
    const addNewlineAfterDecoratorAndSurroundWithBlanks = '\n$1\n$2$3\n';
    const addFollowingBlank = '$1\n';
    const removeCompletely = '';
    const replaceWithSingleBlank = '\n';

    let codeWithBlanksRemoved = inputCode
      .replace(newlineFollowedPropertyDecorator, inlineWithDeclaration)
      .replace(blankPrecededImport, removePrecedingBlank)
      .replace(blankPrecededVariableDeclaration, removePrecedingBlank)
      .replace(blankFollowedStartOfBlock, removeFollowingBlank)
      .replace(blankPrecededEndOfBlock, removePrecedingBlank);

    let codeWithBlanksInserted = codeWithBlanksRemoved
      .replace(blankUnfollowedLastImport, addFollowingBlank)
      .replace(consecutiveTypeAliases, surroundWithBlanks)
      .replace(multilineTypeAlias, surroundWithBlanks)
      .replace(interfaceDeclaration, surroundWithBlanks)
      .replace(functionDeclaration, surroundWithBlanks)
      .replace(classDeclarationWithOptionalDecorator, surroundWithBlanks)
      .replace(blockInsideClass, surroundWithBlanks)
      .replace(propertyWithEffectDecorator, addNewlineAfterDecoratorAndSurroundWithBlanks)
      .replace(blockInsideDescribe, surroundWithBlanks);

    variouslyIndentedDescribeBlocks.forEach((pattern) => {
        codeWithBlanksInserted = codeWithBlanksInserted.replace(pattern, surroundWithBlanks);
    });

    //cleanup
    return codeWithBlanksInserted
      .replace(leadingBlank, removeCompletely)
      .replace(duplicateBlanks, replaceWithSingleBlank)
      .replace(excessTrailingBlanks, removeCompletely);
}

function generateNestedDescribeBlockPatterns(indentSize, maxIndentLevel = 4) {
    const patternArray = [];
    for (let i = 0; i <= maxIndentLevel; i++) {
        const indentPattern = !indentSize ? '\\t' : ` {${indentSize}}`;
        patternArray.push(new RegExp(`(^((?:${indentPattern}){${i}})describe\\(.*, \\(\\) => {\\n(.*\\n)*?\\2}\\);)`, 'mg'));
    }

    return patternArray;
}

module.exports = fixLines;
