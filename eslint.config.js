import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
// Выключает правила ESLint, конфликтующие с Prettier. Идёт последним в extends,
// иначе его отключения перетрут обратно. Сам Prettier запускается отдельно (`pnpm format`),
// а не через eslint-plugin-prettier: так ошибки форматирования не мешаются с настоящими.
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // .claude — рабочие каталоги агента, в том числе git-воркри с копией репозитория:
  // без игнора линт видит два кандидата в tsconfigRootDir и падает на разборе.
  globalIgnores(['dist', 'storybook-static', 'coverage', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  // Правила Storybook: обязательный default export в стори, запрет на renderer-specific
  // импорты и т. п. Идёт после общего блока — конфиг плагина сам сужается до
  // *.stories.* и .storybook/**.
  storybook.configs['flat/recommended'],
  {
    // Стори и конфиг Storybook экспортируют не только компоненты (meta, декораторы),
    // а react-refresh требует, чтобы модуль с компонентом экспортировал только их.
    // Для библиотечного кода правило полезное, здесь — ложное срабатывание.
    files: ['**/*.stories.tsx', '.storybook/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
