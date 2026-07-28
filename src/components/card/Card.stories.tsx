import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from './Card.js'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Внутренний отступ карточки',
    },
    children: {
      control: 'text',
      description: 'Содержимое карточки',
    },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

// Ширину карточке задаёт обёртка стори, а не сама карточка: собственных размеров
// у неё нет, и без родителя не видно, что она тянется по месту.
export const Default: Story = {
  name: 'По умолчанию',
  args: {
    children: 'Card content',
  },
  render: (args) => (
    <div style={{ width: '378px' }}>
      <Card {...args} />
    </div>
  ),
}

export const Compact: Story = {
  name: 'Компактная',
  args: {
    children: 'Compact card',
    padding: 'small',
  },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Card {...args} />
    </div>
  ),
}

export const FlexibleSize: Story = {
  name: 'Шкала отступов',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', width: '520px' }}>
      <Card padding="small">Small padding, parent controls width</Card>
      <Card>Medium padding, parent controls width</Card>
      <Card padding="large">Large padding, parent controls width</Card>
    </div>
  ),
}
