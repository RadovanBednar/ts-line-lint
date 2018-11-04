import { EMPTY_RULES_CONFIG, LineLintConfig } from '../../config/line-lint-config';
import { createMultilineString } from '../../utils/text-utils';
import { expectReplacerWithConfig } from './replacer-expects';
import { createMockConfig } from './replacer-test-utils';

export function unitTestHookStatementRuleTestSuite(): void {
    let config: LineLintConfig;
    const noBlanksAround = createMultilineString(
        'describe("first test suite", () => {',
        '  // non-blank line',
        '  before(() => {',
        '    // code',
        '  });',
        '  // non-blank line',
        '  beforeEach(async () => {',
        '    // regular ES6 async',
        '  });',
        '  // non-blank line',
        '  beforeEach(async(() => {',
        '    // Angular async',
        '  }));',
        '  // non-blank line',
        '  beforeAll(() => {',
        '    // code',
        '  });',
        '  // non-blank line',
        '  after(() => {',
        '    // code',
        '  });',
        '  // non-blank line',
        '  afterEach(() => {',
        '    // code',
        '  });',
        '  // non-blank line',
        '  afterAll(() => {',
        '    // code',
        '  });',
        '  // non-blank line',
        '});',
    );
    const blanksAround = noBlanksAround
        .replace(/((?<!{\n)  \/\/ non-blank line)/g, '\n$1')
        .replace(/(  \/\/ non-blank line(?!\n}))/g, '$1\n');
    const blanksOnlyAfter = noBlanksAround.replace(/((?<!{\n)  \/\/ non-blank line)/g, '\n$1');
    const blanksOnlyBefore = noBlanksAround.replace(/(  \/\/ non-blank line(?!\n}))/g, '$1\n');

    describe('is not specified', () => {

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(EMPTY_RULES_CONFIG).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: none"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'remove', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "remove: before"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'remove', 'before');
        });

        it('should remove blank lines before each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "remove: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'remove', 'after');
        });

        it('should remove blank lines after each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "remove: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'remove', 'both');
        });

        it('should remove blank lines both before and after each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(noBlanksAround);
        });

    });

    describe('has option "insert: none"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'insert', 'none');
        });

        it('should only apply cleanup replacements', () => {
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(blanksAround);
            expectReplacerWithConfig(config).toOnlyApplyCleanupReplacementsTo(noBlanksAround);
        });

    });

    describe('has option "insert: before"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'insert', 'before');
        });

        it('should insert a blank line before each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyBefore);
        });

    });

    describe('has option "insert: after"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'insert', 'after');
        });

        it('should insert a blank line after each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksOnlyAfter);
        });

    });

    describe('has option "insert: both"', () => {

        beforeEach(() => {
            config = createMockConfig('unit-test-hook-statement', 'insert', 'both');
        });

        it('should insert blank lines both before and after each unit test hook statement', () => {
            expectReplacerWithConfig(config).toConvert(noBlanksAround).to(blanksAround);
        });

    });

    describe('has both "remove" and "insert" options', () => {

        beforeEach(() => {
            config = {
                ...EMPTY_RULES_CONFIG,
                rules: { 'unit-test-hook-statement': { remove: 'both', insert: 'after' } },
            };
        });

        it('should first apply the removal and then the insertion', () => {
            expectReplacerWithConfig(config).toConvert(blanksAround).to(blanksOnlyAfter);
        });

    });

}