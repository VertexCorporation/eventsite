'use strict';
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
 let file=path.join(root,pathname);if(pathname.endsWith('/'))file=path.join(file,'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(error,data)=>{
  if(error){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');
  res.end(data);
 });
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage({viewport:{width:390,height:850}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const event={id:'static_free',title:'Statik Sunum Testi',title_en:'Static Hosting Test',desc:'Fixture',date:'2099-01-01',location:'Istanbul',price:0,status:'published',salesStatus:'open',timeZone:'Europe/Istanbul',capacity:5,images:[]};
  await page.route('**/cloudfunctions.net/**',route=>route.abort());
  await page.route('https://europe-west1-vertex-ai-1618.cloudfunctions.net/**',route=>route.fulfill({
   headers:{'Access-Control-Allow-Origin':'*'},json:{result:route.request().url().endsWith('/getPublishedEvents')?{events:[event]}:{registrationId:'a'.repeat(48)}}
  }));
  await page.goto('http://127.0.0.1:'+server.address().port+'/tr/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.event-card');
  assert.equal(await page.locator('.event-card').count(),1);
  await page.locator('.view-details-btn[data-id="static_free"]').click();
  await page.locator('#modal-register-btn').click();
  await page.locator('#reg-name').fill('Static Fixture');
  await page.locator('#reg-email').fill('fixture@example.invalid');
  await page.locator('#submit-reg-btn').click();
  await page.waitForSelector('#ticket-qr-code canvas');
  assert.deepEqual(errors,[]);
  console.log('Static hosting: published events and local ticket QR render without a bundler or module CDN.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
