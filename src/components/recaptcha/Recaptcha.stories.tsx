import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import type { RecaptchaState } from './Recaptcha.js'
import { Recaptcha } from './Recaptcha.js'

const meta = {
  title: 'Components/Recaptcha',
  component: Recaptcha,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'checked', 'loading', 'error', 'expired'],
      description: 'Визуальное состояние виджета — приходит снаружи',
    },
    label: {
      control: 'text',
      description: 'Текст проверки',
    },
  },
} satisfies Meta<typeof Recaptcha>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Обычное',
  args: {
    state: 'default',
  },
}

export const Checked: Story = {
  name: 'Пройдено',
  args: {
    state: 'checked',
  },
}

export const Loading: Story = {
  name: 'Проверка',
  args: {
    state: 'loading',
  },
}

export const ErrorState: Story = {
  name: 'Ошибка',
  args: {
    state: 'error',
  },
}

export const Expired: Story = {
  name: 'Истекло',
  args: {
    state: 'expired',
  },
}

/** Состояние держит потребитель — здесь его роль играет сама стори. */
export const Interactive: Story = {
  name: 'Интерактивная',
  args: {
    state: 'default',
  },
  render: ({ state, ...args }) => {
    const [recaptchaState, setRecaptchaState] = useState<RecaptchaState>(state)

    const verifyRequestHandler = () => {
      setRecaptchaState('loading')
      setTimeout(() => setRecaptchaState('checked'), 300)
    }

    return <Recaptcha {...args} state={recaptchaState} onVerifyRequest={verifyRequestHandler} />
  },
}

export const AllStates: Story = {
  name: 'Все состояния',
  args: {
    state: 'default',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '20px 28px', gridTemplateColumns: 'repeat(2, 300px)' }}>
      <Recaptcha state="default" />
      <Recaptcha state="checked" />
      <Recaptcha state="loading" />
      <Recaptcha state="error" />
      <Recaptcha state="expired" />
    </div>
  ),
}
