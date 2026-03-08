import * as fs from 'fs';

let p = 'src/systems/dnd5e/engine.ts';
let code = fs.readFileSync(p, 'utf8');

// prepareData mutation bug
code = code.replace(
  /prepareData\(document: CharacterDocument<Dnd5eDataModel>\): CharacterDocument<Dnd5eDataModel> \{\n\s*const d = document\.system;/,
  `prepareData(document: CharacterDocument<Dnd5eDataModel>): CharacterDocument<Dnd5eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        spellcasting: document.system.spellcasting ? { ...document.system.spellcasting, spellSlots: { ...document.system.spellcasting.spellSlots } } : undefined,
      },
    };
    const d = clonedDoc.system;`
);
code = code.replace(/normalizeDeathSaves\(document\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/document\.system\.deathSaves = \{/, 'clonedDoc.system.deathSaves = {');

// 1 HP bug
code = code.replace(/let maxHP = 0;\n\s*for \(const cl of d\.classLevels\) \{/, `if (d.classLevels.length > 0) {
      let maxHP = 0;
      for (const cl of d.classLevels) {`);
code = code.replace(/maxHP = Math\.max\(maxHP, d\.level\); \/\/ minimum 1 HP per level\n\s*d\.hitPoints\.max = maxHP;/, `maxHP = Math.max(maxHP, d.level); // minimum 1 HP per level
      d.hitPoints.max = maxHP;
    }`);

code = code.replace(/return document;/g, 'return clonedDoc;');

// applyDamage mutation bug
code = code.replace(
  /applyDamage\(document: CharacterDocument<Dnd5eDataModel>, amount: number, _type: string\): CharacterDocument<Dnd5eDataModel> \{\n\s*const hp = document\.system\.hitPoints;/,
  `applyDamage(document: CharacterDocument<Dnd5eDataModel>, amount: number, _type: string): CharacterDocument<Dnd5eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        deathSaves: { ...document.system.deathSaves },
      },
    };
    const hp = clonedDoc.system.hitPoints;`
);
// replace normalizeDeathSaves(document) in applyDamage
code = code.replace(/normalizeDeathSaves\(document\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/const deathSaves = document\.system\.deathSaves;/, 'const deathSaves = clonedDoc.system.deathSaves;');

// Also fix normalizeDeathSaves signature/body
code = code.replace(
  /function normalizeDeathSaves\(document: CharacterDocument<Dnd5eDataModel>\): void \{/,
  `function normalizeDeathSaves(doc: CharacterDocument<Dnd5eDataModel>): void {`
);
code = code.replace(/document\.system\./g, 'doc.system.');

fs.writeFileSync(p, code);
