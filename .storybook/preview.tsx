// Порядок подключения такой же, как будет у потребителя кита:
// сброс → токены → собственные стили страницы.
import '../src/styles/reset.css'
import '../src/styles/tokens.css'
import './preview.css'

import type { Preview } from '@storybook/react-vite'
import { type ReactNode, useLayoutEffect } from 'react'

/**
 * Держит выбранную в тулбаре поверхность: фон и цвет текста задаёт preview.css,
 * здесь только атрибуты.
 *
 * Атрибута два, и это не дубль. На обёртке он нужен всегда — она и есть поверхность,
 * на которой лежит компонент. На <html> он добавляется только в режиме стори, потому
 * что обёртка занимает высоту содержимого: под коротким компонентом остался бы
 * дефолтный белый холст.
 *
 * В режиме Docs документ не трогаем вовсе. Docs рисуется в том же iframe, но своей
 * светлой темой — покрасив body, мы кладём её тёмный текст на наш чёрный фон
 * и получаем нечитаемую страницу.
 *
 * Отдельный компонент, а не хук прямо в декораторе: декоратор вызывается как функция,
 * и правила хуков на нём не действуют.
 */
function Surface({ surface, isStory, children }: { surface: string; isStory: boolean; children: ReactNode }) {
  useLayoutEffect(() => {
    if (!isStory) return

    document.documentElement.dataset.surface = surface

    // Убираем за собой: iframe переиспользуется при переходе со стори на Docs,
    // и без очистки на документе остался бы фон от прошлого режима.
    return () => {
      delete document.documentElement.dataset.surface
    }
  }, [surface, isStory])

  return <div data-sb-surface={surface}>{children}</div>
}

const preview: Preview = {
  // Docs-страница генерируется для каждой стори без ручного тега.
  tags: ['autodocs'],

  decorators: [
    (Story, { globals, viewMode }) => (
      <Surface surface={globals.surface} isStory={viewMode === 'story'}>
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
    // Витрина открывается на лендинге, дальше — основы (токены, иконки), потом
    // компоненты. Внутри групп индексатор сортирует сам, по алфавиту.
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components'],
      },
    },

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
      // 'todo' — нарушения видны в UI и в логе тестов, но CI не валят. На этапе 6
      // тест-раннер появился, но 'error' сюда не поставили: axe color-contrast
      // фейлит саму тёмную бренд-палитру (primary белый-на-синем 3.86, error-красный
      // на тёмном 3.44, виджет reCAPTCHA) — гейт CI ловил бы фиксированный дизайн,
      // а не регрессию переноса. Палитра — долг дизайн-системы; вернуться к 'error'
      // (возможно, отключив только color-contrast) имеет смысл, когда токены переедут
      // на OKLCH/тему (этап 9). Поведение при этом гейтят play-функции стори.
      test: 'todo',
    },
  },
}

export default preview
