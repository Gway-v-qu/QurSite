/* طريق الجنة - fully local/offline service worker */
const CACHE_NAME = 'tariq-aljannah-offline-v2';

const PRECACHE_URLS = [
  "./",
  "./AmiriQuran-Regular.ttf",
  "./Font Awesome/fontawesome-free-7.2.0-web/LICENSE.txt",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/all.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/all.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/brands.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/brands.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/fontawesome.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/fontawesome.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/regular.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/regular.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/solid.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/solid.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/svg-with-js.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/svg-with-js.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/svg.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/svg.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v4-font-face.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v4-font-face.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v4-shims.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v4-shims.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v5-font-face.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/css/v5-font-face.min.css",
  "./Font Awesome/fontawesome-free-7.2.0-web/webfonts/fa-brands-400.woff2",
  "./Font Awesome/fontawesome-free-7.2.0-web/webfonts/fa-regular-400.woff2",
  "./Font Awesome/fontawesome-free-7.2.0-web/webfonts/fa-solid-900.woff2",
  "./Font Awesome/fontawesome-free-7.2.0-web/webfonts/fa-v4compatibility.woff2",
  "./Logo.png",
  "./add_pwa.js",
  "./fix_all.js",
  "./fix_remaining.js",
  "./fonts.css",
  "./manifest.json",
  "./reciters.json",
  "./sw.js",
  "./update_audio_urls.js",
  "./آل عمران.html",
  "./إبراهيم.html",
  "./اذكار الإستيقاظ.html",
  "./اذكار الصباح.html",
  "./اذكار المساء.html",
  "./اذكار المواصلات.html",
  "./اذكار النوم.html",
  "./اذكار بعد الأذان.html",
  "./اذكار بعد الطعام.html",
  "./اذكار بعد الوضوء.html",
  "./اذكار دخول المنزل.html",
  "./اذكار قبل الطعام.html",
  "./اذكار ما بعد الصلاة.html",
  "./الأحزاب.html",
  "./الأحقاف.html",
  "./الأعراف.html",
  "./الأعلى.html",
  "./الأنبياء.html",
  "./الأنعام.html",
  "./الأنفال.html",
  "./الإخلاص.html",
  "./الإسراء.html",
  "./الإنسان.html",
  "./الاذكار.html",
  "./الانشقاق.html",
  "./الانفطار.html",
  "./البروج.html",
  "./البقرة.html",
  "./البلد.html",
  "./البينة.html",
  "./التحريم.html",
  "./التغابن.html",
  "./التكاثر.html",
  "./التكوير.html",
  "./التوبة.html",
  "./التين.html",
  "./الجاثية.html",
  "./الجمعة.html",
  "./الجن.html",
  "./الحاقة.html",
  "./الحج.html",
  "./الحجر.html",
  "./الحجرات.html",
  "./الحديد.html",
  "./الحشر.html",
  "./الدخان.html",
  "./الذاريات.html",
  "./الرحمن.html",
  "./الرعد.html",
  "./الروم.html",
  "./الزخرف.html",
  "./الزلزلة.html",
  "./الزمر.html",
  "./السجدة.html",
  "./الشرح.html",
  "./الشعراء.html",
  "./الشمس.html",
  "./الشورى.html",
  "./الصافات.html",
  "./الصف.html",
  "./الضحى.html",
  "./الطارق.html",
  "./الطلاق.html",
  "./الطور.html",
  "./العاديات.html",
  "./العصر.html",
  "./العلق.html",
  "./العنكبوت.html",
  "./الغاشية.html",
  "./الفاتحة.html",
  "./الفتح.html",
  "./الفجر.html",
  "./الفرقان.html",
  "./الفلق.html",
  "./الفيل.html",
  "./القارعة.html",
  "./القدر.html",
  "./القصص.html",
  "./القلم.html",
  "./القمر.html",
  "./القيامة.html",
  "./الكافرون.html",
  "./الكهف.html",
  "./الكوثر.html",
  "./الليل.html",
  "./المؤمنون.html",
  "./المائدة.html",
  "./الماعون.html",
  "./المجادلة.html",
  "./المدثر.html",
  "./المرسلات.html",
  "./المزمل.html",
  "./المسد.html",
  "./المطففين.html",
  "./المعارج.html",
  "./الملك.html",
  "./الممتحنة.html",
  "./المنافقون.html",
  "./النازعات.html",
  "./الناس.html",
  "./النبأ.html",
  "./النجم.html",
  "./النحل.html",
  "./النساء.html",
  "./النصر.html",
  "./النمل.html",
  "./النور.html",
  "./الهمزة.html",
  "./الواقعة.html",
  "./سبأ.html",
  "./ص.html",
  "./طه.html",
  "./عبس.html",
  "./غافر.html",
  "./فاطر.html",
  "./فصلت.html",
  "./ق.html",
  "./قراءة القرآن.html",
  "./قريش.html",
  "./لقمان.html",
  "./محمد.html",
  "./مريم.html",
  "./نوح.html",
  "./هود.html",
  "./يس.html",
  "./يوسف.html",
  "./يونس.html",
  "./index.html"
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;

    // Only handle GET requests.
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // All local site files are cache-first. This is what makes page-to-page
    // navigation work without an internet connection.
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request, { ignoreSearch: true })
                .then(cached => {
                    if (cached) return cached;

                    return fetch(request).then(response => {
                        if (response && (response.ok || response.type === 'opaque')) {
                            const copy = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                        }
                        return response;
                    });
                })
                .catch(() => {
                    // Every normal page is already precached, but keep index as
                    // a final navigation fallback.
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return Response.error();
                })
        );
    }
});
