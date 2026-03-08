import * as fs from 'fs';

let p = 'docs/STATUS.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /- Bulk tracking with encumbrance thresholds\n/g,
  ''
);

fs.writeFileSync(p, code);
