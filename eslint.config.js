import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.slidev/**',
      'test-results/**',
      'playwright-report/**',
      '.preview/**',
      '.worktrees/**',
    ],
  },
  // Vue parser handles .vue files; TS parser handles <script> blocks inside
  ...pluginVue.configs['flat/recommended'],
  // TypeScript rules scoped to .ts/.mjs files only
  {
    files: ['**/*.ts', '**/*.mjs'],
    extends: tseslint.configs.recommended,
  },
  // Set TypeScript as inner parser for Vue <script lang="ts"> blocks.
  // Must come AFTER flat/recommended so vue-eslint-parser stays as outer parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // TypeScript rules for .vue files — extract rules only, do not re-set languageOptions.parser
  {
    files: ['**/*.vue'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: tseslint.configs.recommended
      .filter((c) => c.rules)
      .reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
  },
  // Project-level rule overrides for Vue
  {
    files: ['**/*.vue'],
    rules: {
      // Component names like Abs, Block, Callout are the published theme API — renaming would be breaking
      'vue/multi-word-component-names': 'off',
      // Default values are managed centrally in utils/defaults.ts, not per-prop in components
      'vue/require-default-prop': 'off',
      // v-html is intentional: renders sanitized Markdown/HTML from slide frontmatter
      'vue/no-v-html': 'off',
    },
  },
  // global-top.vue renders no DOM — it only runs watchEffect to set CSS variables on :root.
  // vue/valid-template-root is disabled because an empty template is intentional here.
  {
    files: ['global-top.vue'],
    rules: { 'vue/valid-template-root': 'off' },
  },
  // Files that bridge Slidev/Vite internals use `any` intentionally: Slidev does not
  // export stable TypeScript types for its slide objects or transformer context, so
  // typed access would require casting through `unknown` at every property access,
  // making the code harder to read without improving correctness.
  {
    files: [
      'utils/layoutHelper.ts',
      'utils/sectionModel.ts',
      'utils/slideWip.ts',
      'setup/transformers.ts',
      'setup/vite-plugins.ts',
    ],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  eslintConfigPrettier,
)
