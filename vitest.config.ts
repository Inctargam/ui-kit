import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

/**
 * Тесты кита — это стори: addon-vitest превращает каждую в тест (mount + a11y + play,
 * если есть). Отдельных *.test.ts пока нет, поэтому проект один — storybook; unit-проект
 * матчил бы ноль файлов и валил бы `vitest run`. Вернём, когда появится первый unit-тест.
 *
 * Конфиг самостоятельный, а не extends от vite.config.ts: там library mode (build.lib,
 * preserveModules, external), тестам он не нужен — стори собираются билдером Storybook
 * (configDir → .storybook/main.ts, где viteFinal этот режим и снимает). Отсюда react-плагин
 * и css.modules приезжают вместе со стори; resolve.alias здесь — подстраховка под `@/*`.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
