import * as fs from 'fs';

let p = 'src/systems/dnd5e/engine.ts';
let code = fs.readFileSync(p, 'utf8');

// 1. Fix normalizeDeathSaves
code = code.replace(
  /function normalizeDeathSaves\(document: CharacterDocument<Dnd5eDataModel>\): void \{/,
  `function normalizeDeathSaves(document: CharacterDocument<Dnd5eDataModel>): void {`
);

// 2. Fix prepareData
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

code = code.replace(/normalizeDeathSaves\(document\);/g, 'normalizeDeathSaves(clonedDoc);');

// 1 HP bug
code = code.replace(/let maxHP = 0;\n\s*for \(const cl of d\.classLevels\) \{/, `if (d.classLevels.length > 0) {
      let maxHP = 0;
      for (const cl of d.classLevels) {`);
code = code.replace(/maxHP = Math\.max\(maxHP, totalLevel\); \/\/ minimum 1 HP per level\n\s*if \(d\.exhaustionLevel >= 4\) \{\n\s*\/\/ 2014 exhaustion level 4: hit point maximum is halved\.\n\s*maxHP = Math\.max\(1, Math\.floor\(maxHP \/ 2\)\);\n\s*\}\n\s*d\.hitPoints\.max = maxHP;/, `maxHP = Math.max(maxHP, totalLevel); // minimum 1 HP per level
      if (d.exhaustionLevel >= 4) {
        // 2014 exhaustion level 4: hit point maximum is halved.
        maxHP = Math.max(1, Math.floor(maxHP / 2));
      }
      d.hitPoints.max = maxHP;
    }`);

// For prepareData return:
// We need to replace the return document ONLY in prepareData. 
// It is right before async rollCheck
code = code.replace(/return document;\n\s*\}\n\n\s*async rollCheck/, 'return clonedDoc;\n  }\n\n  async rollCheck');
code = code.replace(/document\.system\.deathSaves = \{ successes: 0, failures: 3 \};/, 'clonedDoc.system.deathSaves = { successes: 0, failures: 3 };');

// 3. Fix applyDamage
code = code.replace(
  /applyDamage\(\n\s*document: CharacterDocument<Dnd5eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Dnd5eDataModel> \{\n\s*const hp = document\.system\.hitPoints;/,
  `applyDamage(
    document: CharacterDocument<Dnd5eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd5eDataModel> {
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

code = code.replace(/const deathSaves = document\.system\.deathSaves;/g, 'const deathSaves = clonedDoc.system.deathSaves;');

// Replace all return documents in applyDamage
code = code.replace(/return document;\n\s*\}\n\n\s*if \(amount < 0\) \{/g, 'return clonedDoc;\n    }\n\n    if (amount < 0) {');
code = code.replace(/return document;\n\s*\}\n\n\s*let remaining = amount;/g, 'return clonedDoc;\n    }\n\n    let remaining = amount;');
code = code.replace(/return document;\n\s*\}\n\}/g, 'return clonedDoc;\n  }\n}');

fs.writeFileSync(p, code);
