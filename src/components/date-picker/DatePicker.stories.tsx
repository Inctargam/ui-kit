import type { Meta, StoryObj } from '@storybook/react-vite'

import { DatePicker } from './DatePicker'

// Корень пикера — width: 100%, ширину задаёт раскладка потребителя. В витрине
// её задаёт декоратор, иначе контрол схлопнулся бы по содержимому.
const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['single', 'range'],
      description: 'Режим выбора: одна дата или диапазон',
    },
    label: { control: 'text', description: 'Подпись над контролом' },
    error: { control: 'text', description: 'Текст ошибки. Непустой включает состояние invalid' },
    placeholder: { control: 'text', description: 'Текст, пока дата не выбрана' },
    disabled: { control: 'boolean', description: 'Выключает контрол вместе с календарём' },
    defaultOpen: { control: 'boolean', description: 'Открыть календарь при монтировании' },
  },
  args: {
    label: 'Date select',
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

// Дата фиксированная, а не new Date(): иначе снимок стори менялся бы каждый день
// и визуальная регрессия на этапе 6 падала бы без причины.
const DAY = new Date(2026, 6, 15)
const RANGE = { from: new Date(2026, 6, 6), to: new Date(2026, 6, 19) }

export const Default: Story = {
  name: 'Пустой',
  args: { placeholder: 'Select date' },
}

export const WithValue: Story = {
  name: 'С выбранной датой',
  args: { value: DAY },
}

export const Open: Story = {
  name: 'С открытым календарём',
  args: { value: DAY, defaultOpen: true },
}

export const WithError: Story = {
  name: 'С ошибкой',
  args: { value: DAY, error: 'Error!' },
}

export const Disabled: Story = {
  name: 'Выключенный',
  args: { placeholder: 'Select date', disabled: true },
}

export const Range: Story = {
  name: 'Диапазон',
  args: { mode: 'range', label: 'Date range', value: RANGE },
}

export const RangeOpen: Story = {
  name: 'Диапазон с открытым календарём',
  args: { mode: 'range', label: 'Date range', value: RANGE, defaultOpen: true },
}

export const RangeError: Story = {
  name: 'Диапазон с ошибкой',
  args: {
    mode: 'range',
    label: 'Date range',
    value: RANGE,
    error: 'Error, select current month or last month',
  },
}

export const AllStates: Story = {
  name: 'Все состояния',
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <div style={{ width: 280 }}>
        <DatePicker label="Date select" placeholder="Default" />
      </div>
      <div style={{ width: 280 }}>
        <DatePicker label="Date select" value={DAY} />
      </div>
      <div style={{ width: 280 }}>
        <DatePicker label="Date select" value={DAY} error="Error!" />
      </div>
      <div style={{ width: 280 }}>
        <DatePicker label="Date select" placeholder="Disabled" disabled />
      </div>
      <div style={{ width: 280 }}>
        <DatePicker mode="range" label="Date range" value={RANGE} />
      </div>
      <div style={{ width: 280 }}>
        <DatePicker mode="range" label="Date range" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
}
