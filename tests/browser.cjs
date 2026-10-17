const {chromium}=require('playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const legacy=require('../js/legacy-events');
const baseURL=process.env.EVENTSITE_TEST_URL||'http://127.0.0.1:3000';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const report=[];
 const events=legacy.map(e=>({...e,timeZone:'Europe/Istanbul',status:'published',salesStatus:'open',capacity:null}));
 events.push({id:'test_free',title:'Test free',title_en:'Test free',desc:'Test description',date:'2099-01-01',location:'Istanbul',price:0,status:'published',salesStatus:'open',timeZone:'Europe/Istanbul',images:[],capacity:2});
 for(const width of [390,768,1440])for(const theme of ['dark','light']){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(theme=>{localStorage.setItem('vtx_theme',theme);localStorage.setItem('theme',theme);},theme);
 await page.route('**/*cloudfunctions.net/**',async route=>{const name=route.request().url().split('/').pop();await route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:name==='getPublishedEvents'?{events}:name==='registerForEvent'?{registrationId:'a'.repeat(48)}:{valid:false}}});});
 await page.goto(`${baseURL}/tr/`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.event-card');
 await page.evaluate(theme=>document.documentElement.setAttribute('data-theme',theme),theme);
 assert.equal(await page.locator('.event-card').count(),5);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>!document.querySelector('.header').classList.contains('scrolled'));
 const headerTop=await page.locator('.header').evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(headerTop,'rgba(0, 0, 0, 0)');
 await page.evaluate(()=>window.scrollTo({top:500,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('.header').classList.contains('scrolled'));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.header')).backgroundColor !== 'rgba(0, 0, 0, 0)');
 assert.equal(await page.locator('.hero-video').count(),2);
 await page.evaluate(()=>document.getElementById('hero-video-player-1').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('.hero-video.active').count(),1);

 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`overflow ${width}/${theme}`);
 assert.equal(await page.locator('input[id^="card-"]').count(),0);
 await page.locator('.view-details-btn[data-id="test_free"]').click();
 await page.click('#modal-register-btn');
 await page.fill('#reg-name','Test User');await page.fill('#reg-email','test@example.invalid');await page.click('#submit-reg-btn');
 await page.waitForFunction(()=>document.querySelector('#register-flow-success').style.display==='block');
 assert.equal(await page.locator('#ticket-qr-code canvas').count(),1);
 await page.click('#close-success-btn');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>!document.querySelector('.header').classList.contains('scrolled'));
 await page.screenshot({path:`/tmp/vertex-events-${width}-${theme}.png`,fullPage:true});
 assert.deepEqual(errors,[]);
 report.push({width,theme,cards:5,overflow,qr:true,errors});await page.close();
 }
 // Header parity: square controls, only one open panel, light/dark/system options.
 const controls=await browser.newPage({viewport:{width:390,height:850}});
 await controls.route('**/*cloudfunctions.net/**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{events}}}));
 await controls.goto(baseURL+'/tr/',{waitUntil:'domcontentloaded'});
 await controls.waitForSelector('.event-card');
 const controlShape=await controls.locator('#lang-btn-trigger').evaluate(el=>getComputedStyle(el).borderRadius);
 assert.notEqual(controlShape,'50%');
 // Regression: only one centered SVG may live inside the theme button.
 async function assertThemeIcon(expected) {
   const shape=await controls.locator('.theme-toggle-btn').evaluate(button=>{
     const icon=button.querySelector(':scope > svg');
     const rect=button.getBoundingClientRect();
     const svgRect=icon?.getBoundingClientRect();
     return {
       count:button.querySelectorAll('svg').length,
       children:button.children.length,
       width:Math.round(rect.width),height:Math.round(rect.height),
       iconWidth:svgRect&&Math.round(svgRect.width),
       centered:!!svgRect&&Math.abs((svgRect.left+svgRect.right)/2-(rect.left+rect.right)/2)<1
         && Math.abs((svgRect.top+svgRect.bottom)/2-(rect.top+rect.bottom)/2)<1,
       iconClass:icon?.getAttribute('class'),
       pathCount:icon?.querySelectorAll('path,rect,circle,line').length
     };
   });
   assert.equal(shape.count,1,expected+' should show exactly one SVG');
   assert.equal(shape.children,1,expected+' has extra controls/legacy icons');
   assert.equal(shape.width,36);assert.equal(shape.height,36);
   assert.equal(shape.iconWidth,17);assert.equal(shape.centered,true);
   assert.equal(shape.iconClass,'theme-button-icon');
   assert.ok(shape.pathCount>=1);
 }
 await assertThemeIcon('initial mode');
 assert.equal(await controls.locator('#language-dropdown a.lang-item[data-lang="en"]').evaluate(el=>el.firstChild.textContent.trim()),'İngilizce');
 assert.equal(await controls.locator('#language-dropdown a.lang-item[data-lang="de"]').evaluate(el=>el.firstChild.textContent.trim()),'Almanca');
 assert.equal(await controls.locator('.header .brand-logo-crossfade').count(),1);
 assert.equal(await controls.locator('footer .brand-logo-crossfade').count(),1);
 assert.equal(await controls.locator('footer .footer-brand .logo-events').count(),1);
 assert.equal(await controls.locator('footer .footer-col a[href*="x.com/VertexCorpLTD"]').count(),1);
 assert.equal(await controls.locator('footer .footer-col a[href*="/tr/#projects"]').count(),1);
 await controls.locator('#lang-btn-trigger').click();
 assert.equal(await controls.locator('#language-dropdown.active').count(),1);
 // Same understated scrollbar as the main Vertex site: 5px transparent track,
 // thumb appears on scroll and smoothly disappears after a short idle.
 assert.equal(await controls.locator('.header .lang-menu').evaluate(el=>getComputedStyle(el).scrollbarWidth),'thin');
 const scrollbarStyle=await controls.locator('.header .lang-menu').evaluate(el=>getComputedStyle(el,'::-webkit-scrollbar').width);
 assert.equal(scrollbarStyle,'5px');
 await controls.locator('.header .lang-menu').evaluate(el=>{el.scrollTop=el.scrollHeight-el.clientHeight;});
 await controls.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.header .lang-menu')).getPropertyValue('--scrollbar-alpha'))>.85);
 await controls.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.header .lang-menu')).getPropertyValue('--scrollbar-alpha'))<.08);
 await controls.locator('.theme-toggle-btn').click();
 await controls.waitForSelector('#eventsite-theme-menu.is-open');
 assert.equal(await controls.locator('#language-dropdown.active').count(),0);
 await controls.locator('#eventsite-theme-menu .event-theme-option[data-mode="light"]').click();
 assert.equal(await controls.locator('html').getAttribute('data-theme'),'light');
 await assertThemeIcon('light mode');
 await controls.waitForTimeout(360);
 const lightLogo=await controls.locator('.header .brand-logo-light').evaluate(el=>Number(getComputedStyle(el).opacity));
 assert.equal(lightLogo,1);
 await controls.locator('.theme-toggle-btn').click();
 await controls.waitForSelector('#eventsite-theme-menu.is-open');
 await controls.locator('#eventsite-theme-menu .event-theme-option[data-mode="dark"]').click();
 assert.equal(await controls.locator('html').getAttribute('data-theme'),'dark');
 await assertThemeIcon('dark mode');
 await controls.waitForTimeout(360);
 const darkLogo=await controls.locator('.header .brand-logo-dark').evaluate(el=>Number(getComputedStyle(el).opacity));
 assert.equal(darkLogo,1);
 await controls.locator('.theme-toggle-btn').click();
 await controls.waitForSelector('#eventsite-theme-menu.is-open');
 await controls.locator('#lang-btn-trigger').click();
 assert.equal(await controls.locator('#eventsite-theme-menu.is-open').count(),0);
 assert.equal(await controls.locator('#language-dropdown.active').count(),1);
 await controls.keyboard.press('Escape');
 assert.equal(await controls.locator('#language-dropdown.active').count(),0);
 await controls.locator('.theme-toggle-btn').click();
 await controls.waitForSelector('#eventsite-theme-menu.is-open');
 await controls.locator('#eventsite-theme-menu .event-theme-option[data-mode="system"]').click();
 assert.equal(await controls.locator('html').getAttribute('data-theme-mode'),'system');
 await assertThemeIcon('system mode');
 const controlsOverflow=await controls.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 assert.equal(controlsOverflow,false,'mobile header overflow');
 // Also test the outer document's scrollbar, not just the language panel.
 await controls.evaluate(()=>window.scrollTo({top:600,behavior:'instant'}));
 await controls.waitForFunction(()=>Number(getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-alpha'))>.85);
 await controls.waitForFunction(()=>Number(getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-alpha'))<.08);
 await controls.close();
 // Delayed API: exactly three shimmer cards must precede the first real response.
 const shimmerPage=await browser.newPage({viewport:{width:390,height:850}});
 let resolveFetchSeen,releaseEvents;
 const fetchSeen=new Promise(resolve=>{resolveFetchSeen=resolve;});
 await shimmerPage.route('**/*cloudfunctions.net/**',async route=>{
   if(route.request().url().includes('/getPublishedEvents')){
     resolveFetchSeen();
     await new Promise(resolve=>{
       releaseEvents=async()=>{
         await route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{events}}});
         resolve();
       };
     });
     return;
   }
   await route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{valid:false}}});
 });
 await shimmerPage.goto(baseURL+'/tr/',{waitUntil:'domcontentloaded'});
 await fetchSeen;
 assert.equal(await shimmerPage.locator('.events-skeleton-card').count(),3);
 assert.equal(await shimmerPage.locator('.event-card').count(),0);
 assert.equal(await shimmerPage.locator('#events-grid').getAttribute('data-state'),'loading');
 const shimmerAnimation=await shimmerPage.locator('.events-skeleton-media').first().evaluate(el=>getComputedStyle(el,'::after').animationName);
 assert.ok(shimmerAnimation.includes('vertexEventShimmer'));
 await releaseEvents();
 await shimmerPage.waitForSelector('.event-card');
 await shimmerPage.waitForFunction(()=>!document.querySelector('.events-loading-skeleton'));
 assert.equal(await shimmerPage.locator('.events-skeleton-card').count(),0);
 assert.equal(await shimmerPage.locator('.event-card').count(),5);
 await shimmerPage.close();
 for(const lang of ['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az']){
 const page=await browser.newPage();await page.route('**/*cloudfunctions.net/**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{events}}}));await page.goto(`${baseURL}/${lang}/`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.event-card');assert.equal(await page.locator('html').getAttribute('lang'),lang);await page.close();}
 // Eventsite-only navigation and tap tests across mobile, tablet, desktop, TV widths.
 const deviceMatrix=[320,375,390,768,1024,1280,1920,2560,3840];
 for(const width of deviceMatrix){
   const responsive=await browser.newPage({viewport:{width,height:900}});
   await responsive.emulateMedia({reducedMotion:'reduce'});
   await responsive.route('**/*cloudfunctions.net/**',route=>route.fulfill({
     headers:{'access-control-allow-origin':'*'},json:{result:{events}}
   }));
   await responsive.goto(baseURL+'/tr/',{waitUntil:'domcontentloaded'});
   await responsive.waitForSelector('.event-card');
   const overflow=await responsive.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   assert.equal(overflow,false,'horizontal overflow at '+width+'px');
   const mobile=width<=1100;
   assert.equal(await responsive.locator('.mobile-menu-btn').isVisible(),mobile,'menu breakpoint '+width);
   const tapColor=await responsive.locator('.mobile-menu-btn').evaluate(el=>getComputedStyle(el).webkitTapHighlightColor);
   assert.match(tapColor,/(transparent|,\s*0\))$/,'native tap flash at '+width);
   if(mobile){
     await responsive.locator('.mobile-menu-btn').click();
     assert.equal(await responsive.locator('.mobile-menu-btn').getAttribute('aria-expanded'),'true');
     const drawer=await responsive.locator('.mobile-menu').evaluate(el=>{
       const box=el.getBoundingClientRect();
       return {
         top:box.top,left:box.left,width:box.width,
         headerBottom:document.querySelector('.header').getBoundingClientRect().bottom,
         surface:getComputedStyle(el).backgroundColor,
         clip:getComputedStyle(el).clipPath
       };
     });
     assert.ok(Math.abs(drawer.top-drawer.headerBottom)<8,'drawer/header alignment at '+width);
     assert.ok(Math.abs(drawer.left)<2 && Math.abs(drawer.width-width)<2,'full-width mobile menu at '+width);
     const grid=await responsive.locator('.mobile-menu').evaluate(el=>getComputedStyle(el).gridTemplateRows);
     assert.ok(parseFloat(grid)>0,'grid expanded downward at '+width);
     assert.equal(await responsive.locator('.mobile-lang-selector').count(),0,'languages outside the menu');
     assert.equal(await responsive.locator('.header .logo-events').isVisible(),true,'script title at '+width);
     if(width<=520)assert.equal(await responsive.locator('.header .logo-vertex-word').isVisible(),false,'icon-first title at '+width);
     const alpha=drawer.surface.match(/,\s*(0(?:\.\d+)?|1)\)$/);
     assert.ok(alpha && Number(alpha[1])<1,'translucent menu at '+width);
     const footerLogo=await responsive.locator('.footer-brand>div:first-child').evaluate(el=>({
       center:(el.getBoundingClientRect().left+el.getBoundingClientRect().right)/2,
       parent:(el.parentElement.getBoundingClientRect().left+el.parentElement.getBoundingClientRect().right)/2
     }));
     if(width<=768)assert.ok(Math.abs(footerLogo.center-footerLogo.parent)<2,'centered footer logo at '+width);
     await responsive.locator('.mobile-nav-links a[href="#about"]').click();
     assert.equal(await responsive.locator('.mobile-menu-btn').getAttribute('aria-expanded'),'false');
   }else await responsive.locator('.nav-links a[href="#about"]').click();
   await responsive.waitForFunction(()=>{
     const title=document.querySelector('#about .section-title');
     const header=document.querySelector('.header');
     return Math.abs(title.getBoundingClientRect().top-header.getBoundingClientRect().bottom-20)<17;
   },null,{timeout:4500});
   if(mobile){
     await responsive.locator('.mobile-menu-btn').click();
     await responsive.locator('.mobile-nav-links a[href="#events-section"]').click();
   }else await responsive.locator('.nav-links a[href="#events-section"]').click();
   await responsive.waitForFunction(()=>{
     const title=document.querySelector('#events-section .section-title');
     const header=document.querySelector('.header');
     return Math.abs(title.getBoundingClientRect().top-header.getBoundingClientRect().bottom-20)<17;
   },null,{timeout:4500});
   const after=await responsive.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   assert.equal(after,false,'overflow after navigation at '+width);
   await responsive.close();
 }
 const page=await browser.newPage();await page.route('**/*cloudfunctions.net/**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{valid:false}}}));await page.goto(`${baseURL}/validate.html?id=FAKE`);await page.waitForFunction(()=>document.querySelector('#result-box').textContent.includes('DOĞRULANAMADI'));await page.close();
 fs.writeFileSync('/tmp/vertex-events-browser-report.json',JSON.stringify({matrix:report,languages:16,invalidTicketRejected:true},null,2));console.log('PASS: responsive/theme cases; 9 viewport navigation checks; 16 languages; QR and ticket tests');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
