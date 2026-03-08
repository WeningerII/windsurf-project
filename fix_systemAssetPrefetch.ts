import * as fs from 'fs';

let p = 'src/utils/systemAssetPrefetch.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/}\n\nexport function prefetchSystemAssetsForIds/, 'export function prefetchSystemAssetsForIds');

fs.writeFileSync(p, code);
