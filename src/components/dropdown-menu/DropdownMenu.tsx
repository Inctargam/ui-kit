// Base UI Menu держит состояние открытия, портал и клавиатурную навигацию — без директивы
// Next App Router собрал бы компонент как серверный и упал на первом же хуке.
'use client'

import type { MenuPositionerProps, MenuRootProps } from '@base-ui/react/menu'
import { Menu } from '@base-ui/react/menu'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { MoreHorizontalIcon } from '../../icons/index.js'
import styles from './dropdown-menu.module.css'

export type DropdownMenuItem = {
  /** Пункт разрушающего действия — подпись и иконка в красном. */
  danger?: boolean
  disabled?: boolean
  /**
   * Иконка слева от подписи — готовый элемент (`<Edit2OutlineIcon />`), а не имя.
   * Реестра «имя → компонент» в ките нет намеренно: он тянул бы в бандл все 90 иконок.
   */
  icon?: ReactNode
  /** Ключ для React и зацепка для тестов. Не рисуется. */
  id: string
  label: ReactNode
  onSelect: () => void
}

export type DropdownMenuProps = {
  align?: MenuPositionerProps['align']
  /**
   * Доступное имя триггера. Обязательное: триггер по умолчанию — одна иконка,
   * назвать его нечем.
   */
  ariaLabel: string
  /** Класс попапа — им задают ширину. */
  className?: string
  items: DropdownMenuItem[]
  side?: MenuPositionerProps['side']
  sideOffset?: MenuPositionerProps['sideOffset']
  /** Содержимое триггера. Сам триггер всегда `<button>`. */
  trigger?: ReactNode
  triggerClassName?: string
  // children собираются из items — прокидывать их снаружи нечем.
} & Omit<MenuRootProps, 'children'>

/**
 * Выпадающее меню действий: триггер-кнопка и список пунктов.
 * Управлять открытием необязательно — без `open`/`onOpenChange` меню держит
 * состояние само.
 *
 * Попап уезжает порталом в `<body>`, поэтому слой ему задаёт `--z-index-menu`.
 * Он выше `--z-index-modal`: меню открывают в том числе изнутри модалки,
 * и с общим «попаповым» слоем оно ушло бы под неё.
 *
 * `className` ложится на попап, остальные пропсы — в `Menu.Root`.
 */
export const DropdownMenu = ({
  align = 'end',
  ariaLabel,
  className,
  items,
  side = 'bottom',
  sideOffset = 4,
  trigger,
  triggerClassName,
  ...props
}: DropdownMenuProps) => (
  <Menu.Root {...props}>
    <Menu.Trigger aria-label={ariaLabel} className={clsx(styles.trigger, triggerClassName)}>
      {trigger ?? <MoreHorizontalIcon />}
    </Menu.Trigger>

    <Menu.Portal>
      <Menu.Positioner align={align} className={styles.positioner} side={side} sideOffset={sideOffset}>
        <Menu.Popup className={clsx(styles.popup, className)}>
          {items.map(({ danger, disabled, icon, id, label, onSelect }) => (
            <Menu.Item
              className={clsx(styles.item, danger && styles.danger)}
              disabled={disabled}
              key={id}
              onClick={onSelect}>
              {/* Обёртка, а не голая иконка: ей нужен запрет на сжатие, а классом
                  снаружи её не пометить — она приезжает готовым элементом. */}
              {icon && <span className={styles.itemIcon}>{icon}</span>}
              <span>{label}</span>
            </Menu.Item>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
)
