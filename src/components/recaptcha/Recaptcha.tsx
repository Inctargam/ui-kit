// Клик и клавиатура обрабатываются здесь же — без директивы Next App Router
// собрал бы компонент как серверный и обработчики бы не приехали.
'use client'

import clsx from 'clsx'
import type { ComponentProps, KeyboardEvent } from 'react'

import { CheckmarkOutlineIcon, RecaptchaLogoIcon } from '../../icons'
import styles from './recaptcha.module.css'

export type RecaptchaState = 'default' | 'checked' | 'loading' | 'error' | 'expired'

export type RecaptchaProps = {
  /** Состояние рисуется снаружи: сам компонент капчу не проверяет и не знает её результата. */
  state: RecaptchaState
  label?: string
  errorMessage?: string
  expiredMessage?: string
  className?: string
  /** Пользователь нажал на чекбокс — потребитель запускает свою проверку. */
  onVerifyRequest?: () => void
} & Omit<ComponentProps<'div'>, 'onClick'>

const ERROR_MESSAGES: Partial<Record<RecaptchaState, string>> = {
  error: 'Please verify that you are not a robot',
  expired: 'Verification expired. Check the checkbox again.',
}

/**
 * Вид виджета reCAPTCHA — и только вид.
 *
 * Ключа сайта, загрузки `api.js` и обмена токеном здесь нет и не будет: это
 * интеграция с внешним сервисом, а библиотеке компонентов принадлежит разметка.
 * Потребитель подключает настоящий скрипт сам, а сюда прокидывает `state`
 * и слушает `onVerifyRequest`.
 */
export const Recaptcha = ({
  state,
  label = "I'm not a robot",
  errorMessage = ERROR_MESSAGES.error,
  expiredMessage = ERROR_MESSAGES.expired,
  className,
  onVerifyRequest,
  ...props
}: RecaptchaProps) => {
  const isChecked = state === 'checked'
  const isLoading = state === 'loading'
  const hasOuterError = state === 'error'
  const topMessage = state === 'expired' ? expiredMessage : undefined
  const bottomMessage = state === 'error' ? errorMessage : undefined

  const verifyHandler = () => {
    // Проверка уже идёт или пройдена — повторный запрос не нужен.
    if (isLoading || isChecked) {
      return
    }

    onVerifyRequest?.()
  }

  // Роль checkbox на <div> нативной клавиатуры не даёт — пробел и Enter обрабатываем сами.
  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    verifyHandler()
  }

  return (
    <div className={clsx(styles.wrapper, hasOuterError && styles.wrapperError, className)} {...props}>
      <div
        aria-checked={isChecked}
        aria-disabled={isLoading ? 'true' : undefined}
        aria-label={label}
        className={clsx(styles.root, styles[state])}
        onClick={verifyHandler}
        onKeyDown={keyDownHandler}
        role="checkbox"
        tabIndex={isLoading ? -1 : 0}>
        {topMessage && <span className={styles.topMessage}>{topMessage}</span>}

        <span className={styles.challenge}>
          <span className={styles.checkbox} aria-hidden="true">
            {isChecked && <CheckmarkOutlineIcon className={styles.checkmark} size={28} />}
            {isLoading && <span className={styles.spinner} />}
          </span>
          <span className={styles.label}>{label}</span>
        </span>

        <span className={styles.brand}>
          <RecaptchaLogoIcon className={styles.logo} size={30} />
          <span className={styles.brandName}>reCAPTCHA</span>
          <span className={styles.links}>Privacy - Terms</span>
        </span>
      </div>

      {bottomMessage && <p className={styles.bottomMessage}>{bottomMessage}</p>}
    </div>
  )
}
