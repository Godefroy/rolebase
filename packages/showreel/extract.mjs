import fs from 'fs';
const W=new URL('../../website',import.meta.url).pathname;
const grab=f=>[...fs.readFileSync(f,'utf8').matchAll(/<path d="([^"]+)"(?:[^>]*?fill="([^"]*)")?/g)].map(m=>({d:m[1],fill:m[2]||'none'}));
const icon=grab(W+'/public/favicon.svg');
const lock=grab(W+'/src/assets/icons/rolebase-logo.svg');
fs.writeFileSync(new URL('data.js',import.meta.url),'const ICON='+JSON.stringify(icon)+';\nconst LOCK='+JSON.stringify(lock)+';\n');
console.log(icon.length,lock.length, icon.map(p=>p.fill).join(','));
