import * as fs from 'fs';

let p = 'src/systems/dnd5e-shared/engine.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/const pb = profBonus\(totalLevel\);\n\n    \/\/ Give derived classes a chance to alter initiative\/AC base rules/g, '// Give derived classes a chance to alter initiative/AC base rules');
code = code.replace(/protected applyExhaustionMaxHP\(_exhaustion: number, maxHP: number\): number/g, 'protected applyExhaustionMaxHP(_exhaustion: number, maxHP: number): number');
code = code.replace(/protected isExhaustionLethal\(_exhaustion: number\): boolean/g, 'protected isExhaustionLethal(_exhaustion: number): boolean');

// Better to just use regex to add underscores to unused params
code = code.replace(/applyExhaustionMaxHP\(exhaustion: number, maxHP: number\)/g, 'applyExhaustionMaxHP(_exhaustion: number, maxHP: number)');
code = code.replace(/isExhaustionLethal\(exhaustion: number\)/g, 'isExhaustionLethal(_exhaustion: number)');
code = code.replace(/getExhaustionSkillPenalty\(exhaustion: number\)/g, 'getExhaustionSkillPenalty(_exhaustion: number)');
code = code.replace(/getExhaustionSavePenalty\(exhaustion: number\)/g, 'getExhaustionSavePenalty(_exhaustion: number)');
code = code.replace(/applyInitiativeModifiers\(doc: CharacterDocument<Dnd5eDataModel>, modifier: number\)/g, 'applyInitiativeModifiers(_doc: CharacterDocument<Dnd5eDataModel>, modifier: number)');
code = code.replace(/hasInitiativeAdvantage\(doc: CharacterDocument<Dnd5eDataModel>\)/g, 'hasInitiativeAdvantage(_doc: CharacterDocument<Dnd5eDataModel>)');
code = code.replace(/getExhaustionD20Penalty\(exhaustion: number\)/g, 'getExhaustionD20Penalty(_exhaustion: number)');

fs.writeFileSync(p, code);

p = 'src/systems/dnd5e/engine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/import \{ CharacterDocument \} from '\.\.\/\.\.\/types\/core\/document';\n/, '');
code = code.replace(/import \{ Dnd5eDataModel \} from '\.\/data-model';\n/, '');
code = code.replace(/import \{ hasDnd5eCondition \} from '\.\/conditions';\n/, '');
fs.writeFileSync(p, code);

p = 'src/utils/systemAssetPrefetch.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/function notifyServiceWorkerToCacheUrls[\s\S]*?\}\n/g, '');
fs.writeFileSync(p, code);
