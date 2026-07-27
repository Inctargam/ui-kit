import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen } from 'storybook/test'

import { Select } from './Select'

const options = [
  { label: 'Select-box', value: 'option-1' },
  { label: 'Русский', value: 'option-2' },
  { label: 'Очень длинная подпись пункта, которая не влезает в ширину триггера', value: 'option-3' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  // Список тянется на всю ширину родителя — ширину задаёт раскладка, а не компонент.
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
      description: 'Подпись над списком',
    },
    error: {
      control: 'text',
      description: 'Текст ошибки. Непустой включает состояние invalid',
    },
    placeholder: {
      control: 'text',
      description: 'Что показать, пока ничего не выбрано',
    },
    disabled: {
      control: 'boolean',
      description: 'Блокирует список',
    },
  },
  args: {
    options,
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: клик по триггеру открывает listbox (портал в body), выбор пункта
// пишет значение в триггер и уводит его наружу через onValueChange.
export const Interactive: Story = {
  name: 'Выбор значения',
  args: { label: 'Язык', placeholder: 'Select-box', onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    // Открываем по видимому плейсхолдеру: роль триггера у Base UI не гарантирована,
    // а текст плейсхолдера до открытия уникален.
    await userEvent.click(canvas.getByText('Select-box'))

    // Пункты уезжают порталом в body — ищем по документу.
    await userEvent.click(await screen.findByRole('option', { name: 'Русский' }))

    await expect(canvas.getByText('Русский')).toBeInTheDocument()
    await expect(args.onValueChange).toHaveBeenCalled()
  },
}

export const Default: Story = {
  name: 'Обычный',
  args: { label: 'Язык', placeholder: 'Select-box' },
}

export const Selected: Story = {
  name: 'С выбранным значением',
  args: { label: 'Язык', defaultValue: 'option-1' },
}

export const Invalid: Story = {
  name: 'С ошибкой',
  args: { label: 'Язык', defaultValue: 'option-1', error: 'Error text' },
}

export const Disabled: Story = {
  name: 'Отключённый',
  args: { label: 'Язык', placeholder: 'Select-box', disabled: true },
}

export const WithDisabledOption: Story = {
  name: 'С отключённым пунктом',
  args: {
    label: 'Язык',
    placeholder: 'Select-box',
    options: [
      { label: 'Доступен', value: 'option-1' },
      { disabled: true, label: 'Недоступен', value: 'option-2' },
      { label: 'Доступен', value: 'option-3' },
    ],
  },
}

export const Open: Story = {
  name: 'Раскрытый',
  args: { defaultOpen: true, label: 'Язык', defaultValue: 'option-1' },
}

export const AllStates: Story = {
  name: 'Все состояния',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Select {...args} label="Обычный" placeholder="Select-box" />
      <Select {...args} defaultValue="option-1" label="С выбранным" />
      <Select {...args} defaultValue="option-1" error="Error text" label="С ошибкой" />
      <Select {...args} disabled label="Отключённый" placeholder="Select-box" />
    </div>
  ),
}
