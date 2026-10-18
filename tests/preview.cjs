'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.EVENTSITE_TEST_URL||'http://127.0.0.1:3000';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let eventCalls=0,registerCalls=0;
  await page.route('**/*cloudfunctions.net/**',route=>{
    const url=route.request().url();
    if(url.includes('getPublishedEvents'))eventCalls++;
    if(url.includes('registerForEvent'))registerCalls++;
    return route.fulfill({headers:{'access-control-allow-origin':'*'},
      json:{result:{events:[]}}});
  });
  await page.goto(base+'/tr/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#events-grid[data-state="ready"]');
  const before=eventCalls;
  await page.evaluate(()=>{
   window.__previewMessages=[];
   const draft={
    id:'draft_preview_test',date:'2099-06-10',title:'Unpublished draft preview',
    title_en:'Unpublished draft preview',desc:'Only in the preview',location:'Online',
    detailDesc:'Private details',speakers:[{name:'Example Speaker',role:'Presenter'}],
    ticketCategories:[{name:'Free ticket',price:0}],status:'draft',
    salesStatus:'open',timeZone:'Europe/Istanbul'
   };
   const frame=document.createElement('iframe');frame.id='preview-test';
   frame.referrerPolicy='origin';
   frame.src='/tr/?vertexPreview=1';
   window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow || event.origin!==location.origin)return;
    window.__previewMessages.push(event.data.type);
    if(event.data.type==='vertex:event-preview:ready')
      frame.contentWindow.postMessage({type:'vertex:event-preview:render',version:1,event:draft},location.origin);
   });
   document.body.append(frame);
  });
  const iframe=page.frameLocator('#preview-test');
  await page.waitForFunction(()=>window.__previewMessages.includes('vertex:event-preview:rendered'));
  assert.equal(await iframe.locator('.event-card').count(),1);
  assert.equal(await iframe.locator('#modal-detail-heading').innerText(),'Unpublished draft preview');
  assert.equal(await iframe.locator('.event-preview-watermark').count(),1);
  assert.equal(await iframe.locator('#modal-register-btn').count(),0);
  assert.equal(await iframe.locator('.register-btn:visible').count(),0);
  assert.equal(eventCalls,before,'Preview must not request published event data');
  assert.equal(registerCalls,0,'Preview must not register participants');
  assert.deepEqual(errors,[]);
  await page.close();
  console.log('PASS: real renderer, private draft, no publication, no registration');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
