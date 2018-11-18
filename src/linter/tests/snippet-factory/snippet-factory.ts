export interface SnippetFactory {
    createSnippetWithNoBlanksAround(): string;
    createSnippetWithBlanksAround(): string;
    createSnippetWithBlanksOnlyAfter(): string;
    createSnippetWithBlanksOnlyBefore(): string;
}
