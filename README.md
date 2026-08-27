# @remark-gram/ui-kit

[![Deploy Storybook to Pages](https://github.com/Inctargam/ui-kit/actions/workflows/pages.yml/badge.svg)](https://github.com/Inctargam/ui-kit/actions/workflows/pages.yml)

Библиотека UI-компонентов: Base UI + CSS Modules, React 19, TypeScript.

18 компонентов и 90 иконок. Тёмная тема по умолчанию, стили — CSS Modules,
доступность и клавиатура — на примитивах Base UI.

**Витрина:** [inctargam.github.io/ui-kit](https://inctargam.github.io/ui-kit/) —
Storybook со всеми компонентами, деплой автоматом на пуш в `main`.

```bash
pnpm add @remark-gram/ui-kit
```

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

Наружу не экспортируется:

- `Calendar` — внутренность `DatePicker`, а не второй компонент кита. Своего продуманного
  API у него пока нет (месяцем снаружи не поуправлять, нет `min`/`max` и локалей), а всё
  экспортированное приходится поддерживать;
- `components/shared/selectionControl.module.css` — общие классы `Checkbox` и `RadioGroup`,
  подключаются через `composes` внутри кита;
- CSS-модули компонентов: имена классов при сборке хешируются, опираться на них снаружи
  нельзя. Стили приезжают одним `styles.css`;
- внутренние хелперы (сетка дней календаря, расчёт видимых номеров страниц) и стори —
  `tsconfig.build.json` последние не собирает.

## Разработка

Пакетный менеджер — **pnpm**.

```bash
pnpm install
pnpm dev
```

| Команда                | Что делает                                                   |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm dev`             | Storybook на `localhost:6006` — основная среда разработки    |
| `pnpm build-storybook` | статическая витрина в `storybook-static/`                    |
| `pnpm build`           | проверка типов → сборка пакета в `dist/` → генерация `.d.ts` |
| `pnpm typecheck`       | только проверка типов                                        |
| `pnpm lint`            | ESLint по репозиторию                                        |
| `pnpm lint:css`        | Stylelint по всем `*.css`                                    |
| `pnpm format`          | Prettier, запись изменений                                   |
| `pnpm format:check`    | Prettier, только проверка (для CI)                           |
| `pnpm icons`           | пересборка иконок из `src/icons/svg`                         |
| `pnpm changeset`       | описать изменение — файл в `.changeset/`, коммитится в PR    |
| `pnpm release`         | сборка + `changeset publish` — аварийный ручной релиз        |

## Структура

```
src/index.ts        публичный API библиотеки — что экспортировано, то поддерживается
src/components/     компонент на папку: Button.tsx + button.module.css + index.ts
src/styles/         tokens.css (палитра + семантика + размеры) и reset.css
src/icons/          90 иконок: svg/ — источник, components/ — генерация, index.ts — баррель
src/**/*.stories.tsx  витрина Storybook, лежит рядом с тем, что показывает; в пакет не едет
.storybook/         конфиг витрины: main.ts, preview.tsx, preview.css
dist/               результат сборки, единственное, что уезжает в пакет
tsconfig.build.json конфиг для генерации .d.ts (emitDeclarationOnly, только src/, без стори)
```

Алиас `@/*` → `./src/*` объявлен дважды: в `tsconfig.app.json` (для типов)
и в `vite.config.ts` (для сборки). Правишь в одном — правь в другом.
Внутри `src/` импорты между компонентами — относительные, включая стори.

## Storybook

`pnpm dev` — единственная среда разработки кита: компонент смотрится в изоляции, там же
живут его состояния и проверка доступности (`addon-a11y`). Стори лежит рядом с компонентом
(`Button.tsx` + `Button.stories.tsx`), `title` — латиницей (`Components/Button`), потому что
из него собирается id и адрес стори; название на русском задаётся через `name`.

В тулбаре есть переключатель фона: тёмный (`--color-bg`) и светлый (`--color-bg-inverted`).
Это **не** переключатель светлой темы — светлого набора токенов в дизайн-системе нет, она
тёмная по определению. Переключатель нужен, чтобы поймать глазами ошибку в инвертированной
паре токенов и проверить контраст иконок на светлом.

## Соглашения

Стилизация — CSS Modules на компонент, классы мержатся через `clsx`, состояния через
`[data-*]`-атрибуты Base UI. Цвета, шрифты и отступы — только через токены, хардкода нет.
Компонент не задаёт себе внешние `margin` — расстановкой занимается родитель.

Токены в `src/styles/tokens.css` двухслойные: базовая палитра (`--color-primary-500`) и
семантика (`--color-accent`, `--color-text-primary`), которая ссылается на базу через `var()`.
**Компоненты обращаются только к семантике** — прямой `var(--color-dark-500)` в модуле
означает, что тему потом не перекрасить. Шкала отступов — `--space-N` = `N × 4px`.

## Сборка пакета

Имя пакета — `@remark-gram/ui-kit`, только ESM, `dist/` собирается пофайлово
(`preserveModules`): tree-shaking работает по компонентам, а директива `'use client'`
доживает до потребителя на Next App Router. `react`, `react-dom`, `@base-ui/react` и `clsx`
из бандла исключены — их даёт приложение, вторая копия React означала бы «Invalid hook call».

Что отдаёт пакет:

| Импорт                                  | Что это                                  |
| --------------------------------------- | ---------------------------------------- |
| `@remark-gram/ui-kit`                   | компоненты и типы                        |
| `@remark-gram/ui-kit/styles/tokens.css` | токены — нужны всегда                    |
| `@remark-gram/ui-kit/styles/reset.css`  | сброс стилей — по желанию, он глобальный |
| `@remark-gram/ui-kit/styles.css`        | стили компонентов — нужны всегда         |

Проверка сборки без публикации: `pnpm build && pnpm pack` — тарбол ставится в тестовый
проект как `file:` зависимость.

## Версионирование

Версии считает [Changesets](https://github.com/changesets/changesets), руками `version`
в `package.json` не правится.

**В ветке с правкой** — описать изменение и закоммитить описание вместе с кодом:

```bash
pnpm changeset      # тип бампа (patch/minor/major) + текст для CHANGELOG
```

Получается `.changeset/<случайное-имя>.md`. Смысл в том, что текст пишет автор правки,
пока помнит контекст, а не релиз-менеджер месяц спустя. Правка без пользовательского
эффекта (тесты, CI, доки репозитория) описания не требует.

**Дальше всё делает CI** (`.github/workflows/release.yml`): на пуш в `main` он видит
накопленные описания и открывает PR «`chore: версия пакета`» с бампом версии, обновлённым
`CHANGELOG.md` и удалением съеденных `.md`. Мерж этого PR — и есть релиз: описаний больше
нет, тот же workflow собирает пакет, публикует его в npm, ставит git-тег и создаёт
GitHub Release.

### Как устроена публикация

Токена npm в секретах репозитория нет. Публикация идёт через **trusted publishing (OIDC)**:
GitHub выдаёт прогону короткоживущий токен происхождения, npm сверяет его со списком
доверенных издателей пакета и публикует, если совпали владелец, репозиторий, имя файла
workflow и окружение. Ротировать нечего и срок годности не кончается — этим он и лучше
`NPM_TOKEN`, который у нас как раз протух и оставил `0.1.2` невыпущенным.

Право публиковать (`id-token: write`) в прогоне выдано одной задаче из четырёх:

| Задача        | Что делает                                         | Права                             |
| ------------- | -------------------------------------------------- | --------------------------------- |
| `select-mode` | смотрит, остались ли описания в `.changeset/`      | `contents: read`                  |
| `version`     | открывает и обновляет PR версии                    | `contents`/`pull-requests: write` |
| `pack`        | ставит зависимости, собирает `dist`, пакует тарбол | `contents: read`                  |
| `publish`     | заливает готовый тарбол в npm                      | `id-token`/`contents: write`      |

Сборка отделена от публикации намеренно: в задаче с `id-token: write` опубликовать пакет
может любой шаг, в том числе `postinstall` чужой зависимости. Поэтому `publish` ничего не
собирает, ставит зависимости с `--ignore-scripts` и работает с тарболом из артефакта.
`changesets/action` пришпилен коммитом, а не тегом: тег переставляется, коммит — нет.

**Настройка на стороне npm — один раз, владельцем пакета.** npmjs.com → пакет
`@remark-gram/ui-kit` → Settings → Trusted Publisher → GitHub Actions:

| Поле                 | Значение      |
| -------------------- | ------------- |
| Organization or user | `Inctargam`   |
| Repository           | `ui-kit`      |
| Workflow filename    | `release.yml` |
| Environment name     | `npm`         |

Имя workflow — именно имя файла, без `.github/workflows/`. `Environment name` обязано
совпадать с `environment: npm` в `release.yml`; само окружение GitHub создаёт при первом
прогоне, заводить руками не нужно. После настройки в Settings пакета стоит выставить
Publishing access → «Require trusted publisher», чтобы токеном опубликовать было уже нельзя.

Провенанс (подпись Sigstore со ссылкой на прогон) при этом ставится сам и настройки не
требует — репозиторий публичный.

**Если публикация упала.** Смотреть шаг `Публикация в npm`:

- `404 Not Found - PUT` — доверенный издатель не совпал: чаще всего разъехались имя файла
  workflow или `Environment name`. Токена, который «протух», тут нет — проверять надо
  форму на npm;
- `npm … < 11.5.1` — образ runner'а приехал со старым Node, поднять `node-version`;
- `is not in this registry` при живой настройке — пакет уже опубликован в этой версии;
  `changeset publish` такую версию пропускает, ошибка означает что-то другое.

**Политика semver.** Пока `0.x`:

| Изменение                                    | Бамп                   |
| -------------------------------------------- | ---------------------- |
| ломающее (удалён/переименован проп, экспорт) | **minor** `0.1 → 0.2`  |
| новая возможность, новый необязательный проп | minor                  |
| правка стилей, фикс поведения                | **patch** `0.1.0 → .1` |

Ломающее изменение внутри нуля — minor, а не major: это правило самого semver для `0.x`.
Переход на `1.0.0` — обещание стабильного API, и оно преждевременно, пока компоненты
ещё переезжают из основного проекта. После `1.0.0` таблица сдвинется на разряд влево:
ломающее → major, новый необязательный проп → minor, стили → patch.

## Установка

Пакет опубликован в публичном npm:

```bash
pnpm add @remark-gram/ui-kit
```

Версия `0.x`: пока API не устоялся, ломающее изменение выходит **minor**
(`0.1.0` → `0.2.0`), а не major.

Локально, без релиза на каждую правку, — тарболом:

```bash
pnpm build && pnpm pack           # в репозитории кита
pnpm add file:../ui-kit/remark-gram-ui-kit-0.1.0.tgz   # в приложении
```

`react`, `react-dom` и `@base-ui/react` — peer-зависимости, их ставит приложение.
Вторая копия React означала бы «Invalid hook call», поэтому в бандл кита они не входят.

```bash
pnpm add react react-dom @base-ui/react
```

## Стили

Два импорта, один раз на всё приложение — в корневом layout (Next App Router) или
в точке входа:

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
