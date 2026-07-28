import { Field } from '@base-ui/react/field'
import type { SelectRootProps } from '@base-ui/react/select'
import { Select as BaseSelect } from '@base-ui/react/select'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { ArrowIosDownOutlineIcon } from '../../icons/index.js'
import styles from './select.module.css'

export type SelectOption<Value extends string | number = string> = {
  disabled?: boolean
  label: ReactNode
  value: Value
}

export type SelectProps<Value extends string | number = string> = {
  className?: string
  /** Текст ошибки. Непустой включает состояние `invalid` — отдельного пропа под него нет. */
  error?: string
  label?: string
  options: SelectOption<Value>[]
  placeholder?: string
  // items считается из options — прокидывать его снаружи нечем и незачем.
} & Omit<SelectRootProps<Value>, 'children' | 'items'>

/**
 * Выпадающий список. Такой же контрол `Field`, как `Input` и `TextArea`: триггер
 * Base UI ходит в контекст `Field` сам, поэтому состояния приезжают на корень
 * атрибутами `data-disabled` / `data-invalid` / `data-focused`, и одно правило CSS
 * накрывает подпись, рамку, значение и стрелку разом.
 *
 * Попап уезжает порталом в `<body>`, вне DOM-поддерева компонента. Отсюда два
 * следствия: слой ему задаёт `--z-index-popup` (Base UI `z-index` не ставит вовсе),
 * а ширину и доступную высоту он берёт из `--anchor-width` / `--available-height`
 * позиционера — снаружи их взять неоткуда.
 *
 * `className` ложится на корень (им задают ширину и место в раскладке), остальные
 * пропсы уходят в `Select.Root`.
 */
export const Select = <Value extends string | number = string>({
  className,
  disabled,
  error,
  label,
  options,
  placeholder = 'Select',
  ...props
}: SelectProps<Value>) => (
  <Field.Root className={clsx(styles.root, className)} disabled={disabled} invalid={Boolean(error)}>
    {/* items — карта «значение → подпись» для Base UI: без неё Select.Value рисует
        сырое значение вместо подписи выбранного пункта. */}
    <BaseSelect.Root disabled={disabled} items={options} {...props}>
      {/* Select.Label, а не Field.Label: подпись должна ссылаться на триггер,
          а его id знает только Select. */}
      {label && <BaseSelect.Label className={styles.label}>{label}</BaseSelect.Label>}

      <BaseSelect.Trigger className={styles.trigger}>
        <BaseSelect.Value className={styles.value} placeholder={placeholder} />
        <BaseSelect.Icon className={styles.icon}>
          <ArrowIosDownOutlineIcon size={16} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        {/* alignItemWithTrigger={false} — попап встаёт под триггером, а не поверх него:
            по макету это одна «простыня» из триггера и списка, а не наложение. */}
        <BaseSelect.Positioner alignItemWithTrigger={false} className={styles.positioner}>
          <BaseSelect.Popup className={styles.popup}>
            {/* List, а не пункты прямо в Popup: роль listbox переезжает на свой
                элемент, попапу остаётся оформление. Своих стилей у него нет. */}
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  className={styles.item}
                  disabled={option.disabled}
                  key={String(option.value)}
                  value={option.value}>
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>

    {/* match — «показывать всегда»: валидность считает потребитель, а не браузер. */}
    {error && (
      <Field.Error className={styles.error} match>
        {error}
      </Field.Error>
    )}
  </Field.Root>
)
