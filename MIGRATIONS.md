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

---

## Долги

- `--color-border-disabled` — потребителей нет, кандидат на удаление
- `aria-label` кнопки показа пароля зашит по-английски — решать при втором-третьем потребителе;
  батч 4 добавил ещё троих: `aria-label` крестиков `Alert`/`Modal` и тексты ошибок `Recaptcha`
  (у последних есть пропы-переопределения, у первых нет)
- `Modal` остался конфигурируемым (`title` пропом), а не композиционным
  (`<Modal.Header/>`) — против принципа 2 роадмапа. Перенос не переписывание;
  разбирать, когда появится модалка со своей шапкой
- клавиатура и фокус во всех перенесённых компонентах глазами не проверены
