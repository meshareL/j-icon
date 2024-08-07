import jslint from '@eslint/js';
import tslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
    jslint.configs.recommended,
    ...tslint.configs.recommended,
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: true,
        commaDangle: 'never',
        quoteProps: 'as-needed',
        braceStyle: '1tbs'
    }),
    {
        files: [
            '**/*.js',
            '**/*.ts'
        ]
    },
    {
        ignores: [
            'node_modules/**/',
            'dist/**',
            'test/template/**'
        ]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.nodeBuiltin
            }
        },
        rules: {
            '@stylistic/jsx-indent': [ 'error', 2 ],
            '@stylistic/arrow-parens': [ 'warn', 'as-needed' ],
            '@stylistic/indent': [ 'error', 4, {
                VariableDeclarator: 'first',
                FunctionDeclaration: { parameters: 'first' },
                FunctionExpression: { parameters: 'first' },
                CallExpression: { arguments: 'first' }
            }],
            '@stylistic/array-bracket-spacing': [ 'warn', 'always', {
                singleValue: true,
                objectsInArrays: false,
                arraysInArrays: false
            }],
            '@stylistic/jsx-tag-spacing': [ 'warn', {
                closingSlash: 'never',
                beforeSelfClosing: 'never',
                afterOpening: 'never',
                beforeClosing: 'allow'
            }]
        }
    }
];
