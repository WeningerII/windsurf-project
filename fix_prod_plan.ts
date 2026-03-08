import * as fs from 'fs';

let p = 'docs/PRODUCTION_PLAN.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /- \[ \] All Phase 1 bugs are fixed with regression tests/,
  '- [x] All Phase 1 bugs are fixed with regression tests'
);

code = code.replace(
  /- \[ \] `npm run test:coverage -- --run` passes with expanded coverage config/,
  '- [x] `npm run test:coverage -- --run` passes with expanded coverage config'
);

code = code.replace(
  /- \[ \] `npm run build` succeeds/,
  '- [x] `npm run build` succeeds'
);

code = code.replace(
  /- \[ \] `npm run check:bundle-size` passes/,
  '- [x] `npm run check:bundle-size` passes'
);

code = code.replace(
  /- \[ \] `npm run lint` passes with `--max-warnings 0` \(or documented exception count\)/,
  '- [x] `npm run lint` passes with documented exception count'
);

code = code.replace(
  /- \[ \] E2E tests pass against production build in at least Chromium/,
  '- [ ] E2E tests pass against production build in at least Chromium'
);

code = code.replace(
  /- \[ \] No `<owner>\/<repo>` placeholder strings exist in shipped docs/,
  '- [x] No `<owner>/<repo>` placeholder strings exist in shipped docs'
);

code = code.replace(
  /- \[ \] README system count, coverage number, and feature claims match reality/,
  '- [x] README system count, coverage number, and feature claims match reality'
);

code = code.replace(
  /- \[ \] Storage persist is debounced \(no localStorage write per keystroke\)/,
  '- [x] Storage persist is debounced (no localStorage write per keystroke)'
);

fs.writeFileSync(p, code);
