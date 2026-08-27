# @remark-gram/ui-kit

## 0.2.0

### Minor Changes

- [#7](https://github.com/Inctargam/ui-kit/pull/7) [`cde3965`](https://github.com/Inctargam/ui-kit/commit/cde3965408e82c51e280f2bb662a16197f03c63c) Thanks [@AlxTafari](https://github.com/AlxTafari)! - Батч 7 — правки существующих компонентов вслед за `remark-gram`.

  `Modal`: пропы `headerStart` (слот слева в шапке, заголовок центрируется) и
  `dismissDisabled` (глушит крестик, Esc и клик мимо — на время необратимого действия).

  `ConfirmDialog`: пропы `error` (блок обратной связи над вопросом), `cancelDisabled`
  и `dismissDisabled` (прокидывается в `Modal`).

  `DatePicker`: `label` и `error` расширены до `ReactNode`; новый `ariaLabel` — доступное
  имя триггера, когда `label` не строка; `value` принимает `null` (react-hook-form);
  новый `onBlur` — зовётся на выбор даты, клик мимо и закрытие кликом по триггеру;
  календарь открывается на месяце выбранной даты.

  `Input`: `label` расширен до `ReactNode`.

  `Select`: пропы `triggerClassName`, `popupClassName`, `renderOption` (своя разметка
  пункта) и `renderValue` (своя разметка выбранного значения).

- [#7](https://github.com/Inctargam/ui-kit/pull/7) [`6bcf03b`](https://github.com/Inctargam/ui-kit/commit/6bcf03bc89005a8b834cedc034bd0e7e416ef5ec) Thanks [@AlxTafari](https://github.com/AlxTafari)! - Батч 8 — новые компоненты вслед за `remark-gram`.

  `Combobox` (Base UI `Combobox`): поле с автодополнением. `options` с `value`/`label`
  и опциональным `description`, фильтр по началу подписи, `label`, `placeholder`,
  `error`, `emptyMessage`, `limit`, `onBlur`. Значение — управляемое (`value` +
  `onValueChange`), клик мимо возвращает подпись выбранного пункта или очищает поле.

  `Table` — составной компонент на нативных элементах: `Table.Root` (контейнер со
  скроллом + `<table>`, есть `wrapperClassName`), `Head`, `Body`, `Row`, `HeadCell`,
  `Cell`, `Empty` (`colSpan`), `Skeleton` (`columns`, `rows`). Состояние загрузки —
  `aria-busy` на `Table.Root`.

## 0.1.2

### Patch Changes

- [#3](https://github.com/Inctargam/ui-kit/pull/3) [`bf67879`](https://github.com/Inctargam/ui-kit/commit/bf67879bfe5f9d09391816d8fb708dfef81acd98) Thanks [@AlxTafari](https://github.com/AlxTafari)! - Новые компоненты `DropdownMenu` (меню действий на Base UI `Menu`) и `ConfirmDialog`
  (диалог подтверждения поверх `Modal`).

  `Modal` получил проп `bodyClassName` — класс обёртки тела, для окон, содержимое которых
  должно игнорировать отступы по умолчанию.

  Новые токены: `--z-index-menu` (слой меню, выше модального), `--color-text-destructive`
  и `--color-text-destructive-hover` (подпись разрушающего пункта меню).

## 0.1.1

### Patch Changes

- README пакета: страница на npm вместо пустого описания.

## 0.1.0

### Minor Changes

- Первый релиз: 14 компонентов (`Alert`, `Button`, `Card`, `Checkbox`, `DatePicker`, `Input`,
  `Modal`, `Pagination`, `RadioGroup`, `Recaptcha`, `Scroll`, `Select`, `Tabs`, `TextArea`),
  90 иконок, токены дизайн-системы (`./styles/tokens.css`, `./styles/reset.css`)
  и собранные стили компонентов (`./styles.css`).

<!--
Записи 0.1.0 и 0.1.1 внесены руками: обе версии выпущены до подключения Changesets
(этап 8). Дальше файл ведёт `changeset version` — новые версии он вставляет
сразу под заголовком, поверх этих двух.
-->
