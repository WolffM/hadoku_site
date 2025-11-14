import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

export default [
	// Global ignores
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/.astro/**',
			'**/public/**',
			'**/coverage/**',
			'**/.wrangler/**',
			'**/scripts/backups/**',
			'**/scripts/.venv/**',
			'**/scripts/admin/.venv/**',
			'**/.venv/**',
			'**/venv/**',
			'**/__pycache__/**',
			'*.pyc',
		],
	},

	// JavaScript/TypeScript files
	{
		files: ['**/*.js', '**/*.mjs', '**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				// Node.js globals
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				Buffer: 'readonly',
				// Browser globals
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				// Cloudflare Workers globals
				Request: 'readonly',
				Response: 'readonly',
				fetch: 'readonly',
				crypto: 'readonly',
				Headers: 'readonly',
				URL: 'readonly',
				URLSearchParams: 'readonly',
				ReadableStream: 'readonly',
				WritableStream: 'readonly',
				TransformStream: 'readonly',
				FormData: 'readonly',
				AbortController: 'readonly',
				AbortSignal: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
				queueMicrotask: 'readonly',
				structuredClone: 'readonly',
				atob: 'readonly',
				btoa: 'readonly',
				TextEncoder: 'readonly',
				TextDecoder: 'readonly',
				KVNamespace: 'readonly',
				D1Database: 'readonly',
				AnalyticsEngineDataset: 'readonly',
				DurableObjectNamespace: 'readonly',
				R2Bucket: 'readonly',
				// Custom Elements
				HTMLElement: 'readonly',
				customElements: 'readonly',
				// Browser Storage
				sessionStorage: 'readonly',
				localStorage: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,

			// TypeScript specific
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',

			// General
			'no-console': 'off', // We want console logs in workers
			'no-unused-vars': 'off', // Use TypeScript rule instead
			'prefer-const': 'warn',
			'no-var': 'error',
			'object-shorthand': 'warn',
			'prefer-template': 'warn',
			'prefer-arrow-callback': 'warn',
			'no-throw-literal': 'error',
			'prefer-promise-reject-errors': 'error',

			// Code quality
			'no-duplicate-imports': 'off', // Disable base rule for TypeScript
			'no-self-compare': 'error',
			'no-template-curly-in-string': 'warn',
			'require-atomic-updates': ['error', { allowProperties: true }], // Allow browser navigation
			'no-case-declarations': 'error', // Enforce block scoping in switch cases

			// Best practices
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',
			'no-return-await': 'error',
			'no-await-in-loop': 'warn',
			'no-useless-escape': 'error',
		},
	},

	// Disable rules that conflict with Prettier
	prettierConfig,
];
