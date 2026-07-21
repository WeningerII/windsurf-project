// ESLint 9 flat config — migrated from .eslintrc.json (ESLint 8, EOL).
// Behavior-equivalent by construction; equivalence proven by problem-set diff
// (clean repo + seeded-violation probe) during the Wave 0 T1 dry run.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier/flat';

export default tseslint.config(
  // Was: "ignorePatterns" in .eslintrc.json, plus the `--ext ts,tsx` CLI flag.
  // Flat config has no --ext; scoping every config below to **/*.ts,tsx and
  // globally ignoring js/mjs/cjs reproduces "only lint TS/TSX" exactly.
  {
    ignores: [
      '**/dist/',
      '**/node_modules/',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
    ],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    // Was: "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended",
    //                  "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"]
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      // react-hooks 5.x: `configs.recommended` is still the legacy format;
      // `recommended-latest` is the flat-config variant (same two rules:
      // rules-of-hooks: error, exhaustive-deps: warn).
      reactHooks.configs['recommended-latest'],
      prettier,
    ],
    // Was: "plugins": [..., "react-refresh"] (react/react-hooks/@typescript-eslint
    // are registered by the extends above).
    plugins: {
      'react-refresh': reactRefresh,
    },
    // Was: "env" (browser/es2021/node) + "parserOptions".
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    // Was: the `--report-unused-disable-directives` CLI flag (error severity).
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // --- ESLint 8 parity shim ---------------------------------------------
      // eslint:recommended changed between v8.57 and v9. Effective deltas for
      // this repo (after the @typescript-eslint and prettier overlays, which
      // are identical on both sides):
      //   newly "error" in v9 -> pinned off to match the old effective config
      'no-constant-binary-expression': 'off',
      'no-empty-static-block': 'off',
      'no-unused-private-class-members': 'off',
      //   dropped from v9 recommended -> re-enabled to match the old config
      'no-inner-declarations': 'error',
      // (no-extra-semi / no-mixed-spaces-and-tabs were already off via
      // eslint-config-prettier; no-new-symbol / no-new-native-nonconstructor
      // already off via @typescript-eslint's eslint-recommended overlay.)
      // Recommendation: delete this shim in a follow-up and adopt the v9 set.
      // ----------------------------------------------------------------------

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // Was: overrides[0] — scripts, tests, validation get relaxed rules.
  {
    files: ['src/scripts/**/*', 'src/__tests__/**/*', 'src/validation/**/*', 'scripts/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },

  // Was: overrides[1] — LAYER BOUNDARY (load-bearing; see CLAUDE.md).
  // Shared layers (rules/scene/utils/components/hooks/...) must never
  // value-import from src/systems/**; systems import shared layers, never the
  // reverse. Type-only imports are allowed (erased at compile time). Exempt:
  // the systems tree itself, the registry bootstrap (main.tsx
  // registerAllSystems), the per-system data-dispatch hub (dataLoader), the
  // doc-drift verifier (imports every definition to check docs against truth),
  // and tests/scripts.
  // Flat config expresses eslintrc "excludedFiles" as non-global "ignores"
  // alongside "files" — identical match semantics.
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: [
      'src/systems/**',
      'src/main.tsx',
      'src/utils/dataLoader.ts',
      'src/utils/docDrift.ts',
      'src/__tests__/**',
      'src/scripts/**',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/systems/*', '**/systems/**'],
              message:
                'Layer boundary: shared code must not value-import from src/systems/**. Move system-specific code into src/systems/<id>/ (or the rules layer if rules consume it), or use a type-only import. See CLAUDE.md.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  }
);
