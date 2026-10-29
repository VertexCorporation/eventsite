const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const langs=['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az'];

test('eventsite suppresses native mobile tap splash without hiding keyboard focus',()=>{
 const css=read('css/main.css');
 assert.match(css,/-webkit-tap-highlight-color:transparent/);
 assert.match(css,/touch-action:manipulation/);
 assert.match(css,/:focus-visible\s*\{\s*outline:2px solid var\(--primary\)/);
 assert.match(css,/@media\(hover:none\)/);
});
test('header-aware anchor navigation uses the compact header and visible headings',()=>{
 const js=read('js/main.js');
 assert.doesNotThrow(()=>new Function(js));
 assert.doesNotMatch(js,/scrollIntoView\(/);
 assert.match(js,/--nav-h-shrunk/);
 assert.match(js,/\.purpose-section-header h2, \.section-title, h2/);
 assert.match(js,/function targetScrollTop\(target\)/);
 assert.match(js,/window\.requestAnimationFrame\(\(\) => window\.requestAnimationFrame\(run\)\)/);
 assert.match(js,/navigateTo\(hash, true\)/);
 assert.match(js,/window\.addEventListener\('popstate'/);
 assert.match(js,/event\.preventDefault\(\)/);
});
test('mobile menu is exclusive, keyboard-accessible, scrollable and tablet-safe',()=>{
 const js=read('js/main.js'),css=read('css/main.css');
 assert.match(js,/mobileMenuBtn\.setAttribute\('aria-expanded', String\(open\)\)/);
 assert.match(js,/mobileMenu\.inert = !open/);
 assert.match(js,/event\.key === 'Escape'/);
 assert.match(js,/window\.innerWidth > 1100/);
 assert.match(css,/@media\(max-width:1100px\)/);
 assert.match(css,/\.header\.scrolled \+ \.mobile-menu\{\s*--mobile-header-bottom:var\(--nav-h-shrunk\)/);
 assert.match(css,/overscroll-behavior:contain/);
 assert.match(css,/100dvh - var\(--mobile-header-bottom\)/);
 assert.match(css,/env\(safe-area-inset-bottom,0px\)/);
 assert.match(css,/\.mobile-nav-links>a\{/);
});
test('320px phones, tablets, landscape and 4K layouts have explicit responsive rules',()=>{
 const css=read('css/main.css');
 for(const breakpoint of ['1100px','768px','520px','359px','1800px'])
  assert.ok(css.includes(breakpoint),breakpoint);
 assert.match(css,/@media\(orientation:landscape\) and \(max-height:520px\)/);
 assert.match(css,/min-height:100svh/);
 assert.match(css,/--container-width:clamp\(1200px,72vw,1800px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('all 16 localized eventsite pages keep the same valid section anchors',()=>{
 for(const lang of langs){
  const html=read(lang+'/index.html');
  for(const id of ['home','about','events-section']){
   assert.match(html,new RegExp('id="'+id+'"'),lang+' '+id);
   assert.match(html,new RegExp('href="#'+id+'"'),lang+' '+id);
  }
  assert.match(html,/src="\.\.\/js\/main\.js(?:\?v=[^"]+)?"/,lang);
 }
});

test('mobile panel reveals downwards, preserves translucent hero and localized script titles',()=>{
 const css=read('css/main.css'),template=read('index_template.html');
 assert.match(css,/grid-template-rows:0fr/);
 assert.match(css,/grid-template-rows:1fr/);
 assert.match(css,/background:rgba\(10,10,10,\.18\)/);
 assert.doesNotMatch(css,/translateX\(-103%\)|transition:left|clip-path:inset\(0 0 100% 0\)/);
 assert.match(css,/\.header\.scrolled \+ \.mobile-menu/);
 assert.doesNotMatch(css,/translateX\(-103%\)/);
 assert.match(css,/\.header \.logo-vertex-word\{display:none\}/);
 assert.match(css,/\.header \.logo-events\{display:block!important/);
 for(const lang of langs){
  const html=read(lang+'/index.html');
  assert.doesNotMatch(html,/mobile-lang-selector|mobile-lang-item/,lang);
  assert.match(html,/<span class="logo-vertex-word">Vertex<\/span>/,lang);
  assert.match(html,/class="logo-events" data-i18n="header-events-italic"/,lang);
  assert.match(html,/id="language-dropdown"/,lang);
 }
 assert.doesNotMatch(template,/mobile-lang-selector|mobile-lang-item/);
});

test('footer brand is actually centered on small screens, independently from other columns',()=>{
 const css=read('css/main.css');
 assert.match(css,/\.footer-expanded \.footer-brand>div:first-child\{/);
 assert.match(css,/justify-content:center/);
 assert.match(css,/\.footer-expanded \.footer-brand p\{/);
 assert.match(css,/text-align:center/);
 for(const lang of langs)assert.match(read(lang+'/index.html'),/class="foot-brand"/,lang);
});

