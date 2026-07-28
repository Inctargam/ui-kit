import clsx from 'clsx'
import type { ComponentProps } from 'react'

import { CloseOutlineIcon } from '../../icons/index.js'
import styles from './alert.module.css'

export type AlertVariant = 'error' | 'success' | 'warning' | 'info'

// ComponentProps<'div'>, а не HTMLAttributes: в React 19 ref — обычный проп,
// и он входит только в первый. children и className оттуда же, отдельно не объявляем.
export type AlertProps = {
  variant: AlertVariant
  /** Не передан — крестика нет, и содержимое центрируется по всей ширине. */
  onClose?: () => void
} & ComponentProps<'div'>

/**
 * Плашка статуса: заливка и рамка задаются вариантом, содержимое — любой узел.
 * Ширину и место в раскладке задаёт родитель.
 *
 * `role="alert"` стоит на корне и перекрывается через `...rest`: у постоянной
 * плашки на странице объявление скринридером на каждый ререндер лишнее.
 */
export const Alert = ({ variant, children, onClose, className, ...props }: AlertProps) => (
  <div role="alert" className={clsx(styles.root, styles[variant], !onClose && styles.centered, className)} {...props}>
    <div className={styles.content}>{children}</div>

    {onClose && (
      <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close alert">
        <CloseOutlineIcon />
      </button>
    )}
  </div>
)
