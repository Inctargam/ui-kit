import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, waitFor } from 'storybook/test'

import { Edit2OutlineIcon, TrashOutlineIcon } from '../../icons/index.js'
import { DropdownMenu } from './DropdownMenu.js'

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Выпадающее меню действий на `@base-ui/react/menu`.',
          '',
          'Триггер — `<button>`; по умолчанию рисуется иконка «три точки», своё содержимое',
          'передаётся пропом `trigger`.',
          '',
          'Иконка пункта — готовый элемент (`<Edit2OutlineIcon />`), а не имя: реестра',
          '«имя → компонент» в ките нет, он тянул бы в бандл все 90 иконок.',
          '',
          '## Доступность',
          '- `ariaLabel` обязателен: триггер по умолчанию иконочный, называть его нечем.',
          '- Клавиатура из коробки: `Enter`/`Space` открывают, стрелки двигают подсветку,',
          '  `Escape` закрывает.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    ariaLabel: { description: 'Доступное имя кнопки-триггера' },
    items: { description: 'Пункты меню. `onSelect` вызывается по клику, меню закрывается само' },
    trigger: { description: 'Содержимое триггера. По умолчанию — иконка «три точки»' },
  },
  args: {
    ariaLabel: 'Post actions',
    items: [
      { id: 'edit', label: 'Edit Post', icon: <Edit2OutlineIcon />, onSelect: fn() },
      { id: 'delete', label: 'Delete Post', icon: <TrashOutlineIcon />, onSelect: fn(), danger: true },
    ],
  },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

/** Закрытое меню — виден только триггер. */
export const Default: Story = {
  name: 'Обычное',
}

// Попап уезжает порталом в <body>, поэтому во всех play-функциях ниже он ищется
// по документу (screen), а триггер — по холсту стори (canvas).
/** Открывается по клику, пункты видны. */
export const OpensOnClick: Story = {
  name: 'Открытие по клику',
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))

    await expect(await screen.findByRole('menu')).toBeInTheDocument()
    await expect(screen.getByRole('menuitem', { name: 'Edit Post' })).toBeInTheDocument()
    await expect(screen.getByRole('menuitem', { name: 'Delete Post' })).toBeInTheDocument()
  },
}

/** Выбор пункта вызывает его `onSelect` и закрывает меню. */
export const SelectsItem: Story = {
  name: 'Выбор пункта',
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit Post' }))

    await expect(args.items[0].onSelect).toHaveBeenCalledOnce()
    await expect(args.items[1].onSelect).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  },
}

/** Enter открывает меню, стрелка вниз двигает подсветку на следующий пункт. */
export const KeyboardNavigation: Story = {
  name: 'Клавиатура',
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('button', { name: 'Post actions' }).focus()
    await userEvent.keyboard('{Enter}')

    await expect(await screen.findByRole('menu')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}')

    // data-highlighted — единственный сигнал подсветки: он же отвечает за наведение
    // мышью, поэтому проверяется атрибут, а не класс.
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete Post' })).toHaveAttribute('data-highlighted')
    )
  },
}

/** Escape закрывает меню. */
export const ClosesOnEscape: Story = {
  name: 'Закрытие по Esc',
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await expect(await screen.findByRole('menu')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  },
}

/** Заблокированный пункт не вызывает `onSelect`. */
export const DisabledItem: Story = {
  name: 'Заблокированный пункт',
  args: {
    items: [
      { id: 'edit', label: 'Edit Post', icon: <Edit2OutlineIcon />, onSelect: fn() },
      {
        id: 'delete',
        label: 'Delete Post',
        icon: <TrashOutlineIcon />,
        onSelect: fn(),
        danger: true,
        disabled: true,
      },
    ],
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete Post' }))

    await expect(args.items[1].onSelect).not.toHaveBeenCalled()
  },
}
