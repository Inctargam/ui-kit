import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, waitFor } from 'storybook/test'

import { Button } from '../button/index.js'
import { Modal } from './Modal.js'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Заголовок в шапке',
    },
    open: {
      control: 'boolean',
      description: 'Открытием управляет потребитель — своего состояния у модалки нет',
    },
    disablePointerDismissal: {
      control: 'boolean',
      description: 'Клик вне модалки её не закрывает — остаются крестик и Esc',
    },
  },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: кнопка открывает модалку (роль dialog уезжает порталом в body),
// Esc закрывает. Контракт — доступная роль и заголовок, а не разметка попапа.
export const Interactive: Story = {
  name: 'Открытие и закрытие',
  args: { open: false, onOpenChange: () => {}, title: 'Modal Title', children: null },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onOpenChange={setOpen} title="Modal Title">
          <p style={{ margin: 0 }}>Modal content goes here</p>
        </Modal>
      </>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }))

    // Попап в портале — ищем по документу, а не по холсту стори.
    await expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await expect(screen.getByText('Modal Title')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

/** Модалка с кнопкой открытия — основной сценарий использования. */
export const Default: Story = {
  name: 'Обычная',
  args: {
    open: false,
    onOpenChange: () => {},
    title: 'Modal Title',
    children: null,
  },
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <p style={{ margin: 0 }}>Modal content goes here</p>
        </Modal>
      </>
    )
  },
}

/** Закрывается только крестиком и Esc: клик по подложке игнорируется. */
export const DisablePointerDismissal: Story = {
  ...Default,
  name: 'Без закрытия по клику вне',
  args: {
    ...Default.args,
    title: 'Confirm Action',
    disablePointerDismissal: true,
  },
}

/** Слот слева в шапке: шапка переходит на сетку, заголовок центрируется. */
export const HeaderStart: Story = {
  name: 'Слот в шапке',
  args: {
    open: false,
    onOpenChange: () => {},
    title: 'Settings',
    children: null,
    headerStart: <Button variant="text">←</Button>,
  },
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <p style={{ margin: 0 }}>Modal content goes here</p>
        </Modal>
      </>
    )
  },
}

// dismissDisabled глушит все пути закрытия — крестик выключен, Esc и клик мимо не
// действуют. Сценарий: необратимое действие в процессе.
export const DismissDisabled: Story = {
  name: 'Закрытие заблокировано',
  args: { open: false, onOpenChange: () => {}, title: 'Deleting…', children: null },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onOpenChange={setOpen} title="Deleting…" dismissDisabled>
          <p style={{ margin: 0 }}>Please wait until the operation finishes.</p>
        </Modal>
      </>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Modal' }))

    const dialog = await screen.findByRole('dialog')
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()

    await userEvent.keyboard('{Escape}')
    // Esc не закрывает: попап остаётся в документе.
    await expect(dialog).toBeInTheDocument()
  },
}

/** Кнопки действий в теле — пример confirm-диалога. */
export const WithActions: Story = {
  name: 'С кнопками действий',
  args: {
    open: false,
    onOpenChange: () => {},
    title: 'Log Out',
    children: null,
    disablePointerDismissal: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <p style={{ margin: '0 0 24px' }}>
            Are you really want to log out of your account <strong>&quot;Epam@epam.com&quot;</strong>?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'end' }}>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Yes
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              No
            </Button>
          </div>
        </Modal>
      </>
    )
  },
}
