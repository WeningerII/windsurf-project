import { describe, it, expect } from 'vitest';

import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import { resolveCheck } from '../../rules';
import { createSeededRng } from '../../scene/seededRng';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

registerAllSystems();

/**
 * "Create and run characters" for the NON-combat loop: a fresh default
 * character from each system's createDefaultData() yields a sheet-derived skill
 * modifier (the panels' "real number, not a GM-typed value") that actually
 * drives a check. Guards the same shape-drift risk as the combat proof, for
 * exploration/social: a mismatch would surface as a NaN modifier or a thrown
 * error instead of passing on a hand-built stub.
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

describe('a created character drives a non-combat check (all 7 systems)', () => {
  for (const systemId of ALL_SYSTEMS) {
    it(`${systemId}: sheet-derived skill modifier resolves a check`, () => {
      const def = systemRegistry.get(systemId)!;
      // Each system has a check vocabulary: skills (d20 / M&M) or traits
      // (Daggerheart is trait-based and ships no skills array).
      const checkId = def.skills?.[0]?.id ?? def.attributes?.[0]?.id;
      expect(checkId).toBeTruthy();

      const mod = def.engine.checkModifier?.(defaultDoc(systemId), checkId!);
      // The critical correctness property: a real number or a graceful
      // undefined — never NaN from a shape mismatch.
      expect(mod === undefined || Number.isFinite(mod)).toBe(true);

      const result = resolveCheck({
        systemId,
        modifier: mod ?? 0,
        dc: 15,
        rng: createSeededRng(`${systemId}-check`),
      });
      expect(typeof result.success).toBe('boolean');
      expect(result.modifier).toBe(mod ?? 0);
      expect(Number.isFinite(result.total)).toBe(true);
      expect(result.dice.length).toBeGreaterThan(0);
    });
  }
});

describe('every registered system exposes a checkModifier', () => {
  it('so the non-combat panels get a real number for all seven', () => {
    const missing = ALL_SYSTEMS.filter((id) => !systemRegistry.get(id)?.engine.checkModifier);
    expect(missing).toEqual([]);
  });
});
