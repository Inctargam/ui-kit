import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Дубль алиаса из tsconfig.app.json: tsconfig видит только компилятор типов,
    // Vite про него не знает и упал бы на "failed to resolve import".
    // Правишь здесь — правь и там.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
