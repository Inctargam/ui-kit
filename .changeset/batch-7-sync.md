---
'@remark-gram/ui-kit': minor
---

Батч 7 — правки существующих компонентов вслед за `remark-gram`.

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
