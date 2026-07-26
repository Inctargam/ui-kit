/**
 * Шаг 2 конвейера иконок: из почищенных SVG (`src/icons/svg`) генерируются React-компоненты
 * (`src/icons/components`) и баррель `src/icons/index.ts`.
 *
 * Модуль на иконку, а не спрайт: спрайт атомарен — потребитель платит за все 90 штук
 * или ни за одну, tree-shaking по нему невозможен. Отдельный модуль сборщик просто
 * выкидывает, если тот не импортирован.
 *
 * Результат коммитится: так `tsc` и потребители репозитория не зависят от кодогенерации,
 * а диф в PR показывает, что именно поменялось в разметке иконки.
 *
 * Запуск: `pnpm icons:build` (после `pnpm icons:clean`).
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { transform } from '@svgr/core'
import { format, resolveConfig } from 'prettier'

import { componentNameFrom, paths } from './config.mjs'

const HEADER = '// Сгенерировано `pnpm icons:build` из src/icons/svg. Руками не править.\n'

/**
 * Шаблон компонента. Свой, а не дефолтный от SVGR: нужен именованный экспорт
 * (дефолтный не переживает реэкспорт через баррель без ручного переименования),
 * общий тип пропсов и деструктуризация `size`.
 */
const template = ({ componentName, jsx }, { tpl }) => tpl`
import type { IconProps } from '../types'

export function ${componentName}({ size = 24, ...props }: IconProps) {
  return ${jsx}
}
`

const prettierConfig = await resolveConfig(paths.barrel)

const files = readdirSync(paths.svg)
  .filter((file) => file.endsWith('.svg'))
  .sort()

// Папку пересоздаём целиком: иначе переименованная в исходниках иконка
// останется висеть старым компонентом и уедет в пакет.
rmSync(paths.components, { recursive: true, force: true })
mkdirSync(paths.components, { recursive: true })

const generated = []

for (const file of files) {
  const componentName = componentNameFrom(file)
  const svg = readFileSync(join(paths.svg, file), 'utf8')

  const code = await transform(
    svg,
    {
      plugins: ['@svgr/plugin-jsx'],
      typescript: true,
      jsxRuntime: 'automatic',
      // Спред пропсов идёт последним, чтобы потребитель мог перебить любой атрибут.
      expandProps: 'end',
      svgProps: {
        width: '{size}',
        height: '{size}',
        // Иконка по умолчанию декоративная: подпись даёт текст рядом с ней.
        // Там, где иконка сама несёт смысл, потребитель перебивает это через role/aria-label.
        'aria-hidden': 'true',
      },
      template,
    },
    { componentName, filePath: join(paths.svg, file) }
  )

  const formatted = await format(HEADER + code, { ...prettierConfig, parser: 'typescript' })
  writeFileSync(join(paths.components, `${componentName}.tsx`), formatted)

  generated.push({ componentName, iconName: file.replace(/\.svg$/, '') })
}

const barrel = [
  HEADER,
  '/**',
  ' * Публичный вход в набор иконок. Экспорты именованные и пофайловые —',
  ' * реестра `name -> компонент` здесь намеренно нет: он утащил бы в бандл',
  ' * все иконки сразу и убил tree-shaking.',
  ' */',
  '',
  // Сортировка по имени компонента, а не файла: `simple-import-sort` упорядочивает
  // экспорты по пути модуля, и порядок «arrow-ios-back-outline.svg перед
  // arrow-ios-back.svg» он считает ошибкой.
  ...generated
    .map(({ componentName }) => componentName)
    .sort()
    .map((componentName) => `export { ${componentName} } from './components/${componentName}'`),
  // Без пустой строки: `simple-import-sort` считает её границей группы
  // и требует сортировать реэкспорты одним блоком.
  "export type { IconProps } from './types'",
  '',
  '/**',
  ' * Имена всех иконок набора.',
  ' *',
  ' * Нужен там, где иконка выбирается из данных, а не пишется в коде:',
  ' * проп вида `icon: IconName` или значение из ответа API. Генерируется вместе',
  ' * с компонентами, поэтому не может разъехаться с содержимым папки.',
  ' */',
  'export type IconName =',
  // Здесь порядок как в папке `svg` — так union проще сверять с исходниками глазами.
  ...generated.map(({ iconName }) => `  | '${iconName}'`),
  '',
].join('\n')

writeFileSync(paths.barrel, await format(barrel, { ...prettierConfig, parser: 'typescript' }))

console.log(`icons:build — сгенерировано ${generated.length} компонентов`)
