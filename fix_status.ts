import * as fs from 'fs';

let p = 'docs/STATUS.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /\*\*78 Vitest files\*\* across `src\/__tests__\/`/g,
  '**76 Vitest files** across `src/__tests__/` (run `find src/__tests__ -name \'*.test.*\' | wc -l` to verify)'
);

code = code.replace(
  /\*\*E2E:\*\* 1 Playwright spec \(`e2e\/phase3-workflows\.spec\.ts`\)/g,
  '**E2E:** 2 Playwright specs (`phase3-workflows.spec.ts`, `system-smoke.spec.ts`)'
);

fs.writeFileSync(p, code);
