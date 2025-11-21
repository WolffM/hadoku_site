import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/.astro/**',
			'**/coverage/**',
			'**/public/**',
			'**/.wrangler/**',
			'**/.venv/**',
			'**/venv/**',
			'**/__pycache__/**',
			'**/test/**',
			'**/*.test.ts',
			'**/*.test.tsx',
			'**/vitest.config.ts',
			'**/vite.config.ts',
		],
	},

	// -------------------------------------------------------------
	// Shared base TS config (applies everywhere)
	// -------------------------------------------------------------
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: [
					'./tsconfig.json',
					'./workers/contact-api/tsconfig.json',
					'./workers/task-api/tsconfig.json',
					'./workers/edge-router/tsconfig.json',
					'./workers/util/tsconfig.json',
					'./docs/child-apps/template/tsconfig.json',
				], // enables full type-aware linting
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			// Pull in all recommended + strict TS rules
			...js.configs.recommended.rules,
			...tsPlugin.configs['recommended'].rules,
			...tsPlugin.configs['recommended-type-checked'].rules,
			...tsPlugin.configs['stylistic-type-checked'].rules,

			// -----------------------------
			//     SENSIBLE STRICT RULES
			// -----------------------------

			// Prevent sloppy code paths
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',

			// Avoid silent bugs
			'@typescript-eslint/no-unnecessary-condition': 'off', // Allow defensive null checks in storage/database operations
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
			'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],

			// Real-world strictness
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: false }],
			'@typescript-eslint/no-non-null-assertion': 'off', // Allow ! after validation checks

			// Node/browser correctness
			'no-restricted-globals': ['error', 'event', 'fdescribe'],

			// Safer equality
			eqeqeq: ['error', 'always'],

			// Clean imports
			'no-unused-vars': 'off',
			'no-duplicate-imports': 'error',
			'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

			// Promises must be handled
			'no-void': ['error', { allowAsStatement: true }],

			// Allow console logs when intentional
			'no-console': 'off',

			// Allow intentional || for empty strings and falsy values
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
		},
	},

	// -------------------------------------------------------------
	// FRONTEND / REACT CODE
	// -------------------------------------------------------------
	{
		files: ['src/**/*.{ts,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		rules: {
			// Prevent worker-only APIs from slipping into React code
			'no-restricted-globals': [
				'error',
				{ name: 'D1Database', message: 'Cloudflare Worker global not available in browsers.' },
			],
		},
	},

	// -------------------------------------------------------------
	// DOCS / EXAMPLE CODE
	// -------------------------------------------------------------
	{
		files: ['docs/**/*.{ts,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		rules: {
			// Relax rules for example/template code
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
		},
	},

	// -------------------------------------------------------------
	// CLOUDFLARE WORKERS
	// -------------------------------------------------------------
	{
		files: ['workers/**/*.{ts,tsx}'],
		languageOptions: {
			globals: {
				...globals.serviceworker,
				// Worker-specific builtins
				fetch: 'readonly',
				Response: 'readonly',
				Request: 'readonly',
				// CF-specific
				KVNamespace: 'readonly',
				R2Bucket: 'readonly',
				DurableObjectNamespace: 'readonly',
				D1Database: 'readonly',
				AnalyticsEngineDataset: 'readonly',
			},
		},
		rules: {
			// Relax rules for third-party type issues
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
		},
	},

	// -------------------------------------------------------------
	// NODE / AUTOMATION SCRIPTS
	// -------------------------------------------------------------
	{
		files: ['scripts/**/*.{ts,js}'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	// -------------------------------------------------------------
	// PRETTIER OVERRIDES (must be last)
	// -------------------------------------------------------------
	prettierConfig,
];
