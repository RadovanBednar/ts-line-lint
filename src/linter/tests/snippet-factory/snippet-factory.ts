export abstract class SnippetFactory {

    constructor(protected snippet: string) {
    }

    public createSnippetWithNoBlanksAround(): string {
        return this.snippet
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

    public createSnippetWithBlanksAround(): string {
        return this.snippet
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

    public createSnippetWithBlanksOnlyBefore(): string {
        return this.snippet
            .replace(/%BLANK_BEFORE%\n/g, '\n')
            .replace(/%BLANK_AFTER%\n/g, '');
    }

    public createSnippetWithBlanksOnlyAfter(): string {
        return this.snippet
            .replace(/%BLANK_BEFORE%\n/g, '')
            .replace(/%BLANK_AFTER%\n/g, '\n');
    }

}
