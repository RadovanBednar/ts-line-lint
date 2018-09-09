# Introduction
This tool is supposed to enforce consistent use of blank lines in TypeScript files, a goal that cannot be achieved by other code style tools like `tslint` or `prettier`. `ts-line-lint` is by no means supposed to substitute any of these tools nor your IDE's "reformat code" option; it merely complements them. In fact, to use `ts-line-lint` most effectively, the code in all the affected *.ts files should already be properly formatted according to project code style and have any lint errors fixed beforehand.

# Installation
```shell
$ npm install ts-line-lint --save-dev
```

# Usage
Specify one or more subdirectories in your project where the program will look for *.ts files:

```shell
$ ts-line-lint src apps
```

Specifying a non-existent directory will raise an error and terminate the program before any file processing takes place:

```shell
$ ts-line-lint nonsense-dir
Error: Couldn't find directory "nonsense-dir".
```

If you omit any directories, the program will default to all the project subdirectories. The following two commands are essentially the same:

```shell
$ ts-line-lint .
$ ts-line-lint
Warning: No directory specified, using "." as fallback.
```
Nonetheless, it's better to specify the source directories explicitly, so that the synchronous file search would be faster.

`node_modules` directory as well as any hidden directories will be ignored in the file search process, whether specified explicitly or implicitly via `.`. The following two commands will therefore yield exactly 0 *.ts files to process.

```shell
$ ts-line-lint node_modules
Warning: Skipping excluded directory "node_modules".
Found 0 files to process...
$ ts-line-lint .git
Warning: Skipping hidden directory ".git".
Found 0 files to process...

```

Accessing any directories outside of the project is forbidden, therefore any attempt to specify a directory starting with `..` will raise an error and terminate the program before any file processing takes place. This control mechanism can be circumvented by specifying an absolute path, but why would anyone do that is beyond comprehension of the tool's author :)

```shell
$ ts-line-lint ../another-project
Error: Invalid directory "../another-project". Directories outside of CWD are not allowed.
```

# Under the hood
 `ts-line-lint` first lists all the *.ts files in specified project subdirectories and then processes them one by one via a sequence of regular expression replacements. The sequence may be divided into three logical groups (in the order of execution): blank removals, blank insertions and cleanup.

## Blank removals
In the first phase, these unnecessary blanks are removed:
* newlines after @Input() and @Output decorators, e.g.
  ```javascript
  @Input()
  public foo!: Foo;
  ```
  becomes
  ```javascript
  @Input() public foo!: Foo;
  ```
* blank lines before any import statements, preventing holes in import lists,
* blank lines before any variable or class member variable, e.g.
  ```javascript
  describe('test suite', () => {

      const foo = 'foo';
  ```
  becomes
  ```javascript
  describe('test suite', () => {
      const foo = 'foo';
  ```
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
In the second phase additional blank lines are added it these situations:
* around any list of type aliases, e.g.
  ```javascript
  export type AliasedType = nativeType;
  let aliased: AliasedType;
  ```
  becomes
  ```javascript
  export type AliasedType = nativeType;

  let aliased: AliasedType;
  ```
* around any interface declaration,
* around any function declaration,
* around any class declaration,
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
* around any class methods with explicit access modifiers,
* around any class property getters and setters,
* around any `describe` block in spec files (due to the nature of regexps may not work for nested `describe`s, unfortunately),
* around any `before(Each)`, `after(Each)` and `it` block in spec files,
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
* a blank line introduced between a `@Component` decorator and the decorated class is removed,
* any number of blank lines at the beginning of the file is removed,
* any number of consecutive blank lines is replaced by a single blank line,
* any number of blank lines at the end of the file are replaced by a single blank line.













