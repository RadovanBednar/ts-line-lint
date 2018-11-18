import { createMultilineString } from '../../../utils/text-utils';

export const unitTestItStatementTestSnippet = createMultilineString(
    'describe("test suite", () => {',
    '  // non-blank line',
    '  it("some test case", () => {',
    '    // arange + act',
    '',
    '    // expect...',
    '  });',
    '  // non-blank line',
    '  it("asynchronous test case", async () => {',
    '    // await expect...',
    '  });',
    '  // non-blank line',
    '  it("fake async test case", fakeAsync(() => {',
    '    // tick and then expect...',
    '  }));',
    '  // non-blank line',
    '});',
);
