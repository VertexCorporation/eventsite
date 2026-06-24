import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tr: resolve(__dirname, 'tr/index.html'),
        en: resolve(__dirname, 'en/index.html'),
        de: resolve(__dirname, 'de/index.html'),
        fr: resolve(__dirname, 'fr/index.html'),
        es: resolve(__dirname, 'es/index.html'),
        it: resolve(__dirname, 'it/index.html'),
        pt: resolve(__dirname, 'pt/index.html'),
        nl: resolve(__dirname, 'nl/index.html'),
        id: resolve(__dirname, 'id/index.html'),
        ru: resolve(__dirname, 'ru/index.html'),
        ja: resolve(__dirname, 'ja/index.html'),
        ko: resolve(__dirname, 'ko/index.html'),
        zh: resolve(__dirname, 'zh/index.html'),
        hi: resolve(__dirname, 'hi/index.html'),
        ar: resolve(__dirname, 'ar/index.html'),
        az: resolve(__dirname, 'az/index.html')
      }
    }
  }
})
