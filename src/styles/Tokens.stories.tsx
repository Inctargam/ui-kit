import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

import styles from './tokens.showcase.module.css'

/**
 * Витрина токенов — то, что раньше показывала песочница `dev/Playground.tsx`.
 * Компонента у этих стори нет: показываем сам `tokens.css`, а не React-код.
 *
 * Списки токенов ниже ручные — из CSS они не выводятся. Правишь `tokens.css` —
 * дополняешь и здесь, иначе новый токен молча не попадёт в витрину.
 */

const SCALES = ['primary', 'danger', 'warning', 'success', 'light', 'dark'] as const
const SHADES = [100, 300, 500, 700, 900] as const

const SURFACES = [
  'bg',
  'bg-secondary',
  'bg-elevated',
  'bg-hover',
  'bg-active',
  'bg-disabled',
  'bg-inverted',
  'bg-overlay',
  'bg-accent-subtle',
]

const TEXTS = [
  'text-primary',
  'text-secondary',
  'text-placeholder',
  'text-disabled',
  'text-inverted',
  'text-danger',
  'text-on-accent',
  'text-link',
  'text-link-hover',
]

const LINES = ['border', 'border-strong', 'border-hover', 'border-disabled', 'border-accent', 'border-danger']

const ACCENTS = ['accent', 'accent-hover', 'accent-active', 'accent-disabled', 'focus-ring']

const STATUSES = ['danger', 'danger-bg', 'warning', 'warning-bg', 'success', 'success-bg']

const TYPOGRAPHY = [
  'large',
  'h1',
  'h2',
  'h3',
  'regular-16',
  'bold-16',
  'regular-14',
  'medium-14',
  'bold-14',
  'small',
  'semibold-small',
  'regular-link',
  'small-link',
]

const SPACES = [1, 2, 3, 4, 5, 6, 8, 10, 12]

function Swatch({ token }: { token: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.chip}>
        <div className={styles.chipFill} style={{ backgroundColor: `var(--color-${token})` }} />
      </div>
      <span className={styles.label}>--color-{token}</span>
    </div>
  )
}

function Section({ hint, children }: { hint?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
    </section>
  )
}

const meta = {
  // Латиница в title намеренно: из него собирается id стори и адрес в URL
  // (Foundations/Tokens → foundations-tokens--palette). Русский остаётся в name.
  title: 'Foundations/Tokens',
  parameters: {
    // Отступ холста задаёт декоратор в preview.tsx — своего Storybook добавлять не должен.
    layout: 'fullscreen',
    // Аргументов у этих стори нет, панель Controls была бы пустой.
    controls: { disable: true },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Palette: Story = {
  name: 'Базовая палитра',
  render: () => (
    <Section hint="Сырые цвета бренда. Компоненты обращаются к ним не напрямую, а через семантику.">
      {SCALES.map((scale) => (
        <div className={styles.grid} key={scale}>
          {SHADES.map((shade) => (
            <Swatch key={shade} token={`${scale}-${shade}`} />
          ))}
        </div>
      ))}
    </Section>
  ),
}

export const Surfaces: Story = {
  name: 'Поверхности',
  render: () => (
    <Section hint="Иерархия по «высоте»: страница → панель → всплывающий слой.">
      <div className={styles.grid}>
        {SURFACES.map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </div>
    </Section>
  ),
}

export const Text: Story = {
  name: 'Текст',
  render: () => (
    <Section hint="Каждый токен показан на обоих фонах: --color-text-inverted на тёмном не виден вовсе.">
      {TEXTS.map((token) => (
        <div className={styles.textRow} key={token}>
          <span className={styles.textSampleDark} style={{ color: `var(--color-${token})` }}>
            Съешь ещё этих мягких булок
          </span>
          <span className={styles.textSampleLight} style={{ color: `var(--color-${token})` }}>
            Съешь ещё этих мягких булок
          </span>
          <span className={styles.label}>--color-{token}</span>
        </div>
      ))}
    </Section>
  ),
}

export const BordersAndAccent: Story = {
  name: 'Границы и акцент',
  render: () => (
    <Section>
      <div className={styles.grid}>
        {[...LINES, ...ACCENTS].map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </div>
    </Section>
  ),
}

export const Statuses: Story = {
  name: 'Статусы',
  render: () => (
    <Section hint="Пара «контур/текст» + приглушённая заливка для алертов.">
      <div className={styles.grid}>
        {STATUSES.map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </div>
    </Section>
  ),
}

export const Typography: Story = {
  name: 'Типографика',
  render: () => (
    <Section hint="Каждый вариант — тройка токенов: размер, насыщенность, интерлиньяж.">
      {TYPOGRAPHY.map((variant) => (
        <div key={variant}>
          <span
            style={{
              fontSize: `var(--font-size-${variant})`,
              fontWeight: `var(--font-weight-${variant})`,
              lineHeight: `var(--line-height-${variant})`,
            }}>
            {variant} — Съешь ещё этих мягких булок
          </span>
        </div>
      ))}
    </Section>
  ),
}

export const Spacing: Story = {
  name: 'Отступы',
  render: () => (
    <Section hint="Сетка 4pt: номер токена × 4px.">
      {SPACES.map((step) => (
        <div className={styles.spaceRow} key={step}>
          <div className={styles.spaceBar} style={{ width: `var(--space-${step})` }} />
          <span className={styles.label}>
            --space-{step} = {step * 4}px
          </span>
        </div>
      ))}
    </Section>
  ),
}
