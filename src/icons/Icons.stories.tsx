import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'

import styles from './icons.showcase.module.css'
import * as iconSet from './index'
import type { IconProps } from './types'

/**
 * Витрина набора иконок — то, что раньше показывала песочница `dev/Playground.tsx`.
 *
 * Список берётся из барреля, а не пишется руками: иначе новая иконка молча
 * не попадёт в витрину. Namespace-импорт тут допустим — стори в пакет не едет,
 * и tree-shaking ей не нужен.
 */
const ICONS = Object.entries(iconSet) as [string, ComponentType<IconProps>][]

/** Иконки, у которых есть собственные цвета: их currentColor перекрашивать не должен. */
const COLORED_ICONS = ['BellOutlineIcon', 'PaidIcon', 'GoogleIcon', 'FlagRuIcon', 'StripeIcon']

const meta = {
  // Латиница в title намеренно: из него собирается id стори и адрес в URL
  // (Foundations/Icons → foundations-icons--set). Русский остаётся в name.
  title: 'Foundations/Icons',
  parameters: {
    // Отступ холста задаёт декоратор в preview.tsx — своего Storybook добавлять не должен.
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Set: Story = {
  // Строковый литерал, не шаблон: индексатор Storybook разбирает файл статически
  // и вычислить `Набор (${ICONS.length})` не может — в сайдбаре осталось бы «Set».
  name: 'Набор',
  render: () => (
    <section className={styles.section}>
      <p className={styles.hint}>
        {ICONS.length} иконок. Список выводится из барреля src/icons — руками не поддерживается.
      </p>
      <div className={styles.grid}>
        {ICONS.map(([name, Icon]) => (
          <div className={styles.cell} key={name}>
            <Icon />
            <span className={styles.label}>{name}</span>
          </div>
        ))}
      </div>
    </section>
  ),
}

export const Color: Story = {
  name: 'Цвет',
  render: () => (
    <section className={styles.section}>
      <p className={styles.hint}>
        Одноцветные наследуют color родителя через currentColor — своего пропа цвета у них нет.
      </p>
      {['--color-text-primary', '--color-text-secondary', '--color-danger', '--color-accent'].map((token) => (
        <div className={styles.colorRow} key={token} style={{ color: `var(${token})` }}>
          <iconSet.BellFillIcon />
          <iconSet.HeartIcon />
          <iconSet.SearchOutlineIcon />
          <span className={styles.label}>color: var({token})</span>
        </div>
      ))}
    </section>
  ),
}

export const OwnColors: Story = {
  name: 'Собственные цвета',
  render: () => (
    <section className={styles.section}>
      <p className={styles.hint}>
        Бейдж и подложка переведены на токены, фирменные цвета чужих логотипов оставлены как есть.
      </p>
      <div className={styles.colorRow} style={{ color: 'var(--color-success)' }}>
        {COLORED_ICONS.map((name) => {
          const Icon = iconSet[name as keyof typeof iconSet] as ComponentType<IconProps>
          return <Icon key={name} size={40} />
        })}
        <span className={styles.label}>родителю задан зелёный: перекраситься должен только колокольчик</span>
      </div>
    </section>
  ),
}

export const Size: Story = {
  name: 'Размер',
  render: () => (
    <section className={styles.section}>
      <p className={styles.hint}>Проп size задаёт сторону квадрата; 16 и 24 — токены --icon-size-sm/md.</p>
      <div className={styles.sizeRow}>
        {[16, 24, 40, 64].map((size) => (
          <div className={styles.cell} key={size}>
            <iconSet.SettingsOutlineIcon size={size} />
            <span className={styles.label}>size={size}</span>
          </div>
        ))}
        {/* Логотипы 24×16 вписываются в квадрат по центру, а не растягиваются */}
        <div className={styles.cell}>
          <iconSet.PaypalIcon size={64} />
          <span className={styles.label}>PaypalIcon 24×16</span>
        </div>
      </div>
    </section>
  ),
}
