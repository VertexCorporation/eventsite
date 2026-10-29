// Keep inline render-critical styles generated from the shared source of truth.
const fs=require('node:fs'),path=require('node:path'),{transformSync}=require('esbuild');
const root=path.resolve(__dirname,'..');
const css=transformSync(fs.readFileSync(path.join(root,'css/main.css'),'utf8'),{loader:'css',minify:true}).code.replaceAll('../assets/','/assets/');
const fonts=fs.readFileSync(path.join(root,'assets/fonts/brand.css'),'utf8');
const pages=['validate.html',...fs.readdirSync(root).filter(x=>/^[a-z]{2}$/.test(x)).flatMap(l=>fs.readdirSync(path.join(root,l)).filter(f=>f.endsWith('.html')).map(f=>l+'/'+f))];
for(const name of pages){const file=path.join(root,name);let html=fs.readFileSync(file,'utf8');html=html.replace(/<style data-vertex-styles>[\s\S]*?<\/style>/,()=>'<style data-vertex-styles>'+css+'</style>').replace(/<style data-vertex-fonts>[\s\S]*?<\/style>/,()=>'<style data-vertex-fonts>'+fonts+'</style>');fs.writeFileSync(file,html);}
