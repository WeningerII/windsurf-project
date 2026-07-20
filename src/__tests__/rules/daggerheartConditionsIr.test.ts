import { describe, it, expect } from 'vitest';

import {
  collectDaggerheartConditionEffects,
  hasDaggerheartConditionEffects,
  DAGGERHEART_CONDITION_IDS,
} from '../../rules';
import { DaggerheartEngine } from '../../systems/daggerheart/engine';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import type { CharacterDocument } from '../../types/core/document';

/**
 * PHASE 2 (RFC 003): Daggerheart's conditions (Vulnerable/Restrained/Hidden) are
 * note-only in the shared IR — they change INCOMING rolls/movement, never the
 * bearer's own duality roll. These tests pin the catalog and confirm the engine's
 * provenance seam leaves the duality roll byte-identical.
 */

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');
const engine = new DaggerheartEngine();

function doc(over: Partial<DaggerheartDataModel> = {}): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-conditions-ir',
    name: 'DH Character',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

describe('Daggerheart condition ids', () => {
  it('exposes the catalog-backed condition ids', () => {
    expect(DAGGERHEART_CONDITION_IDS).toEqual(['vulnerable', 'restrained', 'hidden']);
  });

  it('hasDaggerheartConditionEffects recognizes only catalog ids', () => {
    expect(hasDaggerheartConditionEffects('vulnerable')).toBe(true);
    expect(hasDaggerheartConditionEffects('poisoned')).toBe(false);
  });
});

describe('Daggerheart condition effects compile to note-only IR', () => {
  it('emits a note effect per active condition, with a manual boundary', () => {
    const effects = collectDaggerheartConditionEffects(['vulnerable', 'restrained']);
    expect(effects).toHaveLength(2);
    for (const e of effects) {
      expect(e.systemId).toBe('daggerheart');
      expect(e.operation).toBe('note');
      expect(e.value).toBeNull();
      expect(e.target).toBe('attack');
      expect(e.manualBoundary?.kind).toBe('manual');
      expect(e.condition?.kind).toBe('has-condition');
      expect(e.source.kind).toBe('condition');
    }
    expect(effects.map((e) => e.source.id)).toEqual(['vulnerable', 'restrained']);
  });

  it('unknown ids contribute nothing', () => {
    expect(collectDaggerheartConditionEffects(['poisoned', 'prone'])).toHaveLength(0);
  });
});

describe('engine provenance seam does not change the duality roll', () => {
  it('PRESERVED: a plain roll has no condition provenance in its flavor', async () => {
    const result = await engine.rollCheck(doc(), 'agility');
    expect(result.formula).toBe('2d12 + 0 (agility)');
    expect(result.terms).toHaveLength(2);
    expect(result.flavor).not.toContain('[');
  });

  it('self-conditions are surfaced as provenance only (total/terms unchanged)', async () => {
    const withConds = doc({ conditions: ['vulnerable'] } as Partial<DaggerheartDataModel>);
    const result = await engine.rollCheck(withConds, 'agility');
    // The duality total is still hope + fear + mod (mod = 0); provenance never
    // folds into the roll math.
    expect(result.total).toBe(result.terms[0] + result.terms[1] + 0);
    // The provenance suffix surfaces each condition's source.label, which the
    // catalog sets to the (lowercase) condition id.
    expect(result.flavor).toContain('vulnerable');
  });
});
