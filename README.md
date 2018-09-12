# Introduction
This tool is supposed to enforce consistent use of blank lines in TypeScript files, a goal that cannot be achieved by other code style tools like `tslint` or `prettier`. `ts-line-lint` is by no means supposed to substitute any of these tools nor your IDE's "reformat code" option; it merely complements them. In fact, to use `ts-line-lint` most effectively, the code in all the affected \*.ts files should already be properly formatted according to project code style and have any lint errors fixed beforehand.

# Installation
```
$ npm install ts-line-lint --save-dev
```

# Usage
Specify one or more subdirectories in your project where the program will look for \*.ts files:

```
$ ts-line-lint src apps
```

Specifying a non-existent directory will raise an error and terminate the program before any file processing takes place:

```
$ ts-line-lint nonsense-dir
Error: Couldn't find directory "nonsense-dir".
```

If you omit any directories, the program will default to all the project subdirectories. The following two commands are essentially the same:

```
$ ts-line-lint .
$ ts-line-lint
Warning: No directory specified, using "." as fallback.
```
Nonetheless, it's better to specify the source directories explicitly, so that the synchronous file search would be faster.

`node_modules` directory as well as any hidden directories will be ignored in the file search process, whether specified explicitly or implicitly via `.`. The following two commands will therefore yield exactly 0 \*.ts files to process.

```
$ ts-line-lint node_modules
Warning: Skipping excluded directory "node_modules".
Found 0 files to process...
$ ts-line-lint .git
Warning: Skipping hidden directory ".git".
Found 0 files to process...

```

Accessing any directories outside of the project is forbidden, therefore any attempt to specify a directory starting with `..` will raise an error and terminate the program before any file processing takes place. This control mechanism can be circumvented by specifying an absolute path, but why would anyone do that is beyond comprehension of the tool's author :)

```
$ ts-line-lint ../another-project
Error: Invalid directory "../another-project". Directories outside of CWD are not allowed.
```

# Under the hood
`ts-line-lint` first lists all the \*.ts files in specified project subdirectories and then processes them one by one via a sequence of regular expression replacements. The sequence may be divided into three logical groups (in the order of execution): blank removals, blank insertions and cleanup.

## Blank removals
In the first phase, these unnecessary blanks are removed:
* newline after any decorator followed by a property declaration, e.g.
  ```javascript
  @Input()
  public foo!: Foo;
  ```
  becomes
  ```javascript
  @Input() public foo!: Foo;
  ```
* blank lines before any import statement, preventing holes in import lists,
* blank lines before any variable declaration, e.g.
  ```javascript
  describe('test suite', () => {

      const foo = 'foo';
  ```
  becomes
  ```javascript
  describe('test suite', () => {
      const foo = 'foo';
  ```
* blank lines before any class member variable declaration, e.g.
  ```javascript
  class Foo {

      private bar = 'foo';
  ```
  becomes
  ```javascript
  class Foo {
      private bar = 'foo';
  ```
* blank lines following an opening brace of a block, e.g.
  ```javascript
  constructor(private foo: Foo) {

  }
  ```
  becomes
  ```javascript
  constructor(private foo: Foo) {
  }
  ```
* blank lines preceding a closing brace of a block, e.g.
  ```javascript
      return foo;

  }
  ```
  becomes
  ```javascript
      return foo;
  }
  ```

## Blank insertions
In the second phase blank lines are added it these situations:
* around any group of single-line type aliases, e.g.
  ```javascript
  export type AliasedType = nativeType;
  let aliased: AliasedType;
  ```
  becomes
  ```javascript
  export type AliasedType = nativeType;

  let aliased: AliasedType;
  ```
* around any individual multiline type alias,
* around any interface declaration,
* around any function declaration,
* around any class declaration including a decorator, e.g.
  ```javascript
  // non-blank line
  @Component({
    selector: "app-foo",
  })
  class FooComponent {
    // implementation
  }
  // non-blank line
  ```
  becomes
  ```javascript
  // non-blank line

  @Component({
    selector: "app-foo",
  })
  class FooComponent {
    // implementation
  }

  // non-blank line
  ```
* around any class constructor declaration, e.g.
  ```javascript
  class Foo {
      constructor(private bar: type) {
      }
  }
  ```
  becomes
  ```javascript
  class Foo {

      constructor(private bar: type) {
      }

  }
  ```
* around any class method with an explicit access modifier,
* around any class property getter/setter including a decorator, e.g.
  ```javascript
  class A {
    @Input()
    set baz(param: type) {
      this _baz = param;
    }
  }
  ```
  becomes
  ```javascript
  class A {

    @Input()
    set baz(param: type) {
      this _baz = param;
    }

  }
  ```
* around any `describe` block (including nested `describe`s up to indentation level 4) in spec files,
* around any `before(Each|All)`, `after(Each|All)` and `it` block in spec files,
* after the last import statement, e.g.
  ```javascript
  import {Abc} from "abc";
  const foo = 'Foo';
  ```
  becomes
  ```javascript
  import {Abc} from "abc";

  const foo = 'Foo';
  ```

## Cleanup
In the third phase any artifacts possibly introduced by the previous phases are fixed:
* any number of blank lines at the beginning of the file is removed,
* any number of consecutive blank lines is replaced by a single blank line,
* any number of blank lines at the end of the file is replaced by a single blank line.
