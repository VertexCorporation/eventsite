const {chromium}=require('playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const legacy=require('../js/legacy-events');
const baseURL=process.env.EVENTSITE_TEST_URL||'http://127.0.0.1:3000';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 const report=[];
 const events=legacy.map(e=>({...e,timeZone:'Europe/Istanbul',status:'published',salesStatus:'open',capacity:null}));
 events.push({id:'test_free',title:'Test free',title_en:'Test free',desc:'Test description',date:'2099-01-01',location:'Istanbul',price:0,status:'published',salesStatus:'open',timeZone:'Europe/Istanbul',images:[],capacity:2});
 for(const width of [390,768,1440])for(const theme of ['dark','light']){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(theme=>{localStorage.setItem('vtx_theme',theme);localStorage.setItem('theme',theme);},theme);
 await page.route('**/*cloudfunctions.net/**',async route=>{const name=route.request().url().split('/').pop();await route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:name==='getPublishedEvents'?{events}:name==='registerForEvent'?{registrationId:'a'.repeat(48)}:{valid:false}}});});
 await page.goto(`${baseURL}/tr/`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.event-card');
 await page.evaluate(theme=>document.documentElement.setAttribute('data-theme',theme),theme);
 assert.equal(await page.locator('.event-card').count(),5);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>!document.querySelector('.header').classList.contains('scrolled'));
 const headerTop=await page.locator('.header').evaluate(el=>getComputedStyle(el).backgroundColor);
 assert.equal(headerTop,'rgba(0, 0, 0, 0)');
 await page.evaluate(()=>window.scrollTo({top:500,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('.header').classList.contains('scrolled'));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.header')).backgroundColor !== 'rgba(0, 0, 0, 0)');
 assert.equal(await page.locator('.hero-video').count(),2);
 await page.evaluate(()=>document.getElementById('hero-video-player-1').dispatchEvent(new Event('ended')));
 assert.equal(await page.locator('.hero-video.active').count(),1);

 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`overflow ${width}/${theme}`);
 assert.equal(await page.locator('input[id^="card-"]').count(),0);
 await page.locator('.view-details-btn[data-id="test_free"]').click();
 await page.click('#modal-register-btn');
 await page.fill('#reg-name','Test User');await page.fill('#reg-email','test@example.invalid');await page.click('#submit-reg-btn');
 await page.waitForFunction(()=>document.querySelector('#register-flow-success').style.display==='block');
 assert.equal(await page.locator('#ticket-qr-code canvas').count(),1);
 await page.click('#close-success-btn');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>!document.querySelector('.header').classList.contains('scrolled'));
 await page.screenshot({path:`/tmp/vertex-events-${width}-${theme}.png`,fullPage:true});
 assert.deepEqual(errors,[]);
 report.push({width,theme,cards:5,overflow,qr:true,errors});await page.close();
 }
 for(const lang of ['tr','en','de','fr','es','it','pt','nl','id','ru','ja','ko','zh','hi','ar','az']){
 const page=await browser.newPage();await page.route('**/*cloudfunctions.net/**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{events}}}));await page.goto(`${baseURL}/${lang}/`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.event-card');assert.equal(await page.locator('html').getAttribute('lang'),lang);await page.close();}
 const page=await browser.newPage();await page.route('**/*cloudfunctions.net/**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{result:{valid:false}}}));await page.goto(`${baseURL}/validate.html?id=FAKE`);await page.waitForFunction(()=>document.querySelector('#result-box').textContent.includes('DOĞRULANAMADI'));await page.close();
 fs.writeFileSync('/tmp/vertex-events-browser-report.json',JSON.stringify({matrix:report,languages:16,invalidTicketRejected:true},null,2));console.log('PASS: 6 responsive/theme cases; 16 languages; real QR; invalid ticket rejected');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
