import * as fs from 'fs';

let p = 'src/components/ui/Toast.tsx';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  /<div\n      className=\{`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right \$\{VARIANT_STYLES\[item\.variant\]\}`\}\n    >/,
  '<div\n      role="status"\n      aria-live="polite"\n      className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right ${VARIANT_STYLES[item.variant]}`}\n    >'
);

code = code.replace(
  /className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"/,
  'className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" aria-label="Notifications"'
);

fs.writeFileSync(p, code);
