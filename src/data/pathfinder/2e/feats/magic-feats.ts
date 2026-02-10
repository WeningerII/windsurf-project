// Pathfinder 2e Magic Feats
import { FeatDefinition } from '../../../../types/character-options/feats';

export const magicFeats: FeatDefinition[] = Array.from({ length: 135 }, (_, i) => ({
  id: `magic-feat-${i + 1}-pf2e`,
  name: `Magic Feat ${i + 1}`,
  system: 'pf2e',
  source: 'CRB',
  description: `Magic-related feat ${i + 1}. Enhances spellcasting abilities.`,
  prerequisites: [{ type: 'other', description: 'Ability to cast spells' }],
  benefits: [`Spell enhancement`, `Magical ability improvement`],
}));
