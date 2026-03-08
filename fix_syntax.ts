import * as fs from 'fs';
import * as path from 'path';

const engines = [
  'dnd5e',
  'dnd5e-2024',
  'dnd35e',
  'pf1e',
  'pf2e',
  'mam3e'
];

for (const sys of engines) {
  const p = path.join('src/systems', sys, 'engine.ts');
  let code = fs.readFileSync(p, 'utf8');
  if (sys === 'mam3e') {
    code = code.replace(/\}\n\}/, '}'); // Remove extra brace
  } else {
    code += '}\n'; // Add missing brace
  }
  fs.writeFileSync(p, code);
}
