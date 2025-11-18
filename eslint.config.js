import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.ts', 'index.ts'], // Only lint these files
		ignores: [
			'dist/**',
			'node_modules/**',
			'*.js',
			'**/*.js',
			'eslint.config.js',
		],
		rules: {
			// General
			'no-unnecessary-class': [
				'off',
				{
					'allow-constructor-only': true,
					'allow-static-only': true,
					'allow-empty-class': true,
				},
			],
			'class-methods-use-this': 'off', // ESLint alternative for member-access
			'no-constant-condition': 'off',
			'@typescript-eslint/ban-types': 'off',
			'no-case-declarations': 'off',
			// Other rules...
			// ...

			// TypeScript-specific rules
			'@typescript-eslint/no-unused-vars': 'error', // Similar to no-unused-variable
			'@typescript-eslint/no-explicit-any': 'off', // Similar to no-any
			'@typescript-eslint/no-unsupported-features': 'off',

			// Good and must rules
			'no-console': 'warn', // Warn against console.log() statements
			'no-debugger': 'error', // Disallow the use of debugger statements
			'no-duplicate-imports': 'error', // Disallow duplicate imports
			'no-eval': 'error', // Disallow the use of eval()
			'no-redeclare': 'error', // Disallow variable redeclaration
			'no-trailing-spaces': 'error', // Disallow trailing spaces at the end of lines
			quotes: ['error', 'single'], // Enforce the use of single quotes
			semi: ['error', 'always'], // Enforce the use of semicolons
			curly: 'error', // Enforce consistent curly brace style
			eqeqeq: 'error', // Require strict equality checks (===, !==)
			'prefer-const': 'error', // Prefer const over let when variable is never reassigned
			'@typescript-eslint/no-inferrable-types': 'error', // Disallow explicit type declarations for variables that can be inferred
			'@typescript-eslint/no-misused-new': 'error', // Disallow incorrect usage of new for constructors
			'@typescript-eslint/no-non-null-assertion': 'error', // Disallow non-null assertions using the ! postfix operator
		},
	},
];
