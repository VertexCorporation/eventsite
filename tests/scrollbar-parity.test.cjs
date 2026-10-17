const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('page and panel scrollbar styling matches vertexite thin theme-aware pattern',()=>{
  const css=read('css/main.css');
  assert.match(css,/@property --scrollbar-alpha\s*\{\s*syntax:\s*'<number>';/);
  assert.match(css,/html\[data-theme="dark"\]\s*\{\s*--scroll-rgb:\s*255 255 255;/);
  assert.match(css,/:root\s*\{\s*--scroll-rgb:\s*0 0 0;/);
  assert.match(css,/\.header \.lang-menu, \.event-theme-menu\s*\{\s*--scrollbar-alpha:\s*0;/);
  assert.match(css,/scrollbar-width:\s*thin;/);
  assert.match(css,/scrollbar-color:\s*rgb\(var\(--scroll-rgb\) \/ var\(--scrollbar-alpha, 0\)\) transparent;/);
  assert.match(css,/::-webkit-scrollbar\s*\{\s*width:\s*5px;\s*height:\s*4px;/);
  assert.match(css,/::-webkit-scrollbar-thumb\s*\{\s*background:\s*rgb\(var\(--scroll-rgb\) \/ var\(--scrollbar-alpha, 0\)\);/);
  assert.doesNotMatch(css,/\.lang-menu::-webkit-scrollbar-thumb:hover/);
  assert.doesNotMatch(css,/scrollbar-color:\s*rgba\(255,\s*255,\s*255,\s*0\.2\)/);
});
test('scroll thumb fades per scroller on user activity without disrupting theme panels',()=>{
  const script=read('js/header-panels.js');
  assert.doesNotThrow(()=>new Function(script));
  assert.match(script,/const scrollStates = new WeakMap\(\);/);
  assert.match(script,/function fadeScrollbar\(el, target, duration\)/);
  assert.match(script,/document\.addEventListener\('scroll', function \(event\)/);
  assert.match(script,/\{capture: true, passive: true\}/);
  assert.match(script,/document\.scrollingElement \|\| document\.documentElement/);
  assert.match(script,/fadeScrollbar\(el, 1, 120\)/);
  assert.match(script,/fadeScrollbar\(el, 0, 320\), 700/);
  assert.match(script,/if \(reduced\.matches\)/);
  assert.match(script,/window\.cancelAnimationFrame\(state\.frame\)/);
  assert.match(script,/function openLanguage\(\)/);
  assert.match(script,/function openTheme\(\)/);
});
test('scrollbar controller is included by all 16 localized pages',()=>{
  const locales=['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az'];
  for(const locale of locales){
    assert.match(read(locale+'/index.html'),/type="module" src="\.\.\/js\/header-panels\.js"/,locale);
  }
});
