import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@blocks': path.resolve(__dirname, './src/pages/Sites/SiteSettings/PagesTab/BlocksEditor'),
      '@preview': path.resolve(__dirname, './src/pages/Sites/SiteSettings/PagesTab/BlocksEditor/preview'),
    },
  },
})