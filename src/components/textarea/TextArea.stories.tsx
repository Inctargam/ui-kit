import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { TextArea } from './TextArea'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  // Ширину задаёт раскладка родителя — на холсте её изображает декоратор.
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Text-area',
    placeholder: 'Text-area',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Подпись над полем',
    },
    error: {
      control: 'text',
      description: 'Текст ошибки. Непустой включает состояние invalid',
    },
    rows: {
      control: 'number',
      description: 'Высота в строках. По умолчанию 3',
    },
    disabled: {
      control: 'boolean',
      description: 'Блокирует поле',
    },
  },
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: поле принимает ввод. Контракт — роль textbox по подписи и value.
export const Typing: Story = {
  name: 'Ввод текста',
  args: { label: 'Comment' },
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Comment' })
    await userEvent.type(textarea, 'Hello')
    await expect(textarea).toHaveValue('Hello')
  },
}

export const Default: Story = {
  name: 'Обычное',
}

export const Filled: Story = {
  name: 'С текстом',
  args: { defaultValue: 'Text-area' },
}

export const Invalid: Story = {
  name: 'С ошибкой',
  args: { defaultValue: 'Text-area', error: 'Error text' },
}

export const Disabled: Story = {
  name: 'Отключённое',
  args: { disabled: true },
}

// Стори hover/focus/active из remark-gram не перенесены: они рисовали состояние
// руками, дублируя CSS компонента в стори-модуле, — такая копия расходится
// с оригиналом при первой же правке. Наведение и фокус проверяются мышью
// и клавиатурой, автоматически — на этапе 6, play-функциями.
export const AllStates: Story = {
  name: 'Все состояния',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <TextArea label="Text-area" placeholder="Default" />
      <TextArea label="Text-area" defaultValue="Text-area" />
      <TextArea label="Text-area" defaultValue="Text-area" error="Error text" />
      <TextArea label="Text-area" placeholder="Disabled" disabled />
    </div>
  ),
}
