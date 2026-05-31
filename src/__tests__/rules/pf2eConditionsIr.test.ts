import { describe, it, expect } from 'vitest';

import {
  collectPf2eConditionEffects,
  getPf2eConditionStatusPenalty,
  resolveEffects,
  type Pf2eConditionLike,
} from '../../rules';

/**
 * PHASE 3 (RFC 003): PF2e status-condition penalties are now defined once in the
 * shared IR and consumed by the engine. These tests pin the selector (matching
 * the engine's previously hard-coded behavior) and the resolver's PF2e penalty
 * stacking fix (worst penalty applies, bonuses and penalties of one type coexist).
 */

const conds = (...entries: Pf2eConditionLike[]): Pf2eConditionLike[] => entries;

describe('PF2e status-penalty selector (parity with the engine)', () => {
  it('frightened and sickened apply to every check; worst applies', () => {
    expect(
      getPf2eConditionStatusPenalty(
        conds({ name: 'Frightened', value: 2 }, { name: 'Sickened', value: 1 })
      )
    ).toBe(2);
  });

  it('enfeebled is Str-scoped; frightened is universal — worst relevant applies', () => {
    const c = conds({ name: 'Enfeebled', value: 2 }, { name: 'Frightened', value: 1 });
    // Strength check sees enfeebled(2) and frightened(1) → 2.
    expect(getPf2eConditionStatusPenalty(c, 'str')).toBe(2);
    // Dexterity check sees only frightened(1) → 1.
    expect(getPf2eConditionStatusPenalty(c, 'dex')).toBe(1);
  });

  it('clumsy → dex, drained → con, stupefied → mental', () => {
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Clumsy', value: 3 }), 'dex')).toBe(3);
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Clumsy', value: 3 }), 'str')).toBe(0);
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Drained', value: 1 }), 'con')).toBe(1);
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Stupefied', value: 2 }), 'wis')).toBe(2);
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Stupefied', value: 2 }), 'dex')).toBe(0);
  });

  it('defaults a valueless condition to magnitude 1', () => {
    expect(getPf2eConditionStatusPenalty(conds({ name: 'Frightened' }))).toBe(1);
  });

  it('no conditions → no penalty', () => {
    expect(getPf2eConditionStatusPenalty(conds(), 'str')).toBe(0);
  });
});

describe('PF2e condition effects compile to status penalties (provenance)', () => {
  it('emits a negative pf2e-status effect per active condition', () => {
    const effects = collectPf2eConditionEffects(conds({ name: 'Frightened', value: 2 }));
    expect(effects).toHaveLength(1);
    expect(effects[0]).toMatchObject({
      systemId: 'pf2e',
      operation: 'subtract',
      value: 2,
      stackPolicy: 'pf2e-status',
      source: { kind: 'condition', id: 'frightened' },
    });
  });
});

describe('resolver PF2e penalty stacking fix', () => {
  it('two status penalties do not stack — the worst applies', () => {
    const result = resolveEffects([
      {
        id: 'a',
        systemId: 'pf2e',
        target: 'attack',
        operation: 'subtract',
        value: 1,
        stackPolicy: 'pf2e-status',
        source: { kind: 'condition', label: 'sickened' },
        label: 'sickened',
      },
      {
        id: 'b',
        systemId: 'pf2e',
        target: 'attack',
        operation: 'subtract',
        value: 2,
        stackPolicy: 'pf2e-status',
        source: { kind: 'condition', label: 'frightened' },
        label: 'frightened',
      },
    ]);
    // Worst penalty is -2 (not -3).
    expect(result.byTarget.attack.total).toBe(-2);
  });

  it('a status bonus and a status penalty both apply (do not cancel via max)', () => {
    const result = resolveEffects([
      {
        id: 'bonus',
        systemId: 'pf2e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-status',
        source: { kind: 'spell', label: 'bless' },
        label: 'bless',
      },
      {
        id: 'pen',
        systemId: 'pf2e',
        target: 'attack',
        operation: 'subtract',
        value: 2,
        stackPolicy: 'pf2e-status',
        source: { kind: 'condition', label: 'frightened' },
        label: 'frightened',
      },
    ]);
    // +1 status bonus and -2 status penalty → -1 (both apply).
    expect(result.byTarget.attack.total).toBe(-1);
  });
});
