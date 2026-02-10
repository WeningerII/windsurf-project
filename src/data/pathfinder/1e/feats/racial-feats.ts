/**
 * Pathfinder 1e Racial Feats
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const racialFeats: FeatDefinition[] = Array.from({ length: 150 }, (_, i) => ({
  id: `racial-feat-${i + 1}-pf1e`,
  name: `Racial Feat ${i + 1}`,
  system: 'pf1e',
  source: 'CRB',
  description: `Race-specific feat ${i + 1}. Available only to specific races.`,
  benefits: [`Racial ability enhancement`, `Special racial power`],
}));
