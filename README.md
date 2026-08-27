# @remark-gram/ui-kit

[![Deploy Storybook to Pages](https://github.com/Inctargam/ui-kit/actions/workflows/pages.yml/badge.svg)](https://github.com/Inctargam/ui-kit/actions/workflows/pages.yml)

Библиотека UI-компонентов: Base UI + CSS Modules, React 19, TypeScript.

18 компонентов и 90 иконок. Тёмная тема по умолчанию, стили — CSS Modules,
доступность и клавиатура — на примитивах Base UI.

**Витрина:** [inctargam.github.io/ui-kit](https://inctargam.github.io/ui-kit/) —
Storybook со всеми компонентами, деплой автоматом на пуш в `main`.

## Установка

Пакет опубликован в публичном npm:

```bash
pnpm add @remark-gram/ui-kit
```

`react`, `react-dom` и `@base-ui/react` — peer-зависимости, их ставит приложение.
Вторая копия React означала бы «Invalid hook call», поэтому в бандл кита они не входят.

```bash
pnpm add react react-dom @base-ui/react
```

Локально, без релиза на каждую правку, — тарболом:

```bash
pnpm build && pnpm pack                                # в репозитории кита
pnpm add file:../ui-kit/remark-gram-ui-kit-0.2.0.tgz   # в приложении
```

## Стили

Два обязательных импорта, один раз на всё приложение — в корневом layout (Next App
Router) или в точке входа:

```tsx
import '@remark-gram/ui-kit/styles/tokens.css' // обязательно
import '@remark-gram/ui-kit/styles.css' // обязательно
import '@remark-gram/ui-kit/styles/reset.css' // по желанию, он глобальный
```

Без `tokens.css` компоненты остаются без цветов и размеров: всё оформление внутри —
это `var(--…)`, и переменные брать неоткуда. `styles.css` — собранные CSS Modules
всех компонентов; порядок этих двух импортов роли не играет, они не пересекаются
по селекторам.

`reset.css` глобальный — он трогает не только кит. Компоненты на него не рассчитывают:
кнопки-крестики и триггеры обнуляют себе `border` / `background` / `padding` сами.

| Импорт                                  | Что это                                  |
| --------------------------------------- | ---------------------------------------- |
| `@remark-gram/ui-kit`                   | компоненты и типы                        |
| `@remark-gram/ui-kit/styles/tokens.css` | токены — нужны всегда                    |
| `@remark-gram/ui-kit/styles.css`        | стили компонентов — нужны всегда         |
| `@remark-gram/ui-kit/styles/reset.css`  | сброс стилей — по желанию, он глобальный |

## Компоненты

| Компонент       | Основа                     | Коротко                                                                                      |
| --------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| `Alert`         | `<div role="alert">`       | `variant`: `error` \| `success` \| `warning` \| `info`, крестик по `onClose`                 |
| `Button`        | Base UI `Button`           | `variant`: `primary` \| `secondary` \| `outline` \| `text`                                   |
| `Card`          | `<div>`                    | поверхность-панель, `padding`: `none` \| `small` \| `medium` \| `large`                      |
| `Checkbox`      | Base UI `Checkbox`         | подпись — `children`, клик ловит весь ряд                                                    |
| `Combobox`      | Base UI `Combobox`         | поле с автодополнением: `options`, фильтр по началу подписи, `label`/`error`                 |
| `ConfirmDialog` | `Modal` + `Button`         | вопрос и пара кнопок, `closeOnConfirm` для асинхронного действия                             |
| `DatePicker`    | Base UI `Field`            | `mode`: одна дата или диапазон, календарь внутри, `label` и `error`                          |
| `DropdownMenu`  | Base UI `Menu`             | меню действий: `items[]`, иконка пункта — готовый элемент, `danger`                          |
| `Input`         | Base UI `Field`            | `text` / `password` / `search`, показ пароля, `label` и `error`                              |
| `Modal`         | Base UI `Dialog`           | управляемый: `open` + `onOpenChange`, шапка с `title` и крестиком                            |
| `Pagination`    | `<nav>` + Base UI `Select` | номера с многоточиями, стрелки, выбор размера страницы                                       |
| `RadioGroup`    | Base UI `RadioGroup`       | список через `options`, `direction`: `vertical` \| `horizontal`                              |
| `Recaptcha`     | `<div>`                    | только вид: `state` приходит снаружи, проверку делает потребитель                            |
| `Scroll`        | Base UI `ScrollArea`       | своя полоса прокрутки, `orientation`: `vertical` \| `horizontal` \| `both`                   |
| `Select`        | Base UI `Select`           | список через `options`, значение — `string` или `number`                                     |
| `Table`         | `<table>`                  | составной: `Table.Root` / `Head` / `Body` / `Row` / `HeadCell` / `Cell`, `Empty`, `Skeleton` |
| `Tabs`          | Base UI `Tabs`             | составной: `Tabs.Root` / `List` / `Tab` / `Panel`                                            |
| `TextArea`      | Base UI `Field`            | высота через `rows`, `resize: vertical`, `label` и `error`                                   |

Пропсы, которых нет в таблице, — нативные: `...rest` уходит на корневой элемент целиком,
включая `ref` (в React 19 это обычный проп). Непустой `error` у полей формы сам включает
состояние `invalid` — отдельного пропа под него нет.

`Calendar` наружу не экспортируется — это внутренность `DatePicker`. Полный список того,
что не входит в публичный API, — в [CONTRIBUTING.md](./CONTRIBUTING.md#что-наружу-не-экспортируется).

## Иконки

90 штук, именованные экспорты из корня пакета. Реестра `name -> компонент` наружу нет
намеренно: он утащил бы в бандл весь набор и убил бы tree-shaking.

```tsx
import { BellOutlineIcon, SearchOutlineIcon } from '@remark-gram/ui-kit'

;<BellOutlineIcon size={24} />
```

Размер — проп `size` (число или строка, по умолчанию 24), он идёт и в `width`, и в `height`.
Цвет свой иконка не задаёт: `fill="currentColor"`, то есть красится от `color` родителя.
Пропа под цвет нет — это осознанно, иначе рядом с семантикой токенов появился бы
второй способ красить.

Часть иконок разноцветная по природе (бейджи, логотипы, флаги). Такие места зашиты
токеном с HEX-фолбэком — `fill="var(--color-danger-500, #cc1439)"`: с `tokens.css`
цвет идёт от темы, без него иконка всё равно нарисуется правильно.
`currentColor` этих кусков не касается.

## Примеры

Карточка с кнопкой:

```tsx
import { BellOutlineIcon, Button, Card } from '@remark-gram/ui-kit'

export const Example = () => (
  <Card padding="large">
    <BellOutlineIcon size={24} />
    <Button variant="outline" onClick={() => {}}>
      Подписаться
    </Button>
  </Card>
)
```

Поля формы. `label` и `error` компонент связывает сам — `htmlFor` и `aria-describedby`
проставляет `Field` из Base UI:

```tsx
import { Checkbox, Input, RadioGroup, TextArea } from '@remark-gram/ui-kit'

export const Form = () => (
  <form>
    <Input label="Email" type="email" error="Неверный формат" />
    <Input label="Пароль" type="password" />
    <TextArea label="О себе" rows={4} />
    <RadioGroup
      name="plan"
      defaultValue="free"
      options={[
        { label: 'Бесплатный', value: 'free' },
        { label: 'Платный', value: 'paid' },
      ]}
    />
    <Checkbox name="terms">Согласен с условиями</Checkbox>
  </form>
)
```

Дата и диапазон. `DatePicker` управляемый: без `value` и `onChange` выбор никуда
не запишется:

```tsx
import { DatePicker } from '@remark-gram/ui-kit'
import { useState } from 'react'

export const Dates = () => {
  const [day, setDay] = useState<Date>()
  const [range, setRange] = useState<{ from: Date; to: Date }>()

  return (
    <>
      <DatePicker label="Дата" placeholder="Выберите дату" value={day} onChange={(v) => setDay(v as Date)} />
      <DatePicker mode="range" label="Период" value={range} onChange={(v) => setRange(v as { from: Date; to: Date })} />
    </>
  )
}
```

Пагинация — тоже полностью управляемая, своего состояния не держит. Смену размера
страницы обычно сопровождают возвратом на первую: номер прежней страницы в новой
разбивке ничего не значит.

```tsx
import { Pagination } from '@remark-gram/ui-kit'
import { useState } from 'react'

export const List = ({ total }: { total: number }) => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  return (
    <Pagination
      currentPage={page}
      totalPages={Math.ceil(total / perPage)}
      itemsPerPage={perPage}
      onPageChange={setPage}
      onItemsPerPageChange={(value) => {
        setPerPage(value)
        setPage(1)
      }}
    />
  )
}
```

Меню действий и подтверждение. Иконка пункта — готовый элемент, а не имя: реестра
«имя → компонент» в ките нет, он тянул бы в бандл все 90 иконок.

```tsx
import { ConfirmDialog, DropdownMenu, Edit2OutlineIcon, TrashOutlineIcon } from '@remark-gram/ui-kit'
import { useState } from 'react'

export const PostActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <DropdownMenu
        ariaLabel="Действия с постом"
        items={[
          { id: 'edit', label: 'Редактировать', icon: <Edit2OutlineIcon />, onSelect: onEdit },
          {
            id: 'delete',
            label: 'Удалить',
            icon: <TrashOutlineIcon />,
            danger: true,
            onSelect: () => setConfirming(true),
          },
        ]}
      />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Удалить пост"
        message="Пост будет удалён без возможности восстановить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={onDelete}
      />
    </>
  )
}
```

## Версионирование

Версии считает [Changesets](https://github.com/changesets/changesets), руками `version`
в `package.json` не правится. Пока API не устоялся — держим `0.x`:

| Изменение                                    | Бамп                   |
| -------------------------------------------- | ---------------------- |
| ломающее (удалён/переименован проп, экспорт) | **minor** `0.1 → 0.2`  |
| новая возможность, новый необязательный проп | minor                  |
| правка стилей, фикс поведения                | **patch** `0.1.0 → .1` |

Ломающее изменение внутри нуля — minor, а не major: это правило самого semver для `0.x`.
Переход на `1.0.0` преждевременен, пока компоненты ещё переезжают из основного проекта.
После `1.0.0` таблица сдвинется на разряд влево.

Как описывать изменения и как устроена публикация (trusted publishing через OIDC) —
в [CONTRIBUTING.md](./CONTRIBUTING.md#changesets).

## Разработка

Локальная разработка, структура репозитория и соглашения — в
[CONTRIBUTING.md](./CONTRIBUTING.md). Витрина компонентов — `pnpm dev`.
