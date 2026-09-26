import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Imports that would break engine purity (docs/ARCHITECTURE.md §3–4, PROJECT_STRUCTURE.md). */
const IO_AND_FRAMEWORK_IMPORTS = [
  {
    group: ['next', 'next/*', 'react', 'react/*', 'react-dom', 'react-dom/*'],
    message: 'Pure packages must not depend on UI frameworks.',
  },
  {
    group: ['node:*', 'fs', 'fs/*', 'http', 'https', 'net', 'child_process', 'worker_threads'],
    message: 'Pure packages must not perform IO.',
  },
  {
    group: ['pg', 'prisma', '@prisma/*', 'redis', 'ioredis', '@clickhouse/*', 'axios', 'undici'],
    message: 'Pure packages must not access databases or network.',
  },
  {
    group: ['@tft/data-access', '@tft/ui'],
    message: 'Pure packages must not depend on data-access or UI packages.',
  },
];

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/.next/',
    '**/coverage/',
    '**/next-env.d.ts',
    'docs/',
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Mechanics Engine: pure + deterministic (PRD §7 Determinism, CALCULATION_RULES §31).
  {
    files: ['packages/mechanics/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: IO_AND_FRAMEWORK_IMPORTS }],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use the seeded RNG from SimulationContext; results must be reproducible.',
        },
        {
          object: 'Date',
          property: 'now',
          message: 'Simulation time comes from the event timeline, not wall-clock time.',
        },
      ],
    },
  },

  // game-schema: types/schemas only, no business IO.
  {
    files: ['packages/game-schema/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: IO_AND_FRAMEWORK_IMPORTS }],
    },
  },

  // Next.js app
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    settings: { next: { rootDir: 'apps/web/' } },
  },

  prettier,
]);
