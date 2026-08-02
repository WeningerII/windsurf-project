import { dnd5e2024Backgrounds } from '../src/data/dnd/5e-2024/backgrounds/index';
import { dnd5e2024Feats, getFeat } from '../src/data/dnd/5e-2024/feats/index';
import { dnd5e2024Equipment, getEquipment } from '../src/data/dnd/5e-2024/equipment/index';

const eqIds = new Set(dnd5e2024Equipment.map((e: any) => e.id));
for (const bg of dnd5e2024Backgrounds) {
  console.log('===', bg.id, '| feat:', bg.originFeat?.id, '->', getFeat(bg.originFeat!.id) ? 'OK' : 'MISSING', '| abilities:', bg.abilityScores?.join(','));
  const allItems = new Set<string>([...bg.equipment, ...(bg.equipmentOptions ?? []).flatMap(o => o.items.map(i => i.itemId))]);
  for (const id of allItems) {
    console.log('   item', id, eqIds.has(id) ? 'OK' : (getEquipment(id) ? 'OK(getter)' : 'MISSING'));
  }
  console.log('   gold', bg.gold, 'optA gold', bg.equipmentOptions?.[0].gold, 'optB', JSON.stringify(bg.equipmentOptions?.[1]));
  console.log('   skills', bg.skillProficiencies, 'tools', JSON.stringify(bg.toolProficiencies), 'langs', JSON.stringify(bg.languageProficiencies));
  console.log('   feature?', !!bg.feature, 'desc?', !!bg.description, 'suggested?', !!bg.suggestedCharacteristics);
}
console.log('--- origin feats catalog ids ---');
console.log(dnd5e2024Feats.filter((f:any)=>f.category==='origin'||f.type==='origin').map((f:any)=>f.id).join(', '));
