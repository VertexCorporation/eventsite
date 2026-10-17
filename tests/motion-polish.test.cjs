const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const locales=['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az'];

test('all 16 localized pages render three accessible placeholder event cards immediately',()=>{
 for(const lang of locales){
   const page=read(lang+'/index.html');
   assert.match(page,/<div class="grid-1" id="events-grid" data-state="loading">/,lang);
   assert.equal((page.match(/class="events-skeleton-card"/g)||[]).length,3,lang);
   assert.match(page,/class="events-loading-label" data-i18n="events-loading"/,lang);
   assert.match(page,/class="events-skeleton-list" aria-hidden="true"/,lang);
 }
 const template=read('index_template.html');
 assert.equal((template.match(/class="events-skeleton-card"/g)||[]).length,3);
});
test('event cards crossfade from real loading state and refresh silently',()=>{
 const script=read('js/events.js');
 assert.match(script,/const revealLoadedEvents = skeleton =>/);
 assert.match(script,/eventsGrid\.classList\.add\('events-visible'\)/);
 assert.match(script,/eventsGrid\.classList\.add\('events-direct-reveal'\)/);
 assert.match(script,/const skeleton = reveal \? eventsGrid\.querySelector\('\.events-loading-skeleton'\) : null/);
 assert.match(script,/const firstReveal = eventsGrid\.dataset\.state !== 'ready'/);
 assert.match(script,/if \(eventsGrid\.dataset\.state === 'ready'\) renderEvents\(\)/);
 assert.doesNotMatch(script,/const init = \(\) => \{\s*loadEvents\(\);\s*renderEvents\(\);/);
 const css=read('css/main.css');
 assert.match(css,/@keyframes vertexEventShimmer/);
 assert.match(css,/#events-grid\.events-transitioning\.events-visible>/);
 assert.match(css,/@media\(max-width:768px\)\{\s*\.events-skeleton-card/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('theme icon swaps with a fade and logos use overlapping white/black layers',()=>{
 const script=read('js/header-panels.js');
 assert.match(script,/let symbolTimer=0,shownSymbol='system',symbolInitialized=false/);
 assert.match(script,/themeIcon\.classList\.add\('is-swapping'\)/);
 assert.match(script,/window\.setTimeout\(\(\)=>\{/);
 assert.match(script,/themeBtn\.replaceChildren\(themeIcon\)/);
 assert.match(script,/function prepareBrandLogos\(\)/);
 assert.match(script,/image\.replaceWith\(holder\)/);
 assert.match(script,/holder\.append\(image,other\)/);
 assert.match(script,/classList\.add\('brand-logo-dark'\)/);
 assert.match(script,/classList\.add\('brand-logo-light'\)/);
 const css=read('css/main.css');
 assert.match(css,/\.brand-logo-crossfade>\.brand-logo-dark\{opacity:1/);
 assert.match(css,/\[data-theme="light"\] \.brand-logo-crossfade>\.brand-logo-light\{opacity:1/);
 assert.match(css,/\.theme-button-icon\.is-swapping/);
 assert.doesNotThrow(()=>new Function(script));
});
test('all language labels use the visitor-selected locale instead of native language names',()=>{
 const script=read('js/header-panels.js');
 assert.match(script,/new Intl\.DisplayNames\(\[lang\],\{type:'language'\}\)/);
 assert.match(script,/link\.textContent=localizedName\(link\.dataset\.lang\)/);
 for(const locale of locales){
   const labels=new Intl.DisplayNames([locale],{type:'language'});
   assert.ok(labels.of('en')&&labels.of('de')&&labels.of('tr'),locale);
 }
 assert.equal(new Intl.DisplayNames(['tr'],{type:'language'}).of('en'),'İngilizce');
 assert.equal(new Intl.DisplayNames(['en'],{type:'language'}).of('de'),'German');
});
