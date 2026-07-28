import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Alert } from './Alert.js'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'radio',
      options: ['error', 'success', 'warning', 'info'],
      description: 'Статус: задаёт заливку и цвет рамки',
    },
    children: {
      control: 'text',
      description: 'Содержимое плашки — любой узел',
    },
    onClose: {
      description: 'Не передан — крестика нет, содержимое центрируется',
    },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: крестик (есть только когда передан onClose) уводит закрытие наружу.
export const Dismissible: Story = {
  name: 'С закрытием',
  args: { variant: 'info', children: 'Dismiss me', onClose: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close alert' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

export const ErrorVariant: Story = {
  name: 'Ошибка',
  args: {
    variant: 'error',
    children: (
      <>
        <b>Error!</b> Server is not available
      </>
    ),
  },
}

export const Success: Story = {
  name: 'Успех',
  args: {
    variant: 'success',
    children: 'Your settings are saved',
  },
}

export const Warning: Story = {
  name: 'Предупреждение',
  args: {
    variant: 'warning',
    children: 'Your session expires in 5 minutes',
  },
}

export const Info: Story = {
  name: 'Информация',
  args: {
    variant: 'info',
    children: 'A new version is available',
  },
}

export const WithClose: Story = {
  name: 'С крестиком',
  args: {
    variant: 'error',
    children: (
      <>
        <b>Error!</b> Server is not available
      </>
    ),
    onClose: () => {},
  },
}
