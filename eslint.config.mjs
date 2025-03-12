/* eslint-disable import/no-named-as-default-member */
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: [
    'dist',
    'dist/*',
    'build',
    'build/*',
    '.husky',
    'node_modules/*',
    '.husky/*',
    '.commitlintrc.json',
    '.prettierrc',
    '.prettierignore',
  ],
  extends: [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginImport.flatConfigs.recommended,
    eslintPluginImport.flatConfigs.typescript,
  ],
  files: ['**/*.{js,mjs,cjs,ts}'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
    ecmaVersion: 2020,
  },
  plugins: { prettier: eslintPluginPrettier, vitest: vitestPlugin },
  rules: {
    ...prettierConfig.rules,
    ...vitestPlugin.configs.recommended.rules,
    'prettier/prettier': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          'vitest.config.ts',
          'setup.ts',
          'eslint.config.mjs',
          'tsup.config.ts',
          'vitest.config.ts',
          'src/utils/tests/*.ts',
          'prisma/vitest-environment-prisma',
          'src/tests/**/*.ts',
        ],
        optionalDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          'vitest.config.ts',
          'setup.ts',
          'eslint.config.mjs',
          'tsup.config.ts',
          'vitest.config.ts',
          'src/utils/tests/*.ts',
          'prisma/vitest-environment-prisma',
          'src/tests/**/*.ts',
        ],
        peerDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          'vitest.config.ts',
          'setup.ts',
          'eslint.config.mjs',
          'tsup.config.ts',
          'vitest.config.ts',
          'src/utils/tests/*.ts',
          'prisma/vitest-environment-prisma',
          'src/tests/**/*.ts',
        ],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'node:',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'fastify',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
    node: ['src'],
  },
});
