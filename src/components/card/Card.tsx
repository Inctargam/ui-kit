import clsx from 'clsx'
import type { ComponentProps } from 'react'

import styles from './card.module.css'

type Padding = 'none' | 'small' | 'medium' | 'large'

// ComponentProps<'div'>, а не HTMLAttributes: в React 19 ref — обычный проп,
// и он входит только в первый. children и className оттуда же, отдельно не объявляем.
export type CardProps = {
  padding?: Padding
} & ComponentProps<'div'>

/**
 * Поверхность-контейнер: рамка, фон и внутренний отступ. Размерами не управляет —
 * ширину и высоту задаёт родитель.
 */
export const Card = ({ padding = 'medium', className, ...props }: CardProps) => (
  <div className={clsx(styles.root, styles[padding], className)} {...props} />
)
