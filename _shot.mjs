import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(13000);
const fs = await import('fs');
const box = await (await p.$('canvas')).boundingBox();
const cyp = box.y + box.height*0.45;
await p.mouse.move(box.x + box.width*0.5, cyp);
await p.mouse.down();
await p.mouse.move(box.x + box.width*0.5 + 470, cyp, { steps: 40 }); // ~180-200deg
await p.mouse.up();
await p.waitForTimeout(1800);
const d = await p.evaluate(() => {
  const c=document.querySelector('canvas'); const W=c.width,H=c.height;
  const fw=0.5, fh=0.55, cx=0.5, cy=0.55;
  const sw=Math.round(W*fw), sh=Math.round(H*fh);
  const sx=Math.round(W*cx-sw/2), sy=Math.round(H*cy-sh/2);
  const o=document.createElement('canvas'); o.width=sw*2; o.height=sh*2;
  const x=o.getContext('2d'); x.imageSmoothingEnabled=false;
  x.drawImage(c,sx,sy,sw,sh,0,0,o.width,o.height); return o.toDataURL('image/png');
});
fs.writeFileSync('/tmp/m_back.png', Buffer.from(d.split(',')[1],'base64'));
await b.close(); console.log('DONE_OK');
