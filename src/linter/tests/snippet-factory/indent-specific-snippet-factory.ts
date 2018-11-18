import { IndentType } from '../../../config/line-lint-config';
import { IndentSpecificRuleName } from '../../rules';
import { indentSpecificSnippetMap } from './indent-specific-snippet';
import { SnippetFactory } from './snippet-factory';

export class IndentSpecificSnippetFactory extends SnippetFactory {

    constructor(ruleName: IndentSpecificRuleName, indent: IndentType) {
        super(createIndentedSnippet(ruleName, indent));
    }

}

function createIndentedSnippet(ruleName: IndentSpecificRuleName, indent: IndentType): string {
    const indentString = (indent === 'tab') ? '\t' : ' '.repeat(indent);
    return indentSpecificSnippetMap[ruleName].replace(/%IND%/g, indentString);
}
