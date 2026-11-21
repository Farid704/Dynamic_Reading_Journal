const C='drj-v2',A=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('drj-v')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))))});

async function remind(){const c=await caches.open('drj-meta'),r=await c.match('meta');if(!r)return;const m=await r.json();if(!m.on)return;const d=new Date(),k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');if(hm>=m.time&&m.last!==k&&m.sent!==k){m.sent=k;await c.put('meta',new Response(JSON.stringify(m)));await self.registration.showNotification('Waktunya membaca \uD83D\uDCD6',{body:'Catat bacaanmu hari ini.',icon:'icon-192.png',badge:'icon-192.png',tag:'drj'})}}
self.addEventListener('periodicsync',e=>{if(e.tag==='drj-remind')e.waitUntil(remind())});
self.addEventListener('push',e=>e.waitUntil(self.registration.showNotification('Waktunya membaca \uD83D\uDCD6',{body:'Catat bacaanmu hari ini.',icon:'icon-192.png',tag:'drj'})));
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./index.html')))});
