# Разработка кита

`@remark-gram/ui-kit` — библиотека UI-компонентов, вынесенная из `src/shared/ui`
основного проекта `remark-gram`. Потребителю пакета — [README.md](./README.md).
Здесь — как устроен репозиторий и по каким правилам в нём меняют код.

## Быстрый старт

Пакетный менеджер — **pnpm** (есть `pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev            # Storybook на localhost:6006 — среда разработки
```

Браузер для тестов ставится один раз:

```bash
pnpm exec playwright install chromium
```

## Команды

| Команда                | Что делает                                                        |
| ---------------------- | ----------------------------------------------------------------- |
| `pnpm dev`             | Storybook на `localhost:6006`                                     |
| `pnpm build-storybook` | статическая витрина в `storybook-static/`                         |
| `pnpm build`           | `tsc -b` → `vite build` → `tsc -p tsconfig.build.json` (`.d.ts`)  |
| `pnpm typecheck`       | только `tsc -b`, без сборки                                       |
| `pnpm test`            | стори как тесты (`vitest run`, headless Chromium)                 |
| `pnpm test:watch`      | то же в watch-режиме                                              |
| `pnpm lint`            | ESLint по репозиторию                                             |
| `pnpm lint:css`        | Stylelint по всем `*.css`                                         |
| `pnpm lint:pkg`        | `publint --strict` + `attw --pack .` (после `build`)              |
| `pnpm format`          | Prettier с записью изменений                                      |
| `pnpm format:check`    | Prettier только проверкой (для CI)                                |
| `pnpm icons`           | SVGO по `src/icons/svg` → SVGR в `src/icons/components` + баррель |
| `pnpm changeset`       | описать изменение — `.changeset/*.md` в коммит PR                 |
| `pnpm release`         | `pnpm build && changeset publish` — аварийный ручной релиз        |

## Архитектура

**Источник компонентов** — соседний чекаут `remark-gram` (Next 16, FSD, Base UI +
CSS Modules). Дизайн-система описана там в `STYLES.md`, токены — в `src/app/styles/tokens.css`.
Компоненты **переносятся почти как есть** — это вынос, а не переписывание. Разбор
каждого переноса — в [MIGRATIONS.md](./MIGRATIONS.md).

```
src/index.ts          публичный API библиотеки — единственная точка входа наружу
src/components/        папка на компонент: Button.tsx + button.module.css + index.ts + стори
src/components/index.ts  баррель компонентов, реэкспортится из src/index.ts
src/styles/            tokens.css (палитра + семантика + размеры), reset.css
src/icons/svg/         90 почищенных исходников — источник правды для генерации
src/icons/components/  сгенерированные компоненты, руками не править
src/icons/types.ts     IconProps (рукописный); баррель src/icons/index.ts — генерируется
src/**/*.stories.tsx   витрина Storybook рядом с показываемым кодом; в пакет не едет
src/Introduction.mdx   лендинг витрины (страница-док без стори)
scripts/icons/         конвейер: config.mjs (карта цветов, имена), clean.mjs, build.mjs
.storybook/            main.ts (фреймворк, glob, viteFinal), preview.tsx (autodocs, глобал surface)
dist/                  сборка: файл на модуль + styles/ + .d.ts — единственное содержимое пакета
tsconfig.build.json    конфиг генерации .d.ts: emitDeclarationOnly, rootDir src, без стори
```

**Алиас `@/*` → `./src/*` объявлен дважды:** `tsconfig.app.json` (типы) и `vite.config.ts`
(сборка). Правишь один — правь второй. Внутри `src/` импорты относительные, включая
стори; алиас остаётся для тестов.

**`vite.config.ts` общий.** Storybook подхватывает его целиком через builder-vite —
алиас, react-плагин и `css.modules` у витрины и у пакета одни. Настройки library mode
Storybook снимает в `viteFinal` (`.storybook/main.ts`).

### Что наружу не экспортируется

- `Calendar` — внутренность `DatePicker`, не второй компонент. Своего продуманного API
  нет (месяцем снаружи не поуправлять, нет `min`/`max` и локалей), а экспорт пришлось бы
  поддерживать;
- `components/shared/selectionControl.module.css` — общие классы `Checkbox` и `RadioGroup`,
  подключаются через `composes` внутри кита;
- CSS-модули компонентов — имена классов при сборке хешируются. Стили едут одним `styles.css`;
- внутренние хелперы (сетка дней календаря, расчёт видимых номеров страниц) и стори.

## Сборка пакета

- Только **ESM**, `dist/` собирается **пофайлово** (`output.preserveModules`): tree-shaking
  по компонентам, директива `'use client'` доживает до Next App Router у потребителя.
  Выключишь `preserveModules` — директива исчезнет, и App Router получит серверный
  компонент вместо клиентского.
- **Порядок в `build` важен:** `vite build` чистит `dist`, поэтому `.d.ts` генерируются
  **после** него. По той же причине в `tsconfig.build.json` выключен `incremental`.
- Всё из `dependencies` и `peerDependencies` должно быть в `build.rolldownOptions.external`
  (`react`, `react-dom`, `@base-ui/react`, `clsx`). Добавил зависимость — добавь и туда,
  иначе она уедет внутрь бандла второй копией. Вторая копия React = «Invalid hook call».
- Проверка пакета без публикации: `pnpm build && pnpm pack`, тарбол ставится в тестовый
  проект как `file:` зависимость. `pnpm lint:pkg` (`publint` + `attw`) ловит рассогласование
  `exports`/`types` до релиза.

## Соглашения — стилизация

- **CSS Modules** на компонент (`Button.tsx` + `button.module.css`), классы мержатся
  через `clsx`. Состояния — CSS-псевдоклассы и `[data-*]`-атрибуты от Base UI.
- Токены — CSS custom properties в `:root`. Дизайн-система тёмная по умолчанию.
  Переиспользуй переменные, не хардкодь значения.
- Архитектура токенов **двухслойная**:
  - **base palette** (`--color-primary-500`, `--color-dark-700`, …) — сырые цвета;
  - **semantic** (`--color-bg`, `--color-text-primary`, …) — ссылаются на base через `var()`.
- Семантические токены никогда не содержат хардкод-цвет. Полупрозрачные слои — `color-mix()`
  от базового токена, а не HEX с альфой.
- **Компоненты обращаются только к semantic.** `var(--color-dark-500)` в `*.module.css` —
  ошибка ревью: base-палитра живёт только внутри `tokens.css`.
- Отступы — шкала `--space-N` = `N × 4px` (`--space-6` = 24px).
- Высота контрола — `min-height: var(--control-height-sm/md)` + центрирование, не
  вертикальный паддинг: иначе вариант с рамкой оказывается выше варианта без неё.
  Рамку задают всем вариантам сразу (`1px solid transparent`), вариант меняет только цвет.
- Фокус — одно правило `:focus-visible` на компонент: `--focus-ring-width` /
  `--color-focus-ring` / `--focus-ring-offset`. Фокус не перекрашивает содержимое,
  иначе читается как нажатие.
- Заливка нейтрального контрола — `--color-control-bg*`, не `--color-bg-*`: вторые
  описывают слои страницы, совпадение значений случайное.
- Контрол формы (`Input`, `TextArea`, `Checkbox`, `RadioGroup`, `Select`) состояния читает
  с корня `Field.Root`: `.root[data-disabled] …`, `[data-invalid]`, `[data-focused]` —
  одно правило накрывает подпись, поле, иконку и кнопку. Подпись, значение и плейсхолдер
  выключенного поля — `--color-control-text-disabled` (`dark-100`), не
  `--color-text-disabled` (`light-900`): в покое подпись поля уже `light-900`, вторым
  `light-900` выключенное состояние ничем бы не отличалось от рабочего.
- Новый токен заводится только под существующего потребителя. Токен впрок разъезжается
  с реальностью раньше, чем находит применение.
- Компонент не задаёт себе внешние `margin` — расстановкой занимается родитель.
- `box-sizing: border-box` компонент ставит себе сам: на `reset.css` у потребителя
  полагаться нельзя.

## Соглашения — компоненты

- Папка на компонент в `src/components/`: `Button.tsx`, `button.module.css`,
  `Button.stories.tsx`, `index.ts`. Барреля два — свой у компонента и общий
  `src/components/index.ts`, реэкспортится из `src/index.ts`.
- Пропсы расширяют нативные через `ComponentProps<'div'>`, **не** `HTMLAttributes<…>`:
  в React 19 `ref` — обычный проп, и в `HTMLAttributes` его нет. `forwardRef` не нужен.
- `...rest` уходит в корневой DOM-узел целиком, `className` мержится через `clsx`,
  не затирается.
- Тип пропсов экспортируется рядом с компонентом (`ButtonProps`) и попадает в публичный API.
- JSDoc `/** … */` над каждым пропом в типе — уезжает в `.d.ts`, подсказки редактора
  и колонку Description в витрине. Образец — `SelectProps`, `InputProps`, `ComboboxProps`.

## Соглашения — иконки

- Источник правды — `src/icons/svg/*.svg`. Новая иконка: положить файл туда и прогнать
  `pnpm icons`. Компоненты в `src/icons/components/` генерируются — правка переживёт
  до следующего прогона.
- Имя файла в kebab-case задаёт всё: `bell-outline.svg` → `BellOutlineIcon` →
  `'bell-outline'` в union `IconName`. Суффикс `Icon` обязателен, иначе публичный API
  занимает слишком общие имена (`Image`, `Search`).
- Цвет по умолчанию — `currentColor`. Пропа под цвет нет.
- Иконке с собственными цветами нужна запись в `colorOverrides` (`scripts/icons/config.mjs`):
  наши цвета переводятся на токены с фолбэком `var(--token, #hex)`, чужие фирменные
  остаются как есть.

**Компонент `Icon` из `remark-gram` в кит не едет.** Он рисует
`<use href="/icons/icon-sprite.svg#id">` — абсолютный путь в `public/` потребителя,
`iconId: string` не типизирован. При переносе компонента его вызовы переписываются:

```tsx
<Icon iconId="icon-close-outline" width={24} height={24} />  // было
<CloseOutlineIcon size={24} />                               // стало
```

Правило: `icon-<kebab>` → `<Pascal>Icon`, парные `width`/`height` → один `size`.

## Соглашения — Storybook

- Стори лежит рядом с тем, что показывает: `Button.tsx` + `Button.stories.tsx`. В пакет
  не едет — `vite build` её не видит, `tsconfig.build.json` исключает.
- `title` — латиницей и по группам: `Foundations/*` (токены, иконки), `Components/*`.
  Из `title` собирается id стори и адрес, кириллица уезжает в URL в процентном кодировании.
  Порядок групп — `Introduction → Foundations → Components` через `options.storySort`
  в `preview.tsx`.
- Название на русском — через `name`, и только **строковым литералом**: индексатор
  разбирает файл статически и шаблонную строку не вычислит.
- `tags: ['autodocs']` глобальный в `preview.tsx`, в стори не дублировать.
- Тип берётся из `@storybook/react-vite`, не из `@storybook/react` или `nextjs-vite`.
- `satisfies Meta<typeof Component>`, а не `: Meta<…>` — так литеральные типы доживают
  до `StoryObj<typeof meta>` и аргументы стори типизируются union'ом.
- Отступ холста даёт декоратор в `preview.tsx`. Стори не выставляет компоненту внешние
  `margin`.
- Глобал `surface` меняет фон холста (`--color-bg` ↔ `--color-bg-inverted`), а не тему:
  светлого набора токенов в дизайн-системе нет.
- `.mdx`-страницы (лендинг `Introduction`) — только доки без стори. Многострочный
  JSX-комментарий `{/* */}` Prettier в MDX ломает — держать однострочным.

## Соглашения — TypeScript

- Строгие флаги включены (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`).
- `any` — только если без него никак.
- Импорты типов только через `import type` (`verbatimModuleSyntax`).

## Тесты

- **Vitest 4 в browser mode** (`@vitest/browser-playwright`) + `@storybook/addon-vitest`:
  каждая стори гоняется как тест — mount + a11y, play-функции проверяют поведение.
- Проверяем **контракт** (что видит и делает пользователь), не внутренности.
  `expect(btn).toHaveClass('primary')` сломается при первом рефакторинге стилей.
- Портальные компоненты (Modal, Select, Combobox) в play ищутся по документу (`screen`),
  не по холсту стори.
- a11y-гейт пока `test: 'todo'`: axe `color-contrast` фейлит саму тёмную бренд-палитру.
  Гейт CI ловил бы фиксированный дизайн, а не регрессию переноса. Возврат к `'error'` —
  когда токены переедут на OKLCH/тему.

## Файловые операции

- Перенос/реструктуризация файлов — через `cp`/`mv`, потом Edit только изменившихся импортов.
  Не переписывать файл с нуля через Write только потому, что он переехал.
- При правке файла — обновлять существующие комментарии под новую реальность.
- При удалении кода — удалять и его комментарии, не оставлять осиротевшие.

## Коммиты

[Conventional Commits](https://www.conventionalcommits.org/), без подписи:

```bash
git commit -m "$(cat <<'EOF'
<prefix>: краткое описание

- детали при необходимости
EOF
)"
```

Префиксы: `feat` (новая функциональность), `fix` (баг), `refactor` (без смены поведения),
`chore` (конфиги, зависимости, тулинг), `docs`, `style` (форматирование, CSS).

## Changesets

Версии считает `changeset version` в релизном PR — **руками `version` в `package.json`
не трогать**.

- Правка, которую видит потребитель пакета (компонент, токен, публичный API, JSDoc
  в `.d.ts`) → `pnpm changeset`, описание коммитится вместе с кодом.
- Правки самого репозитория (CI, доки, тесты, конфиги) описания не требуют.
- Тип бампа — по таблице semver в [README.md](./README.md#версионирование).

## Pull request

1. Ветка от `main` (`main` защищён).
2. Зелёный CI: `lint` → `lint:css` → `format:check` → `typecheck` → `test` → `build` → `lint:pkg`.
3. `pnpm build` и `pnpm format` локально до пуша.
4. Changeset в PR, если правка видна потребителю.

## Релиз (для мейнтейнера)

Релиз идёт через **trusted publishing (OIDC)** — токена npm в секретах репозитория нет.
GitHub выдаёт прогону короткоживущий токен происхождения, npm сверяет его с формой
доверенного издателя пакета. `.github/workflows/release.yml` на пуш в `main`:

| Задача        | Что делает                                         | Права                             |
| ------------- | -------------------------------------------------- | --------------------------------- |
| `select-mode` | смотрит, остались ли описания в `.changeset/`      | `contents: read`                  |
| `version`     | открывает/обновляет PR «`chore: версия пакета`»    | `contents`/`pull-requests: write` |
| `pack`        | ставит зависимости, собирает `dist`, пакует тарбол | `contents: read`                  |
| `publish`     | заливает готовый тарбол в npm                      | `id-token`/`contents: write`      |

Сборка отделена от публикации намеренно: в задаче с `id-token: write` опубликовать пакет
может любой шаг, в том числе `postinstall` чужой зависимости. `publish` ничего не собирает,
ставит зависимости с `--ignore-scripts`, работает с тарболом из артефакта.
`changesets/action` пришпилен коммитом, а не тегом.

**Настройка на стороне npm — один раз, владельцем пакета.** npmjs.com → пакет →
Settings → Trusted Publisher → GitHub Actions:

| Поле                 | Значение      |
| -------------------- | ------------- |
| Organization or user | `Inctargam`   |
| Repository           | `ui-kit`      |
| Workflow filename    | `release.yml` |
| Environment name     | `npm`         |

`Environment name` обязано совпадать с `environment: npm` в `release.yml`; окружение
GitHub создаёт при первом прогоне. После настройки — Publishing access → «Require trusted
publisher». Провенанс (подпись Sigstore) ставится сам, репозиторий публичный.

**Если публикация упала** — смотреть шаг `Публикация в npm`:

- `404 Not Found - PUT` — доверенный издатель не совпал: чаще всего разъехались имя файла
  workflow или `Environment name`, проверять форму на npm;
- `npm … < 11.5.1` — образ runner'а со старым Node, поднять `node-version`;
- `is not in this registry` при живой настройке — версия уже опубликована.

## Заметки

- **Приложение живёт своей жизнью и добавляет компоненты в `shared/ui`.** Перед новым
  батчем сверять список папок `remark-gram/src/shared/ui` с `src/components/` кита —
  так нашлись `DropdownMenu`/`ConfirmDialog` (батч 6) и `Combobox`/`Table` (батч 8).
- Дизайн-система уже выгружена из Figma в `STYLES.md` основного проекта. В Figma лезть
  не нужно.
- Tailwind и shadcn не используются: в основном проекте их нет. Redux/RTK Query в кит
  не тянем — библиотека компонентов не зависит от state-менеджера.
