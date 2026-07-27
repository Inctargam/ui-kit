// Base UI ScrollArea меряет содержимое хуками и вешает слушатели на вьюпорт —
// без директивы Next App Router собрал бы его как серверный компонент.
'use client'

import type { ScrollAreaRootProps } from '@base-ui/react/scroll-area'
import { ScrollArea } from '@base-ui/react/scroll-area'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './scroll.module.css'

export type ScrollOrientation = 'vertical' | 'horizontal' | 'both'

export type ScrollProps = {
  children: ReactNode
  className?: string
  /** Какие полосы рисуются. Ось без полосы не прокручивается кастомным скроллбаром. */
  orientation?: ScrollOrientation
} & Omit<ScrollAreaRootProps, 'children' | 'className'>

/**
 * Область прокрутки с полосой в стиле кита вместо системной.
 *
 * Размер задаёт родитель через `className`: сама область тянется на 100% того,
 * что ей дали, — без высоты у контейнера прокручивать нечего.
 *
 * Типографику содержимого не трогает: цвет и шрифт приносят дочерние узлы.
 */
export const Scroll = ({ children, className, orientation = 'vertical', ...props }: ScrollProps) => {
  const hasVerticalScrollbar = orientation !== 'horizontal'
  const hasHorizontalScrollbar = orientation !== 'vertical'

  return (
    <ScrollArea.Root className={clsx(styles.root, className)} overflowEdgeThreshold={8} {...props}>
      <ScrollArea.Viewport className={styles.viewport}>
        <ScrollArea.Content className={styles.content}>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>

      {hasVerticalScrollbar && (
        <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      )}

      {hasHorizontalScrollbar && (
        <ScrollArea.Scrollbar className={styles.scrollbar} orientation="horizontal">
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      )}

      {/* Уголок закрывает стык полос — нужен только когда рисуются обе. */}
      {orientation === 'both' && <ScrollArea.Corner className={styles.corner} />}
    </ScrollArea.Root>
  )
}
