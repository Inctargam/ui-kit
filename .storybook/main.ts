import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  // Стори лежат рядом с кодом, который показывают: Button.tsx + Button.stories.tsx.
  // Из пакета они не едут — tsconfig.build.json их исключает, а vite build видит
  // только то, что достижимо из src/index.ts.
  // .mdx — только страницы-доки без стори (лендинг Introduction).
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],

  // addon-vitest (этап 6) превращает каждую стори в тест — mount + a11y + play, если есть.
  // Chromatic из remark-gram по-прежнему не подключён: требует аккаунт и токен в секретах,
  // отложен как опциональный пункт этапа 6.
  addons: ['@storybook/addon-vitest', '@storybook/addon-docs', '@storybook/addon-a11y'],

  // react-vite, а не nextjs-vite: Next в ките нет. Если стори упадёт с
  // "invariant expected app router to be mounted" — компонент тайно зависит от Next,
  // и чинить надо компонент, а не подпирать провайдером.
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    defaultName: 'Docs',
  },

  viteFinal(config) {
    // Storybook подхватывает корневой vite.config.ts целиком, а там включён library mode
    // (build.lib + preserveModules + rolldownOptions.external). Для `storybook build`
    // это чужие настройки: сборка статики — обычное приложение, а не библиотека.
    // Точечно снимаем их, остальное (алиас @/*, react-плагин, css.modules) оставляем.
    if (config.build) {
      config.build.lib = undefined
      config.build.rolldownOptions = undefined
      config.build.minify = 'esbuild'
    }

    return config
  },
}

export default config
