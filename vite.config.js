import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

const LANGUAGES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'id', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'az'];

const input = {
  main: resolve(__dirname, 'index.html'),
  validate: resolve(__dirname, 'validate.html')
};

LANGUAGES.forEach(lang => {
  input[`${lang}_index`] = resolve(__dirname, `${lang}/index.html`);
  input[`${lang}_privacy`] = resolve(__dirname, `${lang}/privacy.html`);
  input[`${lang}_terms`] = resolve(__dirname, `${lang}/terms.html`);
});

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
          const stats = fs.statSync(path.join(srcDir, file));
          if (stats.isDirectory()) {
            // Support font subfolders if any
            const subDest = path.join(destDir, file);
            if (!fs.existsSync(subDest)) {
              fs.mkdirSync(subDest, { recursive: true })
            }
            fs.readdirSync(path.join(srcDir, file)).forEach(subFile => {
              fs.copyFileSync(path.join(srcDir, file, subFile), path.join(subDest, subFile));
            });
          } else {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file))
          }
        })
        console.log('Copied assets/gallery to dist/assets/gallery')
      }
      
      const faviconSrc = path.resolve(__dirname, 'assets/favicon.png')
      const faviconDest = path.resolve(__dirname, 'dist/assets/favicon.png')
      if (fs.existsSync(faviconSrc)) {
        if (!fs.existsSync(path.dirname(faviconDest))) {
          fs.mkdirSync(path.dirname(faviconDest), { recursive: true })
        }
        fs.copyFileSync(faviconSrc, faviconDest)
        console.log('Copied assets/favicon.png to dist/assets/favicon.png')
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
      input
    }
  }
})
