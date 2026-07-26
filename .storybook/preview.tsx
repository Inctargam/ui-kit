// Порядок подключения такой же, как будет у потребителя кита:
// сброс → токены → собственные стили страницы.
import '../src/styles/reset.css'
import '../src/styles/tokens.css'
import './preview.css'

import type { Preview } from '@storybook/react-vite'
import { type ReactNode, useLayoutEffect } from 'react'

/**
 * Держит выбранную в тулбаре поверхность на <html>: фон и цвет текста задаёт
 * preview.css, здесь только атрибут.
 *
 * Атрибут ставится на документ, а не на обёртку стори, потому что фон нужен всему
 * холсту: обёртка занимает высоту содержимого, и под коротким компонентом остался бы
 * дефолтный белый.
 *
 * Отдельный компонент, а не хук прямо в декораторе: декоратор вызывается как функция,
 * и правила хуков на нём не действуют.
 */
function Surface({ surface, children }: { surface: string; children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.surface = surface
  }, [surface])

  return <div data-sb-surface>{children}</div>
}

const preview: Preview = {
  // Docs-страница генерируется для каждой стори без ручного тега.
  tags: ['autodocs'],

  decorators: [
    (Story, { globals }) => (
      <Surface surface={globals.surface}>
        <Story />
      </Surface>
    ),
  ],

  globalTypes: {
    surface: {
      description: 'Фон холста',
      toolbar: {
        title: 'Фон',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Тёмный (--color-bg)' },
          { value: 'light', title: 'Светлый (--color-bg-inverted)' },
        ],
        dynamicTitle: true,
      },
    },
  },

  // Дизайн-система тёмная по умолчанию — «светлый» здесь только инвертированная
  // поверхность, а не вторая тема (подробнее в preview.css).
  initialGlobals: {
    surface: 'dark',
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      controls: {
        sort: 'requiredFirst',
      },
      toc: true,
    },

    a11y: {
      // 'todo' — нарушения видны в UI, но CI не валят. Переключим на 'error'
      // на этапе 6, когда появится тест-раннер.
      test: 'todo',
    },
  },
}

export default preview
