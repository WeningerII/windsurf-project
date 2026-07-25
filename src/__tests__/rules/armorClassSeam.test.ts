import { describe, expect, it } from 'vitest';

import {
  computeDnd5eBaseArmorClass,
  resolveD20LegacyArmorClass,
  resolveDnd5eArmorClass,
  resolvePf2eArmorClass,
} from '../../rules';
import { getPf2eConditionStatusPenalty } from '../../rules/conditions/pf2eConditions';
import { Dnd5eEngine } from '../../systems/dnd5e/engine';
import { Dnd5e2024Engine } from '../../systems/dnd5e-2024/engine';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { Pf2eEngine } from '../../systems/pf2e/engine';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { createDefaultPf2eData, profTotal } from '../../systems/pf2e/data-model';
import { applyDerivedQuantities } from '../../rules/derivation';
import { DND35E_DERIVED_QUANTITIES } from '../../systems/dnd35e/derivedQuantities';
import { PF1E_DERIVED_QUANTITIES } from '../../systems/pf1e/derivedQuantities';
import { PF2E_DERIVED_QUANTITIES } from '../../systems/pf2e/derivedQuantities';
import { abilityMod } from '../../utils/math';
import type { CharacterDocument } from '../../types/core/document';

/**
 * RFC 003 CONSOLIDATION GATE: armor class is composed in exactly ONE place.
 *
 * `rules/compile/armorClass.ts` holds the base-formula → resolver-fold
 * composition that used to be copy-pasted across each engine, each engine's
 * declarative `derivedQuantities.ts` twin, and (for 5e's Unarmored Defense
 * max-fold) the contribution ledger. These tests pin that the engine-prepared
 * value, the declared derived quantity, and the shared helper agree EXACTLY over
 * a gear/ability/size matrix — so a future edit to any one of them cannot
 * reintroduce a second, silently diverging code path.
 */

const DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(systemId: string, system: any): CharacterDocument<any> {
  return {
    id: 'ac-seam',
    name: 'AC Seam',
    systemId,
    system,
    createdAt: DATE,
    updatedAt: DATE,
  };
}

const ABILITIES = [
  { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 10 },
  { str: 8, dex: 20, con: 10, int: 16, wis: 16, cha: 14 },
];

const GEAR: Array<{ name: string; equipment: any[] }> = [
  { name: 'none', equipment: [] },
  {
    name: 'light',
    equipment: [
      { itemId: 'leather', equipped: true, slot: 'chest', armorClass: 11, armorType: 'light' },
    ],
  },
  {
    name: 'medium-capped',
    equipment: [
      {
        itemId: 'half-plate',
        equipped: true,
        slot: 'chest',
        armorClass: 15,
        armorType: 'medium',
        dexBonusMax: 2,
      },
    ],
  },
  {
    name: 'magic',
    equipment: [
      {
        itemId: 'plus-two-plate',
        equipped: true,
        slot: 'chest',
        armorClass: 18,
        armorType: 'heavy',
        acBonus: 2,
      },
      {
        itemId: 'shield',
        equipped: true,
        slot: 'offHand',
        shieldBonus: 2,
        acBonus: 1,
        raised: true,
      },
      { itemId: 'ring-of-protection', equipped: true, acBonus: 1 },
    ],
  },
];

describe('armor class is composed in exactly one place (RFC 003)', () => {
  describe.each([
    { id: 'dnd-3.5e' as const, engine: new Dnd35eEngine(), make: createDefaultDnd35eData },
    { id: 'pf1e' as const, engine: new Pf1eEngine(), make: createDefaultPf1eData },
  ])('$id', ({ id, engine, make }) => {
    it('engine AC, the declared derived quantity, and the shared helper all agree', () => {
      for (const abilities of ABILITIES) {
        for (const gear of GEAR) {
          for (const sizeCategory of ['medium', 'small', 'large']) {
            const system: any = {
              ...make(),
              sizeCategory,
              baseAttributes: { ...abilities },
              equipment: gear.equipment,
            };
            const prepared = engine.prepareData(doc(id, system) as any).system as any;
            const shared = resolveD20LegacyArmorClass(id, system);
            const specs = id === 'dnd-3.5e' ? DND35E_DERIVED_QUANTITIES : PF1E_DERIVED_QUANTITIES;
            const derived = applyDerivedQuantities(system, specs as any);

            expect(prepared.armorClass.total).toBe(shared.total);
            expect(prepared.armorClass.touch).toBe(shared.touch);
            expect(prepared.armorClass.flatFooted).toBe(shared.flatFooted);
            expect(derived[`${id === 'dnd-3.5e' ? 'dnd35e' : 'pf1e'}.L2.ac.total`]).toBe(
              shared.total
            );
          }
        }
      }
    });
  });

  it('pf2e: engine AC, the declared derived quantity, and the shared helper all agree', () => {
    const engine = new Pf2eEngine();
    const conditionSets: Array<Array<{ id: string; name: string; value?: number }>> = [
      [],
      [{ id: 'clumsy', name: 'clumsy', value: 2 }],
      [
        { id: 'frightened', name: 'frightened', value: 3 },
        { id: 'clumsy', name: 'clumsy', value: 1 },
      ],
    ];

    for (const abilities of ABILITIES) {
      for (const gear of GEAR) {
        for (const conditions of conditionSets) {
          const system: any = {
            ...createDefaultPf2eData(),
            level: 7,
            baseAttributes: { ...abilities },
            equipment: gear.equipment,
            conditions,
          };
          const equippedArmor = system.equipment.find(
            (e: any) => e.equipped && e.armorClass != null && !e.shieldBonus
          );
          const tier =
            system.armorProficiencies[equippedArmor?.armorType ?? 'unarmored']?.tier ??
            system.armorProficiencies.unarmored?.tier ??
            'untrained';
          const shared = resolvePf2eArmorClass(
            system,
            profTotal(system.level, tier),
            getPf2eConditionStatusPenalty(conditions, 'dex')
          );
          const prepared = engine.prepareData(doc('pf2e', system) as any).system as any;
          const derived = applyDerivedQuantities(system, PF2E_DERIVED_QUANTITIES as any);

          expect(prepared.armorClass).toBe(shared);
          expect(derived['pf2e.L2.ac']).toBe(shared);
        }
      }
    }
  });

  describe.each([
    { id: 'dnd-5e-2014' as const, engine: new Dnd5eEngine(), make: createDefaultDnd5eData },
    {
      id: 'dnd-5e-2024' as const,
      engine: new Dnd5e2024Engine(),
      make: createDefaultDnd5e2024Data,
    },
  ])('$id', ({ id, engine, make }) => {
    it('engine AC equals the shared helper, including Unarmored Defense', () => {
      const featureSets: any[][] = [
        [],
        [{ id: 'unarmored-defense-barbarian', name: 'Unarmored Defense' }],
        [{ id: 'unarmored-defense-monk', name: 'Unarmored Defense' }],
        [
          { id: 'unarmored-defense-barbarian', name: 'Unarmored Defense' },
          { id: 'unarmored-defense-monk', name: 'Unarmored Defense' },
        ],
      ];

      for (const abilities of ABILITIES) {
        for (const gear of GEAR) {
          for (const features of featureSets) {
            const system: any = {
              ...make(),
              baseAttributes: { ...abilities },
              equipment: gear.equipment,
              features,
            };
            const dexMod = abilityMod(system.baseAttributes.dex ?? 10);
            const prepared = engine.prepareData(doc(id, system) as any).system as any;

            expect(prepared.armorClass).toBe(resolveDnd5eArmorClass(id, system, dexMod, 0));
          }
        }
      }
    });

    it('the ledger explains the SAME Unarmored Defense winner the engine resolves', () => {
      const system: any = {
        ...make(),
        baseAttributes: { str: 10, dex: 16, con: 18, int: 10, wis: 18, cha: 10 },
        equipment: [],
        features: [
          { id: 'unarmored-defense-barbarian', name: 'Unarmored Defense' },
          { id: 'unarmored-defense-monk', name: 'Unarmored Defense' },
        ],
      };
      const dexMod = abilityMod(16);
      const { base, plainUnarmored, unarmoredDefense } = computeDnd5eBaseArmorClass(system, dexMod);

      // Con 18 (+4) beats Wis 18 (+4) only on a tie-break of order; both are 17.
      // What matters is that the winner the ledger explains IS the engine's base.
      expect(unarmoredDefense).not.toBeNull();
      expect(base).toBe(unarmoredDefense?.total);
      expect(base - plainUnarmored).toBeGreaterThan(0);
      expect(engine.prepareData(doc(id, system) as any).system.armorClass).toBe(base);
    });
  });
});
