import { IndentType } from '../../../config/line-lint-config';
import { IndentSpecificRuleName } from '../../rules';
import { snippetMap } from './indent-specific-snippet';
import { SnippetFactory } from './snippet-factory';

export class IndentSpecificSnippetFactory implements SnippetFactory {
    private indentedSnippet: string;

    constructor(private ruleName: IndentSpecificRuleName, private indent: IndentType) {
        this.indentedSnippet = this.getIndentedSnippet();
    }

    public createSnippetWithNoBlanksAround(): string {
        return this.indentedSnippet
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

    public createSnippetWithBlanksAround(): string {
        return this.indentedSnippet
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

    public createSnippetWithBlanksOnlyBefore(): string {
        return this.indentedSnippet
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

    public createSnippetWithBlanksOnlyAfter(): string {
        return this.indentedSnippet
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

    private getIndentedSnippet(): string {
        return snippetMap[this.ruleName].replace(/%IND%/g, this.resolveIndent());
    }

    private resolveIndent(): string {
        if (this.indent === 'tab') {
            return '\t';
        } else {
            return ' '.repeat(this.indent);
        }
    }

}
