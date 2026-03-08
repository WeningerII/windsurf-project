import * as fs from 'fs';
import * as path from 'path';

// Fix dnd5e
let p = path.join('src/systems/dnd5e/engine.ts');
let code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(document: CharacterDocument<Dnd5eDataModel>\): CharacterDocument<Dnd5eDataModel> \{\n\s*const d = document\.system;/, `prepareData(document: CharacterDocument<Dnd5eDataModel>): CharacterDocument<Dnd5eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        spellcasting: document.system.spellcasting ? { ...document.system.spellcasting, spellSlots: { ...document.system.spellcasting.spellSlots } } : undefined,
      },
    };
    const d = clonedDoc.system;`);
code = code.replace(/normalizeDeathSaves\(document\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/return document;/, 'return clonedDoc;');
code = code.replace(/document\.system\.deathSaves = \{/g, 'clonedDoc.system.deathSaves = {');
// Fix 1 HP bug in dnd5e
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

// Fix applyDamage in dnd5e
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Dnd5eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Dnd5eDataModel> \{\n\s*const hp = document\.system\.hitPoints;/, `applyDamage(
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
    const hp = clonedDoc.system.hitPoints;`);
code = code.replace(/normalizeDeathSaves\(document\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/const deathSaves = document\.system\.deathSaves;/, 'const deathSaves = clonedDoc.system.deathSaves;');
code = code.replace(/return document;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

// Fix dnd5e-2024
p = path.join('src/systems/dnd5e-2024/engine.ts');
code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(\n\s*document: CharacterDocument<Dnd5e2024DataModel>\n\s*\): CharacterDocument<Dnd5e2024DataModel> \{\n\s*const d = {[\s\S]*?};\n\s*const data = d\.system;/, `prepareData(
    document: CharacterDocument<Dnd5e2024DataModel>
  ): CharacterDocument<Dnd5e2024DataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        spellcasting: document.system.spellcasting ? { ...document.system.spellcasting, spellSlots: { ...document.system.spellcasting.spellSlots } } : undefined,
      },
    };
    const data = clonedDoc.system;`);
code = code.replace(/normalizeDeathSaves\(d\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/return d;/, 'return clonedDoc;');
// Fix 1 HP bug in 2024
code = code.replace(/let maxHP = 0;\n\s*for \(const cl of data\.classLevels\) \{/, `if (data.classLevels.length > 0) {
      let maxHP = 0;
      for (const cl of data.classLevels) {`);
code = code.replace(/maxHP = Math\.max\(maxHP, totalLevel\);\n\s*if \(data\.exhaustionLevel >= 4\) \{\n\s*maxHP = Math\.max\(1, Math\.floor\(maxHP \/ 2\)\);\n\s*\}\n\s*data\.hitPoints\.max = maxHP;/, `maxHP = Math.max(maxHP, totalLevel);
      if (data.exhaustionLevel >= 4) {
        maxHP = Math.max(1, Math.floor(maxHP / 2));
      }
      data.hitPoints.max = maxHP;
    }`);

// Fix applyDamage in 2024
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Dnd5e2024DataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Dnd5e2024DataModel> \{\n\s*const hp = document\.system\.hitPoints;/, `applyDamage(
    document: CharacterDocument<Dnd5e2024DataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd5e2024DataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        deathSaves: { ...document.system.deathSaves },
      },
    };
    const hp = clonedDoc.system.hitPoints;`);
code = code.replace(/normalizeDeathSaves\(document\);/, 'normalizeDeathSaves(clonedDoc);');
code = code.replace(/const deathSaves = document\.system\.deathSaves;/, 'const deathSaves = clonedDoc.system.deathSaves;');
code = code.replace(/return document;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

// Fix dnd35e
p = path.join('src/systems/dnd35e/engine.ts');
code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(document: CharacterDocument<Dnd35eDataModel>\): CharacterDocument<Dnd35eDataModel> \{\n\s*const d = {[\s\S]*?};\n\s*const data = d\.system;/, `prepareData(document: CharacterDocument<Dnd35eDataModel>): CharacterDocument<Dnd35eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        saves: {
          fortitude: { ...document.system.saves.fortitude },
          reflex: { ...document.system.saves.reflex },
          will: { ...document.system.saves.will },
        },
        hitPoints: { ...document.system.hitPoints },
        armorClass: { ...document.system.armorClass },
      },
    };
    const data = clonedDoc.system;`);
code = code.replace(/return d;/, 'return clonedDoc;');

// Fix applyDamage in dnd35e
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Dnd35eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Dnd35eDataModel> \{\n\s*const hp = document\.system\.hitPoints;/, `applyDamage(
    document: CharacterDocument<Dnd35eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd35eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = clonedDoc.system.hitPoints;`);
code = code.replace(/let remaining = amount;/, `if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      return clonedDoc;
    }
    let remaining = amount;`);
code = code.replace(/return document;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

// Fix pf1e
p = path.join('src/systems/pf1e/engine.ts');
code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(document: CharacterDocument<Pf1eDataModel>\): CharacterDocument<Pf1eDataModel> \{\n\s*const d = {[\s\S]*?};\n\s*const data = d\.system;/, `prepareData(document: CharacterDocument<Pf1eDataModel>): CharacterDocument<Pf1eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        saves: { ...document.system.saves },
        hitPoints: { ...document.system.hitPoints },
        armorClass: { ...document.system.armorClass },
      },
    };
    const data = clonedDoc.system;`);
code = code.replace(/return d;/, 'return clonedDoc;');

// Fix applyDamage in pf1e
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Pf1eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Pf1eDataModel> \{\n\s*const hp = document\.system\.hitPoints;/, `applyDamage(
    document: CharacterDocument<Pf1eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Pf1eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = clonedDoc.system.hitPoints;`);
code = code.replace(/let remaining = amount;/, `if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      return clonedDoc;
    }
    let remaining = amount;`);
code = code.replace(/return document;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

// Fix pf2e
p = path.join('src/systems/pf2e/engine.ts');
code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(document: CharacterDocument<Pf2eDataModel>\): CharacterDocument<Pf2eDataModel> \{\n\s*const d = {[\s\S]*?};\n\s*const data = d\.system;/, `prepareData(document: CharacterDocument<Pf2eDataModel>): CharacterDocument<Pf2eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        skillProficiencies: { ...document.system.skillProficiencies },
        loreProficiencies: { ...document.system.loreProficiencies },
        saveProficiencies: {
          fortitude: { ...document.system.saveProficiencies.fortitude },
          reflex: { ...document.system.saveProficiencies.reflex },
          will: { ...document.system.saveProficiencies.will },
        },
        perceptionProficiency: { ...document.system.perceptionProficiency },
        armorProficiencies: { ...document.system.armorProficiencies },
        weaponProficiencies: { ...document.system.weaponProficiencies },
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const data = clonedDoc.system;`);
code = code.replace(/return d;/, 'return clonedDoc;');

// Fix pf2e AC Clumsy bug
code = code.replace(/const armorProf =\n\s*data\.armorProficiencies\[armorCategory\]\?\.total \?\? data\.armorProficiencies\.unarmored\?\.total \?\? 0;\n\s*data\.armorClass = computePf2eAC\(data\.baseAttributes\.dex \?\? 10, armorProf, data\.equipment\);\n\s*data\.armorClass = Math\.max\(0, data\.armorClass - getPf2eStatusPenalty\(data\.conditions, 'dex'\)\);/, `const armorProf =
      data.armorProficiencies[armorCategory]?.total ??
      data.armorProficiencies.unarmored?.total ??
      0;
    const clumsyPenalty = normalizedConditionValue(data.conditions, 'clumsy');
    const effectiveDex = Math.max(1, (data.baseAttributes.dex ?? 10) - clumsyPenalty * 2);
    data.armorClass = computePf2eAC(effectiveDex, armorProf, data.equipment);`);

// Fix applyDamage in pf2e
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Pf2eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Pf2eDataModel> \{\n\{\n\s*const d = { \.\.\.document, system: { \.\.\.document\.system, hitPoints: { \.\.\.document\.system\.hitPoints } } };\n\s*const hp = d\.system\.hitPoints;/, `applyDamage(
    document: CharacterDocument<Pf2eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Pf2eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = clonedDoc.system.hitPoints;`);
code = code.replace(/return d;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

// Fix mam3e
p = path.join('src/systems/mam3e/engine.ts');
code = fs.readFileSync(p, 'utf8');
code = code.replace(/prepareData\(document: CharacterDocument<Mam3eDataModel>\): CharacterDocument<Mam3eDataModel> \{\n\s*const d = {[\s\S]*?};\n\s*const data = d\.system;/, `prepareData(document: CharacterDocument<Mam3eDataModel>): CharacterDocument<Mam3eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        powerPoints: {
          ...document.system.powerPoints,
          spent: { ...document.system.powerPoints.spent },
        },
        defenses: {
          dodge: { ...document.system.defenses.dodge },
          parry: { ...document.system.defenses.parry },
          fortitude: { ...document.system.defenses.fortitude },
          toughness: { ...document.system.defenses.toughness },
          will: { ...document.system.defenses.will },
        },
        skills: { ...document.system.skills },
      },
    };
    const data = clonedDoc.system;`);
code = code.replace(/return d;/, 'return clonedDoc;');

// Fix applyDamage in mam3e
code = code.replace(/applyDamage\(\n\s*document: CharacterDocument<Mam3eDataModel>,\n\s*amount: number,\n\s*_type: string\n\s*\): CharacterDocument<Mam3eDataModel> \{\n\s*const d = { \.\.\.document, system: { \.\.\.document\.system, conditionTrack: { \.\.\.d\.system\.conditionTrack } } };/, `applyDamage(
    document: CharacterDocument<Mam3eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Mam3eDataModel> {
    const clonedDoc = {
      ...document,
      system: {
        ...document.system,
        conditionTrack: { ...document.system.conditionTrack },
      },
    };`);
code = code.replace(/const current = normalizeConditionTrack\(d\.system\.conditionTrack\);\n\s*d\.system\.conditionTrack = applyToughnessFailure\(current, margin\);/, `const current = normalizeConditionTrack(clonedDoc.system.conditionTrack);
    clonedDoc.system.conditionTrack = applyToughnessFailure(current, margin);`);
code = code.replace(/return d;/g, 'return clonedDoc;');
fs.writeFileSync(p, code);

