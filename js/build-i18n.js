const fs = require('fs');
const path = require('path');

// 1. Load translations.js
const translationsFile = fs.readFileSync(path.join(__dirname, 'translations.js'), 'utf8');
const window = {};
eval(translationsFile);
const TRANSLATIONS = window.TRANSLATIONS;

// 2. Load the index_template.html template
const templatePath = path.join(__dirname, '..', 'index_template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// The list of languages
const LANGUAGES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'id', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'az'];

const langNames = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  id: 'Indonesia',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '简体中文',
  hi: 'Hindi',
  ar: 'العربية',
  az: 'Azərbaycan'
};

// 3. Process each language
LANGUAGES.forEach(lang => {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  let html = template;

  // Change <html lang="tr">
  html = html.replace(/<html lang="[^"]+"/, `<html lang="${lang}"`);

  // Translate static data-i18n elements
  html = html.replace(/(<[^>]*?data-i18n="([^"]+)"[^>]*?>)([\s\S]*?)(<\/[^>]+>)/g, (match, opening, key, content, closing) => {
    if (trans[key]) {
      return `${opening}${trans[key]}${closing}`;
    }
    return match;
  });

  // Translate static data-i18n-href elements
  html = html.replace(/(<[^>]*?data-i18n-href="([^"]+)"[^>]*?href=")([^"]*)("[^>]*?>)/g, (match, prefix, key, originalUrl, suffix) => {
    const val = trans[key] || TRANSLATIONS['en'][key] || TRANSLATIONS['tr'][key];
    if (val) {
      return `${prefix}${val}${suffix}`;
    }
    return match;
  });

  // Prepend '../' to relative css, js, and asset resources
  html = html.replace(/href="css\//g, 'href="../css/');
  html = html.replace(/src="js\//g, 'src="../js/');
  html = html.replace(/src="assets\//g, 'src="../assets/');
  html = html.replace(/href="assets\//g, 'href="../assets/');

  // Update input placeholders
  const namePlh = lang === 'tr' ? 'Ad Soyad' : (lang === 'de' ? 'Vorname & Nachname' : 'Name & Surname');
  const emailPlh = lang === 'tr' ? 'isim@domain.com' : 'name@domain.com';
  html = html.replace(/id="reg-name"\s+required\s+placeholder="[^"]+"/, `id="reg-name" required placeholder="${namePlh}"`);
  html = html.replace(/id="reg-email"\s+required\s+placeholder="[^"]+"/, `id="reg-email" required placeholder="${emailPlh}"`);

  // Update language trigger text
  const activeLangName = trans['active-lang'] || langNames[lang];
  html = html.replace(/<span class="lang-text" id="active-lang-text">[^<]+<\/span>/, `<span class="lang-text" id="active-lang-text">${activeLangName}</span>`);

  // Replace desktop dropdown menu with absolute links
  let desktopMenu = '<div class="lang-menu">\n';
  LANGUAGES.forEach(l => {
    desktopMenu += `            <a href="../${l}/" class="lang-item${l === lang ? ' active' : ''}" data-lang="${l}">${langNames[l]}</a>\n`;
  });
  desktopMenu += '          </div>';
  
  html = html.replace(/<div class="lang-menu">([\s\S]*?)<\/div>/, desktopMenu);

  // Replace mobile language selector with absolute links
  let mobileMenu = `<div class="mobile-lang-selector" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">\n`;
  LANGUAGES.forEach(l => {
    mobileMenu += `        <a href="../${l}/" class="mobile-lang-item${l === lang ? ' active' : ''}" style="font-size: 14px; text-transform: uppercase;">${l}</a>\n`;
  });
  mobileMenu += '      </div>';

  html = html.replace(/<div class="mobile-lang-selector"([\s\S]*?)<\/div>/, mobileMenu);

  // 4. Write compiled HTML to subfolder
  const outDir = path.join(__dirname, '..', lang);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log(`Generated: ${lang}/index.html`);
});

console.log('Language compilation complete.');
