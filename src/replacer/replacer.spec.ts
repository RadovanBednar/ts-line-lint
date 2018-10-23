import { cleanupTestSuite } from "./tests/cleanup.spec";
import { individualImportRuleTestSuite } from "./tests/individual-import.spec";

describe.only('Replacer', () => {
    describe('always at the end of a replacement pipeline', cleanupTestSuite);
    describe('when "individual-import" rule', individualImportRuleTestSuite);
});
