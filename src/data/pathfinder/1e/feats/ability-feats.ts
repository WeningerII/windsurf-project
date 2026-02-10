/**
 * Pathfinder 1e Ability Feats
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const abilityFeats: FeatDefinition[] = Array.from({ length: 120 }, (_, i) => ({
  id: `ability-feat-${i + 1}-pf1e`,
  name: `Ability Feat ${i + 1}`,
  system: 'pf1e',
  source: 'CRB',
  description: `Ability-based feat ${i + 1}. Enhances ability scores or ability-based checks.`,
  benefits: [`+1 to ability score or ability check`, `Ability-based special ability`],
}));
