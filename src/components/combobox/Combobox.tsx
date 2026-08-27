// useState/useId внутри: без директивы Next App Router получил бы серверный
// компонент и упал на хуке.
'use client'

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import clsx from 'clsx'
import { useId, useState } from 'react'

import { ArrowIosDownOutlineIcon } from '../../icons/index.js'
import styles from './combobox.module.css'

export type ComboboxOption = {
  /** Значение, которое уходит в `onValueChange` и хранится в `value`. */
  value: string
  /** Видимая подпись пункта. По ней же идёт фильтрация ввода. */
  label: string
  /** Вторая строка пункта под подписью. В фильтр не входит. */
  description?: string
}

export type ComboboxProps = {
  /** Список вариантов. Фильтруется по началу `label`, без учёта регистра. */
  options: readonly ComboboxOption[]
  /** Выбранное значение (`ComboboxOption.value`) или `null`. Компонент управляемый. */
  value: string | null
  /** Вызывается при выборе пункта и при полной очистке поля (тогда с `null`). */
  onValueChange: (value: string | null) => void
  /** Уход фокуса с поля. Несовпавший с вариантом текст к этому моменту уже сброшен. */
  onBlur?: () => void
  /** Подпись над полем. Также идёт в `aria-label` кнопки-стрелки. */
  label?: string
  /** Текст в пустом поле. По умолчанию `'Select...'`. */
  placeholder?: string
  /** Блокирует поле и кнопку. */
  disabled?: boolean
  /** Текст ошибки под полем. Непустой включает `aria-invalid` — отдельного пропа нет. */
  error?: string
  /** Что показать, когда фильтр ничего не нашёл. `null` — не показывать блок вовсе. По умолчанию `'No Results'`. */
  emptyMessage?: string | null
  /** Максимум пунктов в выпадающем списке. Без него — все совпавшие. */
  limit?: number
  /** Класс корневой обёртки — мержится через `clsx`. */
  className?: string
}

/**
 * Поле с автодополнением: ввод фильтрует список по началу подписи, выбор пишет
 * значение через `onValueChange`. Управляемый — держит `value` снаружи.
 *
 * Список уезжает порталом в `<body>`. Пустой ввод при уходе фокуса снимает выбор
 * (`onValueChange(null)`), несовпавший с вариантом текст откатывается к подписи
 * выбранного пункта.
 *
 * `className` ложится на корневую обёртку — ей задают ширину и место в раскладке.
 */
export const Combobox = ({
  options,
  value,
  onValueChange,
  onBlur,
  label,
  placeholder = 'Select...',
  disabled = false,
  error,
  emptyMessage = 'No Results',
  limit,
  className,
}: ComboboxProps) => {
  const inputId = useId()
  const messageId = useId()
  const [query, setQuery] = useState<string | null>(null)
  const selectedOption = options.find((option) => option.value === value) ?? null
  const filter = BaseCombobox.useFilter({ sensitivity: 'base' })
  const inputValue = query ?? selectedOption?.label ?? ''

  const valueChangeHandler = (option: ComboboxOption | null) => {
    setQuery(null)
    onValueChange(option?.value ?? null)
  }

  const blurHandler = () => {
    if (inputValue.trim() === '') {
      onValueChange(null)
    }

    setQuery(null)
    onBlur?.()
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      {/* openOnInputClick оставлен по умолчанию (true): при очистке поля Base UI
          снимает выбор и, если клик по полю не открывает список, ещё и закрывает
          его — тогда после удаления текста выпадашку уже не вернуть, только стрелкой.
          С открытием по клику очистка сразу показывает полный список для нового выбора. */}
      <BaseCombobox.Root
        autoHighlight
        disabled={disabled}
        filter={filter.startsWith}
        isItemEqualToValue={(option, selectedValue) => option.value === selectedValue?.value}
        itemToStringLabel={(option) => option.label}
        items={options}
        inputValue={inputValue}
        limit={limit}
        onInputValueChange={setQuery}
        onValueChange={valueChangeHandler}
        value={selectedOption}>
        <BaseCombobox.InputGroup className={styles.inputGroup}>
          <BaseCombobox.Input
            aria-describedby={error ? messageId : undefined}
            aria-invalid={Boolean(error)}
            className={styles.input}
            id={inputId}
            onBlur={blurHandler}
            placeholder={placeholder}
          />
          <BaseCombobox.Trigger
            aria-label={label ? `Show ${label} options` : 'Show options'}
            className={styles.trigger}>
            <BaseCombobox.Icon className={styles.icon}>
              <ArrowIosDownOutlineIcon size={16} />
            </BaseCombobox.Icon>
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>

        <BaseCombobox.Portal>
          <BaseCombobox.Positioner align="start" className={styles.positioner} sideOffset={0}>
            <BaseCombobox.Popup className={styles.popup}>
              {emptyMessage && <BaseCombobox.Empty className={styles.empty}>{emptyMessage}</BaseCombobox.Empty>}
              <BaseCombobox.List className={styles.list}>
                {(option: ComboboxOption) => (
                  <BaseCombobox.Item className={styles.item} key={option.value} value={option}>
                    <span>{option.label}</span>
                    {option.description && <span className={styles.description}>{option.description}</span>}
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>

      {error && (
        <span className={clsx(styles.feedback, styles.error)} id={messageId}>
          {error}
        </span>
      )}
    </div>
  )
}
