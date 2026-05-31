import { describe, it, expect } from 'vitest';

import type { GameSystemId } from '../../types/game-systems';
import {
  compileEquipmentEffects,
  compileModifierEffects,
  resolveEffects,
  toContributionLedger,
  type MagicBonusItem,
  type ModifierSource,
} from '../../rules';

/**
 * THE PHASE 1 PROOF POINT (RFC 003):
 * Equip an item and a feat, and have their effects on attack, AC, and damage
 * resolve deterministically through ONE shared resolver — identically across all
 * seven systems. Only the per-system stacking discipline differs, and that
 * difference is rules-as-written.
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

describe('equip parity — a +1 weapon resolves to +1 attack & +1 damage in every system', () => {
  it.each(ALL_SYSTEMS)('%s', (systemId) => {
    const plusOneWeapon: MagicBonusItem = {
      itemId: 'longsword-1',
      customName: '+1 Longsword',
      attackBonus: 1,
      damageBonus: 1,
    };

    const effects = compileEquipmentEffects(systemId, [plusOneWeapon]);
    const result = resolveEffects(effects);

    expect(result.byTarget.attack.total).toBe(1);
    expect(result.byTarget.damage.total).toBe(1);

    // The ledger names the item as the source — provenance for free.
    const ledger = toContributionLedger(result.ledger);
    expect(ledger.entries.every((e) => e.source.id === 'longsword-1')).toBe(true);
  });
});

describe('equip parity — a +1 armor resolves to +1 AC in every system', () => {
  it.each(ALL_SYSTEMS)('%s', (systemId) => {
    const plusOneArmor: MagicBonusItem = {
      itemId: 'plate-1',
      customName: '+1 Plate',
      acBonus: 1,
    };

    const result = resolveEffects(compileEquipmentEffects(systemId, [plusOneArmor]));
    expect(result.byTarget.ac.total).toBe(1);
  });
});

describe('equip parity — a feat that grants +1 attack resolves in every system', () => {
  it.each(ALL_SYSTEMS)('%s', (systemId) => {
    const featSource: ModifierSource = {
      id: 'weapon-focus',
      name: 'Weapon Focus',
      kind: 'feat',
      modifiers: [{ value: 1, type: 'attack', source: 'Weapon Focus' }],
    };

    const result = resolveEffects(compileModifierEffects(systemId, [featSource]));
    expect(result.byTarget.attack.total).toBe(1);
  });
});

describe('equip parity — combined weapon + feat attack bonuses', () => {
  it.each(ALL_SYSTEMS)('%s: +1 weapon and +1 feat both reach the attack total', (systemId) => {
    const weapon: MagicBonusItem = { itemId: 'sword-1', attackBonus: 1, damageBonus: 1 };
    const feat: ModifierSource = {
      id: 'weapon-focus',
      name: 'Weapon Focus',
      kind: 'feat',
      modifiers: [{ value: 1, type: 'attack', source: 'Weapon Focus' }],
    };

    const effects = [
      ...compileEquipmentEffects(systemId, [weapon]),
      ...compileModifierEffects(systemId, [feat]),
    ];
    const result = resolveEffects(effects);

    // 5e/Daggerheart/M&M: both sum → +2.
    // d20 (3.5e/PF1e): the feat attack bonus has no named type (sums), and the
    //   weapon's enhancement bonus is a different stacking class → still +2.
    // PF2e: weapon is an item bonus, feat attack bonus sums → +2.
    expect(result.byTarget.attack.total).toBe(2);
  });
});

describe('per-system stacking is rules-as-written (this is the ONLY difference)', () => {
  it('5e: two same-type magic AC bonuses SUM (no bonus-type system)', () => {
    const items: MagicBonusItem[] = [
      { itemId: 'plate-1', acBonus: 1 },
      { itemId: 'ring-of-protection-1', acBonus: 1 },
    ];
    const result = resolveEffects(compileEquipmentEffects('dnd-5e-2014', items));
    expect(result.byTarget.ac.total).toBe(2);
  });

  it('3.5e: two enhancement AC bonuses do NOT stack (largest only)', () => {
    const items: MagicBonusItem[] = [
      { itemId: 'plate-1', acBonus: 1 }, // default enhancement
      { itemId: 'plate-2', acBonus: 2 }, // default enhancement
    ];
    const result = resolveEffects(compileEquipmentEffects('dnd-3.5e', items));
    expect(result.byTarget.ac.total).toBe(2);
  });

  it('3.5e: enhancement + deflection AC bonuses (different types) DO stack', () => {
    const items: MagicBonusItem[] = [
      { itemId: 'plate-1', acBonus: 1, bonusType: 'enhancement' },
      { itemId: 'ring-of-protection-1', acBonus: 1, bonusType: 'luck' },
    ];
    const result = resolveEffects(compileEquipmentEffects('dnd-3.5e', items));
    expect(result.byTarget.ac.total).toBe(2);
  });

  it('PF2e: two item AC bonuses do NOT stack (highest item bonus wins)', () => {
    const items: MagicBonusItem[] = [
      { itemId: 'armor-potency-1', acBonus: 1 }, // default item bucket
      { itemId: 'armor-potency-2', acBonus: 2 }, // default item bucket
    ];
    const result = resolveEffects(compileEquipmentEffects('pf2e', items));
    expect(result.byTarget.ac.total).toBe(2);
  });

  it('PF2e: item + status + circumstance AC bonuses all stack across buckets', () => {
    const items: MagicBonusItem[] = [
      { itemId: 'armor-potency', acBonus: 1, pf2eBucket: 'item' },
      { itemId: 'shield-other', acBonus: 1, pf2eBucket: 'circumstance' },
      { itemId: 'spell-buff', acBonus: 1, pf2eBucket: 'status' },
    ];
    const result = resolveEffects(compileEquipmentEffects('pf2e', items));
    expect(result.byTarget.ac.total).toBe(3);
  });
});

describe('honest manual boundaries — ambiguous feat modifiers are not faked', () => {
  it('a bonus-type-only modifier (no inherent target) is recorded as a manual note, contributing 0', () => {
    const feat: ModifierSource = {
      id: 'mystery-feat',
      name: 'Mystery Feat',
      kind: 'feat',
      // 'enhancement' names a stacking type but no target — cannot be auto-applied.
      modifiers: [{ value: 2, type: 'enhancement', source: 'Mystery Feat' }],
    };
    const effects = compileModifierEffects('pf1e', [feat]);
    expect(effects).toHaveLength(1);
    expect(effects[0].operation).toBe('note');
    expect(effects[0].manualBoundary?.kind).toBe('manual');

    // It contributes nothing numerically to any real target.
    const result = resolveEffects(effects);
    expect(result.byTarget['modifier.enhancement'].total).toBe(0);
  });

  it('targetable modifiers (attack/ac/damage/save/skill) are applied, not noted', () => {
    const feat: ModifierSource = {
      id: 'multi',
      name: 'Multi Feat',
      kind: 'feat',
      modifiers: [
        { value: 1, type: 'attack', source: 'Multi' },
        { value: 2, type: 'armor-class', source: 'Multi' },
        { value: 1, type: 'saving-throw', source: 'Multi' },
      ],
    };
    const result = resolveEffects(compileModifierEffects('dnd-5e-2024', [feat]));
    expect(result.byTarget.attack.total).toBe(1);
    expect(result.byTarget.ac.total).toBe(2);
    expect(result.byTarget.save.total).toBe(1);
  });
});

describe('determinism — equip resolution is identical across runs in every system', () => {
  it.each(ALL_SYSTEMS)('%s yields byte-identical resolution', (systemId) => {
    const items: MagicBonusItem[] = [
      { itemId: 'sword-1', attackBonus: 1, damageBonus: 2, acBonus: 1 },
    ];
    const a = resolveEffects(compileEquipmentEffects(systemId, items));
    const b = resolveEffects(compileEquipmentEffects(systemId, items));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
