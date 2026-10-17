const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const contract=require('./fixtures/preserved-contract.json');
const root=path.resolve(__dirname,'..');const read=file=>fs.readFileSync(path.join(root,file));const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
test('all 16 footer link contracts and legal content (except favicon metadata) remain preserved',()=>{
 for(const [lang,data]of Object.entries(contract.languages)){const html=read(`${lang}/index.html`).toString();const footer=html.match(/<footer[\s\S]*?<\/footer>/)[0];assert.deepEqual([...footer.matchAll(/href="([^"]*)"/g)].map(m=>m[1]),data.footerLinks,lang);for(const [file,digest]of Object.entries(data.legalHashes)){
    // Only the favicon head metadata is allowed to differ from the approved legal files.
    const source=read(file).toString();
    const faviconBlock=/<!-- Vertex brand favicon: transparent SVGs, matching vertexite -->\n  <link id="vertex-favicon-dark"[^\n]*\n  <link id="vertex-favicon-light"[^\n]*\n  <script src="[^"]+" defer><\/script>/;
    assert.match(source,faviconBlock,file);
    const withoutNewIcon=source.replace(faviconBlock,'<link rel="icon" type="image/png" href="https://www.vertexishere.com/assets/favicon.webp">');
    assert.equal(hash(Buffer.from(withoutNewIcon)),digest,file);
  }}
});
test('video crossfade and scroll/navigation controller remain byte-identical',()=>assert.equal(hash(read('js/main.js')),contract.videoControllerHash));
test('legacy migration retains all IDs, descriptions, images and Stripe links',()=>{
 const events=require('../js/legacy-events');assert.equal(events.length,4);assert.equal(new Set(events.map(e=>e.id)).size,4);assert.equal(events.find(e=>e.id==='evt_tech_summit').date,'2026-09-19');assert(events.find(e=>e.id==='evt_tech_summit').detailDesc.includes('27 Eylül 2026'));assert.equal(events.find(e=>e.id==='evt_tech_summit').stripeLinkStandart,'https://buy.stripe.com/7sYaEY3Dw9Zz5V98hleIw00');
});
