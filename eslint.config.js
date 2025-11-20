import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'**/{dist,node_modules,.astro,public,coverage,.wrangler}/**',
			'**/{.venv,venv,__pycache__}/**',
			'*.pyc',
		],
	},

	// TypeScript (app code)
	{
		files: ['src/**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
				// optionally: project: './tsconfig.json',
			},
			globals: {
				...globals.browser,
				// add *only* the Cloudflare globals you truly have at runtime
			},
		},
		plugins: { '@typescript-eslint': tsPlugin },
		rules: {
			...js.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,
			'no-console': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'off', // or 'error' if you mean it
			'@typescript-eslint/no-non-null-assertion': 'off', // or 'error'
			// drop stylistic rules if you’re using Prettier
		},
	},

	// Node scripts
	{
		files: ['scripts/**/*.{js,ts}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
			globals: globals.node,
		},
		plugins: { '@typescript-eslint': tsPlugin },
		rules: {
			...js.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,
			'no-console': 'off',
		},
	},

	// Prettier last
	prettierConfig,
];
