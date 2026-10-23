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
test('favicon controller follows browser changes independently of the selected page theme',()=>{
  const vm=require('node:vm');
  const script=read('js/favicon.js');
  for(const legacy of [false,true]) for(const selected of ['light','dark','system']){
    const icons={'vertex-favicon-dark':{},'vertex-favicon-light':{}};
    const listeners=[];
    let pageTheme=selected;
    const browserTheme={matches:false};
    browserTheme[legacy?'addListener':'addEventListener']=(...args)=>listeners.push(args.at(-1));
    vm.runInNewContext(script,{
      window:{matchMedia:()=>browserTheme},
      document:{getElementById:id=>icons[id],documentElement:{
        getAttribute:()=>pageTheme,setAttribute:(_,value)=>{pageTheme=value;}
      }},
      localStorage:{getItem:()=>selected}
    });
    const check=dark=>{
      assert.equal(icons['vertex-favicon-dark'].media,dark?'all':'not all');
      assert.equal(icons['vertex-favicon-light'].media,dark?'not all':'all');
    };
    check(false);
    browserTheme.matches=true;listeners.forEach(fn=>fn());check(true);
    browserTheme.matches=false;listeners.forEach(fn=>fn());check(false);
  }
});
test('production Vite bundle retains the static favicon URLs',()=>{
  const config=read('vite.config.js');
  assert.match(config,/favicon-dark\.svg/);
  assert.match(config,/favicon-light\.svg/);
  assert.match(config,/dist\/assets/);
  assert.ok(config.includes('dist/js/favicon.js'));
  assert.ok(config.includes('fs.copyFileSync(controllerSrc, controllerDest)'));
});
