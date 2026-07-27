import { Radio } from '@base-ui/react/radio'
import type { RadioGroupProps as BaseRadioGroupProps } from '@base-ui/react/radio-group'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './radioGroup.module.css'

type Direction = 'horizontal' | 'vertical'

export type RadioGroupOption<Value extends string = string> = {
  disabled?: boolean
  label: ReactNode
  value: Value
}

export type RadioGroupProps<Value extends string = string> = {
  className?: string
  direction?: Direction
  options: RadioGroupOption<Value>[]
} & Omit<BaseRadioGroupProps<Value>, 'children' | 'className'>

/**
 * Группа радиокнопок. Каждый пункт — нативный `<label>`, фокус ловит вложенный
 * `Radio.Root`, а не весь ряд — как у обычного `input[type=radio]`. Подложка
 * состояний вокруг индикатора общая с `Checkbox` (`../shared/selectionControl.module.css`);
 * кольцо и точка — обычные `<div>`, а не `<svg>`, тем же приёмом, что квадрат чекбокса.
 */
export const RadioGroup = <Value extends string = string>({
  className,
  direction = 'vertical',
  options,
  ...props
}: RadioGroupProps<Value>) => (
  <BaseRadioGroup className={clsx(styles.group, styles[direction], className)} {...props}>
    {options.map(({ disabled, label, value }) => (
      <label className={styles.item} data-disabled={disabled || props.disabled ? '' : undefined} key={value}>
        <Radio.Root className={styles.radio} disabled={disabled} value={value}>
          <span className={styles.dot} aria-hidden="true" />
        </Radio.Root>
        <span className={styles.label}>{label}</span>
      </label>
    ))}
  </BaseRadioGroup>
)
