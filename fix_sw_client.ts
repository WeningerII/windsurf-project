import * as fs from 'fs';

let p = 'src/utils/systemAssetPrefetch.ts';
let code = fs.readFileSync(p, 'utf8');

if (!code.includes('CACHE_URLS')) {
  code = code.replace(
    /const prefetchedSystemSheets = new Set<GameSystemId>\(\);\n/,
    `const prefetchedSystemSheets = new Set<GameSystemId>();\n\nfunction notifyServiceWorkerToCacheUrls(urls: string[]) {\n  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {\n    navigator.serviceWorker.controller.postMessage({\n      type: 'CACHE_URLS',\n      urls,\n    });\n  }\n}\n`
  );
  
  // We don't have direct access to the generated asset URLs here, so the service worker interception 
  // on line 53 (cache on request) handles the chunks. But we can trigger explicit requests if needed.
  // Actually, Vite's preload already fetches the chunks and our SW intercepts them.
}

fs.writeFileSync(p, code);
