---
'@remark-gram/ui-kit': minor
---

Батч 8 — новые компоненты вслед за `remark-gram`.

`Combobox` (Base UI `Combobox`): поле с автодополнением. `options` с `value`/`label`
и опциональным `description`, фильтр по началу подписи, `label`, `placeholder`,
`error`, `emptyMessage`, `limit`, `onBlur`. Значение — управляемое (`value` +
`onValueChange`), клик мимо возвращает подпись выбранного пункта или очищает поле.

`Table` — составной компонент на нативных элементах: `Table.Root` (контейнер со
скроллом + `<table>`, есть `wrapperClassName`), `Head`, `Body`, `Row`, `HeadCell`,
`Cell`, `Empty` (`colSpan`), `Skeleton` (`columns`, `rows`). Состояние загрузки —
`aria-busy` на `Table.Root`.
