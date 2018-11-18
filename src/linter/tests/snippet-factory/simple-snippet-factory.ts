import { SimpleRuleName } from '../../rules';
import { simpleSnippetMap } from './simple-snippet';
import { SnippetFactory } from './snippet-factory';

export class SimpleSnippetFactory extends SnippetFactory {

    constructor(ruleName: SimpleRuleName) {
        super(simpleSnippetMap[ruleName]);
    }

}
