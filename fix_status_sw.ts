import * as fs from 'fs';

let p = 'docs/STATUS.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /- \[ \] Cache per-system data chunks in service worker for real offline support/,
  '- [x] Cache per-system data chunks in service worker for real offline support'
);

code = code.replace(
  /7\. \*\*Service worker doesn't cache data chunks\*\* — offline loads app shell but fails to load game data\n/,
  ''
);

code = code.replace(
  /8\. \*\*No PWA install prompt in UI\*\*/,
  '7. **No PWA install prompt in UI**'
);

code = code.replace(
  /9\. \*\*`apiClient\.ts` is a stub\*\*/,
  '8. **`apiClient.ts` is a stub**'
);

fs.writeFileSync(p, code);
