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
  
  // Replace `const d = document.system;` with a cloned document.
  if (sys === 'dnd5e' || sys === 'dnd5e-2024') {
    code = code.replace(/prepareData\([\s\S]*?\{\n\s*const (data|d) = document\.system;/, (match) => {
        return `prepareData(document: CharacterDocument<Dnd5e${sys === 'dnd5e-2024' ? '2024' : ''}DataModel>): CharacterDocument<Dnd5e${sys === 'dnd5e-2024' ? '2024' : ''}DataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        spellcasting: document.system.spellcasting ? { ...document.system.spellcasting } : undefined,
      },
    };
    const data = d.system;`;
    });
    code = code.replace(/const d = document\.system;/g, 'const data = d.system;'); // Just in case
    // For 5e, it uses `d` everywhere, so let's map `data` to `d` internally or fix variable names
    // Wait, the original used `d` or `data`?
    // Let's just do an AST-based or careful regex replacement.
  }
}
