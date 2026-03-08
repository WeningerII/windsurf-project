import * as fs from 'fs';

let p = 'docs/STATUS.md';
let code = fs.readFileSync(p, 'utf8');

// The numbering is off after removal, fix testing gaps numbering
code = code.replace(
  /5\. \*\*Coverage remains runtime-sensitive\*\*/,
  '4. **Coverage remains runtime-sensitive**'
);

fs.writeFileSync(p, code);
