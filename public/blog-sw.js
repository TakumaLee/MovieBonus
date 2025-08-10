/**
 * Blog Service Worker
 * 
 * Caching strategy optimized for blog content with
 * offline support and performance optimization
 */

const CACHE_VERSION = 'blog-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Cache strategies
const CACHE_FIRST_PATHS = [
  '/blog/static/',
  '/fonts/',
  '/icons/',
  '/css/',
  '/js/'
];

const NETWORK_FIRST_PATHS = [
  '/api/v1/blog/',
  '/blog/search'
];

const STALE_WHILE_REVALIDATE_PATHS = [
  '/blog/',
  '/blog/category/',
  '/blog/tag/'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[Blog SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        '/blog',
        '/blog/offline.html',
        '/styles/blog.css',
        '/fonts/noto-sans-tc.woff2',
        '/fonts/noto-serif-tc.woff2'
      ]);
    })
  );
  
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Blog SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.includes('blog-') && cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('[Blog SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isBlogPageRequest(request)) {
    event.respondWith(handleBlogPageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// Request type checkers
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(request.url);
}

function isApiRequest(request) {
  return request.url.includes('/api/v1/blog/');
}

function isBlogPageRequest(request) {
  return request.url.includes('/blog/') && 
         request.headers.get('accept')?.includes('text/html');
}

function isStaticAsset(request) {
  return CACHE_FIRST_PATHS.some(path => request.url.includes(path)) ||
         /\.(css|js|woff|woff2|ttf|eot)$/i.test(request.url);
}

// Request handlers
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache and update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors for background updates
      });
      
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Blog SW] Image request failed:', error);
    return new Response('Image not available', { status: 404 });
  }
}

async function handleApiRequest(request) {
  try {
    // Network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      message: 'Please check your internet connection'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleBlogPageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return cache.match('/blog/offline.html');
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Show offline page
    return cache.match('/blog/offline.html');
  }
}

async function handleStaticAssetRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Blog SW] Static asset request failed:', error);
    return new Response('Asset not available', { status: 404 });
  }
}

async function handleOtherRequests(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[Blog SW] Request failed:', error);
    return new Response('Service unavailable', { status: 503 });
  }
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'blog-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    // Get pending analytics data from IndexedDB
    const pendingData = await getPendingAnalytics();
    
    for (const data of pendingData) {
      try {
        await fetch('/api/v1/blog/analytics/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        // Remove from pending queue
        await removePendingAnalytic(data.id);
      } catch (error) {
        console.error('[Blog SW] Failed to sync analytics:', error);
      }
    }
  } catch (error) {
    console.error('[Blog SW] Background sync failed:', error);
  }
}

// IndexedDB utilities for offline analytics
async function getPendingAnalytics() {
  return new Promise((resolve) => {
    const request = indexedDB.open('BlogAnalytics', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pending'], 'readonly');
      const store = transaction.objectStore('pending');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
    };
    
    request.onerror = () => {
      resolve([]);
    };
  });
}

async function removePendingAnalytic(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('BlogAnalytics', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pending'], 'readwrite');
      const store = transaction.objectStore('pending');
      store.delete(id);
      
      transaction.oncomplete = () => {
        resolve();
      };
    };
    
    request.onerror = () => {
      resolve();
    };
  });
}

// Message handling for dynamic configuration
self.addEventListener('message', (event) => {
  const { type, config } = event.data;
  
  if (type === 'CONFIG') {
    // Update cache strategies based on configuration
    if (config.cacheFirstPaths) {
      CACHE_FIRST_PATHS.push(...config.cacheFirstPaths);
    }
    
    if (config.networkFirstPaths) {
      NETWORK_FIRST_PATHS.push(...config.networkFirstPaths);
    }
    
    console.log('[Blog SW] Configuration updated:', config);
  }
  
  if (type === 'CACHE_BLOG_POST') {
    // Preemptively cache blog post
    const { url } = event.data;
    caches.open(DYNAMIC_CACHE).then(cache => {
      cache.add(url);
    });
  }
});