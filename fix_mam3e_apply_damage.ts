import * as fs from 'fs';
import * as path from 'path';

const p = path.join('src/systems', 'mam3e', 'engine.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/applyDamage\([\s\S]*?\}\n/, `  applyDamage(
    document: CharacterDocument<Mam3eDataModel>,
    amount: number,
    _type: string
  ): CharacterDocument<Mam3eDataModel> {
    const d = { ...document, system: { ...document.system, conditionTrack: { ...document.system.conditionTrack } } };
    // For M&M, "amount" is interpreted as Toughness failure margin.
    const margin = Math.max(0, Math.floor(amount));
    if (margin <= 0) return d;

    const current = normalizeConditionTrack(d.system.conditionTrack);
    d.system.conditionTrack = applyToughnessFailure(current, margin);
    return d;
  }
}
`);
fs.writeFileSync(p, code);
