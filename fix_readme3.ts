import * as fs from 'fs';

let p = 'README.md';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /- \*\*shadcn\/ui\*\* - UI components/g,
  '- **shadcn/ui-inspired** - UI components'
);

code = code.replace(
  /See \*\*SRD_COMPLIANCE\.md\*\* for detailed compliance information./g,
  'See documentation on Open Content Policy.'
);

fs.writeFileSync(p, code);
