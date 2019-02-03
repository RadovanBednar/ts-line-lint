# Table of contents
* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Installation](#installation)
* [Usage](#usage)
  * [Directories](#directories)
  * [Ignored paths](#ignored-paths)
  * [Configurability](#configurability)
* [Rules](#rules)
  * [`block-padding` rule](#block-padding-rule)
  * [Regular rules](#regular-rules)
  * [Cleanup rules](#cleanup-rules)
* [Contact](#contact)

# <a name="introduction"></a>Introduction
This tool is supposed to enforce consistent use of blank lines in TypeScript files, a goal that cannot be achieved by other code style tools like `tslint` or `prettier`. `ts-line-lint` is by no means supposed to substitute any of these tools nor your IDE's "reformat code" option; it merely complements them. In fact, to use `ts-line-lint` the following `tslint` rules must be applied beforehand: "indent", "no-trailing-whitespace", "member-access" and "semicolon" with the option "always". It might be useful to hook a call to `ts-line-lint` to the end of a `tslint` fix script.

# <a name="how-it-works"></a>How it works
`ts-line-lint` first lists all the \*.ts files in specified project subdirectories and then processes them one by one via a sequence of regular expression replacements. The order of replacements is hard-coded, but whether each replacement will be executed is mostly [configurable](#configurability). The only part of the sequence, that runs every time, is the final cleanup sequence.

# <a name="installation"></a>Installation
```
$ npm install ts-line-lint --save-dev
```

# <a name="usage"></a>Usage
```
ts-line-lint [DIR]... [--ignore PATH...] [--config PATH]
```

## <a name="directories"></a>Directories
Specify one or more subdirectories in your project where the program will recursively search \*.ts files to process:
```
$ ts-line-lint src apps
```

Specifying a non-existent directory will raise an error and terminate the program before any file processing takes place:
```
$ ts-line-lint nonsense-dir
Error: Couldn't find directory "nonsense-dir".
```

If you don't specify any directories, the program will default to the project root directory. The following two commands are thus essentially the same:
```
$ ts-line-lint .
$ ts-line-lint
Warning: No directory specified, using "." as fallback.
```

`node_modules` directory as well as any hidden directories will be ignored in the file search process, whether specified explicitly or implicitly via `.`. The following two commands will therefore yield exactly 0 \*.ts files to process:
```
$ ts-line-lint node_modules
Warning: Skipping excluded directory "node_modules".
There are no files to process.

$ ts-line-lint .git
Warning: Skipping hidden directory ".git".
There are no files to process.
```

To prevent accidental changes in any files outside the project, only relative paths to the current project's subdirectories may be specified. Specifying a path starting with `..` or an absolute path will therefore raise an error and terminate the program before any file processing takes place:
```
$ ts-line-lint ../another-project
Error: Invalid directory "../another-project". Only relative paths to project subdirectories are allowed.

$ ts-line-lint /absolute/path/to/no/matter/where
Error: Invalid directory "/absolute/path/to/no/matter/where". Only relative paths to project subdirectories are allowed.
```

## <a name="ignored-paths"></a>Ignored paths
You may use an `--ignore` flag to specify individual files or directories (either directly or via glob patterns) that should be excluded from the linting process. For example, the following command would lint all the files form the `src` directory except for `index.ts`, all the files in the `util` subdirectory and all the spec files from any subdirectory (provided your shell supports the [globstar](https://stackoverflow.com/a/28199633) option):
```
$ ts-line-lint src --ignore src/index.ts src/util src/**/*.spec.ts
```

The `--ignore` flag must be followed by at least one argument. There's no need to list `node_modules` or any hidden directories, as those are ignored by default.

## <a name="configurability"></a>Configurability
The tool comes with a set of [predefined rules](https://github.com/RadovanBednar/ts-line-lint/blob/master/.linelint) based on the author's subjective preference. Should your blank line formatting preferences differ, you may specify your own set of rules in a configuration JSON file. Only rules specified in this config file will be then applied.

There are two ways of supplying a config file:
 1) place a `.linelint` file to the root of your project and ts-line-lint will load it automatically,
 2) create a custom file, point ts-line-lint to its location with a `--config` flag followed by a path to the file and it will be loaded instead.
```
$ ts-line-lint src
# will apply rules defined in .linelint file if one is found
# will apply the built-in predefined set of rules otherwise

$ ts-line-lint src --config line-lint.json
# will apply rules defined in the line-lint.json file
```

The configuration file must be a valid JSON file containing on object with exactly two properties: `indent` and `rules`. If it is not valid JSON or does not conform to the validation schema (or is not found because the path supplied to `--config` flag is wrong), an error will be thrown and the program terminated before any file processing takes place.

### `indent` property
The value of this property may be either a natural number representing the number of space characters your project uses for one level indentation, or the string "tab" if you indent with tab characters. This property is required, because some rules have to know the indentation style in advance to function properly. The default value is `indent: 4`.

### `rules` property
[Rules](#rules) represent language constructs that can be matched via regular expressions in the source code, e.g. import statement, variable declaration, unit test hook etc. There are two options how to apply a rule: one may want to remove blank lines from around or to insert blank lines around the matched construct.

That's why this property takes an object with rule names for properties. Each such property takes another object specifying options of given rule's application via their `remove` and/or `insert` properties. At least one of the options must be provided. If both are provided, the removal will be performed before the insertion.
`remove` and `insert` properties must take one of these four string values:
* **"before"** - blank lines will be removed/inserted only before each matched construct,
* **"after"** - blank lines will be removed/inserted only after each matched construct,
* **"both"** - blank lines will be removed/inserted both before and after each matched construct,
* **"none"** - there will be no blank lines removed/inserted with respect to the matched construct (the same as omitting the option altogether).

This `rules` object may be empty. In this case only the cleanup sequence will be executed.

# <a name="rules"></a>Rules
There are currently 3 categories of rules supported in the application.

## <a name="block-padding-rule"></a>`block-padding` rule
This rule makes up its own category, because unlike the rest of the rules that operate on lines outside the matched code it manipulates blank lines inside an arbitrary block. It removes/inserts blank lines at the beginning and at the end of the **content** of a code block or a multiline object literal.

This rule is always applied **at the beginning** of the replacement sequence. It can be [configured](#configurability) by the user with the same syntax as the rest of the rules. The default value is `{ "remove": "both" }`. If both `remove` and `insert` options are specified, the removal is performed first.

<details><summary style="cursor: pointer">
Example `{ "remove": "both" }`:
</summary>
```javascript
function foo() {

    return "foo";

}
const bar = {

    foo: "bar"

}
```
becomes:
```javascript
function foo() {
    return "foo";
}
const bar = {
    foo: "bar"
}
```
</details>

<details><summary style="cursor: pointer">
Example `{ "insert": "before" }`:
</summary>
```javascript
function foo() {
    return "foo";
}
```
becomes:
```javascript
function foo() {

    return "foo";
}
```
</details>

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

# <a name="contact"></a>Contact
If there are any problems related to this tool (a rule does not match, what should be matched; a rule matches something, that should not be matched; the execution hangs), feel free to create an [issue at GitHub](https://github.com/RadovanBednar/ts-line-lint/issues) or send me an email. Don't forget to attach (a necessarily anonymized version of) the file or the relevant piece of code that causes the problem, so I can investigate properly.
