// D&D 5e (2014) Feats — SRD v5.1 (OGL 1.0a)
//
// The SRD v5.1 includes exactly one feat: Grappler. All other 5e feats are
// Player's Handbook content (not open) and are intentionally excluded.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const grappler: FeatDefinition = {
  id: 'grappler',
  name: 'Grappler',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }],
  description:
    "You've developed the skills necessary to hold your own in close-quarters grappling.",
  benefits: [
    'You have advantage on attack rolls against a creature you are grappling.',
    'You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.',
  ],
};

export const dnd5e2014Feats: FeatDefinition[] = [grappler];
