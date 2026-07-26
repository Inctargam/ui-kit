/**
 * Шаг 1 конвейера иконок: чистка исходных SVG на месте (`src/icons/svg`).
 *
 * Исходники — сырой экспорт из Figma. Что с ними не так:
 *   1) каждый файл обёрнут в <g clip-path> с clipPath на весь холст — он ничего
 *      не отсекает, но тащит за собой <defs> и глобальный id;
 *   2) цвет захардкожен (`fill="black"`), то есть иконка не следует цвету текста;
 *   3) id вида `clip0_306_3913` уникальны только по случайности, а в DOM все иконки
 *      инлайнятся рядом — совпадение id ломает отрисовку сразу у обеих;
 *   4) на корне стоят width/height, из-за которых размер нельзя задать пропом.
 *
 * Запуск: `pnpm icons:clean`. Идемпотентен — на уже почищенных файлах ничего не меняет.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { optimize } from 'svgo'

import { colorOverrides, componentNameFrom, isMonochrome, paths } from './config.mjs'

/** `black` → `#000`, `#CC1439` → `#cc1439`. Нужно, чтобы сравнивать цвета независимо от записи. */
function normalizeColor(value) {
  const named = { black: '#000', white: '#fff' }
  const lower = value.trim().toLowerCase()
  return named[lower] ?? lower
}

/**
 * Убирает бесполезную обёртку `<g clip-path="url(#…)">`, где clipPath — прямоугольник
 * во весь viewBox. Такой clip не отсекает ничего, но обязывает держать <defs> и id.
 *
 * Настоящие клипы (например, у `paid.svg` рамка 16×16 со сдвигом) не трогаем —
 * там отсечение реально влияет на картинку.
 */
const removeFullCanvasClipPath = {
  name: 'removeFullCanvasClipPath',
  description: 'Removes clipPath wrappers that cover the whole viewBox.',
  fn: () => ({
    root: {
      exit: (root) => {
        const svg = root.children.find((child) => child.type === 'element' && child.name === 'svg')
        if (!svg?.attributes.viewBox) return

        const [minX, minY, width, height] = svg.attributes.viewBox.split(/[\s,]+/).map(Number)

        const useless = new Set()

        // Первый проход: собрать id бесполезных clipPath. <defs> в экспорте Figma
        // лежит в конце файла, поэтому за один обход дерева это не сделать.
        const collect = (node) => {
          for (const child of node.children ?? []) {
            if (child.type === 'element') {
              if (child.name === 'clipPath' && child.attributes.id) {
                const shapes = child.children.filter((c) => c.type === 'element')
                const [rect] = shapes
                const coversAll =
                  shapes.length === 1 &&
                  rect.name === 'rect' &&
                  !rect.attributes.transform &&
                  !rect.attributes.rx &&
                  Number(rect.attributes.x ?? 0) === minX &&
                  Number(rect.attributes.y ?? 0) === minY &&
                  Number(rect.attributes.width) === width &&
                  Number(rect.attributes.height) === height

                if (coversAll) useless.add(child.attributes.id)
              }
              collect(child)
            }
          }
        }
        collect(root)
        if (useless.size === 0) return

        const referencesUseless = (value) => {
          const id = value?.match(/^url\(#(.+)\)$/)?.[1]
          return id !== undefined && useless.has(id)
        }

        // Второй проход: выкинуть сами clipPath, снять ссылки на них и развернуть
        // <g>, у которого после этого не осталось ни одного атрибута.
        const prune = (node) => {
          if (!node.children) return

          const next = []
          for (const child of node.children) {
            if (child.type === 'element') {
              if (child.name === 'clipPath' && useless.has(child.attributes.id)) continue

              if (referencesUseless(child.attributes['clip-path'])) {
                delete child.attributes['clip-path']

                if (child.name === 'g' && Object.keys(child.attributes).length === 0) {
                  prune(child)
                  for (const grandChild of child.children) grandChild.parentNode = node
                  next.push(...child.children)
                  continue
                }
              }
              prune(child)
            }
            next.push(child)
          }
          node.children = next
        }
        prune(root)
      },
    },
  }),
}

/**
 * Убирает избыточную пару `<mask>` + `<g mask="…">` из экспорта Figma.
 *
 * Приём в экспорте такой: сначала фигура рисуется путём, потом та же фигура заводится
 * маской, и через неё заливается прямоугольник во весь холст тем же цветом. Итог на экране
 * не меняется — второй слой ложится ровно на первый, — но путь дублируется в файле
 * и появляется глобальный id.
 *
 * Условия намеренно жёсткие: снимаем только когда контур в маске совпадает с уже
 * нарисованным путём и цвет прямоугольника тот же. Не совпало — файл остаётся как есть.
 */
const removeRedundantLuminanceMask = {
  name: 'removeRedundantLuminanceMask',
  description: 'Drops mask + rect duplicates of an already painted path.',
  fn: () => ({
    root: {
      exit: (root) => {
        const svg = root.children.find((child) => child.type === 'element' && child.name === 'svg')
        if (!svg?.attributes.viewBox) return

        const [minX, minY, width, height] = svg.attributes.viewBox.split(/[\s,]+/).map(Number)

        // Плоский список элементов с пометкой «лежит внутри <mask>»: отличать их
        // приходится вручную, полагаться на parentNode у узлов SVGO не стоит.
        const elements = []
        const collect = (node, masked) => {
          for (const child of node.children ?? []) {
            if (child.type === 'element') {
              elements.push({ node: child, masked })
              collect(child, masked || child.name === 'mask')
            }
          }
        }
        collect(svg, false)

        // К этому моменту preset-default уже прогнал convertShapeToPath, так что
        // прямоугольник во весь холст приходит сюда путём, а не <rect>.
        const canvasPath = `M${minX} ${minY}h${width}v${height}H${minX}z`

        const coversCanvas = (node) => {
          if (node.attributes.transform) return false

          if (node.name === 'path') return node.attributes.d?.replace(/\s+/g, ' ').trim() === canvasPath

          return (
            node.name === 'rect' &&
            Number(node.attributes.x ?? 0) === minX &&
            Number(node.attributes.y ?? 0) === minY &&
            Number(node.attributes.width) === width &&
            Number(node.attributes.height) === height
          )
        }

        // `d` путей, нарисованных напрямую: с ними сравниваем контур маски.
        const painted = new Map(
          elements
            .filter(({ node, masked }) => !masked && node.name === 'path' && node.attributes.d)
            .map(({ node }) => [node.attributes.d, node.attributes.fill])
        )

        const redundant = new Set()

        for (const { node } of elements) {
          const maskId = node.attributes.mask?.match(/^url\(#(.+)\)$/)?.[1]
          if (node.name !== 'g' || !maskId) continue

          const [rect, ...extra] = node.children.filter((child) => child.type === 'element')
          if (extra.length > 0 || !rect || !coversCanvas(rect)) continue

          const mask = elements.find(({ node: el }) => el.name === 'mask' && el.attributes.id === maskId)?.node
          if (!mask) continue

          const [contour, ...rest] = mask.children.filter((child) => child.type === 'element')
          if (rest.length > 0 || contour?.name !== 'path') continue
          // Белый контур в luminance-маске = полная непрозрачность. Серый означал бы
          // полупрозрачную копию, и удаление изменило бы картинку.
          if (!['#fff', '#ffffff', 'white'].includes(normalizeColor(contour.attributes.fill ?? ''))) continue
          if (painted.get(contour.attributes.d) !== rect.attributes.fill) continue

          redundant.add(node).add(mask)
        }

        if (redundant.size === 0) return

        const prune = (node) => {
          if (!node.children) return
          node.children = node.children.filter((child) => !redundant.has(child))
          for (const child of node.children) prune(child)
        }
        prune(root)
      },
    },
  }),
}

/** Заменяет цвета заливки и обводки по карте из `config.mjs` (для многоцветных иконок). */
const mapColors = (map) => ({
  name: 'mapColors',
  description: 'Rewrites hardcoded colors to design tokens.',
  fn: () => {
    const normalized = new Map(Object.entries(map).map(([from, to]) => [normalizeColor(from), to]))

    return {
      element: {
        enter: (node) => {
          for (const attr of ['fill', 'stroke']) {
            const value = node.attributes[attr]
            if (value === undefined) continue

            const replacement = normalized.get(normalizeColor(value))
            if (replacement !== undefined) node.attributes[attr] = replacement
          }
        },
      },
    }
  },
})

const files = readdirSync(paths.svg)
  .filter((file) => file.endsWith('.svg'))
  .sort()

let changed = 0

for (const file of files) {
  const path = join(paths.svg, file)
  const source = readFileSync(path, 'utf8')
  const mono = isMonochrome(file)

  const { data } = optimize(source, {
    path,
    plugins: [
      removeFullCanvasClipPath,
      // `xlink:href` → `href` (нужно флагам с их <use>): namespace xlink устарел,
      // а в JSX он превращается в отдельный проп `xmlnsXlink`, который тянуть незачем.
      //
      // Строго до preset-default. Стоя после него, этот плагин ломал идемпотентность:
      // первый прогон отдавал preset-default разметку с xlink, второй — уже без него,
      // и preset-default вёл себя по-разному (в том числе снимал preserveAspectRatio
      // у <image> только на втором проходе).
      'removeXlink',
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Одноцветные обязаны следовать цвету текста, у многоцветных
            // цвета разруливает mapColors ниже.
            convertColors: mono ? { currentColor: true } : {},
          },
        },
      },
      // После preset-default: сравнение цветов идёт уже по нормализованным значениям.
      removeRedundantLuminanceMask,
      ...(mono ? [] : [mapColors(colorOverrides[file])]),
      // Размер задаёт компонент через проп `size`, атрибуты на корне ему мешают.
      'removeDimensions',
      // Оставшиеся id (реальные клипы, паттерны флагов) префиксуем именем компонента:
      // иконки инлайнятся в один документ, а одинаковый id там разрешается в первый
      // встреченный элемент — вторая иконка отрисовалась бы содержимым первой.
      { name: 'prefixIds', params: { prefix: componentNameFrom(file), delim: '-' } },
    ],
  })

  if (data !== source) {
    writeFileSync(path, data)
    changed += 1
  }
}

console.log(`icons:clean — обработано ${files.length}, изменено ${changed}`)
