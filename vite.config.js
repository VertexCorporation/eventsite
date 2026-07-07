import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

const LANGUAGES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'id', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'az'];

const input = {
  main: resolve(__dirname, 'index.html'),
  validate: resolve(__dirname, 'validate.html')
};

const mapping = {
  "ar": {
    "terms": "shurut-al-khidma.html",
    "privacy": "siyasat-al-khususiyya.html"
  },
  "az": {
    "terms": "xidmet-sertleri.html",
    "privacy": "mexfilik-siyaseti.html"
  },
  "de": {
    "terms": "nutzungsbedingungen.html",
    "privacy": "datenschutzrichtlinie.html"
  },
  "en": {
    "terms": "terms-of-service.html",
    "privacy": "privacy-policy.html"
  },
  "es": {
    "terms": "terminos-de-servicio.html",
    "privacy": "politica-de-privacidad.html"
  },
  "fr": {
    "terms": "conditions-d-utilisation.html",
    "privacy": "politique-de-confidentialite.html"
  },
  "hi": {
    "terms": "seva-ki-shartein.html",
    "privacy": "gopaniyata-niti.html"
  },
  "id": {
    "terms": "syarat-layanan.html",
    "privacy": "kebijakan-privasi.html"
  },
  "it": {
    "terms": "termini-di-servizio.html",
    "privacy": "informativa-sulla-privacy.html"
  },
  "ja": {
    "terms": "riyou-kiyaku.html",
    "privacy": "puraibashi-porishi.html"
  },
  "ko": {
    "terms": "iyong-yakgwan.html",
    "privacy": "gaein-jeongbo-cheori-bangchim.html"
  },
  "nl": {
    "terms": "servicevoorwaarden.html",
    "privacy": "privacybeleid.html"
  },
  "pt": {
    "terms": "termos-de-servico.html",
    "privacy": "politica-de-privacidade.html"
  },
  "ru": {
    "terms": "usloviya-obsluzhivaniya.html",
    "privacy": "politika-konfidencialnosti.html"
  },
  "tr": {
    "terms": "hizmet-sartlari.html",
    "privacy": "gizlilik-politikasi.html"
  },
  "zh": {
    "terms": "fuwu-tiaokuan.html",
    "privacy": "yinsi-zhengce.html"
  }
};

LANGUAGES.forEach(lang => {
  input[`${lang}_index`] = resolve(__dirname, `${lang}/index.html`);
  input[`${lang}_privacy`] = resolve(__dirname, `${lang}/${mapping[lang].privacy}`);
  input[`${lang}_terms`] = resolve(__dirname, `${lang}/${mapping[lang].terms}`);
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
      
      const faviconSrc = path.resolve(__dirname, 'assets/favicon.webp')
      const faviconDest = path.resolve(__dirname, 'dist/assets/favicon.webp')
      if (fs.existsSync(faviconSrc)) {
        if (!fs.existsSync(path.dirname(faviconDest))) {
          fs.mkdirSync(path.dirname(faviconDest), { recursive: true })
        }
        fs.copyFileSync(faviconSrc, faviconDest)
        console.log('Copied assets/favicon.webp to dist/assets/favicon.webp')
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
