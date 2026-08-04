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

## Батч 3: `select`, `tabs`

`select` — портал и слой:

- \+ `--z-index-popup` (1000) на позиционер: Base UI `z-index` не ставит вовсе, и попап
  из портала в `<body>` проигрывал любому позиционированному элементу потребителя
- ± попапу `max-height: var(--available-height)` + `overflow-y: auto`; было `overflow: hidden` —
  длинный список уезжал за край экрана без прокрутки
- ± стык рамок триггера и попапа по `data-popup-side` / `data-side`, а не всегда снизу:
  у нижнего края экрана попап переворачивается наверх
- ± `Select.List` между `Popup` и `Item` — роль `listbox` на своём элементе

`select` — состояния и API:

- ± база на `Field`, как батч 1: состояния с корня `[data-disabled|invalid|focused]`,
  подпись `Select.Label`, ошибка `Field.Error`; появился проп `error`
- ± `items={options}` в `Select.Root` — без него `Select.Value` рисовал сырое значение
  вместо подписи выбранного пункта
- ± `data-selected` (цвет) и `data-highlighted` (заливка) разведены: было одно правило,
  и выбранный пункт пропадал, стоило увести подсветку
- ± `SelectOption` получил `disabled`, `label` расширен до `ReactNode`
- ± заливка триггера прозрачная (как у `Input`); `opacity: 0.5` у `disabled` →
  `--color-control-text-disabled`
- ± `Icon` со спрайтом → `ArrowIosDownOutlineIcon`, `width`/`height` → `size`

`tabs`:

- ± `data-orientation` читается на всех частях — вертикальный режим не работал вовсе,
  хотя `orientation` был выставлен контролом в стори
- ± рамка `border: 0 solid` + ширина нужной стороны: цвет живёт одним `border-color`
  и не дублируется под каждую ориентацию
- ± idle-подпись `dark-100` → `--color-text-secondary`: контраст ~2:1 на фоне страницы
  не проходил; `disabled` → `--color-control-text-disabled` + `--color-border-disabled`
  (первый потребитель токена)
- ± `pointer-events: none` у `disabled` убран; фокус на общие `--focus-ring-*`
  с отрицательным отступом (вкладки стоят вплотную, внешнее кольцо срезала бы соседняя)
- ± высота — `min-height: var(--control-height-md)`; было `padding: 6px 24px 4px 23px`
- ± неймспейс `Tabs` собирается в `index.ts`: объект-экспорт в `Tabs.tsx` ломает
  `react-refresh/only-export-components`
- \+ `--color-bg-accent-hover` / `--color-bg-accent-active` вместо `rgb(35 78 153 / 15%)`
  и `rgb(115 165 255 / 15%)`; `--color-bg-accent-subtle` переименован в `-active`
  (потребителей не имел)
- − `Tabs.Indicator` — в исходнике задан `display: none`, то есть висел в API, не рисуя ничего
- − `'use client'` у `Select` — своих хуков в обёртке нет, директива стоит на модулях Base UI
- − стори с ручной подменой `hover`/`focus`/`pressed` (`Tabs.stories.module.css`) — тот же
  случай, что у `RadioGroup` в батче 2

## Батч 4: `alert`, `modal`, `scroll`, `recaptcha`

- ± `Icon` заменён на компоненты кита: `CloseOutlineIcon` (Alert, Modal),
  `CheckmarkOutlineIcon` + `RecaptchaLogoIcon` (Recaptcha)
- ± `AlertProps`, `RecaptchaProps` → `ComponentProps<'div'>`; `ModalProps` → `DialogPopupProps`,
  `...rest` уходит на попап
- ± `Modal.onOpenChange` типизирован от Base UI — вторым аргументом приезжает причина закрытия
- ± `'use client'` добавлена в `Scroll` (хуки Base UI) и `Recaptcha` (обработчики)
- ± подложка модалки — `--color-bg-overlay` вместо `dark-900` + `opacity: 0.6`
- ± фон попапа `dark-300` → `--color-bg-elevated` (`dark-500`), рамки → `--color-border`
- ± заголовок модалки: `--font-weight-bold` (такого токена нет — правило отваливалось) →
  `--font-weight-h1` + `--line-height-h1`
- ± тело модалки `30px 24px 36px` → `--space-8/-6/-9`; попапу добавлен
  `max-width: calc(100vw - var(--space-8))`
- ± `Alert`: рамка `1px solid transparent` всем вариантам, у `info` появился цвет рамки
  (`border: 1px solid` без цвета брал `currentColor` и рисовал белую)
- ± текст `Alert` — `--color-text-on-accent`: он лежит на заливке варианта, а не на фоне страницы
- ± кнопки-крестики `Alert` и `Modal` обнуляются сами (`border`/`background`/`padding`) —
  `reset.css` у потребителя не обязателен
- ± кольцо фокуса добавлено крестикам `Alert`/`Modal` и корню `Recaptcha`
  (`role="checkbox"` на `<div>` нативного кольца не даёт)
- ± `Scroll`: ползунок на `--color-scrollbar-thumb*`, `border-radius` 3px → `--radius-pill`,
  кольцо фокуса вьюпорта на `--focus-ring-*` с отрицательным offset
- ± `Recaptcha`: заливка/рамка/текст виджета → семантика, сообщения → `--color-text-danger`,
  спиннер → `--color-accent`
- \+ `--z-index-modal` (1100), `--color-accent-bg` (`primary-900`),
  `--color-scrollbar-thumb` (+ `-hover`)
- − `pointer-events: none` у подложки модалки — с ним клик мимо попапа доставался бы
  элементам страницы под ней
- − `.root:hover` у `Recaptcha` — ставил ту же рамку, что и в покое: правило-пустышка
- − типографика и цвет с корня `Scroll` — контейнер прокрутки стиль текста не навязывает
- − стори `Interactive` у `Recaptcha` потеряла `play` — тянет `storybook/test` (нет до этапа 6)
- ± геометрия виджета `Recaptcha` (300/314px, 20px квадрат, 10/8/6px подписи, шрифт Roboto,
  `#b7b7b7`, `#9d9d9d`, `#14b34b`) оставлена литералами: чужая бренд-марка, тот же приём,
  что у иконок в `colorOverrides`

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

## Батч 6: `dropdown-menu`, `confirm-dialog`

Оба компонента появились в `remark-gram` 1 августа, уже после переноса батчей 1–5 —
это догон рассинхрона, а не продолжение плана этапа 5.

- ± `DropdownMenuItem.iconId: string` (id спрайта) → `icon?: ReactNode`: потребитель
  передаёт готовый `<Edit2OutlineIcon />`. Union `IconName` тут не годится — под него
  нужен реестр «имя → компонент», а он тянет в бандл все 90 иконок
- ± иконка пункта обёрнута в `<span class="itemIcon">`: приезжает готовым элементом,
  классом снаружи её не пометить, а запрет на сжатие ей нужен
- ± триггер по умолчанию — `MoreHorizontalIcon` вместо `<Icon iconId="icon-more-horizontal">`
- ± `DropdownMenuProps` = свои пропсы + `Omit<MenuRootProps, 'children'>`, `side`/`align`/
  `sideOffset` типизированы от `MenuPositionerProps`. Обёртка над `onOpenChange`,
  срезавшая `eventDetails`, убрана — тип берётся у Base UI, как у `Modal`
- ± `ConfirmDialogProps` тянет `open`/`disablePointerDismissal` из `ModalProps` через `Pick`;
  `onOpenChange` остаётся суженным до `(open: boolean) => void` — причину закрытия компонент
  разбирает сам, наружу отмена одна
- ± кнопки диалога получили класс вместо селектора `.actions button`: элементный селектор
  внутри CSS-модуля ловит любую вложенную кнопку, включая чужую из `message`
- ± `width: 96px; height: 36px` у кнопок → `min-width: 96px`; высоту `Button` и так держит
  сам через `--control-height-md`
- ± отступ под вопросом `30px` → `--space-8` (32px): 30px в сетку 4pt не ложится
- ± меню: `--color-light-100` → `--color-text-primary`, `--color-primary-100`/`-500` →
  `--color-accent-hover`/`--color-accent` (значения совпадают точь-в-точь),
  `--color-dark-500`/`-100` → `--color-bg-elevated`/`--color-border`
- ± пункт меню: высота через `min-height: var(--control-height-md)` вместо `padding: 6px 12px`,
  как у пункта `Select`; `padding: 6px 0` попапа → `padding-block: var(--space-2)`
- ± свой фокус триггера (`outline: 2px solid --color-primary-700`, offset 2px) → общее
  правило кита на `--focus-ring-*`; значения те же, но теперь одно место на весь кит
- ± выключенный пункт: `--color-text-secondary` → `--color-control-text-disabled` —
  тот же токен, что у выключенного пункта `Select`, попап у них общего вида
- \+ `--z-index-menu` (1200): выше `--z-index-modal`. Меню открывают изнутри модалки,
  и на общем `--z-index-popup` (1000) оно ушло бы под неё — ровно тот баг, который
  в приложении чинили значением 200 поверх модалочных 100/101
- \+ `--color-text-destructive` (`danger-300`) и `-hover` (`danger-100`) — подпись пункта
  удаления. Не `--color-text-danger` (`danger-500`): тот же довод, что у `--color-text-weekend`,
  на тёмном фоне 500 глохнет
- \+ `box-shadow: var(--shadow-popup)` попапу меню — у попапов `Select` и `Calendar` тень
  уже есть, у меню в исходнике не было
- \+ `bodyClassName` у `Modal` — перенос правки из `remark-gram` (`Modal.tsx`, 2 августа)
- ± стори переведены на `@storybook/react-vite`, `title` → `Components/*`, локальный
  `tags: ['autodocs']` убран, русские `name` добавлены; `userEvent` берётся из контекста
  `play`, а не импортом — как в остальных стори кита
- − `Icon`, `iconId` и любые упоминания спрайта

---

## Долги

- `--color-border-disabled` — потребителей нет, кандидат на удаление
- английские строки зашиты, i18n нет — решать при втором-третьем потребителе:
  `aria-label` кнопки показа пароля; батч 4 — `aria-label` крестиков `Alert`/`Modal`
  и тексты ошибок `Recaptcha` (у последних есть пропы-переопределения, у первых нет);
  батч 5 — `placeholder` пикера `'Select date'`, формат даты `en-GB` (`dd/mm/yyyy`),
  подписи дней недели латиницей
- `Modal` остался конфигурируемым (`title` пропом), а не композиционным
  (`<Modal.Header/>`) — против принципа 2 роадмапа. Перенос не переписывание;
  разбирать, когда появится модалка со своей шапкой
- `alignItemWithTrigger={false}` у `Select` зашит — наружу не настраивается
- `modal: true` у `Select.Root` (умолчание Base UI) блокирует прокрутку страницы,
  пока список раскрыт — глазами не проверено
- селект размера страницы в `Pagination` собран на примитивах Base UI, а не на `Select`
  кита. `Select` приехал батчем 3 и теперь в ките — переключить
- клавиатура в `Calendar`: дни обходятся `Tab`, стрелок и `Home`/`End` нет.
  Полноценная клавиатурная навигация — вместе с `min`/`max` и локалями
- клавиатура и фокус во всех перенесённых компонентах глазами не проверены
- стори `WithActions` у `Modal` руками собирает то, чем теперь занят `ConfirmDialog` —
  переписать на него или удалить как дубль
- `Recaptcha` в `remark-gram` больше не используется: приложение перешло на невидимую
  reCAPTCHA v3, виджет из форм убран. В ките компонент остаётся без потребителя —
  решать, оставлять его или помечать устаревшим (этап 9)
- ширина попапа меню `min-width: 160px` — литерал, токена ширины в ките нет
