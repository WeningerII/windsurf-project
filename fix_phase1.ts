import * as fs from 'fs';
import * as path from 'path';

// 1. Fix prepareData in all engines
const engines = ['dnd5e', 'dnd5e-2024', 'dnd35e', 'pf1e', 'pf2e', 'mam3e'];
for (const sys of engines) {
  const p = path.join('src/systems', sys, 'engine.ts');
  let code = fs.readFileSync(p, 'utf8');

  // Fix mutation-in-place in prepareData
  if (sys === 'dnd5e' || sys === 'dnd5e-2024') {
    code = code.replace(/prepareData\([\s\S]*?\{\n\s*const d = document\.system;/, (match) => {
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
    code = code.replace(/const conMod = abilityMod\(d\.baseAttributes\.con \?\? 10\);/g, 'const conMod = abilityMod(data.baseAttributes.con ?? 10);');
    code = code.replace(/const dexMod = abilityMod\(d\.baseAttributes\.dex \?\? 10\);/g, 'const dexMod = abilityMod(data.baseAttributes.dex ?? 10);');
    // Replace all d. with data. EXCEPT for `return d;` or `const d = ` or `normalizeDeathSaves(d)`
    // To be safe, just rename d to data where appropriate.
    code = code.replace(/d\.level/g, 'data.level');
    code = code.replace(/d\.classLevels/g, 'data.classLevels');
    code = code.replace(/d\.hitPoints/g, 'data.hitPoints');
    code = code.replace(/d\.exhaustionLevel/g, 'data.exhaustionLevel');
    code = code.replace(/d\.armorClass/g, 'data.armorClass');
    code = code.replace(/d\.baseAttributes/g, 'data.baseAttributes');
    code = code.replace(/d\.equipment/g, 'data.equipment');
    code = code.replace(/d\.initiative/g, 'data.initiative');
    code = code.replace(/d\.hitDice/g, 'data.hitDice');
    code = code.replace(/d\.spellcasting/g, 'data.spellcasting');
    code = code.replace(/d\.conditions/g, 'data.conditions');
    code = code.replace(/d\.feats/g, 'data.feats'); // for 2024
    
    code = code.replace(/normalizeDeathSaves\(document\)/, 'normalizeDeathSaves(d)');
    code = code.replace(/document\.system\.deathSaves/g, 'd.system.deathSaves');
    
    // Fix New character 1 HP bug
    code = code.replace(/let maxHP = 0;\n\s*for \(const cl of data\.classLevels\) \{/, `let maxHP = 0;
      for (const cl of data.classLevels) {`);
    code = code.replace(/if \(data\.classLevels\.length > 0\) \{/g, ''); // just in case it was already there
    code = code.replace(/\/\/ --- Max HP ---\n\s*let maxHP = 0;/, `// --- Max HP ---
    if (data.classLevels.length > 0) {
      let maxHP = 0;`);
    code = code.replace(/data\.hitPoints\.max = maxHP;\n/, `data.hitPoints.max = maxHP;
    }\n`);

    // Fix applyDamage
    code = code.replace(/applyDamage\([\s\S]*?\{\n\s*const hp = document\.system\.hitPoints;/, (match) => {
        return `applyDamage(
    document: CharacterDocument<Dnd5e${sys === 'dnd5e-2024' ? '2024' : ''}DataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Dnd5e${sys === 'dnd5e-2024' ? '2024' : ''}DataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
        deathSaves: { ...document.system.deathSaves },
      },
    };
    const hp = d.system.hitPoints;`;
    });
    code = code.replace(/return document;/g, 'return d;');
  }
  
  if (sys === 'dnd35e' || sys === 'pf1e') {
    code = code.replace(/prepareData\([\s\S]*?\{\n\s*const (data|d) = document\.system;/, (match) => {
        return `prepareData(document: CharacterDocument<${sys === 'dnd35e' ? 'Dnd35e' : 'Pf1e'}DataModel>): CharacterDocument<${sys === 'dnd35e' ? 'Dnd35e' : 'Pf1e'}DataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        saves: { 
          ${sys === 'dnd35e' ? 'fortitude: { ...document.system.saves.fortitude },\n          reflex: { ...document.system.saves.reflex },\n          will: { ...document.system.saves.will },' : '...document.system.saves'}
        },
        hitPoints: { ...document.system.hitPoints },
        armorClass: { ...document.system.armorClass },
      },
    };
    const data = d.system;`;
    });
    code = code.replace(/const d = document\.system;/g, 'const data = d.system;'); // Just in case
    code = code.replace(/d\./g, 'data.');
    code = code.replace(/return data;/g, 'return d;');
    
    // Fix applyDamage
    code = code.replace(/applyDamage\([\s\S]*?\{\n\s*const hp = document\.system\.hitPoints;/, (match) => {
        return `applyDamage(
    document: CharacterDocument<${sys === 'dnd35e' ? 'Dnd35e' : 'Pf1e'}DataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<${sys === 'dnd35e' ? 'Dnd35e' : 'Pf1e'}DataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = d.system.hitPoints;`;
    });
    
    // Fix healing bug
    code = code.replace(/if \(amount < 0\) \{\n\s*const healing = Math\.abs\(amount\);\n\s*hp\.current = Math\.min\(hp\.max, hp\.current \+ healing\);\n\s*return (document|d);\n\s*\}/, '');
    code = code.replace(/let remaining = amount;/, `if (amount < 0) {
      const healing = Math.abs(amount);
      hp.current = Math.min(hp.max, hp.current + healing);
      return d;
    }
    let remaining = amount;`);
    
    code = code.replace(/return document;/g, 'return d;');
  }
  
  if (sys === 'pf2e') {
    code = code.replace(/prepareData\([\s\S]*?\{\n\s*const d = document\.system;/, (match) => {
        return `prepareData(document: CharacterDocument<Pf2eDataModel>): CharacterDocument<Pf2eDataModel> {
    const d = {
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
    const data = d.system;`;
    });
    code = code.replace(/d\./g, 'data.');
    code = code.replace(/return data;/g, 'return d;');
    
    // Fix PF2e Clumsy condition AC bug
    code = code.replace(/const armorProf =\n\s*data\.armorProficiencies\[armorCategory\]\?\.total \?\? data\.armorProficiencies\.unarmored\?\.total \?\? 0;\n\s*data\.armorClass = computePf2eAC\(data\.baseAttributes\.dex \?\? 10, armorProf, data\.equipment\);\n\s*data\.armorClass = Math\.max\(0, data\.armorClass - getPf2eStatusPenalty\(data\.conditions, 'dex'\)\);/, `const armorProf =
      data.armorProficiencies[armorCategory]?.total ??
      data.armorProficiencies.unarmored?.total ??
      0;
    const clumsyPenalty = normalizedConditionValue(data.conditions, 'clumsy');
    const effectiveDex = Math.max(1, (data.baseAttributes.dex ?? 10) - clumsyPenalty * 2);
    data.armorClass = computePf2eAC(effectiveDex, armorProf, data.equipment);`);

    // Fix applyDamage
    code = code.replace(/applyDamage\([\s\S]*?\{\n\s*const hp = document\.system\.hitPoints;/, (match) => {
        return `applyDamage(
    document: CharacterDocument<Pf2eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Pf2eDataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        hitPoints: { ...document.system.hitPoints },
      },
    };
    const hp = d.system.hitPoints;`;
    });
    code = code.replace(/return document;/g, 'return d;');
  }

  if (sys === 'mam3e') {
    code = code.replace(/prepareData\([\s\S]*?\{\n\s*const data = document\.system;/, (match) => {
        return `prepareData(document: CharacterDocument<Mam3eDataModel>): CharacterDocument<Mam3eDataModel> {
    const d = {
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
    const data = d.system;`;
    });
    code = code.replace(/return document;/g, 'return d;');
    
    // Fix applyDamage
    code = code.replace(/applyDamage\([\s\S]*?\{\n\s*\/\//, (match) => {
        return `applyDamage(
    document: CharacterDocument<Mam3eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Mam3eDataModel> {
    const d = {
      ...document,
      system: {
        ...document.system,
        conditionTrack: { ...document.system.conditionTrack },
      },
    };
    //`;
    });
    code = code.replace(/document\.system\.conditionTrack/g, 'd.system.conditionTrack');
    code = code.replace(/return document;/g, 'return d;');
  }

  fs.writeFileSync(p, code);
}
