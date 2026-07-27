// Внутри Select из Base UI — контекст и состояние открытия.
'use client'

import { Select } from '@base-ui/react/select'
import clsx from 'clsx'
import type { ComponentProps } from 'react'

import { ArrowIosBackIcon, ArrowIosDownOutlineIcon, ArrowIosForwardIcon } from '../../icons'
import styles from './pagination.module.css'

export type PaginationProps = {
  /** Текущая страница, нумерация с единицы. */
  currentPage: number
  totalPages: number
  /** Выбранный размер страницы — одно из значений `itemsPerPageOptions`. */
  itemsPerPage: number
  itemsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange: (value: number) => void
} & ComponentProps<'nav'>

const DEFAULT_OPTIONS = [10, 20, 30, 50, 100]

/** Многоточие в списке страниц. Отдельный тип, чтобы `pages` не был `(number | string)[]`. */
const ELLIPSIS = '…'

type PageItem = number | typeof ELLIPSIS

/**
 * Собирает видимый список страниц: до 7 показываются подряд, дальше края
 * прижимаются к первой и последней, а разрывы схлопываются в многоточие.
 */
function buildPages(current: number, total: number): PageItem[] {
  const pages: PageItem[] = []

  // Защита от двух многоточий подряд и от дубля номера на стыке окон.
  const add = (value: PageItem) => {
    if (pages[pages.length - 1] !== value) {
      pages.push(value)
    }
  }

  const firstPage = 1
  const lastPage = total

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const isNearStart = current <= 4
  const isNearEnd = current >= total - 3

  if (isNearStart) {
    for (let page = firstPage; page <= 5; page++) {
      add(page)
    }
    add(ELLIPSIS)
    add(lastPage)

    return pages
  }

  if (isNearEnd) {
    add(firstPage)
    add(ELLIPSIS)
    for (let page = lastPage - 4; page <= lastPage; page++) {
      add(page)
    }

    return pages
  }

  add(firstPage)
  add(ELLIPSIS)
  for (let page = current - 1; page <= current + 1; page++) {
    add(page)
  }
  add(ELLIPSIS)
  add(lastPage)

  return pages
}

/**
 * Постраничная навигация: стрелки, номера страниц и выбор размера страницы.
 *
 * Компонент полностью управляемый — текущую страницу и размер ведёт потребитель,
 * своего состояния у него нет. При `totalPages <= 0` не рисуется вовсе.
 *
 * `className` и остальные пропсы ложатся на корневой `<nav>`.
 */
export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsPerPageOptions = DEFAULT_OPTIONS,
  onPageChange,
  onItemsPerPageChange,
  className,
  ...rest
}: PaginationProps) {
  if (totalPages <= 0) return null

  const pages = buildPages(currentPage, totalPages)

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return
    if (page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav className={clsx(styles.root, className)} aria-label="Pagination" {...rest}>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page">
        <ArrowIosBackIcon size={24} />
      </button>

      <ol className={styles.list}>
        {pages.map((page, index) =>
          page === ELLIPSIS ? (
            // Ключ по индексу намеренно: многоточий в списке максимум два,
            // и различает их только позиция.
            <li key={`ellipsis-${index}`} className={styles.dots} aria-hidden="true">
              {ELLIPSIS}
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                className={clsx(styles.page, page === currentPage && styles.pageActive)}
                onClick={() => goTo(page)}
                // Текущую страницу объявляет aria-current, а не подпись:
                // визуальное выделение скринридеру не видно.
                aria-current={page === currentPage ? 'page' : undefined}>
                {page}
              </button>
            </li>
          )
        )}
      </ol>

      <button
        type="button"
        className={styles.arrow}
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page">
        <ArrowIosForwardIcon size={24} />
      </button>

      <div className={styles.perPage}>
        <span className={styles.perPageText}>Show</span>

        {/* Селект собран здесь на примитивах Base UI, а не на Select кита:
            тот приезжает соседним батчем. Переключить — задача на потом. */}
        <Select.Root
          value={itemsPerPage}
          onValueChange={(value: number | null) => {
            if (value !== null) onItemsPerPageChange(value)
          }}>
          <Select.Trigger className={styles.selectTrigger} aria-label="Items per page">
            <Select.Value />
            <Select.Icon className={styles.selectIcon}>
              <ArrowIosDownOutlineIcon size={16} />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            {/* alignItemWithTrigger={false} — список выпадает под триггером,
                а не наезжает на него выбранным пунктом. */}
            <Select.Positioner alignItemWithTrigger={false}>
              <Select.Popup className={styles.selectPopup}>
                {itemsPerPageOptions.map((option) => (
                  <Select.Item key={option} value={option} className={styles.selectItem}>
                    <Select.ItemText>{option}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>

        <span className={styles.perPageText}>on page</span>
      </div>
    </nav>
  )
}
