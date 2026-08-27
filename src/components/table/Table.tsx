import clsx from 'clsx'
import type { ComponentProps } from 'react'

import styles from './table.module.css'

export type TableRootProps = {
  /** Class for the scroll container that wraps the `<table>`, not for the table itself. */
  wrapperClassName?: string
} & ComponentProps<'table'>

export type TableHeadProps = ComponentProps<'thead'>

export type TableBodyProps = ComponentProps<'tbody'>

export type TableRowProps = ComponentProps<'tr'>

export type TableHeadCellProps = ComponentProps<'th'>

export type TableCellProps = ComponentProps<'td'>

export type TableEmptyProps = {
  /** Number of columns to span — must match the number of `Table.HeadCell` in the header. */
  colSpan: number
} & Omit<ComponentProps<'td'>, 'colSpan'>

export type TableSkeletonProps = {
  /** Number of columns to fill — must match the number of `Table.HeadCell` in the header. */
  columns: number
  rows?: number
}

const DEFAULT_SKELETON_ROWS = 3

const TableRoot = ({ className, wrapperClassName, ...props }: TableRootProps) => (
  <div className={clsx(styles.wrapper, wrapperClassName)}>
    <table className={clsx(styles.table, className)} {...props} />
  </div>
)

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <thead className={clsx(styles.head, className)} {...props} />
)

const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody className={clsx(styles.body, className)} {...props} />
)

const TableRow = ({ className, ...props }: TableRowProps) => <tr className={clsx(styles.row, className)} {...props} />

const TableHeadCell = ({ className, scope = 'col', ...props }: TableHeadCellProps) => (
  <th className={clsx(styles.headCell, className)} scope={scope} {...props} />
)

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td className={clsx(styles.cell, className)} {...props} />
)

const TableEmpty = ({ className, colSpan, ...props }: TableEmptyProps) => (
  <tr className={styles.row}>
    <td className={clsx(styles.emptyCell, className)} colSpan={colSpan} {...props} />
  </tr>
)

/**
 * Placeholder rows for the loading state. Hidden from assistive tech —
 * put `aria-busy="true"` on `Table.Root` so the loading state is announced once.
 */
const TableSkeleton = ({ columns, rows = DEFAULT_SKELETON_ROWS }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <tr key={rowIndex} className={styles.row} aria-hidden="true">
        {Array.from({ length: columns }, (_, cellIndex) => (
          <td key={cellIndex} className={styles.cell}>
            <span className={styles.skeleton} />
          </td>
        ))}
      </tr>
    ))}
  </>
)

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Empty: TableEmpty,
  Skeleton: TableSkeleton,
}
