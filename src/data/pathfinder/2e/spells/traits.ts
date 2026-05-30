import type { Spell } from '../../../../types/magic/spells';

function getDerivedPf2eTraits(spell: Spell): string[] {
  return [
    ...(spell.level === 0 ? ['cantrip'] : []),
    spell.school,
    ...(spell.attackRoll ? ['attack'] : []),
    ...(spell.components.verbal ? ['concentrate'] : []),
    ...(spell.components.somatic || spell.components.material ? ['manipulate'] : []),
  ];
}

export function withPf2eSpellTraits<T extends Spell>(spells: T[]): T[] {
  return spells.map((spell) => ({
    ...spell,
    traits: Array.from(new Set([...(spell.traits ?? []), ...getDerivedPf2eTraits(spell)])),
  }));
}
