// Base UI Dialog внутри держит состояние портала и слушает клавиатуру — без директивы
// Next App Router собрал бы его как серверный компонент и упал на хуке.
'use client'

import type { DialogPopupProps, DialogRootProps } from '@base-ui/react/dialog'
import { Dialog } from '@base-ui/react/dialog'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { CloseOutlineIcon } from '../../icons/index.js'
import styles from './modal.module.css'

export type ModalProps = {
  /**
   * Класс обёртки тела — для окон, содержимое которых должно игнорировать
   * отступы по умолчанию (картинка во всю ширину, своя сетка).
   */
  bodyClassName?: string
  open: boolean
  /** Тип берётся у Base UI: вторым аргументом приезжает причина закрытия (Esc, клик вне, крестик). */
  onOpenChange: DialogRootProps['onOpenChange']
  title: string
  children: ReactNode
  // className сужен до строки (как в Input): у Base UI он принимает ещё и функцию
  // от состояния, но состояния попапа описаны в CSS через [data-*].
  className?: string
  /** Закрытие остаётся только на крестике и Esc — клик вне модалки её не закрывает. */
  disablePointerDismissal?: boolean
  /** Слот слева в шапке. Когда задан, шапка переключается на сетку 24px 1fr 24px, заголовок центрируется. */
  headerStart?: ReactNode
  /**
   * Глушит все пути закрытия (крестик, Esc, клик мимо), пока идёт необратимое действие.
   * Обёртка над `onOpenChange` + `disabled` у крестика; клик мимо снимает `disablePointerDismissal`.
   */
  dismissDisabled?: boolean
} & Omit<DialogPopupProps, 'children' | 'className' | 'title'>

/**
 * Модальное окно поверх страницы: подложка, шапка с заголовком и крестиком, тело.
 * Открытием управляет потребитель — `open` + `onOpenChange`, своего состояния нет.
 *
 * `className` и остальные пропсы ложатся на попап (им задают ширину), подложка
 * и портал своих настроек наружу не отдают.
 */
export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  bodyClassName,
  className,
  disablePointerDismissal = false,
  headerStart,
  dismissDisabled = false,
  ...props
}: ModalProps) => {
  // Крестик и Esc гасятся здесь, клик мимо — через disablePointerDismissal ниже.
  const openChangeHandler: DialogRootProps['onOpenChange'] = (nextOpen, eventDetails) => {
    if (!nextOpen && dismissDisabled) {
      return
    }

    onOpenChange?.(nextOpen, eventDetails)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={openChangeHandler}
      disablePointerDismissal={disablePointerDismissal || dismissDisabled}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={clsx(styles.popup, className)} {...props}>
          <div className={styles.header} data-has-start={headerStart ? true : undefined}>
            {headerStart ? <div className={styles.headerStart}>{headerStart}</div> : null}
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close" disabled={dismissDisabled}>
              <CloseOutlineIcon />
            </Dialog.Close>
          </div>
          <div className={clsx(styles.body, bodyClassName)}>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
