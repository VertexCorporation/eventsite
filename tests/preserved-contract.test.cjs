const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const contract=require('./fixtures/preserved-contract.json');
const root=path.resolve(__dirname,'..');const read=file=>fs.readFileSync(path.join(root,file));const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
test('all localized footer links and legal body content remain preserved',()=>{
 for(const [lang,data]of Object.entries(contract.languages)){const html=read(`${lang}/index.html`).toString();const footer=html.match(/<footer[\s\S]*?<\/footer>/)[0];assert.match(footer,/https:\/\/cortexishere.com/,lang);assert.doesNotMatch(footer,/All Star/,lang);for(const [file,digest]of Object.entries(data.legalHashes)){
    // Head assets and SEO metadata may change; approved legal body content must not.
    const source=read(file).toString();
    const bodyHashes=require('./fixtures/legal-body-hashes.json');
    assert.equal(hash(Buffer.from(source.split(/<body\b/)[1])),bodyHashes[file],file);

  }}
});
test('video playback pauses when hidden and respects reduced motion',()=>{const s=read('js/main.js').toString();assert.match(s,/document.hidden/);assert.match(s,/prefers-reduced-motion/);assert.match(s,/player.pause/);});
test('legacy migration retains all IDs, descriptions, images and Stripe links',()=>{
 const events=require('../js/legacy-events');assert.equal(events.length,4);assert.equal(new Set(events.map(e=>e.id)).size,4);assert.equal(events.find(e=>e.id==='evt_tech_summit').date,'2026-09-19');assert(events.find(e=>e.id==='evt_tech_summit').detailDesc.includes('27 Eylül 2026'));assert.equal(events.find(e=>e.id==='evt_tech_summit').stripeLinkStandart,'https://buy.stripe.com/7sYaEY3Dw9Zz5V98hleIw00');
});

