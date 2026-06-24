import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function copyGalleryPlugin() {
  return {
    name: 'copy-gallery',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'assets/gallery')
      const destDir = path.resolve(__dirname, 'dist/assets/gallery')
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        const files = fs.readdirSync(srcDir)
        files.forEach(file => {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file))
        })
        console.log('Copied assets/gallery to dist/assets/gallery')
      }
    }
  }
}

export default defineConfig({
  plugins: [copyGalleryPlugin()],
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
