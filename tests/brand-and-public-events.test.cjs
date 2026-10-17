const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../css/main.css'),'utf8');
const events=fs.readFileSync(path.join(__dirname,'../js/events.js'),'utf8');
test('eventsite uses vertexite palette and three brand typefaces',()=>{
  assert.match(css,/--text-main:\s*#e1dede/);
  assert.match(css,/--text-muted:\s*#bebec4/);
  assert.match(css,/--font-main:\s*'Ubuntu'/);
  assert.match(css,/--font-heading:\s*'Anton'/);
  assert.match(css,/--font-sub:\s*'Poppins'/);
  assert.doesNotMatch(css,/--bg-color:#0f0f10/);
  assert.match(css,/\.btn-primary:hover:not\(:disabled\)\{background:var\(--primary-hover\)/);
});
test('published events are the sole live source and failures cannot fabricate events',()=>{
  assert.match(events,/api\('getPublishedEvents'\)/);
  assert.match(events,/Array\.isArray\(result\?\.events\)/);
  assert.match(events,/eventsGrid\.dataset\.state = 'error'/);
  assert.match(events,/eventsGrid\.replaceChildren\(notice\)/);
  assert.doesNotMatch(events,/import\s+.*legacy-events|require\(['"].*legacy-events/);
  assert.match(events,/api\('registerForEvent'/);
});
test('footer links use main-site muted/bright theme colors and preserve custom event brand',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../css/main.css'),'utf8');
 assert.match(css,/--footer-link-muted:\s*#858585/);
 assert.match(css,/--footer-link-bright:\s*#f5f5f5/i);
 assert.match(css,/--footer-link-muted:\s*#707782/);
 assert.match(css,/--footer-link-bright:\s*#17191d/i);
 assert.match(css,/\.footer-expanded \.footer-col \.footer-links a:is\(:hover,:focus-visible\)/);
 assert.match(css,/transition: color 240ms cubic-bezier\(\.2,\.8,\.2,1\) 45ms/);
 for(const lang of ['tr','en','zh']){
   const html=fs.readFileSync(path.join(__dirname,'..',lang,'index.html'),'utf8');
   assert.match(html,/<span class="logo-events"/);
   assert.match(html,/data-i18n="hero-desc"/);
 }
});
