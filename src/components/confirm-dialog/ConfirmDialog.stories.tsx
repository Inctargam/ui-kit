import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen } from 'storybook/test'

import { ConfirmDialog } from './ConfirmDialog.js'

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Диалог подтверждения поверх `Modal`.',
          '',
          'Компонент управляемый: состояние `open` держит родитель.',
          'Любое закрытие — кнопка отмены, крестик, `Escape` — проходит через `onCancel`',
          'и `onOpenChange(false)`. Подтверждение вызывает `onConfirm` и следом `onOpenChange(false)`.',
          '',
          'Асинхронное действие — `closeOnConfirm={false}`: диалог останется на экране,',
          'и закроет его владелец, когда запрос завершится успехом. Иначе ошибку негде показать.',
          '',
          '`disablePointerDismissal` включён по умолчанию: на вопрос отвечают, а не',
          'отмахиваются случайным кликом мимо окна.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    cancelDisabled: { description: 'Блокирует кнопку отмены' },
    cancelLabel: { description: 'Текст кнопки отмены. По умолчанию `No`' },
    closeOnConfirm: { description: 'Закрывать ли диалог сразу после подтверждения. По умолчанию `true`' },
    confirmLabel: { description: 'Текст кнопки подтверждения. По умолчанию `Yes`' },
    dismissDisabled: { description: 'Глушит крестик, Esc и клик мимо — на время необратимого действия' },
    error: { description: 'Блок обратной связи над вопросом. ReactNode' },
    message: { description: 'Тело диалога. Принимает ReactNode, не только строку' },
  },
  args: {
    open: true,
    title: 'Delete Post',
    message: 'Are you sure you want to delete this post?',
    onConfirm: fn(),
    onCancel: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

/** Открытый диалог с подписями кнопок по умолчанию. */
export const Default: Story = {
  name: 'Обычный',
}

/** Свои подписи кнопок. */
export const CustomLabels: Story = {
  name: 'Свои подписи',
  args: {
    title: 'Discard changes',
    message: 'Do you really want to finish editing? If you close the changes you have made will not be saved',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
}

/** Блок обратной связи над вопросом — например, ошибка сервера после неудачного подтверждения. */
export const WithError: Story = {
  name: 'С ошибкой',
  args: {
    closeOnConfirm: false,
    error: 'Server responded 500. Try again.',
    confirmDisabled: false,
  },
  play: async ({ userEvent }) => {
    await expect(screen.getByText('Server responded 500. Try again.')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))
    // closeOnConfirm=false — диалог остаётся, ошибке есть где показаться.
    await expect(screen.getByRole('dialog')).toBeVisible()
  },
}

/** `dismissDisabled` глушит крестик, Esc и клик мимо, пока идёт необратимое действие. */
export const DismissDisabled: Story = {
  name: 'Закрытие заблокировано',
  args: {
    dismissDisabled: true,
    cancelDisabled: true,
    confirmDisabled: true,
  },
  play: async ({ args, userEvent }) => {
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()

    await userEvent.keyboard('{Escape}')
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(screen.getByRole('dialog')).toBeVisible()
  },
}

// Диалог уезжает порталом в <body>, поэтому во всех play-функциях ниже он ищется
// по документу (screen), а не по холсту стори.
/** Подтверждение вызывает `onConfirm` и просит родителя закрыть диалог. */
export const Confirms: Story = {
  name: 'Подтверждение',
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onCancel).not.toHaveBeenCalled()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** С `closeOnConfirm={false}` диалог остаётся открытым — закрывает его владелец. */
export const KeepsOpenOnConfirm: Story = {
  name: 'Остаётся открытым',
  args: {
    closeOnConfirm: false,
  },
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(screen.getByRole('dialog')).toBeVisible()
  },
}

/** Отмена не вызывает `onConfirm`. */
export const Cancels: Story = {
  name: 'Отмена',
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: 'No' }))

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Крестик ведёт себя как отмена. */
export const ClosesByX: Story = {
  name: 'Закрытие крестиком',
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Escape ведёт себя как отмена. */
export const ClosesOnEscape: Story = {
  name: 'Закрытие по Esc',
  play: async ({ args, userEvent }) => {
    await userEvent.keyboard('{Escape}')

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}
