import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  // Поле тянется на всю ширину родителя — ширину задаёт раскладка, а не компонент.
  // На холсте раскладки нет, поэтому её изображает декоратор.
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Подпись над полем',
    },
    error: {
      control: 'text',
      description: 'Текст ошибки. Непустой включает состояние invalid',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search'],
      description: 'Тип поля. search добавляет иконку, password — кнопку показа',
    },
    disabled: {
      control: 'boolean',
      description: 'Блокирует поле',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: кнопка показа пароля меняет тип поля и свою подпись.
// Контракт — видимость значения и aria-label кнопки, а не разметка.
export const PasswordToggle: Story = {
  name: 'Показ пароля',
  args: { label: 'Password', type: 'password', defaultValue: 'secret' },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText('Password')
    await expect(field).toHaveAttribute('type', 'password')

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }))
    await expect(field).toHaveAttribute('type', 'text')
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  },
}

export const Default: Story = {
  name: 'Обычное',
  args: { label: 'Email', placeholder: 'Epam@epam.com' },
}

export const Filled: Story = {
  name: 'С текстом',
  args: { label: 'Email', defaultValue: 'Epam@epam.com' },
}

export const Invalid: Story = {
  name: 'С ошибкой',
  args: { label: 'Email', defaultValue: 'Epam@epam.com', error: 'Error text' },
}

export const Disabled: Story = {
  name: 'Отключённое',
  args: { label: 'Email', placeholder: 'Epam@epam.com', disabled: true },
}

export const Password: Story = {
  name: 'Пароль',
  args: { label: 'Password', type: 'password', defaultValue: 'password' },
}

export const Search: Story = {
  name: 'Поиск',
  args: { type: 'search', placeholder: 'Input search' },
}

export const AllStates: Story = {
  name: 'Все состояния',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Input label="Email" placeholder="Default" />
      <Input label="Email" defaultValue="Epam@epam.com" />
      <Input label="Email" defaultValue="Error" error="Error text" />
      <Input label="Email" placeholder="Disabled" disabled />
      <Input label="Password" type="password" defaultValue="password" />
      <Input label="Password" type="password" defaultValue="password" disabled />
      <Input type="search" placeholder="Input search" />
      <Input type="search" defaultValue="Input search" error="Error text" />
    </div>
  ),
}
