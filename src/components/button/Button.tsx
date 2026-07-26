import type { ButtonProps as BaseButtonProps } from '@base-ui/react/button'
import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import styles from './button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'text'

export type ButtonProps = {
  variant?: Variant
  // className сужен до строки: у Base UI он принимает ещё и функцию от состояния,
  // но состояния кнопки описаны в CSS через [data-*], и вычислять класс в рантайме
  // незачем. Заодно clsx получает предсказуемый тип.
  className?: string
} & Omit<BaseButtonProps, 'className'>

/**
 * Кнопка. Доступность (фокус, клавиатура, `data-disabled`) приходит из примитива
 * Base UI — кит добавляет к ней только оформление варианта.
 *
 * `...props` уходят в `<button>` целиком, включая `ref`: в React 19 это обычный проп,
 * `forwardRef` не нужен.
 */
export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => (
  <BaseButton className={clsx(styles.button, styles[variant], className)} {...props} />
)
