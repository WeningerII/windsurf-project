import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../../../systems/pf2e/data-model';
import { createDefaultPf2eData } from '../../../systems/pf2e/data-model';

/**
 * Engine spellcasting-type inference (engine.ts `inferPf2eCastingType`). The
 * engine derives the casting type from the CLASS spellcasting block when the
 * document has no persisted `spellcasting.type`:
 *   - a `preparedCasterFormula` ⇒ 'prepared'
 *   - otherwise a non-empty `spellsKnown` ⇒ 'spontaneous' (the spontaneous branch)
 *   - otherwise the 'prepared' fallback
 *
 * No CRB class in the catalog ships a `spellsKnown` array to the engine, so the
 * spontaneous branch is only reachable with an injected class definition — we
 * mock `pf2eClasses` to supply one. The mock is isolated to this file so the
 * real-catalog engine tests (barbarian/wizard HP, etc.) are unaffected.
 */
vi.mock('../../../data/pathfinder/2e/classes', () => {
  const spellSlots = { 1: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] };
  return {
    pf2eClasses: {
      // Spontaneous: spellsKnown present, no preparedCasterFormula → 'spontaneous'.
      'test-spontaneous': {
        id: 'test-spontaneous',
        name: 'Test Spontaneous',
        hitDie: 'd6',
        spellcasting: {
          ability: 'cha',
          spellListId: 'occult-pf2e',
          spellsKnown: [5, 3, 2],
          spellSlots,
        },
        classResources: [],
      },
      // Prepared: an explicit preparedCasterFormula wins regardless of spellsKnown.
      'test-prepared': {
        id: 'test-prepared',
        name: 'Test Prepared',
        hitDie: 'd6',
        spellcasting: {
          ability: 'int',
          spellListId: 'arcane-pf2e',
          preparedCasterFormula: 'int_mod + class_level',
          spellsKnown: [5, 3, 2],
          spellSlots,
        },
        classResources: [],
      },
      // Neither marker present → the 'prepared' fallback.
      'test-fallback': {
        id: 'test-fallback',
        name: 'Test Fallback',
        hitDie: 'd6',
        spellcasting: {
          ability: 'wis',
          spellListId: 'divine-pf2e',
          spellSlots,
        },
        classResources: [],
      },
    },
  };
});

// Import the engine AFTER registering the mock so it binds to the stub catalog.
const { Pf2eEngine } = await import('../../../systems/pf2e/engine');

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-spellcasting-infer',
    name: 'Caster',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

describe('Pf2eEngine spellcasting-type inference', () => {
  const engine = new Pf2eEngine();

  it("infers 'spontaneous' from a spellsKnown list with no prepared formula", () => {
    // No existing spellcasting on the doc, so the type is inferred from the class.
    const result = engine.prepareData(makeDoc({ level: 1, classId: 'test-spontaneous' }));
    expect(result.system.spellcasting?.type).toBe('spontaneous');
  });

  it("infers 'prepared' when the class has a prepared formula (even with spellsKnown)", () => {
    const result = engine.prepareData(makeDoc({ level: 1, classId: 'test-prepared' }));
    expect(result.system.spellcasting?.type).toBe('prepared');
  });

  it("falls back to 'prepared' when the class declares neither marker", () => {
    const result = engine.prepareData(makeDoc({ level: 1, classId: 'test-fallback' }));
    expect(result.system.spellcasting?.type).toBe('prepared');
  });

  it('keeps a persisted casting type instead of re-inferring it', () => {
    // A document that already records 'prepared' must NOT be flipped to
    // 'spontaneous' even though the spontaneous class would infer that.
    const result = engine.prepareData(
      makeDoc({
        level: 1,
        classId: 'test-spontaneous',
        spellcasting: {
          tradition: 'occult',
          type: 'prepared',
          proficiency: { tier: 'trained', total: 0 },
          spellSlots: {},
          spellsKnown: [],
          focusSpells: [],
          focusPoints: { current: 0, max: 0 },
        },
      })
    );
    expect(result.system.spellcasting?.type).toBe('prepared');
  });
});
