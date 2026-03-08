import * as fs from 'fs';
import * as path from 'path';

const definitions = [
  'dnd5e',
  'dnd5e-2024',
  'dnd35e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart'
];

for (const sys of definitions) {
  const p = path.join('src/systems', sys, 'definition.ts');
  let code = fs.readFileSync(p, 'utf8');

  // Replace `SheetComponent: Dnd5eSheet,` with the lazy reference
  if (sys === 'dnd5e') {
    code = code.replace(/import \{ Dnd5eSheet \} from '\.\/components\/Dnd5eSheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: Dnd5eSheet,/, "SheetComponent: lazy(() => import('./components/Dnd5eSheet').then((m) => ({ default: m.Dnd5eSheet }))),");
  } else if (sys === 'dnd5e-2024') {
    code = code.replace(/import \{ Dnd5e2024Sheet \} from '\.\/components\/Dnd5e2024Sheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: Dnd5e2024Sheet,/, "SheetComponent: lazy(() => import('./components/Dnd5e2024Sheet').then((m) => ({ default: m.Dnd5e2024Sheet }))),");
  } else if (sys === 'dnd35e' || sys === 'pf1e') {
    code = code.replace(/import \{ D20LegacySheet \} from '\.\.\/d20-legacy\/sheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: D20LegacySheet,/, "SheetComponent: lazy(() => import('../d20-legacy/sheet').then((m) => ({ default: m.D20LegacySheet }))),");
  } else if (sys === 'pf2e') {
    code = code.replace(/import \{ Pf2eSheet \} from '\.\/sheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: Pf2eSheet,/, "SheetComponent: lazy(() => import('./sheet').then((m) => ({ default: m.Pf2eSheet }))),");
  } else if (sys === 'mam3e') {
    code = code.replace(/import \{ Mam3eSheet \} from '\.\/sheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: Mam3eSheet,/, "SheetComponent: lazy(() => import('./sheet').then((m) => ({ default: m.Mam3eSheet }))),");
  } else if (sys === 'daggerheart') {
    code = code.replace(/import \{ DaggerheartSheet \} from '\.\/sheet';\n/, "import { lazy } from 'react';\n");
    code = code.replace(/SheetComponent: DaggerheartSheet,/, "SheetComponent: lazy(() => import('./sheet').then((m) => ({ default: m.DaggerheartSheet }))),");
  }
  
  fs.writeFileSync(p, code);
}
