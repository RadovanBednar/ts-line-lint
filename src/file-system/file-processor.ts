import * as fs from 'fs';
import { ILinter } from '../linter/linter';

export class FileProcessor {
    private modified = 0;

    constructor(private linter: ILinter) {
    }

    public process(fileName: string): void {
        const content = fs.readFileSync(fileName, 'utf-8');

        const newContent = this.linter.lint(content);

        if (newContent !== content) {
            fs.writeFileSync(fileName, newContent, 'utf-8');
            this.modified++;
        }
    }

    public getModified(): number {
        return this.modified;
    }

}
