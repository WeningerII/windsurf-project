import { describe, it, expect } from 'vitest';

import { createSeededRng } from '../../scene/seededRng';
import {
  effectApplies,
  makeEffectId,
  resolveEffects,
  toContributionLedger,
  type EffectInstance,
} from '../../rules';

/**
 * Proof that ONE `EffectInstance` shape encodes every system's stacking rules.
 * Each case below is a worked encoding from `docs/rfc/003-rules-ir-and-effects.md`.
 * Only `systemId`, `target`, and `stackPolicy` differ between systems — the
 * structure is identical. That is "system-tagged, not system-shaped."
 */

function effect(
  partial: Partial<EffectInstance> &
    Pick<EffectInstance, 'target' | 'operation' | 'value' | 'stackPolicy' | 'systemId'>
): EffectInstance {
  return {
    id:
      partial.id ??
      makeEffectId(partial.systemId, partial.target, partial.label ?? '', String(partial.value)),
    label: partial.label ?? 'effect',
    source: partial.source ?? { kind: 'custom', label: 'test' },
    ...partial,
  };
}

describe('resolveEffects — cross-system stacking parity (RFC 003 worked encodings)', () => {
  it('D&D 5e +1 magic weapon: attack and damage both add (stackPolicy sum)', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'attack',
        operation: 'add',
        value: 3,
        stackPolicy: 'sum',
        label: 'Proficiency + STR',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'sum',
        label: '+1 Longsword',
        source: { kind: 'item', id: 'longsword-1', label: '+1 Longsword' },
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage.slashing',
        operation: 'add',
        value: 3,
        stackPolicy: 'sum',
        label: 'STR',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage.slashing',
        operation: 'add',
        value: 1,
        stackPolicy: 'sum',
        label: '+1 Longsword',
        source: { kind: 'item', id: 'longsword-1', label: '+1 Longsword' },
      }),
    ];
    const result = resolveEffects(effects);
    expect(result.byTarget.attack.total).toBe(4);
    expect(result.byTarget['damage.slashing'].total).toBe(4);
  });

  it('PF2e item/status/circumstance: highest per bucket, buckets sum', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'pf2e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-item',
        label: 'Weapon Potency (item)',
      }),
      // A second, smaller item bonus must NOT stack — only the highest item bonus counts.
      effect({
        systemId: 'pf2e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-circumstance',
        label: 'Aid (circumstance)',
      }),
      effect({
        systemId: 'pf2e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-status',
        label: 'Bless (status)',
      }),
    ];
    const result = resolveEffects(effects);
    // +1 item + +1 circumstance + +1 status = +3
    expect(result.byTarget.attack.total).toBe(3);
  });

  it('PF2e: two bonuses in the same bucket do not stack (highest wins)', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'pf2e',
        target: 'ac',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-status',
        label: 'minor status',
      }),
      effect({
        systemId: 'pf2e',
        target: 'ac',
        operation: 'add',
        value: 2,
        stackPolicy: 'pf2e-status',
        label: 'greater status',
      }),
    ];
    const result = resolveEffects(effects);
    expect(result.byTarget.ac.total).toBe(2);
  });

  it('D&D 3.5e enhancement bonus: same-type bonuses do not stack (largest only)', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-3.5e',
        target: 'attack',
        operation: 'add',
        value: 2,
        stackPolicy: { bonusType: 'enhancement' },
        label: '+2 Longsword',
      }),
      effect({
        systemId: 'dnd-3.5e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: { bonusType: 'enhancement' },
        label: 'lesser enhancement',
      }),
    ];
    const result = resolveEffects(effects);
    // Only the largest enhancement (+2) applies.
    expect(result.byTarget.attack.total).toBe(2);
  });

  it('PF1e size + enhancement on AC: different named types both apply', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'pf1e',
        target: 'ac',
        operation: 'set',
        value: 10,
        stackPolicy: 'sum',
        label: 'base AC',
      }),
      effect({
        systemId: 'pf1e',
        target: 'ac',
        operation: 'add',
        value: 1,
        stackPolicy: { bonusType: 'racial' },
        label: 'Small size',
      }),
      effect({
        systemId: 'pf1e',
        target: 'ac',
        operation: 'add',
        value: 1,
        stackPolicy: { bonusType: 'enhancement' },
        label: '+1 Chain Shirt',
      }),
    ];
    const result = resolveEffects(effects);
    // 10 base + 1 size + 1 enhancement = 12
    expect(result.byTarget.ac.total).toBe(12);
  });

  it('M&M 3e power cost math: per-rank costs sum', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'mam3e',
        target: 'cost.power.0.perRank',
        operation: 'add',
        value: 1,
        stackPolicy: 'sum',
        category: 'cost',
        label: 'Blast base',
      }),
      effect({
        systemId: 'mam3e',
        target: 'cost.power.0.perRank',
        operation: 'add',
        value: 1,
        stackPolicy: 'sum',
        category: 'cost',
        label: 'Area extra',
      }),
      effect({
        systemId: 'mam3e',
        target: 'defense.toughness',
        operation: 'add',
        value: 8,
        stackPolicy: 'sum',
        category: 'defense',
        label: 'Protection 8',
      }),
    ];
    const result = resolveEffects(effects);
    expect(result.byTarget['cost.power.0.perRank'].total).toBe(2);
    expect(result.byTarget['defense.toughness'].total).toBe(8);
  });

  it('Daggerheart armor score / severe threshold: additive, gated while armored', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'daggerheart',
        target: 'armorScore',
        operation: 'add',
        value: 3,
        stackPolicy: 'sum',
        category: 'defense',
        label: 'Gambeson',
        condition: { kind: 'while-armored' },
      }),
      effect({
        systemId: 'daggerheart',
        target: 'severeThreshold',
        operation: 'add',
        value: 9,
        stackPolicy: 'sum',
        category: 'defense',
        label: 'Gambeson',
      }),
    ];
    const armored = resolveEffects(effects, { armored: true });
    expect(armored.byTarget.armorScore.total).toBe(3);
    expect(armored.byTarget.severeThreshold.total).toBe(9);

    // While unarmored, the armor-score effect drops out; threshold (ungated) stays.
    const unarmored = resolveEffects(effects, { armored: false });
    expect(unarmored.byTarget.armorScore).toBeUndefined();
    expect(unarmored.byTarget.severeThreshold.total).toBe(9);
  });
});

describe('resolveEffects — operation semantics', () => {
  it('set establishes a base, then sum adds on top', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2024',
        target: 'ac',
        operation: 'set',
        value: 14,
        stackPolicy: 'sum',
        label: 'half plate base',
      }),
      effect({
        systemId: 'dnd-5e-2024',
        target: 'ac',
        operation: 'add',
        value: 2,
        stackPolicy: 'sum',
        label: 'shield',
      }),
    ];
    expect(resolveEffects(effects).byTarget.ac.total).toBe(16);
  });

  it('multiply applies to the running total (e.g. terrain halving)', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage.fire',
        operation: 'set',
        value: 10,
        stackPolicy: 'sum',
        label: 'fire damage',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage.fire',
        operation: 'multiply',
        value: 0.5,
        stackPolicy: 'sum',
        label: 'deep water',
        source: { kind: 'terrain', id: 'deep-water', label: 'Deep water' },
      }),
    ];
    expect(resolveEffects(effects).byTarget['damage.fire'].total).toBe(5);
  });

  it('advantage and disadvantage cancel to normal (5e)', () => {
    const adv: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'attack',
        operation: 'advantage',
        value: null,
        stackPolicy: 'sum',
        label: 'prone target (melee)',
      }),
    ];
    expect(resolveEffects(adv).byTarget.attack.rollMode).toBe('advantage');

    const both: EffectInstance[] = [
      ...adv,
      effect({
        systemId: 'dnd-5e-2014',
        target: 'attack',
        operation: 'disadvantage',
        value: null,
        stackPolicy: 'sum',
        label: 'attacker poisoned',
      }),
    ];
    expect(resolveEffects(both).byTarget.attack.rollMode).toBe('normal');
  });

  it('min/max clamp the total', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'mam3e',
        target: 'hp',
        operation: 'set',
        value: 0,
        stackPolicy: 'sum',
        label: 'base',
      }),
      effect({
        systemId: 'mam3e',
        target: 'hp',
        operation: 'subtract',
        value: 5,
        stackPolicy: 'sum',
        label: 'damage',
      }),
      effect({
        systemId: 'mam3e',
        target: 'hp',
        operation: 'min',
        value: 1,
        stackPolicy: 'sum',
        label: 'floor at 1',
      }),
    ];
    expect(resolveEffects(effects).byTarget.hp.total).toBe(1);
  });
});

describe('effectApplies — condition gating', () => {
  const base = (condition: EffectInstance['condition']): EffectInstance =>
    effect({
      systemId: 'dnd-5e-2014',
      target: 'x',
      operation: 'add',
      value: 1,
      stackPolicy: 'sum',
      label: 't',
      condition,
    });

  it('omitted condition always applies', () => {
    expect(effectApplies(undefined, {})).toBe(true);
  });

  it('has-condition gates on the subject condition set', () => {
    const e = base({ kind: 'has-condition', conditionId: 'prone' });
    expect(effectApplies(e.condition, { conditions: new Set(['prone']) })).toBe(true);
    expect(effectApplies(e.condition, { conditions: new Set() })).toBe(false);
  });

  it('while-equipped gates on equipped item ids', () => {
    const e = base({ kind: 'while-equipped', itemId: 'ring-of-protection' });
    expect(effectApplies(e.condition, { equippedItemIds: new Set(['ring-of-protection']) })).toBe(
      true
    );
    expect(effectApplies(e.condition, { equippedItemIds: new Set(['other']) })).toBe(false);
  });

  it('ability-threshold gates on a minimum score', () => {
    const e = base({ kind: 'ability-threshold', ability: 'str', min: 13 });
    expect(effectApplies(e.condition, { abilities: { str: 14 } })).toBe(true);
    expect(effectApplies(e.condition, { abilities: { str: 12 } })).toBe(false);
  });

  it('unknown condition kinds fail closed (never apply)', () => {
    const e = base({ kind: 'made-up-kind' } as unknown as EffectInstance['condition']);
    expect(effectApplies(e.condition, {})).toBe(false);
  });
});

describe('resolveEffects — determinism', () => {
  it('same effects + same seed yield byte-identical dice', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add-die',
        value: 8,
        stackPolicy: 'sum',
        label: '1d8 longsword',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add',
        value: 3,
        stackPolicy: 'sum',
        label: 'STR',
      }),
    ];
    const a = resolveEffects(effects, { rng: createSeededRng('seed-42') });
    const b = resolveEffects(effects, { rng: createSeededRng('seed-42') });
    expect(a.byTarget.damage.diceTerms).toEqual(b.byTarget.damage.diceTerms);
    expect(a.byTarget.damage.total).toBe(b.byTarget.damage.total);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('different seeds can produce different rolls', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add-die',
        value: 20,
        stackPolicy: 'sum',
        label: '1d20',
      }),
    ];
    const a = resolveEffects(effects, { rng: createSeededRng('aaa') });
    const b = resolveEffects(effects, { rng: createSeededRng('zzz') });
    // Not guaranteed unequal in general, but for these seeds they differ.
    expect(a.byTarget.damage.total).not.toBe(b.byTarget.damage.total);
  });

  it('no dice are rolled without an rng (fold stays pure)', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add-die',
        value: 8,
        stackPolicy: 'sum',
        label: '1d8',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add',
        value: 3,
        stackPolicy: 'sum',
        label: 'STR',
      }),
    ];
    const result = resolveEffects(effects);
    expect(result.byTarget.damage.diceTerms).toBeUndefined();
    expect(result.byTarget.damage.total).toBe(3);
  });
});

describe('toContributionLedger — the ledger is a projection of the same primitive', () => {
  it('every applied effect becomes a ledger entry preserving target/source/value', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'armorClass',
        operation: 'set',
        value: 13,
        stackPolicy: 'sum',
        category: 'defense',
        label: 'studded leather',
        source: { kind: 'item', id: 'studded-leather', label: 'Studded Leather' },
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'armorClass',
        operation: 'add',
        value: 2,
        stackPolicy: 'sum',
        category: 'defense',
        label: 'DEX',
        source: { kind: 'system', label: 'Dexterity' },
      }),
    ];
    const result = resolveEffects(effects);
    const ledger = toContributionLedger(result.ledger);
    expect(ledger.entries).toHaveLength(2);
    expect(ledger.entries[0]).toMatchObject({
      target: 'armorClass',
      operation: 'set',
      value: 13,
      category: 'defense',
      source: { kind: 'item', id: 'studded-leather' },
    });
    expect(ledger.entries[1]).toMatchObject({ operation: 'add', value: 2 });
  });

  it('resolver-only operations normalize into the ledger enum', () => {
    const effects: EffectInstance[] = [
      effect({
        systemId: 'dnd-5e-2014',
        target: 'damage',
        operation: 'add-die',
        value: 8,
        stackPolicy: 'sum',
        label: '1d8',
      }),
      effect({
        systemId: 'dnd-5e-2014',
        target: 'attack',
        operation: 'advantage',
        value: null,
        stackPolicy: 'sum',
        label: 'prone',
      }),
    ];
    const ledger = toContributionLedger(effects);
    expect(ledger.entries[0].operation).toBe('add'); // add-die -> add
    expect(ledger.entries[1].operation).toBe('add'); // advantage -> add (annotation)
  });

  it('uncategorized effects default to the "other" ledger category', () => {
    const ledger = toContributionLedger([
      effect({
        systemId: 'pf2e',
        target: 'attack',
        operation: 'add',
        value: 1,
        stackPolicy: 'pf2e-item',
        label: 'rune',
      }),
    ]);
    expect(ledger.entries[0].category).toBe('other');
  });
});
