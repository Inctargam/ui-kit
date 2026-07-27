import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { RadioGroup } from './RadioGroup'
import styles from './radioGroup.stories.module.css'

const options = [
  { label: 'Checked option', value: 'checked' },
  { label: 'Off option', value: 'off' },
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Направление списка вариантов',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает всю группу',
    },
  },
  args: {
    direction: 'horizontal',
    name: 'radio-group-story',
    options,
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

// Тест поведения: клик по варианту выбирает его и уводит значение наружу.
// Проверяем роль radio и aria-checked, а не подсветку.
export const Interactive: Story = {
  name: 'Выбор варианта',
  args: { defaultValue: 'checked', onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const off = canvas.getByRole('radio', { name: 'Off option' })
    await expect(off).not.toBeChecked()

    await userEvent.click(off)
    await expect(off).toBeChecked()
    await expect(args.onValueChange).toHaveBeenCalledWith('off', expect.anything())
  },
}

export const Checked: Story = {
  name: 'Выбран',
  args: {
    defaultValue: 'checked',
  },
}

export const Disabled: Story = {
  name: 'Отключена',
  args: {
    defaultValue: 'checked',
    disabled: true,
  },
}

export const Vertical: Story = {
  name: 'Вертикально',
  args: {
    defaultValue: 'checked',
    direction: 'vertical',
  },
}

export const AllStates: Story = {
  name: 'Все состояния',
  render: () => (
    <div className={styles.allStates}>
      <div className={styles.state}>
        <span className={styles.stateLabel}>Checked</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          name="radio-group-all-states-checked"
          options={options}
        />
      </div>

      <div className={styles.state}>
        <span className={styles.stateLabel}>Disabled</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          disabled
          name="radio-group-all-states-disabled"
          options={options}
        />
      </div>

      <div className={styles.state}>
        <span className={styles.stateLabel}>Vertical</span>
        <RadioGroup
          defaultValue="checked"
          direction="vertical"
          name="radio-group-all-states-vertical"
          options={options}
        />
      </div>
    </div>
  ),
}
