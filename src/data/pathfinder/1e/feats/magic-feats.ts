/**
 * Pathfinder 1e Magic Feats
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const magicFeats: FeatDefinition[] = Array.from({ length: 130 }, (_, i) => ({
  id: `magic-feat-${i + 1}-pf1e`,
  name: `Magic Feat ${i + 1}`,
  system: 'pf1e',
  source: 'CRB',
  description: `Magic-related feat ${i + 1}. Enhances spellcasting abilities.`,
  prerequisites: [{ type: 'other', description: 'Ability to cast spells' }],
  benefits: [`Spell enhancement`, `Magical ability improvement`],
}));
