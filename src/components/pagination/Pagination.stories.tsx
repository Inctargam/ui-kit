import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'

import { Pagination } from './Pagination'

// Компонент полностью управляемый, поэтому в витрине состояние ведут args:
// useArgs пишет обратно в панель Controls, и там видно, что реально изменилось.
// Отдельная обёртка с useState была бы вторым источником правды и разъезжалась
// бы с Controls при правке args руками.
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 }, description: 'Текущая страница, с единицы' },
    totalPages: { control: { type: 'number', min: 0 }, description: 'Всего страниц' },
    itemsPerPage: { control: false, description: 'Выбранный размер страницы' },
    itemsPerPageOptions: { control: 'object', description: 'Варианты размера страницы' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    return (
      <Pagination
        {...args}
        onPageChange={(page) => updateArgs({ currentPage: page })}
        // Смена размера страницы возвращает на первую: номер прежней страницы
        // в новой разбивке ничего не значит.
        onItemsPerPageChange={(value) => updateArgs({ itemsPerPage: value, currentPage: 1 })}
      />
    )
  },
  args: {
    currentPage: 1,
    totalPages: 55,
    itemsPerPage: 10,
    onPageChange: () => {},
    onItemsPerPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Start: Story = {
  name: 'Начало списка',
  args: { currentPage: 1 },
}

export const Middle: Story = {
  name: 'Середина списка',
  args: { currentPage: 7 },
}

export const End: Story = {
  name: 'Конец списка',
  args: { currentPage: 55 },
}

export const FewPages: Story = {
  name: 'Мало страниц',
  args: { currentPage: 1, totalPages: 5 },
}

// 7 — граница: до неё номера идут подряд, после появляются многоточия.
export const SevenPagesBoundary: Story = {
  name: 'Граница в семь страниц',
  args: { currentPage: 4, totalPages: 7 },
}

export const SinglePage: Story = {
  name: 'Одна страница',
  args: { currentPage: 1, totalPages: 1 },
}
