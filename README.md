# Table of contents
* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Installation](#installation)
* [Usage](#usage)
  * [Directories](#directories)
  * [Ignored paths](#ignored-paths)
  * [Configurability](#configurability)
* [Rules](#rules)
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
An overview of available line-linting rules is available at [https://github.com/RadovanBednar/ts-line-lint/blob/master/docs/rules.md].

# <a name="contact"></a>Contact
If there are any problems related to this tool (a rule does not match, what should be matched; a rule matches something, that should not be matched; the execution hangs), feel free to create an [issue at GitHub](https://github.com/RadovanBednar/ts-line-lint/issues) or send me an email. Don't forget to attach (a necessarily anonymized version of) the file or the relevant piece of code that causes the problem, so I can investigate properly.
