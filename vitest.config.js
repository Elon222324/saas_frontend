// FILE: vitest.config.js
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
  },
})
