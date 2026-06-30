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

  // Translate SEO meta tags (title, description, og:title, og:description, keywords)
  const seoData = {
    tr: {
      title: 'Vertex Etkinlikleri | Teknolojinin Zirvesinde Buluşalım',
      desc: 'Vertex Corporation etkinlik platformu. Yeni nesil teknoloji şirketi Vertex, teknoloji sektöründe devrim yaratıyor! Teknoloji konferansları, atölyeler ve topluluk buluşmalarımıza katılın.',
      ogDesc: 'Yeni nesil teknoloji şirketi Vertex, teknoloji sektöründe devrim yaratıyor! Konferanslar ve atölyelere katılın.',
      keywords: 'vertex, vertex etkinlikleri, hackathon, yazılım kampı, yapay zeka buluşması, cortex, drome, mergen, teknoloji konferansı, genç girişimciler'
    },
    en: {
      title: "Vertex Events | Let's Meet at the Peak of Technology",
      desc: 'Vertex Corporation events platform. The next generation tech company Vertex is revolutionizing the technology sector! Join our technology conferences, workshops, and community meetups.',
      ogDesc: 'The next generation tech company Vertex is revolutionizing the technology sector! Join our conferences and workshops.',
      keywords: 'vertex, vertex events, hackathon, software camp, ai meetup, cortex, drome, mergen, tech conference, young entrepreneurs'
    },
    de: {
      title: 'Vertex Events | Treffen wir uns am Gipfel der Technologie',
      desc: 'Vertex Corporation Veranstaltungsplattform. Das Tech-Unternehmen der nächsten Generation revolutioniert die Technologiebranche! Nehmen Sie an unseren Konferenzen und Workshops teil.',
      ogDesc: 'Vertex revolutioniert die Technologiebranche! Nehmen Sie an Konferenzen und Workshops teil.',
      keywords: 'vertex, vertex events, hackathon, software camp, ki treffen, cortex, technologie konferenz'
    },
    fr: {
      title: 'Vertex Événements | Rencontrons-nous au Sommet de la Technologie',
      desc: "Plateforme d'événements Vertex Corporation. Vertex révolutionne le secteur technologique ! Rejoignez nos conférences et ateliers.",
      ogDesc: "Vertex révolutionne le secteur technologique ! Rejoignez nos conférences et ateliers.",
      keywords: 'vertex, événements vertex, hackathon, ia, cortex, conférence technologique'
    },
    es: {
      title: 'Vertex Eventos | Encontrémonos en la Cumbre de la Tecnología',
      desc: 'Plataforma de eventos de Vertex Corporation. ¡Vertex está revolucionando el sector tecnológico! Únase a nuestras conferencias y talleres.',
      ogDesc: '¡Vertex está revolucionando el sector tecnológico! Únase a nuestras conferencias y talleres.',
      keywords: 'vertex, eventos vertex, hackathon, ia, cortex, conferencia tecnológica'
    },
    ja: {
      title: 'Vertex Events | テクノロジーの頂点で会いましょう',
      desc: 'Vertex Corporationイベントプラットフォーム。次世代テクノロジー企業Vertexがテクノロジーセクターに革命を起こしています！カンファレンスやワークショップにご参加ください。',
      ogDesc: 'Vertexがテクノロジーセクターに革命を起こしています！カンファレンスにご参加ください。',
      keywords: 'vertex, vertexイベント, ハッカソン, AI, cortex, テックカンファレンス'
    },
    ru: {
      title: 'Vertex Events | Встретимся на вершине технологий',
      desc: 'Платформа мероприятий Vertex Corporation. Vertex совершает революцию в технологическом секторе! Присоединяйтесь к нашим конференциям и мастер-классам.',
      ogDesc: 'Vertex совершает революцию в технологическом секторе! Присоединяйтесь к нашим мероприятиям.',
      keywords: 'vertex, мероприятия vertex, хакатон, ИИ, cortex, технологическая конференция'
    },
    ko: {
      title: 'Vertex Events | 기술의 정상에서 만나요',
      desc: 'Vertex Corporation 이벤트 플랫폼. 차세대 기술 기업 Vertex가 기술 산업에 혁명을 일으키고 있습니다! 컨퍼런스와 워크숍에 참여하세요.',
      ogDesc: 'Vertex가 기술 산업에 혁명을 일으키고 있습니다! 컨퍼런스에 참여하세요.',
      keywords: 'vertex, vertex 이벤트, 해커톤, AI, cortex, 기술 컨퍼런스'
    },
    zh: {
      title: 'Vertex Events | 在科技巅峰相聚',
      desc: 'Vertex Corporation活动平台。新一代科技公司Vertex正在革新科技行业！加入我们的会议和研讨会。',
      ogDesc: 'Vertex正在革新科技行业！加入我们的会议和研讨会。',
      keywords: 'vertex, vertex活动, 黑客马拉松, AI, cortex, 科技会议'
    },
    ar: {
      title: 'Vertex Events | لنلتقِ في قمة التكنولوجيا',
      desc: 'منصة فعاليات Vertex Corporation. شركة Vertex تُحدث ثورة في قطاع التكنولوجيا! انضموا إلى مؤتمراتنا وورش العمل.',
      ogDesc: 'Vertex تُحدث ثورة في قطاع التكنولوجيا! انضموا إلى فعالياتنا.',
      keywords: 'vertex, فعاليات vertex, هاكاثون, ذكاء اصطناعي, cortex, مؤتمر تقني'
    },
    hi: {
      title: 'Vertex Events | प्रौद्योगिकी के शिखर पर मिलें',
      desc: 'Vertex Corporation इवेंट प्लेटफॉर्म। Vertex तकनीकी क्षेत्र में क्रांति ला रहा है! हमारे सम्मेलनों और कार्यशालाओं में शामिल हों।',
      ogDesc: 'Vertex तकनीकी क्षेत्र में क्रांति ला रहा है! हमारे कार्यक्रमों में शामिल हों।',
      keywords: 'vertex, vertex इवेंट, हैकाथॉन, AI, cortex, टेक सम्मेलन'
    },
    az: {
      title: 'Vertex Tədbirlər | Texnologiyanın Zirvəsində Görüşək',
      desc: 'Vertex Corporation tədbir platforması. Yeni nəsil texnologiya şirkəti Vertex texnologiya sektorunda inqilab edir! Konfranslarımıza və atelyelərimizə qatılın.',
      ogDesc: 'Vertex texnologiya sektorunda inqilab edir! Konfranslarımıza qatılın.',
      keywords: 'vertex, vertex tədbirləri, hackathon, AI, cortex, texnologiya konfransı'
    }
  };
  const seo = seoData[lang] || seoData['en'];
  html = html.replace(/<title>[^<]+<\/title>/, `<title>${seo.title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${seo.desc}">`);
  html = html.replace(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${seo.keywords}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${seo.title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${seo.ogDesc}">`);

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
