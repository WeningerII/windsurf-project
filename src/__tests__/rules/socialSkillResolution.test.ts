import { describe, it, expect } from 'vitest';

import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import { socialSkillId, type SocialApproach } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

registerAllSystems();

/**
 * The social loop maps an approach (persuade / deceive / intimidate) to each
 * system's own social skill — Diplomacy/Bluff for d20-legacy, Presence for
 * Daggerheart, etc. If that id doesn't match what the engine's checkModifier
 * recognizes, social silently falls back to a +0 modifier. This guards that the
 * mapping resolves to a REAL sheet number for every system × approach.
 */

const ALL_SYSTEMS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

const APPROACHES: SocialApproach[] = ['persuasion', 'deception', 'intimidation'];

function defaultDoc(systemId: GameSystemId): CharacterDocument<SystemDataModel> {
  const def = systemRegistry.get(systemId);
  if (!def) throw new Error(`system ${systemId} is not registered`);
  return {
    id: `${systemId}-pc`,
    name: 'Fresh Hero',
    systemId,
    system: def.createDefaultData() as SystemDataModel,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

describe('socialSkillId resolves to a real per-system modifier', () => {
  for (const systemId of ALL_SYSTEMS) {
    for (const approach of APPROACHES) {
      it(`${systemId} / ${approach}: maps to a checkModifier-known id`, () => {
        const def = systemRegistry.get(systemId)!;
        const skillId = socialSkillId(systemId, approach);
        expect(skillId).toBeTruthy();
        const mod = def.engine.checkModifier?.(defaultDoc(systemId), skillId);
        expect(typeof mod).toBe('number');
        expect(Number.isFinite(mod as number)).toBe(true);
      });
    }
  }
});
