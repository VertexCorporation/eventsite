'use strict';
// Commit the deterministic browser module because the production site serves
// source files directly. No runtime CDN or package resolver is required.
const fs=require('node:fs'),path=require('node:path');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');
const out=esbuild.buildSync({
 entryPoints:[require.resolve('qrcode/lib/browser.js')],bundle:true,write:false,
 platform:'browser',format:'esm',target:'es2018',minify:true,metafile:true,
 banner:{js:'// Local QR renderer. Regenerate with npm run build:qr. Licenses: qrcode.LICENSE.txt'},
 legalComments:'eof'
});
fs.mkdirSync(path.join(root,'js/vendor'),{recursive:true});
fs.writeFileSync(path.join(root,'js/vendor/qrcode.js'),out.outputFiles[0].contents);
const packages=[...new Set(Object.keys(out.metafile.inputs).map(file=>
 file.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1]).filter(Boolean))].sort();
const licenses=packages.map(name=>{
 const dir=path.join(root,'node_modules',name);
 const metadata=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));
 const license=['LICENSE','license','LICENSE.md','LICENSE.txt'].find(f=>fs.existsSync(path.join(dir,f)));
 if(!license)throw Error('Missing license for '+name);
 return name+' '+metadata.version+'\n'+fs.readFileSync(path.join(dir,license),'utf8');
});
fs.writeFileSync(path.join(root,'js/vendor/qrcode.LICENSE.txt'),licenses.join('\n\n---\n\n')+'\n');
console.log('Built local QR module from '+packages.join(', '));
