import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Button } from './Button'

// `satisfies Meta<typeof Button>`, а не `: Meta<typeof Button>`: satisfies проверяет
// объект по типу, но сохраняет литеральные типы — и ниже args типизируются union'ом
// вариантов, а не голым string.
const meta = {
  // Латиница: из title собирается id стори и её адрес в URL. Русское имя — в name.
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  // argTypes описывает панель Controls. Базовые контролы Storybook выводит из типов сам,
  // здесь добавляем описания и выбираем виджет.
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text'],
      description: 'Визуальный вариант кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает кнопку',
    },
    children: {
      control: 'text',
      description: 'Текст или содержимое кнопки',
    },
  },
} satisfies Meta<typeof Button>

export default meta

// `typeof meta`, а не `typeof Button`: так стори наследует уже суженные метой args.
type Story = StoryObj<typeof meta>

// Тест поведения (addon-vitest прогонит play как тест): контракт кнопки — вызывать
// onClick по клику и молчать в disabled. Проверяем это, а не классы варианта.
export const Clickable: Story = {
  name: 'Клик',
  args: { children: 'Click me', onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Click me' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const DisabledNoClick: Story = {
  name: 'Отключённая не кликается',
  args: { children: 'No click', disabled: true, onClick: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'No click' })
    await expect(button).toBeDisabled()
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Primary: Story = {
  name: 'Основная',
  args: { children: 'Primary Button', variant: 'primary' },
}

export const Secondary: Story = {
  name: 'Вторичная',
  args: { children: 'Secondary Button', variant: 'secondary' },
}

export const Outline: Story = {
  name: 'С рамкой',
  args: { children: 'Outline Button', variant: 'outline' },
}

export const Text: Story = {
  name: 'Текстовая',
  args: { children: 'Text Button', variant: 'text' },
}

export const Disabled: Story = {
  name: 'Отключённая',
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}

// render заменяет отрисовку одного экземпляра: args управляют только одним,
// а здесь варианты нужны рядом — так видно, что высота у них одинаковая.
export const AllVariants: Story = {
  name: 'Все варианты',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
}
