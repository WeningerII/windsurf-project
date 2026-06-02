import { describe, it, expect } from 'vitest';

import { characterSaveBonus } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

/**
 * A PC's save bonus when caught in an area effect, derived per system: 5e uses
 * ability modifier + proficiency over six saves; the Fortitude/Reflex/Will
 * systems (3.5e, PF1e, PF2e) read the engine-computed save total, mapped from
 * the spell's save ability (con→Fort, dex→Ref, wis→Will).
 */

function doc(systemId: GameSystemId, system: unknown): CharacterDocument<SystemDataModel> {
  return {
    id: 'pc',
    name: 'Hero',
    systemId,
    system: system as SystemDataModel,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

describe('characterSaveBonus', () => {
  it('5e: ability modifier plus proficiency on a proficient save', () => {
    const d = doc('dnd-5e-2014', {
      baseAttributes: { con: 14 },
      level: 5,
      savingThrowProficiencies: ['con'],
    });
    expect(characterSaveBonus(d, 'con')).toBe(5); // +2 CON, +3 proficiency
  });

  it('5e: just the ability modifier when not proficient', () => {
    const d = doc('dnd-5e-2014', { baseAttributes: { dex: 16 }, level: 5 });
    expect(characterSaveBonus(d, 'dex')).toBe(3);
  });

  it('3.5e: reads the computed Reflex total for a dex save', () => {
    const d = doc('dnd-3.5e', {
      baseAttributes: { dex: 18 },
      saves: { reflex: { total: 7 }, fortitude: { total: 4 }, will: { total: 2 } },
    });
    expect(characterSaveBonus(d, 'dex')).toBe(7); // the class-derived Reflex total, not just +4 DEX
  });

  it('PF1e: reads the computed Fortitude total for a con save', () => {
    const d = doc('pf1e', {
      baseAttributes: { con: 14 },
      saves: { fortitude: { total: 9 }, reflex: { total: 3 }, will: { total: 5 } },
    });
    expect(characterSaveBonus(d, 'con')).toBe(9);
  });

  it('PF2e: reads the computed Will proficiency total for a wis save', () => {
    const d = doc('pf2e', {
      baseAttributes: { wis: 12 },
      saveProficiencies: {
        will: { tier: 'expert', total: 12 },
        fortitude: { tier: 'trained', total: 8 },
        reflex: { tier: 'trained', total: 7 },
      },
    });
    expect(characterSaveBonus(d, 'wis')).toBe(12);
  });

  it('falls back to the ability modifier for a save outside Fort/Ref/Will', () => {
    const d = doc('dnd-3.5e', {
      baseAttributes: { cha: 16 },
      saves: { fortitude: { total: 4 }, reflex: { total: 2 }, will: { total: 6 } },
    });
    expect(characterSaveBonus(d, 'cha')).toBe(3); // no CHA save in the model → +3 CHA mod
  });
});
