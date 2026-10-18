const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const languages=['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az'];
const iconTag=(html,mode)=>html.match(new RegExp('<link id="vertex-favicon-'+mode+'"[^>]*>'))?.[0]||'';
test('the eventsite icons exactly match the transparent Vertex brand SVGs',()=>{
  for(const mode of ['dark','light']){
    const svg=read('assets/favicon-'+mode+'.svg');
    assert.match(svg,/<svg[^>]*viewBox="0 0 225 225"/);
    assert.doesNotMatch(svg,/<rect|<image|background(-color)?:/i);
    assert.match(svg,new RegExp('stroke="'+(mode==='dark'?'white':'black')+'"'));
  }
});
test('all landing pages, validation, and root use local color-scheme SVG favicons',()=>{
  for(const file of ['index.html','validate.html','index_template.html',...languages.map(x=>x+'/index.html')]){
    const html=read(file);
    for(const mode of ['dark','light']){
      const tag=iconTag(html,mode);
      assert.ok(tag,file+' missing '+mode);
      assert.match(tag,/type="image\/svg\+xml"/);
      assert.match(tag,new RegExp('favicon-'+mode+'\\.svg\\?v=20261017-vertex'));
      assert.match(tag,new RegExp('media="\\(prefers-color-scheme: '+mode+'\\)"'));
    }
    assert.match(html,/js\/favicon\.js\?v=20261017-vertex/);
    assert.doesNotMatch(html,/<link[^>]+rel="icon"[^>]+favicon\.webp/);
  }
});
test('favicon controller observes selected theme and browser theme changes',()=>{
  const script=read('js/favicon.js');
  assert.doesNotThrow(()=>new Function(script));
  assert.match(script,/MutationObserver/);
  assert.match(script,/attributeFilter: \['data-theme'\]/);
  assert.match(script,/browserTheme\.addEventListener\('change'/);
  assert.match(script,/localStorage\.getItem\('theme'\)/);
});
test('production Vite bundle retains the static favicon URLs',()=>{
  const config=read('vite.config.js');
  assert.match(config,/favicon-dark\.svg/);
  assert.match(config,/favicon-light\.svg/);
  assert.match(config,/dist\/assets/);
  assert.match(config,/dist\\/js\\/favicon\\.js/);
  assert.match(config,/fs\\.copyFileSync\\(controllerSrc, controllerDest\\)/);
});
