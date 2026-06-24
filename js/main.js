/* =========================================
   VERTEX EVENTS - GENERAL PAGE LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
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
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      });
    });
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

  // --- Smooth Scroll For Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
