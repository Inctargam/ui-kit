// Директива нужна не самому компоненту, а Modal под ним: Base UI Dialog внутри
// держит портал и слушает клавиатуру. Без неё Next App Router собрал бы серверный
// компонент и упал на первом же хуке.
'use client'

import type { ReactNode } from 'react'

import { Button } from '../button/index.js'
import type { ModalProps } from '../modal/index.js'
import { Modal } from '../modal/index.js'
import styles from './confirm-dialog.module.css'

export type ConfirmDialogProps = {
  cancelLabel?: string
  /** Класс попапа — им задают ширину, когда она отличается от модалочной. */
  className?: string
  /**
   * Закрывает ли подтверждение диалог само.
   * Выключают для асинхронного действия: диалог обязан дожить до ответа сервера,
   * иначе ошибку негде показать. Тогда закрывает его владелец — по успеху.
   */
  closeOnConfirm?: boolean
  /** Блокирует кнопку отмены — например, пока идёт необратимое действие. */
  cancelDisabled?: boolean
  /** Блокирует подтверждение, пока подтверждённое действие ещё выполняется. */
  confirmDisabled?: boolean
  confirmLabel?: string
  /** Блок обратной связи над вопросом — например, ошибка сервера после неудачного подтверждения. */
  error?: ReactNode
  message: ReactNode
  /** Вызывается на отмену, крестик и любое другое закрытие. */
  onCancel?: () => void
  onConfirm: () => void
  // Сужено против ModalProps['onOpenChange']: причину закрытия компонент разбирает
  // сам и наружу не отдаёт — снаружи отмена одна, чем бы она ни была вызвана.
  onOpenChange: (open: boolean) => void
  title: string
} & Pick<ModalProps, 'disablePointerDismissal' | 'dismissDisabled' | 'open'>

/**
 * Диалог подтверждения: заголовок, вопрос и пара кнопок.
 * Своего состояния нет — открытием управляет потребитель.
 *
 * Клик мимо окна по умолчанию не закрывает: на вопрос отвечают, а не отмахиваются
 * случайным кликом. Все пути закрытия (крестик, Esc, отмена) проходят через
 * `onCancel`, поэтому владельцу достаточно одного обработчика.
 */
export const ConfirmDialog = ({
  cancelDisabled = false,
  cancelLabel = 'No',
  className,
  closeOnConfirm = true,
  confirmDisabled = false,
  confirmLabel = 'Yes',
  disablePointerDismissal = true,
  dismissDisabled = false,
  error,
  message,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmDialogProps) => {
  // Крестик, Esc и клик вне окна приходят сюда одним потоком: Base UI закрытие
  // не различает, а для отмены разницы и нет.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel?.()
    }
    onOpenChange(nextOpen)
  }

  const confirmHandler = () => {
    onConfirm()

    if (closeOnConfirm) {
      onOpenChange(false)
    }
  }

  const cancelHandler = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Modal
      className={className}
      disablePointerDismissal={disablePointerDismissal}
      dismissDisabled={dismissDisabled}
      onOpenChange={openChangeHandler}
      open={open}
      title={title}>
      {error ? <div className={styles.error}>{error}</div> : null}
      <div className={styles.message}>{message}</div>
      <div className={styles.actions}>
        {/* Подтверждение — вторичная кнопка, отмена — акцентная: так нарисовано
            в макете. Разрушающее действие не должно быть кнопкой по умолчанию. */}
        <Button className={styles.action} disabled={confirmDisabled} onClick={confirmHandler} variant="outline">
          {confirmLabel}
        </Button>
        <Button className={styles.action} disabled={cancelDisabled} onClick={cancelHandler} variant="primary">
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}
