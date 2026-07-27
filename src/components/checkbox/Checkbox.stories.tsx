import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Подпись чекбокса',
    },
    checked: {
      control: 'boolean',
      description: 'Контролируемое выбранное состояние',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Начальное выбранное состояние',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает чекбокс',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  name: 'Не выбран',
  args: {
    children: 'Check-box',
  },
}

export const Checked: Story = {
  name: 'Выбран',
  args: {
    children: 'Check-box',
    defaultChecked: true,
  },
}

export const DisabledUnchecked: Story = {
  name: 'Отключён, не выбран',
  args: {
    children: 'Check-box',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  name: 'Отключён, выбран',
  args: {
    children: 'Check-box',
    defaultChecked: true,
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  name: 'Без подписи',
  args: {
    'aria-label': 'Accept terms',
  },
}

// render заменяет отрисовку одного экземпляра: args управляют только одним,
// а здесь варианты нужны рядом — так видно разницу состояний.
export const AllStates: Story = {
  name: 'Все состояния',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <Checkbox>Check-box</Checkbox>
      <Checkbox defaultChecked>Check-box</Checkbox>
      <Checkbox disabled>Check-box</Checkbox>
      <Checkbox defaultChecked disabled>
        Check-box
      </Checkbox>
      <Checkbox aria-label="Icon checkbox" />
    </div>
  ),
}
