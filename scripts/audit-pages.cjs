const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const lang=process.argv[2];
const paths=lang==='root'?['/','/validate.html']:fs.readdirSync(lang).filter(x=>x.endsWith('.html')).map(x=>'/'+lang+'/'+(x==='index.html'?'':x));
fs.mkdirSync('audit-results',{recursive:true});let failed=false;
for(const urlPath of paths)for(const device of ['mobile','desktop']){
 const name=(urlPath.replaceAll('/','_')||'root')+'-'+device;const out=path.resolve('audit-results',name+'.json');
 const args=['lighthouse','https://events.vertexishere.com'+urlPath,'--output=json','--output-path='+out,'--only-categories=performance,accessibility,best-practices,seo','--chrome-flags=--headless --no-sandbox','--quiet'];
 if(device==='desktop')args.push('--preset=desktop');
 const result=spawnSync('npx',args,{encoding:'utf8',timeout:120000});
 if(result.status!==0){console.log('AUDIT_ERROR',urlPath,device,result.stderr);failed=true;continue;}
 const report=JSON.parse(fs.readFileSync(out));const scores=Object.fromEntries(Object.entries(report.categories).map(([k,v])=>[k,Math.round(v.score*100)]));
 console.log('AUDIT_RESULT',JSON.stringify({url:report.finalDisplayedUrl,device,scores}));
 if(Object.values(scores).some(s=>s<100))failed=true;
}
process.exitCode=failed?1:0;
