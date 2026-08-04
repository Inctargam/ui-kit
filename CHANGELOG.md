# @remark-gram/ui-kit

## 0.2.0

### Minor Changes

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
