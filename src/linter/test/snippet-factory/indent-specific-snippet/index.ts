import { IndentSpecificRuleName } from '../../../rules';
import { unitTestDescribeBlockPlaceholderSnippet } from './unit-test-describe-block-placeholder-snippet';

export const indentSpecificSnippetMap: { readonly [key in IndentSpecificRuleName]: string } = {
    'unit-test-describe-block': unitTestDescribeBlockPlaceholderSnippet,
};
