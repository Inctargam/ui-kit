import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../button'
import { Modal } from './Modal'

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
