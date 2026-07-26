import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * tokens.css и reset.css не импортируются из src/index.ts, поэтому сборка их не видит
 * и в dist они сами не попадут. Кладём их отдельными файлами: потребитель подключает
 * их из CSS или как побочный импорт, а не получает вместе с JS — reset глобальный,
 * навязывать его каждому, кто взял одну кнопку, нельзя.
 */
function copyStyles(): Plugin {
  const files = ['tokens.css', 'reset.css']

  return {
    name: 'ui-kit:copy-styles',
    apply: 'build',
    generateBundle() {
      for (const file of files) {
        this.emitFile({
          type: 'asset',
          fileName: `styles/${file}`,
          source: readFileSync(new URL(`./src/styles/${file}`, import.meta.url), 'utf-8'),
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyStyles()],
  resolve: {
    // Дубль алиаса из tsconfig.app.json: tsconfig видит только компилятор типов,
    // Vite про него не знает и упал бы на "failed to resolve import".
    // Правишь здесь — правь и там.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      // Префикс кита в имени класса: в DevTools потребителя сразу видно, чей стиль,
      // а хеш разводит одинаковые имена классов из разных компонентов.
      generateScopedName: 'rg-[local]-[hash:base64:5]',
    },
  },
  build: {
    // Статика песочницы (иконки, favicon) в пакет не едет.
    copyPublicDir: false,
    sourcemap: true,
    // Библиотека едет неминифицированной: сжимать будет сборщик потребителя, а вот
    // имена функций после минификации теряются — компонент виден в React DevTools
    // как `i`, и стек-трейс читать нечем.
    minify: false,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      // Только ESM. CJS не собираем: потребитель — Next 16 со сборщиком,
      // а двойная сборка это dual package hazard (две копии модуля в рантайме).
      formats: ['es'],
      // Общий файл стилей компонентов: dist/styles.css. Появится вместе с первым
      // компонентом — пока ни один *.module.css не импортируется, файла нет.
      cssFileName: 'styles',
    },
    rolldownOptions: {
      // Всё, что объявлено в peerDependencies и dependencies, — внешнее.
      // React в бандле означал бы вторую копию у потребителя и «Invalid hook call»;
      // Base UI — вторую копию React-контекстов; clsx — лишний дубль в его бандле.
      // Хвост ($|/) нужен, чтобы вместе с 'react' совпал и 'react/jsx-runtime'.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react($|\/)/, /^clsx($|\/)/],
      output: {
        // Файл на модуль вместо одного бандла. Два эффекта:
        // 1) tree-shaking у потребителя работает по компонентам;
        // 2) Rolldown сохраняет директивы 'use client' — без preserveModules он их срежет,
        //    и Next App Router получит серверный компонент там, где нужен клиентский.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
    },
  },
})
