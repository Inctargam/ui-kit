import { Field } from '@base-ui/react/field'
import clsx from 'clsx'
import type { ComponentProps } from 'react'

import styles from './textarea.module.css'

export type TextAreaProps = {
  label?: string
  /** Текст ошибки. Непустой включает состояние `invalid` — отдельного пропа под него нет. */
  error?: string
  className?: string
  // Нативные пропсы берём у <textarea>, а не у Field.Control: тот типизирован
  // по <input>, и rows/cols в нём нет, а onChange приходит с HTMLInputElement.
} & Omit<ComponentProps<'textarea'>, 'className'>

/**
 * Многострочное поле. Устроено как `Input`: `Field` из Base UI связывает подпись,
 * контрол и ошибку, состояния приезжают на корень атрибутами `data-*`,
 * оформление берётся из тех же токенов.
 *
 * Обёртки вокруг поля здесь нет — вставлять внутрь рамки нечего, поэтому рамку
 * и кольцо фокуса несёт сам `<textarea>`.
 *
 * `className` ложится на корень, остальные пропсы и `ref` — на `<textarea>`.
 */
export const TextArea = ({ label, error, className, disabled, rows = 3, ...props }: TextAreaProps) => (
  <Field.Root className={clsx(styles.root, className)} disabled={disabled} invalid={Boolean(error)}>
    {label && <Field.Label className={styles.label}>{label}</Field.Label>}

    {/* Пропсы уходят на элемент из render, а не на Field.Control: так они
        типизированы по <textarea>. Base UI сливает их своим mergeProps —
        обработчики выстраиваются в цепочку, а не затирают друг друга. */}
    <Field.Control className={styles.textarea} render={<textarea disabled={disabled} rows={rows} {...props} />} />

    {error && (
      <Field.Error className={styles.error} match>
        {error}
      </Field.Error>
    )}
  </Field.Root>
)
