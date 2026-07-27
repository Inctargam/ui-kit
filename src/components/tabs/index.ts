import { TabsList, TabsPanel, TabsRoot, TabsTab } from './Tabs'

export type { TabsListProps, TabsPanelProps, TabsRootProps, TabsTabProps } from './Tabs'

/**
 * Вкладки. Составной компонент: `Tabs.Root` держит активное значение,
 * `Tabs.List` — ряд кнопок, `Tabs.Tab` — кнопку, `Tabs.Panel` — содержимое.
 * Вкладка и панель связываются совпадением `value`.
 *
 * Неймспейс собирается здесь, а не в `Tabs.tsx`: там объект-экспорт ломает
 * `react-refresh/only-export-components`. Наружу отдаётся только `Tabs` —
 * отдельные `TabsRoot`, `TabsList` и прочие в публичный API не входят.
 */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
}
