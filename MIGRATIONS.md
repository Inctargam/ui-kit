# MIGRATIONS

Что изменилось при переносе компонента из `remark-gram`. Строка на факт, без прозы.
Подробные разборы первых батчей — в `ROADMAP.md`, этап 5.

Легенда: **±** правка против исходника, **+** новый токен, **−** не перенесено.

---

## Батч: `button`, `card` (этап 5, начало)

- ± высота — `min-height: var(--control-height-md)`, рамка `1px solid transparent` у всех вариантов
- ± фокус — одно правило `--focus-ring-*` на компонент
- ± `pointer-events: none` у `disabled` убран (клики блокирует нативный `disabled`)
- ± `#212121` → `--color-control-bg-active`; рамка `Card` `dark-300` → `--color-border`
- ± `CardProps` → `ComponentProps<'div'>` (в React 19 `ref` — обычный проп)
- \+ `--color-control-bg` (+`-hover`, `-active`, `-disabled`), `--control-font-weight`, `--space-9`
- ± `--color-text-disabled`: `dark-100` → `light-900`

## Батч 1 форм: `input`, `textarea`

- ± база на `Field` (Base UI), состояния читаются с корня: `[data-disabled|invalid|focused]`
- ± рамка `Input` на обёртке, а не на `<input>` — ушли дубли `search*` (~60 строк, два `:has()`)
- ± фокус одним кольцом: `Input` — `:focus-within` на обёртке, `TextArea` — `:focus-visible`
- ± заливка обоих полей прозрачная; наведение у обоих `--color-border-hover`
- ± `TextArea`: высота через `rows` (3) вместо `min-height: 84px`, `width: 284px` убрана, `resize: vertical`
- ± кнопка показа пароля выключается вместе с полем; `'use client'` добавлена в `Input`
- \+ `--color-control-text-disabled` (`dark-100`)
- − состояние «набран текст» (`:focus:not(:placeholder-shown)`) — второй сигнал фокуса
- − стори `hover`/`focus`/`active` у `textarea` — рисовали состояние вручную

## Батч 2 форм: `checkbox`, `radio-group`

- ± общий `src/components/shared/selectionControl.module.css` через `composes`
  (`interactiveArea`, `indicatorBox`); общего React-компонента нет — корни примитивов разные
- ± idle индикатора унифицирован на `--color-text-primary` (было `light-500` / `light-100`)
- ± фокус на общий `outline`-приём, подложка только `hover`/`active`
  (`--color-bg-hover` / `--color-bg-active` — первый потребитель)
- ± `RadioGroup`: кольцо и точка — `<div>` + `border-radius: var(--radius-pill)`, не `<svg>`
- ± `padding: 6px` → `calc((var(--control-height-md) - var(--icon-size-md)) / 2)`
- ± `.stylelintrc.mjs`: `ignoreProperties: ['composes']` в `property-no-unknown` и `value-keyword-case`
- \+ `--color-control-indicator-disabled` (`light-700`)
- − стори `Hover`/`Focus`/`Active` у `RadioGroup` — подменяли состояние через несуществующую переменную
- − стори `Interactive` у `Checkbox` — тянет `storybook/test`, его нет до этапа 6

## Батч 5: `date-picker` (с `Calendar`), `pagination`

- ± `Icon` заменён на компоненты кита: `ArrowIosBackIcon` + `ArrowIosForwardIcon`
  (переключение месяца в `Calendar`, стрелки страниц в `Pagination`),
  `CalendarOutlineIcon` (триггер `DatePicker`), `ArrowIosDownOutlineIcon` (селект размера страницы)
- ± `DatePicker` переписан на `Field` (Base UI), как `Input`/`TextArea`: `Field.Control`
  с `render={<button>}` — подпись получает `htmlFor` (button — labelable-элемент),
  ошибка `aria-describedby`, состояния читаются с корня `[data-disabled|invalid]`
- ± `DatePickerProps` → `Omit<ComponentProps<'div'>, 'onChange'>`, `PaginationProps` →
  `ComponentProps<'nav'>`; нативный `onChange` у пикера убран — он `FormEventHandler`,
  а наш принимает дату, и пересечение по имени пришлось бы разруливать на каждом вызове
- ± плейсхолдер `DatePicker` **чинится**: было `formatValue(selected || new Date())` —
  пустой пикер всегда показывал сегодняшнюю дату, и `placeholder` не показывался никогда
- ± границы диапазона **чинятся**: сравнение срезано до полуночи (`startOfDay`) —
  ячейки сетки строятся из `new Date(год, месяц, число)`, а границы приходят от потребителя
  со временем, и `new Date()` в `from` не совпадал ни с одной ячейкой
- ± анимация попапа `Pagination` **чинится**: `animation: popupIn` не находил
  `@keyframes popup-in` (CSS Modules локализуют имя keyframes, но не камелизируют его) —
  имена приведены к kebab-case
- ± убран хак `selectedUnderError`: он глушил текст ошибки после первого клика по дате,
  хотя валидность считает потребитель и сам решает, когда убрать `error`
- ± роверинг `tabIndex` по дням, `focusedDay`, `useMemo`/`useCallback` из `Calendar` убраны —
  сетка перестраивается только на смене месяца, мемоизация экономила ноль
- ± закрытие попапа по клику мимо и по `Escape` ведёт сам `DatePicker`: попап живёт
  в потоке страницы, а не в портале, и слушатели `document` висят только пока открыто
- ± девять хардкод-цветов `Pagination` (`#fff`, `#000`, фолбэки вида `var(--color-light-100, #fff)`)
  и вся палитра `Calendar` — на семантику; активная страница на `--color-bg-inverted`
- ± гашение выключенной стрелки и многоточий — цветом, а не `opacity: 0.3/0.7`:
  прозрачность считается от фона под элементом и уезжает вместе с ним
- ± высота ячейки календаря и колонки грида — `--control-height-md`, номера страниц
  и стрелки — `--control-height-sm`; рамка `1px solid transparent` у всех номеров,
  иначе активный был бы на 2px крупнее соседей
- ± направление состояний кнопок месяца развёрнуто под кит: покой `--color-control-bg`,
  наведение `--color-control-bg-hover` (в исходнике было наоборот)
- ± класс `.triggerRange` удалён — отличался от `.trigger` ничем
- \+ `--z-index-popup` (1000), `--shadow-popup`, `--color-accent-muted` (+ `-hover`),
  `--color-text-weekend` (`danger-300`)
- − `Calendar` из `date-picker/index.ts` не реэкспортируется: внутренность `DatePicker`,
  своего API (управление месяцем, `min`/`max`, локали) у него нет, а экспорт заморозил бы
  текущий вид
- − дата-библиотеки нет и не появилось: `Calendar` считает на нативном `Date`,
  поэтому `peerDependencies` и `rolldownOptions.external` не менялись
- − мёртвые `:disabled`-правила `Calendar` — кнопки дней выключенными не бывают
- − наведение на активный номер страницы — кликать по текущей странице некуда,
  `goTo` на том же номере выходит сразу

---

## Долги

- `--color-border-disabled` — потребителей нет, кандидат на удаление
- `aria-label` кнопки показа пароля зашит по-английски — решать при втором-третьем потребителе.
  Батч 5 добавил второго: `placeholder` пикера по умолчанию `'Select date'`, формат даты
  зашит на `en-GB` (`dd/mm/yyyy`), подписи дней недели — латиницей
- селект размера страницы в `Pagination` собран на примитивах Base UI, а не на `Select`
  кита — тот приезжает соседней веткой. Переключить при слиянии
- клавиатура в `Calendar`: дни обходятся `Tab`, стрелок и `Home`/`End` нет.
  Полноценная клавиатурная навигация — вместе с `min`/`max` и локалями
- клавиатура и фокус во всех перенесённых компонентах глазами не проверены
