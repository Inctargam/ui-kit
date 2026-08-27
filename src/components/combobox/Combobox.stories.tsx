import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, screen } from 'storybook/test'

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
  // Компонент полностью управляемый: без записи value обратно выбранный пункт
  // в поле не появляется. useArgs пишет в панель Controls (там же видно результат),
  // спай args.onValueChange при этом продолжает дёргаться — на нём стоят проверки play.
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <Combobox
        {...args}
        onValueChange={(value) => {
          updateArgs({ value })
          args.onValueChange(value)
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

export const RestoresSelectedValueOnBlur: Story = {
  name: 'Возврат значения на клик мимо',
  args: {
    value: 'BY',
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox')

    await userEvent.clear(input)
    await userEvent.type(input, 'Unknown')
    await userEvent.tab()

    await expect(input).toHaveValue('Belarus')
  },
}

export const ClearsUnmatchedValueOnBlur: Story = {
  name: 'Сброс несовпавшего значения',
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
