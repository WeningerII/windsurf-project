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
  
  // Replace `const hp = document.system.hitPoints;` (or similar for mam3e)
  // with a cloned document.
  if (sys === 'mam3e') {
    code = code.replace(/applyDamage\([\s\S]*?\{\n\s*\/\//, (match) => {
        return match.replace(/\{\n/, `{\n    const d = { ...document, system: { ...document.system, conditionTrack: { ...document.system.conditionTrack } } };\n`);
    });
    code = code.replace(/document\.system\.conditionTrack/g, 'd.system.conditionTrack');
    code = code.replace(/return document;/g, 'return d;');
  } else {
    code = code.replace(/applyDamage\([\s\S]*?\{\n/, (match) => {
        let replacement = `{\n    const d = { ...document, system: { ...document.system, hitPoints: { ...document.system.hitPoints }`;
        if (sys.startsWith('dnd5e')) {
            replacement += `, deathSaves: { ...document.system.deathSaves }`;
        }
        replacement += ` } };\n`;
        return match + replacement;
    });
    code = code.replace(/const hp = document\.system\.hitPoints;/g, 'const hp = d.system.hitPoints;');
    code = code.replace(/normalizeDeathSaves\(document\);/g, 'normalizeDeathSaves(d);');
    code = code.replace(/const deathSaves = document\.system\.deathSaves;/g, 'const deathSaves = d.system.deathSaves;');
    code = code.replace(/return document;/g, 'return d;');
  }
  
  fs.writeFileSync(p, code);
}
