/* Keep the transparent Vertex favicon in sync with the browser color scheme.
   Without JavaScript the two media-qualified <link> elements follow the browser theme. */
(() => {
  'use strict';
  const darkIcon = document.getElementById('vertex-favicon-dark');
  const lightIcon = document.getElementById('vertex-favicon-light');
  if (!darkIcon || !lightIcon) return;

  const browserTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = () => {
    try { return localStorage.getItem('theme'); } catch { return null; }
  };
  const sync = () => {
    const theme = browserTheme.matches ? 'dark' : 'light';
    darkIcon.media = theme === 'dark' ? 'all' : 'not all';
    lightIcon.media = theme === 'light' ? 'all' : 'not all';
  };
  const syncSystemTheme = () => {
    // Preserve automatic page-theme updates separately from favicon selection.
    if (savedTheme() !== 'dark' && savedTheme() !== 'light') {
      document.documentElement.setAttribute('data-theme', browserTheme.matches ? 'dark' : 'light');
    }
    sync();
  };
  if (typeof browserTheme.addEventListener === 'function') {
    browserTheme.addEventListener('change', syncSystemTheme);
  } else if (typeof browserTheme.addListener === 'function') {
    browserTheme.addListener(syncSystemTheme);
  }
  sync();
})();
