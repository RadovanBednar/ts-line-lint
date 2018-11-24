import { JSONSchema7 } from 'json-schema';
import { RuleName } from '../linter/rules';

const ruleOptionsDefinitionReference = { $ref: '#/definitions/rule_options' };
const rulesPropertiesSchema: { [K in RuleName]: typeof ruleOptionsDefinitionReference } = {
    'block-padding': ruleOptionsDefinitionReference,
    'individual-import': ruleOptionsDefinitionReference,
    'consecutive-imports': ruleOptionsDefinitionReference,
    'individual-multiline-type-alias': ruleOptionsDefinitionReference,
    'consecutive-single-line-type-aliases': ruleOptionsDefinitionReference,
    'interface-declaration': ruleOptionsDefinitionReference,
    'single-line-variable-declaration': ruleOptionsDefinitionReference,
    'multiline-variable-declaration': ruleOptionsDefinitionReference,
    'function-declaration': ruleOptionsDefinitionReference,
    'class-declaration': ruleOptionsDefinitionReference,
    'class-property-declaration': ruleOptionsDefinitionReference,
    'method-or-accessor-declaration': ruleOptionsDefinitionReference,
    'abstract-method-or-accessor': ruleOptionsDefinitionReference,
    'property-with-effect-decorator': ruleOptionsDefinitionReference,
    'unit-test-describe-block': ruleOptionsDefinitionReference,
    'unit-test-hook-statement': ruleOptionsDefinitionReference,
    'unit-test-it-statement': ruleOptionsDefinitionReference,
};

export const configSchema: JSONSchema7 = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
        indent: {
            anyOf: [
                { type: 'integer', minimum: 1 },
                { type: 'string', const: 'tab' },
            ],
        },
        rules: {
            type: 'object',
            properties: rulesPropertiesSchema,
            additionalProperties: false,
        },
    },
    required: [
        'indent', 'rules',
    ],
    additionalProperties: false,
    definitions: {
        modification_options: {
            type: 'string',
            enum: [
                'before', 'after', 'both', 'none',
            ],
        },
        rule_options: {
            type: 'object',
            properties: {
                remove: {
                    $ref: '#/definitions/modification_options',
                },
                insert: {
                    $ref: '#/definitions/modification_options',
                },
            },
            additionalProperties: false,
        },
    },
};
