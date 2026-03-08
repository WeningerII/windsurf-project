import * as fs from 'fs';
import * as path from 'path';

for (const sys of ['dnd35e', 'pf1e']) {
  const p = path.join('src/systems', sys, 'engine.ts');
  let code = fs.readFileSync(p, 'utf8');

  // Remove unused pf1eClasses import
  code = code.replace(/import \{ pf1eClasses \} from '\.\.\/\.\.\/data\/pathfinder\/1e\/classes';\n/, '');

  // Add import for pf1eClassSpellSlotTables if missing
  if (!code.includes('pf1eClassSpellSlotTables')) {
    code = code.replace(/import \{ getSpellSlotsAtClassLevel/, "import { pf1eClassSpellSlotTables } from '../../data/pathfinder/1e/classSpellSlotTables';\nimport { getSpellSlotsAtClassLevel");
  } else {
    // If it's used but the import is missing or incorrect, fix it
    if (!code.match(/import\s+\{.*pf1eClassSpellSlotTables.*\}\s+from/)) {
      code = code.replace(/import \{ getSpellSlotsAtClassLevel/, "import { pf1eClassSpellSlotTables } from '../../data/pathfinder/1e/classSpellSlotTables';\nimport { getSpellSlotsAtClassLevel");
    }
  }

  fs.writeFileSync(p, code);
}
