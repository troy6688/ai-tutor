/* ====== AI 智课 PWA Service Worker ====== */

const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `ai-tutor-${CACHE_VERSION}`;

// 预缓存的核心资源（离线可用）
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/home.html',
  '/grade.html',
  '/course.html',
  '/quiz.html',
  '/records.html',
  '/review.html',
  '/profile.html',
  '/manifest.json',
  '/assets/app.css',
  '/assets/app.js',
  '/assets/home-main.js',
  '/assets/course-main.js',
  '/assets/animation-studio.js',
  '/assets/course-data.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/favicon.png',
];

// 安装：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] 部分资源预缓存失败（可能是首次加载）：', err);
        // 部分失败不阻止安装
        return Promise.resolve();
      });
    }).then(() => {
      console.log('[SW] 预缓存完成');
      return self.skipWaiting(); // 立即激活
    })
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => {
      console.log('[SW] 旧缓存已清理，新缓存激活');
      return self.clients.claim(); // 立即接管所有页面
    })
  );
});

// 请求拦截：缓存策略
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 只缓存同源 GET 请求
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // API 请求：网络优先，失败时不缓存（保证数据实时）
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match(req);
      })
    );
    return;
  }

  // 静态资源（JS/CSS/图片/字体）：缓存优先，网络更新
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|mp3|mp4)$/i)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // 有缓存先返回，同时后台更新
          fetch(req).then((resp) => {
            if (resp && resp.status === 200) {
              const clone = resp.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, clone);
              });
            }
          }).catch(() => {});
          return cached;
        }
        // 无缓存，网络获取并缓存
        return fetch(req).then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, clone);
            });
          }
          return resp;
        }).catch(() => {
          // 离线时返回离线页
          return caches.match('/home.html');
        });
      })
    );
    return;
  }

  // HTML 页面：网络优先，失败时用缓存
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(req).then((resp) => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, clone);
          });
        }
        return resp;
      }).catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          // 找不到缓存，返回首页
          return caches.match('/home.html');
        });
      })
    );
    return;
  }

  // 其他请求：正常网络请求
  event.respondWith(fetch(req));
});

// 推送通知（预留，以后可以加更新提醒等）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || 'AI 智课', {
        body: data.body || '',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        data: data.data || {},
      })
    );
  }
});

// 点击通知时打开对应页面
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url || '/home.html';
  event.waitUntil(
    self.clients.openWindow(url)
  );
});
