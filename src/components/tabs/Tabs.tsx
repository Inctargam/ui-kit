import type { Tabs as BaseTabsType } from '@base-ui/react/tabs'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import clsx from 'clsx'

import styles from './tabs.module.css'

// className сужен до строки у всех частей: у Base UI он принимает ещё и функцию
// от состояния, но состояния вкладок описаны в CSS через [data-*].
export type TabsRootProps = {
  className?: string
} & Omit<BaseTabsType.Root.Props, 'className'>

export type TabsListProps = {
  className?: string
} & Omit<BaseTabsType.List.Props, 'className'>

export type TabsTabProps = {
  className?: string
} & Omit<BaseTabsType.Tab.Props, 'className'>

export type TabsPanelProps = {
  className?: string
} & Omit<BaseTabsType.Panel.Props, 'className'>

/**
 * Части вкладок по отдельности. Наружу они уезжают собранными в объект `Tabs`
 * (`./index.ts`) — здесь их приходится экспортировать поштучно, потому что
 * `react-refresh/only-export-components` требует от модуля с компонентами
 * экспортировать только компоненты, а объект-неймспейс под это не подходит.
 *
 * Активную вкладку рисует её собственная подчёркивающая рамка, а не отдельный
 * бегунок: `Tabs.Indicator` из Base UI в кит не поехал — в исходнике он был задан
 * `display: none`, то есть висел в API, не рисуя ничего. Нужен скользящий
 * индикатор — его даёт Base UI напрямую, вместе с переменными `--active-tab-*`.
 *
 * `orientation="vertical"` переносит ряд и подчёркивание вбок: CSS читает
 * `data-orientation`, который Base UI ставит на все части.
 */
export const TabsRoot = ({ className, ...props }: TabsRootProps) => (
  <BaseTabs.Root className={clsx(styles.root, className)} {...props} />
)

export const TabsList = ({ className, ...props }: TabsListProps) => (
  <BaseTabs.List className={clsx(styles.list, className)} {...props} />
)

export const TabsTab = ({ className, ...props }: TabsTabProps) => (
  <BaseTabs.Tab className={clsx(styles.tab, className)} {...props} />
)

export const TabsPanel = ({ className, ...props }: TabsPanelProps) => (
  <BaseTabs.Panel className={clsx(styles.panel, className)} {...props} />
)
