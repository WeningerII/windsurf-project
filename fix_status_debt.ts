import * as fs from 'fs';

let p = 'docs/STATUS.md';
let code = fs.readFileSync(p, 'utf8');

// Remove deleted performance utils from debt
code = code.replace(
  /5\. \*\*Performance utilities \(`measurePerformance`, etc\.\) exist but are never called\*\*\n6\. \*\*`reportWebVitals\(\)` results go nowhere\*\* \(no analytics endpoint\)\n/g,
  ''
);

// Update testing gaps
code = code.replace(
  /4\. \*\*Coverage config only measures `src\/components\/` and `src\/utils\/`\*\* — excludes `src\/systems\/`, `src\/hooks\/`, `src\/registry\/`, `src\/data\/`\n/g,
  ''
);

code = code.replace(
  /3\. \*\*Daggerheart browser coverage is smoke-test only\*\* — create\/persist is covered, but import\/export and any data-backed flow remain unavailable because the system is still scaffold-only\n/g,
  '3. **Daggerheart browser coverage is smoke-test only** — create/persist is covered, but import/export and any data-backed flow remain unavailable because the system is still scaffold-only\n'
);

// Remove completed P3 item
code = code.replace(
  /- \[ \] Wire performance monitoring utilities to something useful \(or delete them\)\n/g,
  ''
);

// Update P4 item
code = code.replace(
  /- \[ \] Expand coverage config to include `src\/systems\/`, `src\/hooks\/`, `src\/registry\/`\n/g,
  '- [x] Expand coverage config to include `src/systems/`, `src/hooks/`, `src/registry/`\n'
);

fs.writeFileSync(p, code);
