const expect = require('chai').expect;
const Replacer = require('./replacer');
const createMultilineString = require('../utils').createMultilineString;

describe.only('Replacer', () => {
    const emptyRulesConfig = { rules: {} };
    let config;
    let expectedOutput;

    describe('when the rule "individual-import"', () => {
        const importSnippet = createMultilineString(
            '',
            'import {SingleImportedItem} from "abc";',
            '',
            'import {AnotherSingleImportedItem} from "./def";',
            'import {YetAnotherSingleImportedItem} from "./ghi";',
            '',
            'import {',
            '  FirstOfSeveralImportedItems,',
            '  SecondOfSeveralImportedItems',
            '} from "../jkl";',
            '',
            '// non-blank line',
        );

        describe('is not specified', () => {

            it('should not change lines around individual import', () => {
                expectReplacerWithConfig(emptyRulesConfig).toNotChange(importSnippet);
            });

        });

        describe('has an option "remove: none"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'remove', 'none');
            });

            it('should not change lines around individual imports', () => {
                expectReplacerWithConfig(config).toNotChange(importSnippet);
            });

        });

        describe('has an option "remove: before"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'remove', 'before');
            });

            it('should remove blank lines before each individual import', () => {
                expectedOutput = createMultilineString(
                    'import {SingleImportedItem} from "abc";',
                    'import {AnotherSingleImportedItem} from "./def";',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

        describe('has an option "remove: after"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'remove', 'after');
            });

            it('should remove blank lines after each individual import', () => {
                expectedOutput = createMultilineString(
                    '',
                    'import {SingleImportedItem} from "abc";',
                    'import {AnotherSingleImportedItem} from "./def";',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

        describe('has an option "remove: both"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'remove', 'both');
            });

            it('should remove blank lines both before and after each individual import', () => {
                expectedOutput = createMultilineString(
                    'import {SingleImportedItem} from "abc";',
                    'import {AnotherSingleImportedItem} from "./def";',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

        describe('has an option "insert: none"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'insert', 'none');
            });

            it('should not change lines around individual imports', () => {
                expectReplacerWithConfig(config).toNotChange(importSnippet);
            });

        });

        describe('has an option "insert: before"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'insert', 'before');
            });

            it('should insert a blank line before each individual import', () => {
                expectedOutput = createMultilineString(
                    '',
                    '',
                    'import {SingleImportedItem} from "abc";',
                    '',
                    '',
                    'import {AnotherSingleImportedItem} from "./def";',
                    '',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    '',
                    '',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

        describe('has an option "insert: after"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'insert', 'after');
            });

            it('should insert a blank line after each individual import', () => {
                expectedOutput = createMultilineString(
                    '',
                    'import {SingleImportedItem} from "abc";',
                    '',
                    '',
                    'import {AnotherSingleImportedItem} from "./def";',
                    '',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    '',
                    '',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '',
                    '',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

        describe('has an option "insert: both"', () => {

            beforeEach(() => {
                config = createConfig('individual-import', 'insert', 'both');
            });

            it('should insert blank lines both before and after each individual import', () => {
                expectedOutput = createMultilineString(
                    '',
                    '',
                    'import {SingleImportedItem} from "abc";',
                    '',
                    '',
                    '',
                    'import {AnotherSingleImportedItem} from "./def";',
                    '',
                    '',
                    'import {YetAnotherSingleImportedItem} from "./ghi";',
                    '',
                    '',
                    '',
                    'import {',
                    '  FirstOfSeveralImportedItems,',
                    '  SecondOfSeveralImportedItems',
                    '} from "../jkl";',
                    '',
                    '',
                    '// non-blank line',
                );

                expectReplacerWithConfig(config).toConvert(importSnippet).to(expectedOutput);
            });

        });

    });

    function createConfig(rule, property, option) {
        return { rules: { [rule]: { [property]: option } } }
    }

    function expectReplacerWithConfig(config) {
        replacer = new Replacer(config);

        return {
            toNotChange(snippet) {
                expect(replacer.fix(snippet)).to.equal(snippet);
            },
            toConvert(snippet) {
                return {
                    to(output) {
                        expect(replacer.fix(snippet)).to.equal(output);
                    }
                }
            }
        };
    }

});
