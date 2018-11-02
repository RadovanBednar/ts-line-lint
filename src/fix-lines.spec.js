const expect = require('chai').expect;
const createMultilineString = require('./utils').createMultilineString;
const fixLines = require('./fix-lines');

describe('fixLines function', () => {
    const accessModifiers = ['public ', 'protected ', 'private '];
    const accessModifiersIncludingImplicitOne = accessModifiers.concat('');
    let inputSnippet;
    let expectedOutput;

    describe('class properties', () => {

        it('should inline decorators with property declarations', () => {
            inputSnippet = createMultilineString(
                'class A {',
                '  @ViewChild(SomeComponent)',
                '  someComponent: SomeComponent;',
                '  @Input()',
                '  public foo!: Foo;',
                '  @Output()',
                '  public bar = new EventEmitter<Bar>();',
                '}',
            );
            expectedOutput = createMultilineString(
                'class A {',
                '  @ViewChild(SomeComponent) someComponent: SomeComponent;',
                '  @Input() public foo!: Foo;',
                '  @Output() public bar = new EventEmitter<Bar>();',
                '}',
                '',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should NOT inline @Input decorator with property setter declaration', () => {
            inputSnippet = createMultilineString(
                'class A {',
                '',
                '  @Input()',
                '  set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '',
                '}',
                '',
            );
            expectedOutput = createMultilineString(
                'class A {',
                '',
                '  @Input()',
                '  set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '',
                '}',
                '',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('unit tests', () => {

        it('should add blank lines around unindented "describe" statements', () => {
            inputSnippet = createMultilineString(
                '// preceding non-blank line',
                'describe("first test suite", () => {',
                '  // something',
                '});',
                'describe("second test suite", () => {',
                '  // something else',
                '});',
                '// following non-blank line',
            );
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'describe("first test suite", () => {',
                '  // something',
                '});',
                '',
                'describe("second test suite", () => {',
                '  // something else',
                '});',
                '',
                '// following non-blank line',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around nested "describe" statements with any kind of indentation', () => {
            for (let spaceCount = 0; spaceCount <= 5; spaceCount++) {
                const ind = !spaceCount ? '\t' : ' '.repeat(spaceCount);

                inputSnippet = createMultilineString(
                    '// preceding non-blank line',
                    'describe("top-level test suite", () => {',
                    ind + 'describe("first level nested test suite", () => {',
                    ind + ind + '// something else',
                    ind + '});',
                    '});',
                    '// following non-blank line',
                );
                expectedOutput = createMultilineString(
                    '// preceding non-blank line',
                    '',
                    'describe("top-level test suite", () => {',
                    '',
                    ind + 'describe("first level nested test suite", () => {',
                    ind + ind + '// something else',
                    ind + '});',
                    '',
                    '});',
                    '',
                    '// following non-blank line',
                );

                expectSnippet(inputSnippet).withIndentationSize(spaceCount).toConvertTo(expectedOutput);
            }

        });

        it('should add blank lines around nested "describe" statements with 2 or 3 levels of any kind of indentation', () => {
            for (let spaceCount = 0; spaceCount <= 5; spaceCount++) {
                const ind = !spaceCount ? '\t' : ' '.repeat(spaceCount);

                inputSnippet = createMultilineString(
                    '// preceding non-blank line',
                    'describe("top-level test suite", () => {',
                    ind + 'describe("first level nested test suite", () => {',
                    ind + ind + 'describe("second level nested test suite", () => {',
                    ind + ind + ind + 'describe("third level nested test suite", () => {',
                    ind + ind + ind + ind + '// something else',
                    ind + ind + ind + '});',
                    ind + ind + '});',
                    ind + '});',
                    '});',
                    '// following non-blank line',
                );
                expectedOutput = createMultilineString(
                    '// preceding non-blank line',
                    '',
                    'describe("top-level test suite", () => {',
                    '',
                    ind + 'describe("first level nested test suite", () => {',
                    '',
                    ind + ind + 'describe("second level nested test suite", () => {',
                    '',
                    ind + ind + ind + 'describe("third level nested test suite", () => {',
                    ind + ind + ind + ind + '// something else',
                    ind + ind + ind + '});',
                    '',
                    ind + ind + '});',
                    '',
                    ind + '});',
                    '',
                    '});',
                    '',
                    '// following non-blank line',
                );

                expectSnippet(inputSnippet).withIndentationSize(spaceCount).toConvertTo(expectedOutput);
            }
        });

        it('should add blank lines around uniline "before(Each|All)" and "after(Each|All)" statements', () => {
            inputSnippet = createMultilineString(
                '// preceding non-blank line',
                'describe("first test suite", () => {',
                '  before(stuffToDoBeforeAll);',
                '  // non-blank line',
                '  beforeAll(stuffToDoBeforeAll);',
                '  // non-blank line',
                '  beforeEach(stuffToDoBeforeEach);',
                '  // non-blank line',
                '  after(stuffToDoAfterAll);',
                '  // non-blank line',
                '  afterAll(stuffToDoAfterAll);',
                '  // non-blank line',
                '  afterEach((stuffToDoAfterEach);',
                '});',
                '// following non-blank line',
            );
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'describe("first test suite", () => {',
                '',
                '  before(stuffToDoBeforeAll);',
                '',
                '  // non-blank line',
                '',
                '  beforeAll(stuffToDoBeforeAll);',
                '',
                '  // non-blank line',
                '',
                '  beforeEach(stuffToDoBeforeEach);',
                '',
                '  // non-blank line',
                '',
                '  after(stuffToDoAfterAll);',
                '',
                '  // non-blank line',
                '',
                '  afterAll(stuffToDoAfterAll);',
                '',
                '  // non-blank line',
                '',
                '  afterEach((stuffToDoAfterEach);',
                '',
                '});',
                '',
                '// following non-blank line',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around multiline "before(Each|All)", "after(Each|All)" and "it" statements', () => {
            inputSnippet = createMultilineString(
                '// preceding non-blank line',
                'describe("first test suite", () => {',
                '  before(() => {',
                '    // before',
                '  });',
                '  // non-blank line',
                '  beforeEach(() => {',
                '    // beforeEach',
                '  });',
                '  // non-blank line',
                '  beforeAll(() => {',
                '    // beforeAll',
                '  });',
                '  // non-blank line',
                '  after(() => {',
                '    // after',
                '  });',
                '  // non-blank line',
                '  afterEach(() => {',
                '    // afterEach',
                '  });',
                '  // non-blank line',
                '  afterAll(() => {',
                '    // afterAll',
                '  });',
                '  // non-blank line',
                '  it("some test case", () => {',
                '    // expect...',
                '  });',
                '  // non-blank line',
                '  it("asynchronous test case", async () => {',
                '    // await expect...',
                '  });',
                '});',
                '// following non-blank line',
            );
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'describe("first test suite", () => {',
                '',
                '  before(() => {',
                '    // before',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  beforeEach(() => {',
                '    // beforeEach',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  beforeAll(() => {',
                '    // beforeAll',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  after(() => {',
                '    // after',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  afterEach(() => {',
                '    // afterEach',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  afterAll(() => {',
                '    // afterAll',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  it("some test case", () => {',
                '    // expect...',
                '  });',
                '',
                '  // non-blank line',
                '',
                '  it("asynchronous test case", async () => {',
                '    // await expect...',
                '  });',
                '',
                '});',
                '',
                '// following non-blank line',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around test statements with Angular async/fakeAsync', () => {
            inputSnippet = createMultilineString(
                '// preceding non-blank line',
                'describe("test suite", () => {',
                '  beforeEach(async(() => {',
                '    // beforeEach with Angular async',
                '  }));',
                '  // non-blank line',
                '  it("fake async test case", fakeAsync(() => {',
                '    // tick and then expect...',
                '  }));',
                '});',
                '// following non-blank line',
            );
            expectedOutput = createMultilineString(
                '// preceding non-blank line',
                '',
                'describe("test suite", () => {',
                '',
                '  beforeEach(async(() => {',
                '    // beforeEach with Angular async',
                '  }));',
                '',
                '  // non-blank line',
                '',
                '  it("fake async test case", fakeAsync(() => {',
                '    // tick and then expect...',
                '  }));',
                '',
                '});',
                '',
                '// following non-blank line',
            );

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    function expectSnippet(snippet) {
        let indentSize;
        return {
            withIndentationSize(customIndent) {
                indentSize = customIndent;
                return this;
            },
            toConvertTo(output) {
                expect(fixLines(snippet, indentSize)).to.equal(output);
            },
        };
    }

});
