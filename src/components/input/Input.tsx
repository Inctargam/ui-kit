// useState внутри: без директивы Next App Router получил бы серверный компонент
// и упал на хуке. У Button/Card её нет — там своего состояния нет вовсе.
'use client'

import { Field } from '@base-ui/react/field'
import type { InputProps as BaseInputProps } from '@base-ui/react/input'
import { Input as BaseInput } from '@base-ui/react/input'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { EyeIcon, EyeOffIcon, SearchOutlineIcon } from '../../icons/index.js'
import styles from './input.module.css'

export type InputProps = {
  /** Подпись над полем. Строка или узел — под react-hook-form подписи бывают составными. */
  label?: ReactNode
  /** Текст ошибки. Непустой включает состояние `invalid` — отдельного пропа под него нет. */
  error?: string
  // className сужен до строки (как в Button): у Base UI он принимает ещё и функцию
  // от состояния, но состояния поля описаны в CSS через [data-*].
  className?: string
} & Omit<BaseInputProps, 'className'>

/**
 * Поле ввода. Разметку связывает `Field` из Base UI: подпись получает `htmlFor`,
 * ошибка — `aria-describedby`, состояния приезжают на корень атрибутами
 * `data-disabled` / `data-invalid` / `data-focused`, и CSS читает их оттуда.
 *
 * Тип поля меняет только начинку рамки: `search` добавляет иконку слева,
 * `password` — кнопку показа справа. Рамка, высота и отступы у всех типов общие.
 *
 * `className` ложится на корень (им задают ширину и место в раскладке), остальные
 * пропсы вместе с `ref` уходят в сам `<input>` — оттуда полезнее и `focus()`, и `value`.
 */
export const Input = ({ label, error, className, disabled, type, ...props }: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const isPassword = type === 'password'
  const isSearch = type === 'search'

  return (
    <Field.Root className={clsx(styles.root, className)} disabled={disabled} invalid={Boolean(error)}>
      {label && <Field.Label className={styles.label}>{label}</Field.Label>}

      {/* Рамку рисует обёртка, а не сам input: иначе иконка поиска оказалась бы
          снаружи поля, а у password-варианта рамка и кнопка жили бы независимо. */}
      <div className={styles.control}>
        {isSearch && <SearchOutlineIcon className={styles.icon} size={20} />}

        <BaseInput
          className={styles.input}
          // Показ пароля — это подмена типа поля, а не отдельное состояние input'а.
          type={isPassword && passwordVisible ? 'text' : type}
          disabled={disabled}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            // Только aria-label, без aria-pressed: подпись уже меняется по состоянию,
            // вдвоём они дают скринридеру двойное объявление одного и того же.
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            // Выключенное поле выключает и кнопку: иначе пароль в заблокированном
            // поле всё равно можно раскрыть.
            disabled={disabled}
            onClick={() => setPasswordVisible((visible) => !visible)}>
            {passwordVisible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
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
