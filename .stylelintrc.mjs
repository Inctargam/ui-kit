const stylelintConfig = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  // Скрипт `lint:css` ходит по "**/*.css" — сгенерированный CSS проверять нечего
  ignoreFiles: ['dist/**', 'storybook-static/**', 'coverage/**'],
  rules: {
    // CSS Modules: классы в camelCase, чтобы обращаться как styles.buttonPrimary без кавычек
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
    // composes — синтаксис CSS Modules, обычный CSS о нём не знает: property-no-unknown
    // считает его опечаткой, а value-keyword-case — что имя класса нужно писать строчными.
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],
    'declaration-no-important': true,
    'declaration-block-no-duplicate-properties': true,
    // transition: all перерисовывает всё подряд и ломает производительность анимаций
    'declaration-property-value-disallowed-list': {
      transition: ['/all/'],
    },
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'gap',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'padding',
      'border',
      'border-radius',
      'background',
      'background-color',
      'color',
      'font-size',
      'font-weight',
      'line-height',
      'opacity',
      'cursor',
      'transition',
    ],
  },
}

export default stylelintConfig
