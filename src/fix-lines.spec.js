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
