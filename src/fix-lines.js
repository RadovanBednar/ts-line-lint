function fixLines(inputCode, indentSize = 4) {
    // search patterns
    const newlineFollowedPropertyDecorator = /(^[ \t]+@\w+\([\w'"]*\))\n[ \t]+(?!.*\b(set|get)\b.*)/mg;
    const blankPrecededImport = /\n(\n^import {.*$)/mg;
    const blankPrecededVariableDeclaration = /(?<!})\n(\n[ \t]*(?:var|const|let|(@.* )?(private|protected|public)) )/mg;
    const blankFollowedStartOfBlock = /({\n)\n+/mg;
    const blankPrecededEndOfBlock = /\n+(\n[ \t]*})/mg;
    const blankUnfollowedLastImport = /(^import .*\n|^} from .*\n)(?!^(?:import|[ \t]+|\n))/mg;
    const consecutiveTypeAliases = /((?:^(export )?type .*;\n)+)/mg;
    const multilineTypeAlias = /(^([ \t]*)(?:export )?type .*\n(?:[ \t]+.*\n)+?\2[^;]*;)/mg;
    const interfaceDeclaration = /(^([ \t]*)(?:export )?interface \w+ {\n(?:.*\n)*?\2})/mg;
    const functionDeclaration = /(^([ \t]*)(?:async )?function .*[{,]\n(?:.*\n)*?\2})/mg;
    const classDeclarationWithOptionalDecorator = /(^([ \t]*)(?:@\w+\((?:{\n(?:.*\n)*?\2})?\)\n\2)?.*\bclass\b.*\n(?:.*\n)*?\2})/mg;
    const blockInsideClass = /(^([ \t]*)(?:@\w+\([\w'"]*\)\n\2)?(?:public |protected |private |get |set |constructor\().*[{,]\n(?:(?!\2};).*\n)*?\2}\n)/mg;
    const abstractMethodOrAccessor = /(^([ \t]*)(?:public |protected |private )?abstract [^(\n]*\(.*\n)/mg;
    const propertyWithEffectDecorator = /(^([ \t]*)@Effect\([^)]*\)) (.*\n(?:.*\n)*?\2\S.*)/mg;
    const blockInsideDescribe = /(^([ \t]*)(before(Each|All)?|after(Each|All)?|it)\(.*\n(?:.*\n)*?\2\S.*)/mg;
    const variouslyIndentedDescribeBlocks = generateNestedDescribeBlockPatterns(indentSize, 4);
    const tslintDisableNextLineComment = /(^([ \t]*)\/(?:\/|\*) tslint:disable-next-line.*\n)\n+/mg;
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
      .replace(abstractMethodOrAccessor, surroundWithBlanks)
      .replace(propertyWithEffectDecorator, addNewlineAfterDecoratorAndSurroundWithBlanks)
      .replace(blockInsideDescribe, surroundWithBlanks);

    variouslyIndentedDescribeBlocks.forEach((pattern) => {
        codeWithBlanksInserted = codeWithBlanksInserted.replace(pattern, surroundWithBlanks);
    });

    //cleanup
    return codeWithBlanksInserted
      .replace(tslintDisableNextLineComment, removeFollowingBlank)
      .replace(leadingBlank, removeCompletely)
      .replace(duplicateBlanks, replaceWithSingleBlank)
      .replace(excessTrailingBlanks, removeCompletely);
}

function generateNestedDescribeBlockPatterns(indentSize, maxIndentLevel = 4) {
    const patternArray = [];
    for (let indentLevel = 0; indentLevel <= maxIndentLevel; indentLevel++) {
        const indentPattern = !indentSize ? `\\t{${indentLevel}}` : ` {${indentSize * indentLevel}}`;
        patternArray.push(new RegExp(`(^(${indentPattern})describe\\(.*, \\(\\) => {\\n(.*\\n)*?\\2\\S.*)`, 'mg'));
    }

    return patternArray;
}

module.exports = fixLines;
