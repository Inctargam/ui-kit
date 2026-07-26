import type { ReactNode } from 'react'

import styles from './playground.module.css'

/**
 * Локальная песочница: `pnpm dev` монтирует её и ничего больше.
 * В сборку библиотеки не попадает — точка входа кита это `src/index.ts`.
 * Нужна до этапа 3, пока нет Storybook: смотреть токены и компоненты глазами.
 *
 * Сейчас показывает токены: базовую палитру, семантику, типографику и сетку
 * отступов. Список токенов здесь ручной — он не выводится из CSS, поэтому
 * при правке tokens.css его надо дополнять.
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

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {hint && <p className={styles.subtitle}>{hint}</p>}
      {children}
    </section>
  )
}

export function Playground() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ui-kit — токены</h1>

      <Section
        title="Базовая палитра"
        hint="Сырые цвета бренда. Компоненты обращаются к ним не напрямую, а через семантику.">
        {SCALES.map((scale) => (
          <div className={styles.grid} key={scale}>
            {SHADES.map((shade) => (
              <Swatch key={shade} token={`${scale}-${shade}`} />
            ))}
          </div>
        ))}
      </Section>

      <Section title="Поверхности" hint="Иерархия по «высоте»: страница → панель → всплывающий слой.">
        <div className={styles.grid}>
          {SURFACES.map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section title="Текст">
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

      <Section title="Границы и акцент">
        <div className={styles.grid}>
          {[...LINES, ...ACCENTS].map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section title="Статусы" hint="Пара «контур/текст» + приглушённая заливка для алертов.">
        <div className={styles.grid}>
          {STATUSES.map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section title="Типографика">
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

      <Section title="Отступы" hint="Сетка 4pt: номер токена × 4px.">
        {SPACES.map((step) => (
          <div className={styles.spaceRow} key={step}>
            <div className={styles.spaceBar} style={{ width: `var(--space-${step})` }} />
            <span className={styles.label}>
              --space-{step} = {step * 4}px
            </span>
          </div>
        ))}
      </Section>
    </main>
  )
}
