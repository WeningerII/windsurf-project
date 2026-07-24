import { describe, expect, it } from 'vitest';

import {
  collectD20LegacyConditionEffects,
  collectDaggerheartConditionEffects,
  collectDnd5eConditionEffects,
  collectMam3eConditionEffects,
  collectPf2eConditionEffects,
  getPf2eConditionStatusPenalty,
  mam3eToughnessPenalty,
  resolveCharacterEffects,
  type Pf2eConditionLike,
} from '../../rules';
import type { Mam3eConditionTrack } from '../../systems/mam3e/data-model';

/**
 * W5 CONTRACT PROOF (RFC 003): conditions fold through `resolveCharacterEffects`.
 *
 * The `conditions` input is system-AGNOSTIC — it consumes `EffectInstance[]` from
 * any system's `collectXConditionEffects` helper — so every system's condition
 * vocabulary expresses in the SAME fold. These tests pin one condition per family
 * and assert the resolver reproduces the system's helper math exactly (differential
 * equivalence), plus the additive principle (no conditions ⇒ identical output).
 */

describe('conditions fold through resolveCharacterEffects (system-agnostic contract)', () => {
  it('5e disadvantage: poisoned folds to a disadvantage roll mode on attack', () => {
    const resolved = resolveCharacterEffects('dnd-5e-2014', {
      conditions: collectDnd5eConditionEffects(['poisoned']),
    });
    expect(resolved.result.byTarget.attack?.rollMode).toBe('disadvantage');
    expect(resolved.result.byTarget['ability-check']?.rollMode).toBe('disadvantage');
    // The folded effects appear in the ledger (they no longer bypass provenance).
    expect(resolved.result.ledger.length).toBeGreaterThan(0);
    expect(resolved.result.ledger.every((e) => e.source.kind === 'condition')).toBe(true);
  });

  it('d20 check-penalty: shaken folds to a flat -2 on attack', () => {
    const resolved = resolveCharacterEffects('dnd-3.5e', {
      conditions: collectD20LegacyConditionEffects('dnd-3.5e', ['shaken']),
    });
    expect(resolved.bonus('attack')).toBe(-2);
  });

  it('PF2e status penalty: the folded worst status penalty equals the helper', () => {
    const conditions: Pf2eConditionLike[] = [
      { name: 'frightened', value: 2 },
      { name: 'sickened', value: 1 },
      { name: 'clumsy', value: 3 },
    ];
    const resolved = resolveCharacterEffects('pf2e', {
      conditions: collectPf2eConditionEffects(conditions),
    });
    // 'all'-scoped conditions (frightened/sickened) land on 'check'; clumsy on
    // 'check.dex'. In each pf2e-status bucket only the single worst penalty applies.
    expect(-resolved.bonus('check')).toBe(getPf2eConditionStatusPenalty(conditions));
    expect(-resolved.bonus('check.dex')).toBe(getPf2eConditionStatusPenalty(conditions, 'dex'));
  });

  it('M&M Toughness penalty: bruised folds to -bruised on toughness (equals helper)', () => {
    const track = { bruised: 3, dazed: false, staggered: false, incapacitated: false };
    const resolved = resolveCharacterEffects('mam3e', {
      conditions: collectMam3eConditionEffects(track as Mam3eConditionTrack),
    });
    expect(-resolved.bonus('toughness')).toBe(mam3eToughnessPenalty(track));
    expect(resolved.bonus('toughness')).toBe(-3);
  });

  it('Daggerheart note: conditions appear in the ledger but fold to zero (additive)', () => {
    const conditionEffects = collectDaggerheartConditionEffects(['vulnerable', 'restrained']);
    const resolved = resolveCharacterEffects('daggerheart', { conditions: conditionEffects });
    // The notes are surfaced in the resolver result...
    expect(resolved.result.ledger).toEqual(conditionEffects);
    // ...but contribute no magnitude to any target.
    expect(resolved.bonus('attack')).toBe(0);
    expect(resolved.result.byTarget.attack?.rollMode).toBeUndefined();
  });

  it('additive principle: no conditions resolves identically to an empty fold', () => {
    const withUndefined = resolveCharacterEffects('pf2e', {
      equipment: [{ itemId: 'ring', acBonus: 1 }],
    });
    const withEmpty = resolveCharacterEffects('pf2e', {
      equipment: [{ itemId: 'ring', acBonus: 1 }],
      conditions: [],
    });
    expect(JSON.stringify(withUndefined.result)).toBe(JSON.stringify(withEmpty.result));
  });
});
