import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useArgs } from 'storybook/preview-api'
import { expect, waitFor } from 'storybook/test'

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

// Тест поведения: стрелка «вперёд» уводит на следующую страницу (useArgs в render
// пишет новую currentPage обратно), и активной становится вторая — по aria-current.
export const Interactive: Story = {
  name: 'Переход вперёд',
  args: { currentPage: 1, totalPages: 55 },
  // Свой render на useState, а не общий meta.render на useArgs: updateArgs пишет через
  // канал Storybook, которого в изолированном тест-прогоне нет — там currentPage не
  // обновилась бы и aria-current не появился. Локальное состояние работает и в тесте.
  render: (args) => {
    const [page, setPage] = useState(1)

    return <Pagination {...args} currentPage={page} onPageChange={setPage} onItemsPerPageChange={() => {}} />
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page'))
  },
}

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
