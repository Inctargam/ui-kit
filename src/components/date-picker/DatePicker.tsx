// useState + слушатель на document: без директивы Next App Router получил бы
// серверный компонент и упал на первом же хуке.
'use client'

import { Field } from '@base-ui/react/field'
import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'

import { CalendarOutlineIcon } from '../../icons'
import { Calendar } from './Calendar'
import styles from './date-picker.module.css'

/** Диапазон дат режима `range`. Обе границы обязательны: полуоткрытого состояния нет. */
export type DateRange = { from: Date; to: Date }

/** Значение пикера: одна дата в режиме `single`, диапазон в `range`. */
export type DatePickerValue = Date | DateRange | undefined

export type DatePickerProps = {
  /** `single` — одна дата, `range` — диапазон. Меняет и формат значения, и поведение календаря. */
  mode?: 'single' | 'range'
  label?: string
  /** Текст ошибки. Непустой включает состояние `invalid` — отдельного пропа под него нет. */
  error?: string
  disabled?: boolean
  /** Текст, пока дата не выбрана. */
  placeholder?: string
  /** Открыть календарь при монтировании — для витрины и отладки. */
  defaultOpen?: boolean
  /** Значение. Передан — компонент управляемый, значение ведёт потребитель. */
  value?: DatePickerValue
  onChange?: (value: DatePickerValue) => void
  // onChange у <div> — нативный FormEventHandler, наш принимает дату: пересечение
  // по имени пришлось бы разруливать на каждом вызове, поэтому нативный убран.
} & Omit<ComponentProps<'div'>, 'onChange'>

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatValue = (value: DatePickerValue): string => {
  if (!value) return ''
  if (value instanceof Date) return formatDate(value)

  return `${formatDate(value.from)} - ${formatDate(value.to)}`
}

/**
 * Выбор даты: кнопка со значением и выпадающий календарь.
 *
 * Компонент работает и управляемым, и неуправляемым: передан `value` — значение
 * ведёт потребитель, не передан — компонент помнит его сам, а `onChange` остаётся
 * уведомлением.
 *
 * Подпись, ошибку и выключенное состояние связывает `Field` из Base UI — тот же
 * приём, что у `Input` и `TextArea`: состояния приезжают на корень атрибутами
 * `data-disabled` / `data-invalid`, и CSS читает их оттуда одним правилом.
 */
export const DatePicker = ({
  mode = 'single',
  label,
  error,
  className,
  disabled,
  placeholder = 'Select date',
  defaultOpen = false,
  value,
  onChange,
  ...rest
}: DatePickerProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const [internalValue, setInternalValue] = useState<DatePickerValue>(value)
  const rootRef = useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined
  const selected = isControlled ? value : internalValue
  const isRange = mode === 'range'
  const displayValue = formatValue(selected)

  // Попап живёт в потоке страницы, а не в портале, поэтому закрытие по клику мимо
  // и по Escape приходится вести самим. Слушатели висят только пока открыто.
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const commit = (next: DatePickerValue) => {
    onChange?.(next)
    if (!isControlled) setInternalValue(next)
  }

  const handleSelect = (date: Date) => {
    commit(date)
    setOpen(false)
  }

  const handleRangeSelect = (range: DateRange) => {
    commit(range)
    // Первый клик диапазона даёт from === to — набор ещё не закончен, календарь
    // остаётся открытым. Закрываем только на второй, когда границы разъехались.
    if (range.from.getTime() !== range.to.getTime()) setOpen(false)
  }

  return (
    <Field.Root
      ref={rootRef}
      className={clsx(styles.root, className)}
      disabled={disabled}
      invalid={Boolean(error)}
      {...rest}>
      {label && <Field.Label className={styles.label}>{label}</Field.Label>}

      <div className={styles.triggerWrapper}>
        {/* Field.Control с render={<button>}: подпись получает htmlFor на кнопку
            (button — labelable-элемент), ошибка — aria-describedby. Своего
            примитива под выбор даты в Base UI нет. */}
        <Field.Control
          render={<button type="button" />}
          className={styles.trigger}
          disabled={disabled}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}>
          <span className={clsx(styles.value, !displayValue && styles.placeholder)}>{displayValue || placeholder}</span>
          <CalendarOutlineIcon className={styles.icon} size={24} />
        </Field.Control>

        {open && (
          <div className={styles.popup}>
            <Calendar
              mode={mode}
              selected={isRange ? undefined : (selected as Date | undefined)}
              rangeSelected={isRange ? (selected as DateRange | undefined) : undefined}
              onSelect={handleSelect}
              onRangeSelect={handleRangeSelect}
            />
          </div>
        )}
      </div>

      {/* match — «показывать всегда»: валидность считает потребитель, а не браузер. */}
      {error && (
        <Field.Error className={styles.error} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  )
}
