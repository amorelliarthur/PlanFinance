const CACHE_NAME = 'PlanFinance-cache-v1';

// Detecta automaticamente o caminho base
const BASE_PATH = self.location.pathname.includes('/PlanFinance/')
  ? '/PlanFinance'
  : '';

const ASSETS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,
  `${BASE_PATH}/css/style.css`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/db.js`,
  `${BASE_PATH}/js/ui.js`,
  `${BASE_PATH}/js/chart.js`,
  'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instala o service worker e faz cache dos arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // força ativação imediata
});

// Remove caches antigos ao ativar uma nova versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // garante que o SW controle imediatamente as páginas abertas
});

// Intercepta requisições e usa cache/offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualiza o cache com a nova resposta
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Se estiver offline, tenta pegar do cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.destination === 'document') {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
      })
  );
});

