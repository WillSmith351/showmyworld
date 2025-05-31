// eslint.config.mjs
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier',
    'jsdoc',
    'sonarjs',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsdoc/recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // ─── RÈGLES GÉNÉRALES (ESLint) ─────────────────────────────────────────────────
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // ─── IMPORTS / ORGANISATION ──────────────────────────────────────────────────────
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.test.ts', 'test/**', 'tests/**'] }
    ],

    // ─── TYPESCRIPT & SÉCURITÉ TYPE AWARE ──────────────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-implicit-any-catch': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/max-parameters': ['error', { max: 3 }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: { message: 'Utilise `string` au lieu de `String`.' },
          Boolean: { message: 'Utilise `boolean` au lieu de `Boolean`.' },
          Number: { message: 'Utilise `number` au lieu de `Number`.' },
          Object: { message: 'Évite `Object`, préfère un type précis ou `Record<string, unknown>`.' },
          Symbol: { message: 'Utilise `symbol` au lieu de `Symbol`.' }
        }
      }
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'func-names': ['error', 'as-needed'],

    // ─── JSDOC ───────────────────────────────────────────────────────────────────────
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/require-description': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-type': 'error',

    // ─── SONARJS (CODE SMELLS) ─────────────────────────────────────────────────────
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', 3],
    'sonarjs/no-identical-conditions': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-object-literal': 'error',

    // ─── PRETTIER (DERNIER) ───────────────────────────────────────────────────────────
    'prettier/prettier': ['error']
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.js'
  ]
};
