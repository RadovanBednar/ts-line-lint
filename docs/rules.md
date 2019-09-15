# Line linting rules
* [`block-padding` rule](#block-padding-rule)
* [Regular rules](#regular-rules)
* [Cleanup rules](#cleanup-rules)

There are currently 3 categories of rules supported in the application.

## <a name="block-padding-rule"></a>`block-padding` rule
This rule makes up its own category, because unlike the rest of the rules that operate on lines outside the matched code it manipulates blank lines inside an arbitrary block. It removes/inserts blank lines at the beginning and at the end of the **content** of a code block or a multiline object literal.

This rule is always applied **at the beginning** of the replacement sequence. It can be [configured](#configurability) by the user with the same syntax as the rest of the rules. The default value is `{ "remove": "both" }`. If both `remove` and `insert` options are specified, the removal is performed first.

Example `{ "remove": "both" }`:
```
// original                     |    // after linting
function foo() {                |    function foo() {
                                |        return "foo";
    return "foo";               |    }
                                |    const bar = {
}                               |        foo: "bar"
const bar = {                   |    }
                                |
    foo: "bar"                  |
                                |
}                               |
```
Example `{ "insert": "before" }`:
```
// original                     |   // after linting
function foo() {                |   function foo() { 
    return "foo";               |
}                               |       return "foo";
                                |   }
```

## <a name="regular-rules"></a>Regular rules
These rules search for specified language constructs and either remove or insert blank lines in their vicinity. They can be [configured](#configurability) by the user via a configuration file. Some of them are **indent-specific** (they have to know the project's indentation style beforehand to work correctly), but the most is **simple** (they work irrespective of the project's indentation style).

Regular rules are applied after the `block-padding` rule, if that is specified. First all the rules are read from the config object in a fixed order and if an individual rule is found and has the `remove` option set to something else than "none", the removal is applied. Then the rules are read once more it the same order and if an individual rule is found and has the `insert` option set to something else than "none", the insertion is applied.

The application currently recognizes these regular rules (in the order of application):

* `individual-import` rule

  Matches individual import statements.
  ```javascript
  import { FirstItem, SecondItem } from "foo";
  ```
  ```javascript
  import * as bar from "bar";
  ```
  ```javascript
  import {
    FirstOfSeveralLongNameImportedItems,
    SecondOfSeveralLongNameImportedItems
  } from "../baz";
  ```
  The default value is `{ "remove": "before" }`.

* `consecutive-imports` rule

  Matches groups of consecutive import statements.
  ```javascript
  import { FirstItem, SecondItem } from "foo";
  import * as bar from "bar";
  import {
    FirstOfSeveralLongNameImportedItems,
    SecondOfSeveralLongNameImportedItems
  } from "../baz";
  ```
  The default value is `{ "insert": "after" }`.

* `individual-multiline-type-alias` rule

  Matches type aliases that span two or more lines.
  ```javascript
  export type ExtendedType<T> = T & {
    [P in keyof T]: T[P] & BaseType<T>;
  };
  ```
  ```javascript
  export type UnionType =
    SomeType |
    AnotherType;
  ```
  The default value is `{ "insert": "both" }`.

* `consecutive-single-line-type-aliases` rule

  Matches groups of consecutive single-line type aliases.
  ```javascript
  export type Foo = "foo";
  export type Bar = string;
  ```
  The default value is `{ "insert": "both" }`.

* `interface-declaration` rule

  Matches individual interface declarations.
  ```javascript
  interface LocalInterface {
    prop1: type;
    prop2: type;
  }
  ```
  ```javascript
  export interface ExportedInterface {
    method1(param: type): type;

    method2(param: type): type;
  }
  ```
  The default value is `{ "insert": "both" }`.

* `single-line-variable-declaration` rule

  Matches single-line `var`, `let` or `const` declarations.
  ```javascript
  var foo = 'foo';
  ```
  ```javascript
  let bar = 123;
  ```
  ```javascript
  const baz = { foo: bar };
  ```
  The default value is `{ "remove": "none" }`.

* `multiline-variable-declaration` rule

  Matches `var`, `let` or `const` declarations that span two or more lines (typically array or object literals).
  ```javascript
  const fooArray = [
    "some long string",
    "another long string",
  ];
  ```
  ```javascript
  let fooObject = {
    key1: "value1",
    key2: "value2",
  };
  ```
  The default value is `{ "remove": "none" }`.

* `function-declaration` rule

  Matches regular and async function declarations. Does not match function declarations nested in other function declarations.
  ```javascript
  function fooBar(foo: ExcruciatinglyLongTypeName,
                  bar: AnotherExcruciatinglyLongTypeName) {
    return 42;
  }
  ```
  ```javascript
  async function asyncFooBar(): Promise<void> {
    await foo();
  }
  ```
  The default value is `{ "insert": "both" }`.

* `class-declaration` rule

  Matches class declarations including Angular decorators like `@Component`.
  ```javascript
  @Component({ selector: "app-bar" })
  class Bar implements OnInit {
    // implementation
  }
  ```
  ```javascript
  export abstract class Foo extends Bar {
    // properties

    // methods
  }
  ```
  The default value is `{ "insert": "both" }`.

* `class-property-declaration` rule

  Matches class property declarations including Angular decorators like `@ViewChild`. Properties must have explicit access modifiers.
  ```javascript
    private static foo = 123;
  ```
  ```javascript
    protected static fooObject = {
      key1: "value1",
      key2: "value2",
    };
  ```
  ```javascript
    public static fooArray = [
      "some very long array memeber",
      "some even longer array memeber",
    ];
  ```
  ```javascript
    @Input() public fooDecorated!: Foo;
  ```
  The default value is `{ "remove": "before" }`.

* `method-or-accessor-declaration` rule

  Matches class constructors, methods and property setters/getters including Angular decorators like `@HostListener`. Methods must have explicit access modifiers.
  ```javascript
    constructor() {
    }
  ```
  ```javascript
    protected bar(protected firstParam: VeryLongTypeName,
                  protected secondParam: EvenLongerTypeName,
                  protected thirdParam: SomeMonstrouslyLongTypeName): Bar {
      // implementation

      // return statement
    }
  ```
  ```javascript
    @HostListener("click", ["$event.target"])
    public onClick(btn) {
      // implementation
    }
  ```
  ```javascript
    @Input()
    set foo(param: type) {
      this _foo = param;
    }
  ```
  The default value is `{ "insert": "both" }`.

* `abstract-method-or-accessor` rule

  Matches abstract class methods or property accessors.
  ```javascript
    public abstract getBar(): Bar;
  ```
  ```javascript
    protected abstract async setBar(bar: Bar): Promise<void>;
  ```
  The default value is `{ "insert": "both" }`.

* `property-with-effect-decorator` rule

  Matches class properties with an [ngrx](https://github.com/ngrx/effects) `@Effect` decorators which are usually more verbose than regular properties.
  ```javascript
    @Effect()
    public barAction$ = this.actions$.pipe(
      // code
    );
  ```
  ```javascript
    @Effect() public barAction$ = this.actions$.pipe(
      // code
    );
  ```
  The default value is `{ "insert": "both" }`.

* `unit-test-describe-block` rule

  Matches `describe` blocks in spec files including nested ones up to indentation level 4. It is thus an indent-specific rule.
  ```javascript
  describe("test suite", () => {
    // tests
  });
  ```
  The default value is `{ "insert": "both" }`.

* `unit-test-hook-statement` rule

  Matches unit test hooks `before`/`beforeEach`/`beforeAll` and `after`/`afterEach`/`afterAll` in spec files.
  ```javascript
    beforeEach(async () => {
      // async code
    });
  ```
  ```javascript
    afterAll(() => {
      // code
    });
  ```
  The default value is `{ "insert": "both" }`.

* `unit-test-it-statement` rule

  Matches unit test `it` statements.
  ```javascript
    it("some test case", () => {
      // arange + act

      // expect...
    });
  ```
  ```javascript
    it("asynchronous test case", async () => {
      // await expect...
    });
  ```
  The default value is `{ "insert": "both" }`.

## <a name="cleanup-rules"></a>Cleanup rules
These rules are supposed to remove unwanted artifacts possibly introduced by application of other rules. They are not configurable and are always applied **at the end** of the replacement sequence in this order:
* any number of blank lines following a `tslint:disable-next-line` comment is removed,
* any number of blank lines at the beginning of a file is removed,
* any number of consecutive blank lines is replaced by a single blank line,
* any number of blank lines at the end of a file is replaced by a single blank line.
