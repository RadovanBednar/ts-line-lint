function fixLines(inputCode) {
    // search patterns
    const newlineFollowedInputOutputDecorator = /(^[ \t]+@(?:In|Out)put\(['\w]*\))\n[ \t]+(.*)/mg;
    const blankPrecededImport = /\n(\n^import {.*$)/mg;
    const blankPrecededVariableDeclaration = /\n(\n[ \t]*(?:var|const|let|(.* )?(private|protected|public)) )/mg;
    const blankFollowedStartOfBlock = /({\n)\n+/mg;
    const blankPrecededEndOfBlock = /\n+(\n[ \t]*})/mg;
    const consecutiveTypeAliases = /((?:^export type .*\n)+)/mg;
    const interfaceDeclaration = /(^(?:export )?interface \w+ {\n(?:(?:[ \t]+.*)?\n)*?^})/mg;
    const functionDeclaration = /((?:^[ \t]*(?:\/\/|\/\*).*\n)?^([ \t]*)(async )?function \w+\(.*\).*{\n(?:(?:\2[ \t]+.*)?\n)*?\2})/mg;
    const classDeclaration = /(^([ \t]*).*?class .*(?: |\n\2[ \t]+.*?){\n(?:(?:\2[ \t]+.*)?\n)*?^\2})/mg;
    const newlineFollowedComponentDecorator = /(^([ \t]+)?@Component\({\n(?:\2[ \t]+.*\n)*?\2?}\)\n)\n/mg;
    const blockInsideClass = /(^([ \t]*)(public |protected |private |(.* )?(g|s)et |constructor\().*\n(?:(?:\2[ \t]+.*)?\n)*?\2})/mg;
    const describeBlock = /(^([ \t]*)describe\(.*, \(\) => {\n(.*\n)*?\2}\);)/mg;
    const blockInsideDescribe = /(^([ \t]*)(before(Each)?\(|after(Each)?\(|it\().*\n(?:.*\n)*?\2}\);)/mg;
    const blankUnfollowedLastImport = /(^import .*\n|^} from .*\n)(?!^(?:import|[ \t]+))/mg;
    const leadingBlank = /^\n+/g;
    const duplicateBlanks = /(?<=\n)(\n+)/g;
    const excessTrailingBlanks = /(?<=\n)(\n+)$/g;
    // replacements
    const inlineWithDeclaration = '$1 $2';
    const removePrecedingBlank = '$1';
    const removeFollowingBlank = '$1';
    const surroundWithBlanks = '\n$1\n';
    const addFollowingBlank = '$1\n';
    const removeCompletely = '';
    const replaceWithSingleBlank = '\n';

    return inputCode
        // blank removals
        .replace(newlineFollowedInputOutputDecorator, inlineWithDeclaration)
        .replace(blankPrecededImport, removePrecedingBlank)
        .replace(blankPrecededVariableDeclaration, removePrecedingBlank)
        .replace(blankFollowedStartOfBlock, removeFollowingBlank)
        .replace(blankPrecededEndOfBlock, removePrecedingBlank)
        // blank insertions
        .replace(consecutiveTypeAliases, surroundWithBlanks)
        .replace(interfaceDeclaration, surroundWithBlanks)
        .replace(functionDeclaration, surroundWithBlanks)
        .replace(classDeclaration, surroundWithBlanks)
        .replace(blockInsideClass, surroundWithBlanks)
        .replace(describeBlock, surroundWithBlanks)
        .replace(blockInsideDescribe, surroundWithBlanks)
        .replace(blankUnfollowedLastImport, addFollowingBlank)
        // cleanup
        .replace(newlineFollowedComponentDecorator, removeFollowingBlank)
        .replace(leadingBlank, removeCompletely)
        .replace(duplicateBlanks, replaceWithSingleBlank)
        .replace(excessTrailingBlanks, removeCompletely);
}

module.exports = fixLines;
