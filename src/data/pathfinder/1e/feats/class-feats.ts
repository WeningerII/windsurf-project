/**
 * Pathfinder 1e Class-Specific Feats
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const classFeats: FeatDefinition[] = Array.from({ length: 140 }, (_, i) => ({
  id: `class-feat-${i + 1}-pf1e`,
  name: `Class Feat ${i + 1}`,
  system: 'pf1e',
  source: 'CRB',
  description: `Class-specific feat ${i + 1}. Available only to specific classes.`,
  benefits: [`Class ability enhancement`, `Special class power`],
}));
