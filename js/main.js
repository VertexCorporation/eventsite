/* =========================================
   VERTEX EVENTS - GENERAL PAGE LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  // --- Hero Background Video Randomizer & Crossfade ---
  const video1 = document.getElementById('hero-video-player-1');
  const video2 = document.getElementById('hero-video-player-2');
  if (video1 && video2) {
    const videos = ['yacht-1.mp4', 'yacht-2.mp4', 'yacht-3.mp4'];
    let currentVideo = videos[Math.floor(Math.random() * videos.length)];
    let activePlayer = 1;
    const prefix = document.documentElement.lang ? '../' : '';

    video1.src = `${prefix}assets/gallery/${currentVideo}`;
    video1.load();

    const playNext = () => {
      let nextVideo;
      do {
        nextVideo = videos[Math.floor(Math.random() * videos.length)];
      } while (nextVideo === currentVideo);
      currentVideo = nextVideo;

      if (activePlayer === 1) {
        video2.src = `${prefix}assets/gallery/${currentVideo}`;
        video2.load();
        video2.play();
        video2.classList.add('active');
        video1.classList.remove('active');
        activePlayer = 2;
      } else {
        video1.src = `${prefix}assets/gallery/${currentVideo}`;
        video1.load();
        video1.play();
        video1.classList.add('active');
        video2.classList.remove('active');
        activePlayer = 1;
      }
    };

    video1.addEventListener('ended', playNext);
    video2.addEventListener('ended', playNext);
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- Mobile Drawer Menu ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenu.id = 'eventsite-mobile-menu';
    mobileMenuBtn.type = 'button';
    mobileMenuBtn.setAttribute('aria-controls', mobileMenu.id);
    const setMenuOpen = open => {
      mobileMenu.classList.toggle('active', open);
      mobileMenuBtn.textContent = open ? '✕' : '☰';
      mobileMenuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      mobileMenu.inert = !open;
    };
    setMenuOpen(false);
    mobileMenuBtn.addEventListener('click', event => {
      event.stopPropagation();
      setMenuOpen(!mobileMenu.classList.contains('active'));
    });
    document.addEventListener('click', event => {
      if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        setMenuOpen(false);
        mobileMenuBtn.focus({preventScroll:true});
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) setMenuOpen(false);
    }, {passive:true});
  }

  // --- Light / Dark Theme Toggle ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- Translation & Language Switcher Logic ---
  window.currentLanguage = document.documentElement.lang || 'en';
  localStorage.setItem('vtx_lang', window.currentLanguage);

  // --- Language Selector Dropdown Click ---
  const langDropdown = document.getElementById('language-dropdown');
  const langBtnTrigger = document.getElementById('lang-btn-trigger');
  
  if (langDropdown && langBtnTrigger) {
    langBtnTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('active');
      }
    });

    document.querySelectorAll('.lang-item').forEach(item => {
      item.addEventListener('click', () => {
        const selectedLang = item.dataset.lang;
        if (selectedLang) {
          localStorage.setItem('vtx_lang', selectedLang);
        }
        langDropdown.classList.remove('active');
      });
    });
  }

  // Mobile Language selector click
  document.querySelectorAll('.mobile-lang-item').forEach(item => {
    item.addEventListener('click', () => {
      const selectedLang = item.dataset.lang;
      if (selectedLang) {
        localStorage.setItem('vtx_lang', selectedLang);
      }
    });
  });

  // --- Viewport-aware anchors: align section headings below the compact header ---
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mainContent = document.querySelector('main');
  let navigationId = 0, correctionTimer = 0, scrollEndHandler = null;
  function getAnchorTarget(hash) {
    if (!hash || !hash.startsWith('#') || hash.length < 2) return null;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
    const node = document.getElementById(id);
    return node && mainContent?.contains(node) ? node : null;
  }
  function targetScrollTop(target) {
    if (target.id === 'home') return 0;
    const heading = target.querySelector('.purpose-section-header h2, .section-title, h2');
    const box = (heading || target).getBoundingClientRect();
    const root = getComputedStyle(document.documentElement);
    const shrunk = parseFloat(root.getPropertyValue('--nav-h-shrunk')) || 56;
    const padding = heading ? 0 : (parseFloat(getComputedStyle(target).paddingTop) || 0);
    return Math.max(0, Math.round(window.scrollY + box.top + padding - shrunk - 20));
  }
  function stopCorrection() {
    window.clearTimeout(correctionTimer);
    if (scrollEndHandler) window.removeEventListener('scrollend', scrollEndHandler);
    scrollEndHandler = null;
    navigationId++;
  }
  function navigateTo(hash, smooth = true) {
    const target = getAnchorTarget(hash);
    if (!target) return false;
    stopCorrection();
    const id = navigationId;
    const run = () => {
      if (id !== navigationId) return;
      window.scrollTo({
        top: targetScrollTop(target),
        behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant'
      });
      if (target.id === 'home') return;
      const correct = () => {
        if (id !== navigationId) return;
        const intended = targetScrollTop(target);
        if (Math.abs(window.scrollY - intended) > 5)
          window.scrollTo({top:intended,behavior:'instant'});
        stopCorrection();
      };
      if (smooth && !reducedMotion.matches && 'onscrollend' in window) {
        scrollEndHandler = correct;
        window.addEventListener('scrollend', scrollEndHandler, {once:true});
      }
      correctionTimer = window.setTimeout(correct, smooth && !reducedMotion.matches ? 1200 : 160);
    };
    window.requestAnimationFrame(() => window.requestAnimationFrame(run));
    return true;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.hash;
    if (!getAnchorTarget(hash)) return;
    event.preventDefault();
    if (mobileMenuBtn && mobileMenu) {
      mobileMenu.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.inert = true;
    }
    if (window.location.hash !== hash) history.pushState(null, '', hash);
    navigateTo(hash, true);
  });
  window.addEventListener('popstate', () => {
    if (location.hash) navigateTo(location.hash, false);
  });
  window.addEventListener('hashchange', () => {
    if (location.hash) navigateTo(location.hash, false);
  });
  window.addEventListener('load', () => {
    if (location.hash) navigateTo(location.hash, false);
  }, {once:true});
  window.addEventListener('pageshow', event => {
    if (event.persisted && location.hash) navigateTo(location.hash, false);
  });
  window.addEventListener('wheel', stopCorrection, {passive:true});
  window.addEventListener('touchstart', stopCorrection, {passive:true});
});
