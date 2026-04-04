// public/sw.js
self.addEventListener('install', () => {
  console.log('Service Worker instalado!');
});

self.addEventListener('fetch', (event) => {
  // Necessário para o navegador considerar o app instalável
  event.respondWith(fetch(event.request));
});