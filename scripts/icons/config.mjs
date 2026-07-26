/**
 * Общие настройки конвейера иконок: где лежат файлы, как из имени файла
 * получается имя компонента, какие иконки многоцветные и во что мапятся их цвета.
 *
 * Используется обоими шагами: `icons:clean` (SVGO) и `icons:build` (SVGR).
 */
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))

export const paths = {
  svg: `${root}src/icons/svg`,
  components: `${root}src/icons/components`,
  barrel: `${root}src/icons/index.ts`,
}

/**
 * `arrow-ios-back-outline` → `ArrowIosBackOutlineIcon`.
 *
 * Суффикс `Icon` не косметика: без него в публичном API кита появятся `Image`,
 * `Search`, `Menu`, `Person` — имена, которые у потребителя почти гарантированно
 * столкнутся с чем-то своим (например, с `Image` из `next/image`).
 */
export function componentNameFrom(fileName) {
  const base = fileName.replace(/\.svg$/, '')
  const pascal = base.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase())
  return `${pascal}Icon`
}

/**
 * Иконки, у которых есть собственные цвета, — их нельзя красить в `currentColor` целиком.
 * Ключ — имя файла, значение — карта «цвет в исходнике → чем заменить».
 *
 * Правило разделения: наши цвета переводим на токены (иначе смена темы или бренда
 * пройдёт мимо иконок), чужие фирменные оставляем как есть — логотип Google,
 * перекрашенный вместе с темой, это уже не логотип.
 *
 * Фолбэк в `var(--token, #hex)` нужен на случай, если потребитель не подключил
 * `tokens.css`: без него `fill` схлопнется в чёрный, и иконка просто исчезнет на тёмном фоне.
 */
export const colorOverrides = {
  // Колокольчик с бейджем: сам колокольчик обязан следовать цвету текста,
  // бейдж — наш danger, цифра на бейдже — цвет поверх акцентной заливки.
  'bell-outline.svg': {
    black: 'currentColor',
    '#CC1439': 'var(--color-danger-500, #cc1439)',
    white: 'var(--color-text-on-accent, #fff)',
  },
  // Галочка «оплачено»: подложка — наш primary, галочка поверх неё.
  'paid.svg': {
    '#397DF6': 'var(--color-primary-500, #397df6)',
    white: 'var(--color-text-on-accent, #fff)',
  },
  // Ниже — чужие бренд-марки. Цвета фиксированы гайдлайнами их владельцев,
  // на токены не переводим и в currentColor не сворачиваем.
  'facebook.svg': {},
  'flag-ru.svg': {},
  'flag-uk.svg': {},
  'google.svg': {},
  'paypal.svg': {},
  'recaptcha-logo.svg': {},
  'stripe.svg': {},
}

/** Одноцветные иконки красятся целиком в `currentColor` — их подавляющее большинство. */
export function isMonochrome(fileName) {
  return !(fileName in colorOverrides)
}
