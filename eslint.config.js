import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import globals from 'globals';
import typescriptESLint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintPluginN from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import pluginPromise from 'eslint-plugin-promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

/** @see https://eslint.org/docs/latest/use/getting-started */
const nativeESLint = [pluginJs.configs.recommended];

/** @see https://typescript-eslint.io/getting-started/ */
const typescript = [
	...typescriptESLint.configs.recommendedTypeChecked,
	...typescriptESLint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/array-type': ['error', { default: 'generic' }],
			'@typescript-eslint/no-namespace': 'off',
		},
	},
];

/** @see https://github.com/sindresorhus/eslint-plugin-unicorn */
const unicorn = [
	eslintPluginUnicorn.configs['flat/recommended'],
	{
		rules: {
			'unicorn/filename-case': ['error', { case: 'snakeCase' }],
			'unicorn/prevent-abbreviations': [
				'error',
				{
					checkFilenames: false,
					checkDefaultAndNamespaceImports: false,
					checkShorthandImports: false,
					extendDefaultReplacements: false,
					replacements: {
						whitelist: { include: true },
						blacklist: { exclude: true },
						master: { main: true },
						slave: { secondary: true },
						application: { app: true },
						applications: { apps: true },
						arr: { array: true },
						e: { error: true, event: true },
						el: { element: true },
						elem: { element: true },
						len: { length: true },
						msg: { message: true },
						num: { number: true },
						obj: { object: true },
						opts: { options: true },
						param: { parameter: true },
						params: { parameters: true },
						prev: { previous: true },
						req: { request: true },
						res: { response: true, result: true },
						ret: { returnValue: true },
						str: { string: true },
						temp: { temporary: true },
						tmp: { temporary: true },
						val: { value: true },
						err: { error: true },
					},
				},
			],
			'unicorn/numeric-separators-style': 'off',
			'unicorn/no-null': 'off',
		},
	},
];

/** @see https://github.com/SonarSource/eslint-plugin-sonarjs */
const sonar = [
	sonarjs.configs.recommended,
	{
		rules: {
			'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],
		},
	},
];

/** @see https://github.com/eslint-community/eslint-plugin-eslint-comments */
const comments = [eslintComments.recommended];

/** @see https://github.com/eslint-community/eslint-plugin-n */
const node = [
	eslintPluginN.configs['flat/recommended-module'],
	{
		rules: {
			'n/no-missing-import': 'off',
			'n/no-unpublished-import': 'off',
			'n/no-unsupported-features/node-builtins': 'off',
		},
	},
];

/** @see https://github.com/prettier/eslint-config-prettier */
const prettier = [eslintConfigPrettier];

/** @see https://github.com/dustinspecker/eslint-plugin-no-use-extend-native */
const noUseExtendNative = [
	{
		plugins: {
			'no-use-extend-native': eslintPluginNoUseExtendNative,
		},
	},
];

/** @see https://github.com/eslint-community/eslint-plugin-promise */
const promise = [pluginPromise.configs['flat/recommended']];

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
	/* Ignores files globally. */
	{
		ignores: ['dist', 'eslint.config.js', 'domains/_domain'],
	},
	/* Global options. */
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	/**
	 * Older configurations that has not been migrated to flat config yet.
	 * @see https://github.com/un-ts/eslint-plugin-import-x
	 */
	...compat.config({
		extends: ['plugin:import-x/recommended', 'plugin:import-x/typescript'],
		rules: {
			'import-x/no-unresolved': 'off',
			'import-x/namespace': 'off',
			'import-x/default': 'off',
			'import-x/no-named-as-default': 'off',
			'import-x/no-named-as-default-member': 'off',
			'import-x/order': [
				'error',
				{
					'groups': ['type', 'builtin', 'external', 'internal', 'index', 'parent', 'sibling', 'object'],
					'pathGroups': [
						{
							pattern: '#*/**',
							group: 'internal',
						},
					],
					'distinctGroup': true,
					'newlines-between': 'always',
					'alphabetize': {
						order: 'asc',
						orderImportKind: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
		settings: {
			'import-x/parsers': {
				'@typescript-eslint/parser': ['.ts'],
			},
			'import-x/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: true,
				},
				node: true,
			},
		},
	}),

	/* Rules configuration. */
	...nativeESLint,
	...typescript,
	...unicorn,
	...sonar,
	...comments,
	...noUseExtendNative,
	...node,
	...promise,
	...prettier,

	/* Specific for ESLint itself. */
	{
		files: ['eslint.config.js'],
		languageOptions: {
			sourceType: 'script',
			globals: {
				...globals.node,
			},
		},
	},
];
