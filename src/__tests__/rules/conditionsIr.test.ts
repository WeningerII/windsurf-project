import { describe, it, expect } from 'vitest';

import {
  collectDnd5eConditionEffects,
  conditionImposesDisadvantage,
  resolveEffects,
} from '../../rules';
import { Dnd5eEngine } from '../../systems/dnd5e/engine';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import type { Dnd5eDataModel } from '../../systems/dnd5e/data-model';

/**
 * PHASE 2 (RFC 003): D&D 5e conditions are now DATA in the shared IR. These
 * tests pin both the catalog (conditions → effects) and the engine's
 * consumption of it (rollCheck sources disadvantage from the IR).
 */

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'cond-test',
    name: 'Test',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-05-31T00:00:00.000Z'),
    updatedAt: new Date('2026-05-31T00:00:00.000Z'),
  };
}

describe('5e condition IR catalog', () => {
  it('poisoned imposes disadvantage on attacks and ability checks', () => {
    const effects = collectDnd5eConditionEffects(['poisoned']);
    const disadvantaged = effects
      .filter((e) => e.operation === 'disadvantage')
      .map((e) => e.target);
    expect(disadvantaged).toContain('attack');
    expect(disadvantaged).toContain('ability-check');
  });

  it('restrained imposes disadvantage on Dexterity saves (deterministic, RAW)', () => {
    expect(conditionImposesDisadvantage(['restrained'], ['save', 'save.dex'])).toBe(true);
    // ...but not on Strength saves.
    expect(conditionImposesDisadvantage(['restrained'], ['save', 'save.str'])).toBe(false);
  });

  it('frightened disadvantage is situational, recorded as a note (not auto-applied)', () => {
    const effects = collectDnd5eConditionEffects(['frightened']);
    expect(effects.every((e) => e.operation === 'note')).toBe(true);
    // Therefore it does NOT impose auto disadvantage on ability checks.
    expect(conditionImposesDisadvantage(['frightened'], ['ability-check'])).toBe(false);
    // But it IS surfaced with a manual boundary for the player/GM.
    expect(effects.some((e) => e.manualBoundary?.kind === 'partial')).toBe(true);
  });

  it('every catalog effect carries a has-condition guard and condition source', () => {
    const effects = collectDnd5eConditionEffects(['poisoned', 'restrained', 'blinded']);
    expect(effects.length).toBeGreaterThan(0);
    for (const e of effects) {
      expect(e.condition?.kind).toBe('has-condition');
      expect(e.source.kind).toBe('condition');
    }
  });

  it('effects only apply when the matching condition is active (resolver gating)', () => {
    const effects = collectDnd5eConditionEffects(['poisoned']);
    // Active: the disadvantage effects are applicable.
    const active = resolveEffects(effects, { conditions: new Set(['poisoned']) });
    expect(active.byTarget['ability-check']?.rollMode).toBe('disadvantage');
    // Inactive: nothing applies.
    const inactive = resolveEffects(effects, { conditions: new Set() });
    expect(inactive.ledger).toHaveLength(0);
  });

  it('unknown conditions contribute no effects', () => {
    expect(collectDnd5eConditionEffects(['charmed', 'deafened', 'invisible'])).toHaveLength(0);
  });
});

describe('5e engine consumes the condition IR (behavior preserved + extended)', () => {
  const engine = new Dnd5eEngine();

  it('PRESERVED: poisoned still gives disadvantage on ability checks', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      conditions: [{ id: 'poisoned', name: 'Poisoned' }],
    });
    const result = await engine.rollCheck(doc, 'str');
    expect(result.formula).toBe('2d20kl1 + 2');
    expect(result.flavor).toBe('STR Check (Disadvantage)');
  });

  it('PRESERVED: no condition → normal roll', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    });
    const result = await engine.rollCheck(doc, 'str');
    expect(result.formula).toBe('1d20 + 2');
  });

  it('EXTENDED: restrained now gives disadvantage on Dexterity saves', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
      conditions: [{ id: 'restrained', name: 'Restrained' }],
    });
    const result = await engine.rollCheck(doc, 'save-dex');
    expect(result.formula).toBe('2d20kl1 + 2');
    expect(result.flavor).toContain('Disadvantage');
  });

  it('EXTENDED: restrained does NOT affect Strength saves', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      conditions: [{ id: 'restrained', name: 'Restrained' }],
    });
    const result = await engine.rollCheck(doc, 'save-str');
    expect(result.formula).toBe('1d20 + 2');
  });

  it('PRESERVED: paralyzed still auto-fails DEX saves (outcome override, not a roll)', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
      conditions: [{ id: 'paralyzed', name: 'Paralyzed' }],
    });
    const result = await engine.rollCheck(doc, 'save-dex');
    expect(result.formula).toBe('Auto-fail');
    expect(result.flavor).toContain('auto-fail');
  });

  it('frightened (situational) does NOT auto-impose disadvantage on ability checks', async () => {
    const doc = makeDoc({
      baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      conditions: [{ id: 'frightened', name: 'Frightened' }],
    });
    const result = await engine.rollCheck(doc, 'str');
    expect(result.formula).toBe('1d20 + 2');
  });
});
