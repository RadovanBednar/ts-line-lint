const expect = require('chai').expect;
const fixLines = require('./fix-lines');

describe('fixLines function', () => {
    const accessModifiers = ['public', 'protected', 'private'];
    let inputSnippet;
    let expectedOutput;

    describe('import statements', () => {

        it('should remove blank lines before each import statement', () => {
            inputSnippet = createMultilineString([
                '',
                'import {SingleImportedItem} from "abc";',
                '',
                'import {AnotherSingleImportedItem} from "./def";',
                '',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../ghi";',
                '',
            ]);
            expectedOutput = createMultilineString([
                'import {SingleImportedItem} from "abc";',
                'import {AnotherSingleImportedItem} from "./def";',
                'import {',
                '  FirstOfSeveralImportedItems,',
                '  SecondOfSeveralImportedItems',
                '} from "../ghi";',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add an empty line after the last import statement', () => {
            inputSnippet = createMultilineString([
                '// last import is single-line',
                'import {Abc} from "abc";',
                'import {Def} from "./def";',
                'const foo = 666;',
                '',
                '// last import is multi-line',
                'import {Abc} from "abc";',
                'import {',
                '  Def,',
                '  Fed',
                '} from "./def";',
                'const foo = 666;',
            ]);
            expectedOutput = createMultilineString([
                '// last import is single-line',
                'import {Abc} from "abc";',
                'import {Def} from "./def";',
                '',
                'const foo = 666;',
                '',
                '// last import is multi-line',
                'import {Abc} from "abc";',
                'import {',
                '  Def,',
                '  Fed',
                '} from "./def";',
                '',
                'const foo = 666;',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('blocks', () => {

        it('should remove blank lines from any kind of empty block', () => {
            inputSnippet = createMultilineString([
                'class A {',
                '',
                '  constructor(private prop: type) {',
                '',
                '  }',
                '',
                '}',
                '',
                'function doNothing(): void {',
                '',
                '}',
                '',
            ]);
            expectedOutput = createMultilineString([
                'class A {',
                '',
                '  constructor(private prop: type) {',
                '  }',
                '',
                '}',
                '',
                'function doNothing(): void {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should remove leading blank lines inside a block', () => {
            inputSnippet = createMultilineString([
                'interface WithLeadingBlank {',
                '',
                '  prop1: type;',
                '  prop2: type;',
                '}',
                '',
                'if (condition) {',
                '',
                '  if (another condition) {',
                '',
                '    // some code',
                '  } else {',
                '',
                '    // some code',
                '  }',
                '}',
                '',
            ]);
            expectedOutput = createMultilineString([
                'interface WithLeadingBlank {',
                '  prop1: type;',
                '  prop2: type;',
                '}',
                '',
                'if (condition) {',
                '  if (another condition) {',
                '    // some code',
                '  } else {',
                '    // some code',
                '  }',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should remove trailing blank lines inside a block', () => {
            inputSnippet = createMultilineString([
                'interface WithLeadingBlank {',
                '  prop1: type;',
                '  prop2: type;',
                '',
                '}',
                '',
                'if (condition) {',
                '  if (another condition) {',
                '    // some code',
                '',
                '  } else {',
                '    // some code',
                '',
                '  }',
                '',
                '}',
                '',
            ]);
            expectedOutput = createMultilineString([
                'interface WithLeadingBlank {',
                '  prop1: type;',
                '  prop2: type;',
                '}',
                '',
                'if (condition) {',
                '  if (another condition) {',
                '    // some code',
                '  } else {',
                '    // some code',
                '  }',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('variable declarations', () => {

        it('should remove blank lines before each possibly indented var, let and const declarations', () => {
            const declarationKeywords = ['var', 'let', 'const'];

            for (const kw of declarationKeywords) {
                inputSnippet = createMultilineString([
                    '// preceding non-blank line',
                    '',
                    `${kw} bar: type;`,
                    '',
                    'function foo() {',
                    '',
                    `  ${kw} baz: type;`,
                    '}',
                    '',
                ]);
                expectedOutput = createMultilineString([
                    '// preceding non-blank line',
                    `${kw} bar: type;`,
                    '',
                    'function foo() {',
                    `  ${kw} baz: type;`,
                    '}',
                    '',
                ]);

                expectSnippet(inputSnippet).toConvertTo(expectedOutput);
            }
        });

    });

    describe('type aliases', () => {

        it('should add blank lines around each group of consecutive exported type aliases', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '// following non-blank line',
            ]);
            expectedOutput = createMultilineString([
                '// preceding non-blank line',
                '',
                'export type AliasedType = type;',
                'export type AnotherAliasedType = type2;',
                '',
                '// following non-blank line',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('interface declarations', () => {

        it('should add blank lines around each interface declaration', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'interface LocalInterface {',
                '  prop1: type;',
                '  prop2: type;',
                '}',
                'export interface ExportedInterface {',
                '  method1(param: type): type;',
                '',
                '  method2(param: type): type;',
                '}',
                '// following non-blank line',
            ]);
            expectedOutput = createMultilineString([
                '// preceding non-blank line',
                '',
                'interface LocalInterface {',
                '  prop1: type;',
                '  prop2: type;',
                '}',
                '',
                'export interface ExportedInterface {',
                '  method1(param: type): type;',
                '',
                '  method2(param: type): type;',
                '}',
                '',
                '// following non-blank line',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('function declaration', () => {

        it('should add blank lines around each function declaration', () => {
            inputSnippet = createMultilineString([
                'const foo = 666;',
                'function bar() {',
                '}',
                '  function baz(param: type): type {',
                '  }',
                'async function bar2(): Promise<void> {',
                '}',
            ]);
            expectedOutput = createMultilineString([
                'const foo = 666;',
                '',
                'function bar() {',
                '}',
                '',
                '  function baz(param: type): type {',
                '  }',
                '',
                'async function bar2(): Promise<void> {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should NOT add blank line between comment and subsequent function declaration', () => {
            inputSnippet = createMultilineString([
                '/* tslint:disable-next-line:typedef */',
                'function bar() {',
                '}',
                '// tslint:disable-next-line:typedef',
                'function baz() {',
                '}',
            ]);
            expectedOutput = createMultilineString([
                '/* tslint:disable-next-line:typedef */',
                'function bar() {',
                '}',
                '',
                '// tslint:disable-next-line:typedef',
                'function baz() {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('class declaration', () => {

        it('should add blank lines around each class declaration', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'export abstract class A extends B {',
                '  // properties',
                '',
                '  // methods',
                '}',
                '',
                'describe("test", () => {',
                '  class TestClass {',
                '    // properties',
                '  }',
                '});',
                '',
            ]);
            expectedOutput = createMultilineString([
                '// preceding non-blank line',
                '',
                'export abstract class A extends B {',
                '  // properties',
                '',
                '  // methods',
                '}',
                '',
                'describe("test", () => {',
                '',
                '  class TestClass {',
                '    // properties',
                '  }',
                '',
                '});',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around class declaration with newline before opening brace', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'export class VeryLongClassName<TYPE extends SomeType>',
                '  implements EvenLongerInterfaceName<SomeMonstrouslyLongName> {',
                '  // properties',
                '',
                '  // methods',
                '}',
                '// following non-blank line',
            ]);
            expectedOutput = createMultilineString([
                '// preceding non-blank line',
                '',
                'export class VeryLongClassName<TYPE extends SomeType>',
                '  implements EvenLongerInterfaceName<SomeMonstrouslyLongName> {',
                '  // properties',
                '',
                '  // methods',
                '}',
                '',
                '// following non-blank line',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should not add blank line before @Component-decorated class declaration', () => {
            inputSnippet = createMultilineString([
                '@Component({',
                '  selector: "app-a",',
                '})',
                'class A implements OnInit {',
                '}',
            ]);
            expectedOutput = createMultilineString([
                '@Component({',
                '  selector: "app-a",',
                '})',
                'class A implements OnInit {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('class properties', () => {

        it('should remove blank lines before each public, protected and private property', () => {
            for (const modifier of accessModifiers) {
                inputSnippet = createMultilineString([
                    'class A {',
                    '',
                    `  ${modifier} foo = 123`,
                    '',
                    `  ${modifier} bar!: string`,
                    '}',
                ]);
                expectedOutput = createMultilineString([
                    'class A {',
                    `  ${modifier} foo = 123`,
                    `  ${modifier} bar!: string`,
                    '}',
                    '',
                ]);

                expectSnippet(inputSnippet).toConvertTo(expectedOutput);
            }
        });

        it('should inline @Input and @Output decorators with property names', () => {
            inputSnippet = createMultilineString([
                'class A {',
                '  @Input()',
                '  public foo!: Foo;',
                '',
                '  @Input()',
                '  set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '',
                '  @Output()',
                '  public bar = new EventEmitter<Bar>();',
                '}',
            ]);
            expectedOutput = createMultilineString([
                'class A {',
                '  @Input() public foo!: Foo;',
                '',
                '  @Input() set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '',
                '  @Output() public bar = new EventEmitter<Bar>();',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should remove blank lines before each @Input and @Output property', () => {
            inputSnippet = createMultilineString([
                'class A {',
                '',
                '  @Input() public foo!: Foo;',
                '',
                '  @Output() public bar = new EventEmitter<Bar>();',
                '}',
            ]);
            expectedOutput = createMultilineString([
                'class A {',
                '  @Input() public foo!: Foo;',
                '  @Output() public bar = new EventEmitter<Bar>();',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around class property getters and setters', () => {
            inputSnippet = createMultilineString([
                'class A {',
                '  set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '  get baz(param: type) {',
                '    return this _baz;',
                '  }',
                '}',
            ]);
            expectedOutput = createMultilineString([
                'class A {',
                '',
                '  set baz(param: type) {',
                '    this _baz = param;',
                '  }',
                '',
                '  get baz(param: type) {',
                '    return this _baz;',
                '  }',
                '',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('class methods', () => {

        it('should add blank lines around public, protected and private class method declarations', () => {
            for (const modifier of accessModifiers) {
                inputSnippet = createMultilineString([
                    'class A {',
                    `  ${modifier} static foo(): bar {`,
                    '    // declarations',
                    '',
                    '    // implementation',
                    '',
                    '    // return statement',
                    '  }',
                    `  ${modifier} baz(): void {`,
                    '    // implementation',
                    '  }',
                    '}',
                ]);
                expectedOutput = createMultilineString([
                    'class A {',
                    '',
                    `  ${modifier} static foo(): bar {`,
                    '    // declarations',
                    '',
                    '    // implementation',
                    '',
                    '    // return statement',
                    '  }',
                    '',
                    `  ${modifier} baz(): void {`,
                    '    // implementation',
                    '  }',
                    '',
                    '}',
                    '',
                ]);

                expectSnippet(inputSnippet).toConvertTo(expectedOutput);
            }

        });

        it('should add blank lines around constructor declarations', () => {
            inputSnippet = createMultilineString([
                'class A {',
                '  private prop: type;',
                '  constructor() {',
                '    // implementation',
                '  }',
                '  private constructor() {',
                '    // implementation',
                '  }',
                '}',
            ]);
            expectedOutput = createMultilineString([
                'class A {',
                '  private prop: type;',
                '',
                '  constructor() {',
                '    // implementation',
                '  }',
                '',
                '  private constructor() {',
                '    // implementation',
                '  }',
                '',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('unit tests', () => {

        it('should add blank lines around unindented "describe" statements', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'describe("first test suite", () => {',
                '  // something',
                '});',
                'describe("second test suite", () => {',
                '  // something else',
                '});',
                '// following non-blank line',
            ]);
            expectedOutput = createMultilineString([
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
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should add blank lines around nested "describe" statements with any kind of indentation', () => {
            for (let spaceCount = 0; spaceCount <= 5; spaceCount++) {
                const ind = !spaceCount ? '\t' : ' '.repeat(spaceCount);

                inputSnippet = createMultilineString([
                    '// preceding non-blank line',
                    'describe("top-level test suite", () => {',
                    ind + 'describe("first level nested test suite", () => {',
                    ind + ind + '// something else',
                    ind + '});',
                    '});',
                    '// following non-blank line',
                ]);
                expectedOutput = createMultilineString([
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
                ]);

                expectSnippet(inputSnippet).withIndentationSize(spaceCount).toConvertTo(expectedOutput);
            }

        });

        it('should add blank lines around nested "describe" statements with 2 or 3 levels of any kind of indentation', () => {
            for (let spaceCount = 0; spaceCount <= 5; spaceCount++) {
                const ind = !spaceCount ? '\t' : ' '.repeat(spaceCount);

                inputSnippet = createMultilineString([
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
                ]);
                expectedOutput = createMultilineString([
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
                ]);

                expectSnippet(inputSnippet).withIndentationSize(spaceCount).toConvertTo(expectedOutput);
            }
        });

        it('should add blank lines around "before(Each)", "after(Each)" and "it" statements', () => {
            inputSnippet = createMultilineString([
                '// preceding non-blank line',
                'describe("first test suite", () => {',
                '  before(() => {',
                '    // before',
                '  });',
                '  beforeEach(() => {',
                '    // beforeEach',
                '  });',
                '  after(() => {',
                '    // after',
                '  });',
                '  afterEach(() => {',
                '    // afterEach',
                '  });',
                '  it("some test case", () => {',
                '    // expect...',
                '  });',
                '  it("asynchronous test case", async () => {',
                '    // await expect...',
                '  });',
                '});',
                '// following non-blank line',
            ]);
            expectedOutput = createMultilineString([
                '// preceding non-blank line',
                '',
                'describe("first test suite", () => {',
                '',
                '  before(() => {',
                '    // before',
                '  });',
                '',
                '  beforeEach(() => {',
                '    // beforeEach',
                '  });',
                '',
                '  after(() => {',
                '    // after',
                '  });',
                '',
                '  afterEach(() => {',
                '    // afterEach',
                '  });',
                '',
                '  it("some test case", () => {',
                '    // expect...',
                '  });',
                '',
                '  it("asynchronous test case", async () => {',
                '    // await expect...',
                '  });',
                '',
                '});',
                '',
                '// following non-blank line',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    describe('final code refinements', () => {

        it('should remove empty lines from the beginning of a file', () => {
            inputSnippet = createMultilineString([
                '',
                '',
                'function bar() {',
                '}',
                '',
                '',
            ]);
            expectedOutput = createMultilineString([
                'function bar() {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should replace multiple consecutive blank lines with a single one', () => {
            inputSnippet = createMultilineString([
                'const foo = 666;',
                '',
                '',
                'function bar() {',
                '}',
                '',
                '',
                'function baz(param: type): type {',
                '}',
                '',
            ]);
            expectedOutput = createMultilineString([
                'const foo = 666;',
                '',
                'function bar() {',
                '}',
                '',
                'function baz(param: type): type {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

        it('should replace multiple trailing blank lines with a single one', () => {
            inputSnippet = createMultilineString([
                'function baz(param: type): type {',
                '}',
                '',
                '',
            ]);
            expectedOutput = createMultilineString([
                'function baz(param: type): type {',
                '}',
                '',
            ]);

            expectSnippet(inputSnippet).toConvertTo(expectedOutput);
        });

    });

    function createMultilineString(lines) {
        return lines.join('\n');
    }

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
