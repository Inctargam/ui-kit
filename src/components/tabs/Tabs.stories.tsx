import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './index'

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Активная вкладка в неуправляемом режиме',
    },
    value: {
      control: 'text',
      description: 'Активная вкладка в управляемом режиме',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Горизонтальный ряд с подчёркиванием или вертикальный с полосой сбоку',
    },
  },
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Обычные',
  args: { defaultValue: 'general' },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        <Tabs.Tab value="general">Общее</Tabs.Tab>
        <Tabs.Tab value="devices">Устройства</Tabs.Tab>
        <Tabs.Tab value="payments">Платежи</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">Общие настройки профиля</Tabs.Panel>
      <Tabs.Panel value="devices">Список активных сессий</Tabs.Panel>
      <Tabs.Panel value="payments">История списаний</Tabs.Panel>
    </Tabs.Root>
  ),
}

export const WithDisabled: Story = {
  name: 'С отключённой вкладкой',
  args: { defaultValue: 'general' },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        <Tabs.Tab value="general">Общее</Tabs.Tab>
        <Tabs.Tab disabled value="devices">
          Устройства
        </Tabs.Tab>
        <Tabs.Tab value="payments">Платежи</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">Общие настройки профиля</Tabs.Panel>
      <Tabs.Panel value="payments">История списаний</Tabs.Panel>
    </Tabs.Root>
  ),
}

export const ActiveDisabled: Story = {
  name: 'Активная и отключённая',
  args: { defaultValue: 'general' },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        <Tabs.Tab disabled value="general">
          Общее
        </Tabs.Tab>
        <Tabs.Tab value="devices">Устройства</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">Общие настройки профиля</Tabs.Panel>
      <Tabs.Panel value="devices">Список активных сессий</Tabs.Panel>
    </Tabs.Root>
  ),
}

export const Vertical: Story = {
  name: 'Вертикальные',
  args: { defaultValue: 'general', orientation: 'vertical' },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        <Tabs.Tab value="general">Общее</Tabs.Tab>
        <Tabs.Tab value="devices">Устройства</Tabs.Tab>
        <Tabs.Tab value="payments">Платежи</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">Общие настройки профиля</Tabs.Panel>
      <Tabs.Panel value="devices">Список активных сессий</Tabs.Panel>
      <Tabs.Panel value="payments">История списаний</Tabs.Panel>
    </Tabs.Root>
  ),
}
