import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen } from 'storybook/test'

import type { ComboboxProps } from './Combobox.js'
import { Combobox } from './Combobox.js'

const COUNTRY_OPTIONS = [
  { label: 'Belarus', value: 'BY' },
  { label: 'Poland', value: 'PL' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
]

const CITY_OPTIONS = [
  { label: 'Dzyarzhynsk', value: 'dzyarzhynsk', description: 'Minsk Region' },
  { label: 'Minsk', value: 'minsk', description: 'Minsk City' },
  { label: 'Minsk Mazowiecki', value: 'minsk-mazowiecki', description: 'Masovian' },
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  // Поле тянется на всю ширину родителя; попапу нужно место под холстом.
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Подпись над полем' },
    placeholder: { control: 'text', description: 'Текст в пустом поле' },
    error: { control: 'text', description: 'Текст ошибки. Непустой включает aria-invalid' },
    emptyMessage: { control: 'text', description: 'Что показать, когда фильтр ничего не нашёл' },
    disabled: { control: 'boolean', description: 'Блокирует поле и кнопку' },
    limit: { control: 'number', description: 'Максимум пунктов в списке' },
    value: { control: false, description: 'Выбранное значение (управляемое, ведётся в стори)' },
    options: { control: false, description: 'Список вариантов' },
  },
  // Компонент полностью управляемый (value + onValueChange). Чтобы в витрине
  // выбранный пункт реально появлялся в поле, состояние ведёт локальный useState,
  // а не useArgs: writeback через канал Storybook в связке с этим компонентом
  // уводит превью в бесконечный ре-рендер. Спай args.onValueChange по-прежнему
  // дёргается — на нём стоят проверки play.
  render: function Render({ value: initialValue, onValueChange, ...args }: ComboboxProps) {
    const [value, setValue] = useState(initialValue)

    return (
      <Combobox
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onValueChange(next)
        }}
      />
    )
  },
  args: {
    label: 'Select your country',
    options: COUNTRY_OPTIONS,
    value: null,
    onValueChange: fn(),
  },
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Обычный',
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: 'Select your country' })

    await userEvent.type(input, 'bel')
    await userEvent.click(await screen.findByRole('option', { name: 'Belarus' }))

    await expect(args.onValueChange).toHaveBeenCalledWith('BY')
    // Выбранный пункт остаётся в поле — витрина ведёт value через useState.
    await expect(input).toHaveValue('Belarus')
  },
}

export const Selected: Story = {
  name: 'С выбранным значением',
  args: {
    value: 'BY',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toHaveValue('Belarus')
  },
}

export const NoOptions: Story = {
  name: 'Ничего не найдено',
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Mars')

    await expect(await screen.findByText('No Results')).toBeVisible()
  },
}

export const PrefixSearchIgnoresDescription: Story = {
  name: 'Поиск по началу подписи',
  args: {
    label: 'Select your city',
    options: CITY_OPTIONS,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Minsk')
    const options = await screen.findAllByRole('option')

    await expect(options).toHaveLength(2)
    await expect(options[0]).toHaveAccessibleName(/Minsk Minsk City/)
    await expect(screen.queryByRole('option', { name: /Dzyarzhynsk/ })).not.toBeInTheDocument()
  },
}

export const OpensAllOptionsFromTrigger: Story = {
  name: 'Стрелка открывает весь список',
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show Select your country options' }))

    await expect(await screen.findAllByRole('option')).toHaveLength(COUNTRY_OPTIONS.length)
  },
}

export const ClearingInputDeselects: Story = {
  name: 'Очистка поля снимает выбор',
  args: {
    value: 'BY',
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('combobox')
    await expect(input).toHaveValue('Belarus')

    // Полная очистка поля — Base UI снимает выбор (onValueChange(null)),
    // список остаётся открытым для нового выбора.
    await userEvent.clear(input)

    await expect(args.onValueChange).toHaveBeenCalledWith(null)
    await expect(input).toHaveValue('')
  },
}

export const ReselectsAfterClearing: Story = {
  name: 'Новый выбор после очистки',
  args: {
    value: 'BY',
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox')

    await userEvent.clear(input)
    await userEvent.type(input, 'pol')
    await userEvent.click(await screen.findByRole('option', { name: 'Poland' }))

    await expect(input).toHaveValue('Poland')
  },
}

export const UnmatchedTextClearsOnBlur: Story = {
  name: 'Несовпавший текст сбрасывается на клик мимо',
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox')

    await userEvent.type(input, 'Unknown')
    await userEvent.tab()

    await expect(input).toHaveValue('')
  },
}

export const Disabled: Story = {
  name: 'Отключённый',
  args: {
    disabled: true,
  },
}
