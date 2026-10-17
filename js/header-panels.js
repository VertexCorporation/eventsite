/* Vertexite-matched language/theme controls. Kept separate so the
   video, scroll navigation, and existing event registration logic stay intact. */
(() => {
  'use strict';
  const labels = {
    tr:['Tema','Açık','Koyu','Sistem'],en:['Theme','Light','Dark','System'],
    de:['Design','Hell','Dunkel','System'],fr:['Thème','Clair','Sombre','Système'],
    es:['Tema','Claro','Oscuro','Sistema'],it:['Tema','Chiaro','Scuro','Sistema'],
    pt:['Tema','Claro','Escuro','Sistema'],nl:['Thema','Licht','Donker','Systeem'],
    ru:['Тема','Светлая','Тёмная','Система'],ar:['المظهر','فاتح','داكن','النظام'],
    hi:['थीम','लाइट','डार्क','सिस्टम'],id:['Tema','Terang','Gelap','Sistem'],
    ja:['テーマ','ライト','ダーク','システム'],ko:['테마','라이트','다크','시스템'],
    zh:['主题','浅色','深色','系统'],az:['Mövzu','Açıq','Tünd','Sistem']
  };
  const names = {
    tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',es:'Español',
    it:'Italiano',pt:'Português',nl:'Nederlands',id:'Indonesia',ru:'Русский',
    ja:'日本語',ko:'한국어',zh:'简体中文',hi:'हिन्दी',ar:'العربية',az:'Azərbaycan'
  };
  const iconPaths = {
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/>',
    chevron:'<path d="M6 9l6 6 6-6"/>',
    light:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
    dark:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    system:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M7 20h10M9 16v4M15 16v4"/>',
    check:'<path d="M5 12l5 5L20 7"/>'
  };
  function icon(kind, cls, size) {
    const el=document.createElementNS('http://www.w3.org/2000/svg','svg');
    el.setAttribute('viewBox','0 0 24 24');
    el.setAttribute('width',String(size||17));el.setAttribute('height',String(size||17));
    el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');
    el.setAttribute('stroke-width','1.8');el.setAttribute('stroke-linecap','round');
    el.setAttribute('stroke-linejoin','round');el.setAttribute('aria-hidden','true');
    if(cls)el.setAttribute('class',cls);
    el.innerHTML=iconPaths[kind];return el;
  }
  function init() {
    const lang=document.documentElement.lang.toLowerCase().split('-')[0]||'en';
    const tr=labels[lang]||labels.en;
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
    const themeBtn=document.querySelector('.theme-toggle-btn');
    const langBtn=document.getElementById('lang-btn-trigger');
    const langWrap=document.getElementById('language-dropdown');
    const langMenu=langWrap&&langWrap.querySelector('.lang-menu');
    const mobileButton=document.querySelector('.mobile-menu-btn');
    const mobileMenu=document.querySelector('.mobile-menu');
    if(!themeBtn||!langBtn||!langWrap||!langMenu)return;

    const legacyThemeIcon=themeBtn.querySelector('.theme-icon');
    if(legacyThemeIcon)legacyThemeIcon.hidden=true;
    const langLabel=langBtn.querySelector('.lang-text');
    if(langLabel){langLabel.textContent=names[lang]||names.en;langLabel.style.removeProperty('display');}
    const globe=langBtn.querySelector('.globe-icon');
    if(globe)globe.replaceWith(icon('globe','globe-icon',16));
    langBtn.appendChild(icon('chevron','lang-chevron',11));
    langBtn.type='button';
    langBtn.setAttribute('aria-haspopup','menu');
    langBtn.setAttribute('aria-controls','eventsite-language-menu');
    langBtn.setAttribute('aria-expanded','false');
    langMenu.id='eventsite-language-menu';
    langMenu.setAttribute('role','menu');
    langMenu.setAttribute('aria-hidden','true');
    langMenu.inert=true;
    const langLinks=[...langMenu.querySelectorAll('a.lang-item')];
    langLinks.forEach(link=>{
      link.setAttribute('role','menuitem');
      link.classList.toggle('active',link.dataset.lang===lang);
      const check=document.createElement('span');
      check.className='lang-check';check.setAttribute('aria-hidden','true');
      check.textContent='✓';link.appendChild(check);
    });

    themeBtn.type='button';
    themeBtn.setAttribute('aria-haspopup','dialog');
    themeBtn.setAttribute('aria-expanded','false');
    themeBtn.setAttribute('aria-controls','eventsite-theme-menu');
    const sun=icon('light','theme-button-sun',17);
    const moon=icon('dark','theme-button-moon',17);
    const system=icon('system','theme-button-system',17);
    themeBtn.append(sun,moon,system);

    const menu=document.createElement('div');
    menu.className='event-theme-menu';
    menu.id='eventsite-theme-menu';menu.hidden=true;menu.inert=true;
    menu.setAttribute('role','dialog');menu.setAttribute('aria-label',tr[0]);
    menu.setAttribute('aria-hidden','true');
    const heading=document.createElement('div');
    heading.className='event-theme-heading';heading.textContent=tr[0];menu.appendChild(heading);
    const items=document.createElement('div');
    items.className='event-theme-list';items.setAttribute('role','menu');menu.appendChild(items);
    const modes=['light','dark','system'];
    const options=modes.map((mode,i)=>{
      const button=document.createElement('button');
      button.type='button';button.className='event-theme-option';button.dataset.mode=mode;
      button.setAttribute('role','menuitemradio');
      const label=document.createElement('span');label.textContent=tr[i+1];
      button.append(icon(mode,'theme-option-icon',17),label,icon('check','theme-option-check',16));
      items.appendChild(button);
      return button;
    });
    document.body.appendChild(menu);
    let themeOpen=false,themeTimer=0,animationFrame=0,leaving=false;
    const read=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
    const write=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
    const storedMode=()=>{
      const mode=read('vertex-theme-mode'),old=read('theme');
      return modes.includes(mode)?mode:(old==='light'||old==='dark'?old:'system');
    };
    const resolved=mode=>mode==='system'?(media.matches?'dark':'light'):mode;
    function applyTheme(mode) {
      const theme=resolved(mode);
      document.documentElement.setAttribute('data-theme',theme);
      document.documentElement.setAttribute('data-theme-mode',mode);
      write('vertex-theme-mode',mode);write('theme',theme);
      const meta=document.querySelector('meta[name="theme-color"]');
      if(meta)meta.content=theme==='dark'?'#0E1013':'#FAFAF9';
      sun.hidden=mode!=='dark';moon.hidden=mode!=='light';system.hidden=mode!=='system';
      themeBtn.setAttribute('aria-label',tr[0]+': '+tr[modes.indexOf(mode)+1]);
      options.forEach(option=>{
        const yes=option.dataset.mode===mode;
        option.setAttribute('aria-checked',String(yes));
        option.classList.toggle('is-selected',yes);
      });
    }
    function closeLanguage(focus,instant) {
      if(!langWrap.classList.contains('active'))return;
      // Switching panels is immediate: neither can remain visible during the other's entrance.
      if(instant)langMenu.classList.add('is-instant');
      langWrap.classList.remove('active');
      langBtn.setAttribute('aria-expanded','false');
      langMenu.setAttribute('aria-hidden','true');langMenu.inert=true;
      if(instant)window.requestAnimationFrame(()=>langMenu.classList.remove('is-instant'));
      if(focus)langBtn.focus({preventScroll:true});
    }
    function openLanguage() {
      closeTheme(true);
      closeMobile();
      langMenu.inert=false;langMenu.setAttribute('aria-hidden','false');
      langWrap.classList.add('active');langBtn.setAttribute('aria-expanded','true');
    }
    function closeMobile(){
      if(mobileMenu)mobileMenu.classList.remove('active');
      if(mobileButton){mobileButton.textContent='☰';mobileButton.setAttribute('aria-expanded','false');}
    }
    function positionTheme(){
      if(menu.hidden)return;
      const rect=themeBtn.getBoundingClientRect(),pad=8,w=menu.offsetWidth,h=menu.offsetHeight;
      const x=Math.min(Math.max(pad,rect.left+rect.width/2-w/2),Math.max(pad,innerWidth-w-pad));
      const below=rect.bottom+7,above=rect.top-h-7;
      const y=below+h<=innerHeight-pad?below:(above>=pad?above:Math.max(pad,innerHeight-h-pad));
      menu.style.left=Math.round(x)+'px';menu.style.top=Math.round(y)+'px';
      menu.style.transformOrigin=y>=rect.bottom?'top center':'bottom center';
    }
    function closeTheme(instant,focus){
      if(!themeOpen&&!menu.classList.contains('is-closing'))return;
      themeOpen=false;themeBtn.setAttribute('aria-expanded','false');
      window.clearTimeout(themeTimer);window.cancelAnimationFrame(animationFrame);
      menu.classList.remove('is-open');menu.classList.add('is-closing');
      menu.setAttribute('aria-hidden','true');menu.inert=true;
      if(instant||reduce.matches){menu.hidden=true;menu.classList.remove('is-closing');}
      else themeTimer=window.setTimeout(()=>{
        if(!themeOpen){menu.hidden=true;menu.classList.remove('is-closing');}
      },120);
      if(focus)themeBtn.focus({preventScroll:true});
    }
    function openTheme(){
      closeLanguage(false,true);
      closeMobile();
      window.clearTimeout(themeTimer);window.cancelAnimationFrame(animationFrame);
      themeOpen=true;menu.hidden=false;menu.inert=false;
      menu.classList.remove('is-closing');menu.setAttribute('aria-hidden','false');
      themeBtn.setAttribute('aria-expanded','true');positionTheme();
      animationFrame=window.requestAnimationFrame(()=>{
        if(themeOpen){menu.classList.add('is-open');positionTheme();}
      });
    }

    // Capture events before the previous site controller's bubble listeners.
    // This preserves its video / navbar hash and avoids two competing toggle handlers.
    document.addEventListener('click',event=>{
      const target=event.target;
      if(themeBtn.contains(target)){
        event.preventDefault();event.stopImmediatePropagation();
        if(themeOpen)closeTheme(false);else openTheme();
        return;
      }
      if(langBtn.contains(target)){
        event.preventDefault();event.stopImmediatePropagation();
        if(langWrap.classList.contains('active'))closeLanguage();else openLanguage();
        return;
      }
      if(mobileButton&&mobileButton.contains(target)){
        closeTheme(true);closeLanguage(false,true);return; // existing mobile handler owns toggling
      }
      if(!menu.contains(target))closeTheme(false);
      if(!langWrap.contains(target))closeLanguage();
    },true);
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'){
        if(themeOpen){event.preventDefault();event.stopPropagation();closeTheme(false,true);}
        else if(langWrap.classList.contains('active')){event.preventDefault();closeLanguage(true);}
        return;
      }
      if(themeOpen&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&menu.contains(document.activeElement)){
        event.preventDefault();
        const current=options.indexOf(document.activeElement);
        const next=event.key==='Home'?0:event.key==='End'?options.length-1:
          (current+(event.key==='ArrowDown'?1:options.length-1))%options.length;
        options[next].focus();
      } else if(langWrap.classList.contains('active')&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&langWrap.contains(document.activeElement)){
        event.preventDefault();
        const current=langLinks.indexOf(document.activeElement);
        const next=event.key==='Home'?0:event.key==='End'?langLinks.length-1:
          (current+(event.key==='ArrowDown'?1:langLinks.length-1))%langLinks.length;
        langLinks[next].focus();
      }
    },true);
    options.forEach(option=>{
      option.addEventListener('click',()=>{
        applyTheme(option.dataset.mode);closeTheme(false,true);
      });
    });
    langLinks.forEach(link=>link.addEventListener('click',event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||
         event.shiftKey||event.altKey||link.target||link.hasAttribute('download')||leaving||reduce.matches)return;
      const url=new URL(link.href,location.href);
      if(url.origin!==location.origin||url.href===location.href)return;
      event.preventDefault();leaving=true;
      document.documentElement.classList.add('language-leaving');
      window.setTimeout(()=>location.assign(url.href),160);
    }));
    window.addEventListener('pageshow',()=>{leaving=false;document.documentElement.classList.remove('language-leaving');});
    window.addEventListener('resize',()=>{if(themeOpen)positionTheme();},{passive:true});
    window.addEventListener('scroll',()=>{if(themeOpen)positionTheme();},{passive:true});
    const onSystem=()=>{if(storedMode()==='system')applyTheme('system');};
    if(media.addEventListener)media.addEventListener('change',onSystem);
    else if(media.addListener)media.addListener(onSystem);
    applyTheme(storedMode());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
