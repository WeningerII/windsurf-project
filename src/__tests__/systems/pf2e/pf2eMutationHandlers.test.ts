import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Pf2eDataModel } from '../../../systems/pf2e/data-model';
import { createDefaultPf2eData } from '../../../systems/pf2e/data-model';
import { nextPf2eTier } from '../../../systems/pf2e/pf2eSheetShared';
import { usePf2eMutationHandlers } from '../../../systems/pf2e/usePf2eMutationHandlers';

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-mutation-test',
    name: 'Mutation Test',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function renderHandlers(
  document: CharacterDocument<Pf2eDataModel>,
  onUpdate: ReturnType<typeof makeOnUpdate> | undefined
) {
  return renderHook(() => usePf2eMutationHandlers({ document, onUpdate }));
}

function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<Pf2eDataModel> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Pf2eDataModel>;
}

describe('usePf2eMutationHandlers', () => {
  it('is a read-only no-op without onUpdate', () => {
    const { result } = renderHandlers(makeDoc(), undefined);
    expect(result.current.canUpdate).toBe(false);
    expect(() =>
      act(() => {
        result.current.update({ speed: 30 });
        result.current.onNameChange('Ignored');
      })
    ).not.toThrow();
    // Rest handlers are gated off entirely in read-only mode.
    expect(result.current.onShortRest).toBeUndefined();
    expect(result.current.onLongRest).toBeUndefined();
  });

  it('renames through onNameChange', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);
    act(() => result.current.onNameChange('Seelah'));
    expect(latest(onUpdate).name).toBe('Seelah');
  });

  it('cycles a skill tier up and stamps it as a manual source', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ skillProficiencies: { athletics: { tier: 'untrained', total: 0 } } }),
      onUpdate
    );

    act(() => result.current.cycleSkillTier('athletics'));

    expect(latest(onUpdate).system.skillProficiencies.athletics).toMatchObject({
      tier: nextPf2eTier('untrained'),
      source: ['manual'],
    });
  });

  it('cycles save, perception, and class DC tiers', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);
    const doc = makeDoc();

    act(() => result.current.cycleSaveTier('fortitude'));
    expect(latest(onUpdate).system.saveProficiencies.fortitude.tier).toBe(
      nextPf2eTier(doc.system.saveProficiencies.fortitude.tier)
    );

    act(() => result.current.cyclePerceptionTier());
    expect(latest(onUpdate).system.perceptionProficiency.tier).toBe(
      nextPf2eTier(doc.system.perceptionProficiency.tier)
    );

    act(() => result.current.cycleClassDcTier());
    expect(latest(onUpdate).system.classDcProficiency?.tier).toBe(
      nextPf2eTier(doc.system.classDcProficiency?.tier ?? 'trained')
    );
  });

  it('cycles spell proficiency only when the character casts', () => {
    const noCaster = makeOnUpdate();
    const { result: withoutCasting } = renderHandlers(makeDoc(), noCaster);
    act(() => withoutCasting.current.cycleSpellProficiencyTier());
    expect(noCaster).not.toHaveBeenCalled();

    const caster = makeOnUpdate();
    const { result: withCasting } = renderHandlers(
      makeDoc({
        spellcasting: {
          proficiency: { tier: 'trained', total: 0 },
        } as Pf2eDataModel['spellcasting'],
      }),
      caster
    );
    act(() => withCasting.current.cycleSpellProficiencyTier());
    expect(latest(caster).system.spellcasting?.proficiency.tier).toBe(nextPf2eTier('trained'));
  });

  it('persists a max-HP edit as a maxBonus delta over the computed baseline', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ hitPoints: { current: 10, max: 20, temp: 0, maxBonus: 3 } }),
      onUpdate
    );

    // Baseline = 20 − 3 = 17, so a new max of 25 persists as +8.
    act(() => result.current.updateHitPoints(15, 25));

    expect(latest(onUpdate).system.hitPoints).toMatchObject({
      current: 15,
      max: 25,
      maxBonus: 8,
    });
  });

  it('recovers HP on a short rest and fully restores on a long rest', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({ level: 1, heroPoints: 0, hitPoints: { current: 5, max: 20, temp: 4 } }),
      onUpdate
    );

    act(() => result.current.onShortRest!());
    // Recovered = max(1, floor(level/2)) = 1 at level 1.
    expect(latest(onUpdate).system.hitPoints.current).toBe(6);

    act(() => result.current.onLongRest!());
    expect(latest(onUpdate).system.hitPoints).toMatchObject({ current: 20, temp: 0 });
    expect(latest(onUpdate).system.heroPoints).toBe(1);
  });

  it('removes a feat by id', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({
        feats: [
          { id: 'power-attack', name: 'Power Attack' },
          { id: 'sudden-charge', name: 'Sudden Charge' },
        ] as Pf2eDataModel['feats'],
      }),
      onUpdate
    );

    act(() => result.current.removeFeat('power-attack'));

    expect(latest(onUpdate).system.feats.map((feat) => feat.id)).toEqual(['sudden-charge']);
  });

  it('adds and removes inventory items', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDoc(), onUpdate);

    act(() =>
      result.current.addInventoryItem({ id: 'rope', name: 'Rope', quantity: 1, weight: 1 })
    );
    expect(latest(onUpdate).system.inventory.at(-1)).toMatchObject({
      itemId: 'rope',
      name: 'Rope',
      bulk: 1,
    });

    const withItem = makeDoc({
      inventory: [{ itemId: 'rope', name: 'Rope', quantity: 1, bulk: 1 }],
    });
    const remover = makeOnUpdate();
    const { result: removerResult } = renderHandlers(withItem, remover);
    act(() => removerResult.current.removeInventoryItem('rope'));
    expect(latest(remover).system.inventory).toEqual([]);
  });

  it('equips armor and a shield, each replacing its kind', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({
        equipment: [{ itemId: 'leather', name: 'Leather', bulk: 1, equipped: true, armorClass: 1 }],
      }),
      onUpdate
    );

    act(() =>
      result.current.equipArmor({
        id: 'plate',
        name: 'Full Plate',
        armorClass: 6,
        armorType: 'heavy',
        dexBonusMax: 0,
      })
    );
    const armor = latest(onUpdate).system.equipment;
    expect(armor).toHaveLength(1);
    expect(armor[0]).toMatchObject({ itemId: 'plate', equipped: true, armorClass: 6 });

    const shieldDoc = makeDoc();
    const shieldUpdate = makeOnUpdate();
    const { result: shieldResult } = renderHandlers(shieldDoc, shieldUpdate);
    act(() =>
      shieldResult.current.equipShield({ id: 'steel-shield', name: 'Steel Shield', shieldBonus: 2 })
    );
    // CRB: a freshly equipped shield is not raised until the Raise a Shield action.
    expect(latest(shieldUpdate).system.equipment.at(-1)).toMatchObject({
      itemId: 'steel-shield',
      shieldBonus: 2,
      raised: false,
    });
  });

  it('toggles the equipped shield raised state, and does nothing without a shield', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDoc({
        equipment: [
          {
            itemId: 'steel-shield',
            name: 'Steel Shield',
            bulk: 1,
            equipped: true,
            shieldBonus: 2,
            raised: false,
          },
        ],
      }),
      onUpdate
    );
    act(() => result.current.toggleShieldRaised());
    expect(latest(onUpdate).system.equipment[0]).toMatchObject({ raised: true });

    const noShield = makeOnUpdate();
    const { result: noShieldResult } = renderHandlers(makeDoc(), noShield);
    act(() => noShieldResult.current.toggleShieldRaised());
    expect(noShield).not.toHaveBeenCalled();
  });

  it('unequips armor and shields independently', () => {
    const equipment = [
      { itemId: 'plate', name: 'Full Plate', bulk: 4, equipped: true, armorClass: 6 },
      { itemId: 'steel-shield', name: 'Steel Shield', bulk: 1, equipped: true, shieldBonus: 2 },
    ];

    const armorUpdate = makeOnUpdate();
    const { result: armorResult } = renderHandlers(makeDoc({ equipment }), armorUpdate);
    act(() => armorResult.current.unequipArmor());
    expect(latest(armorUpdate).system.equipment.map((entry) => entry.itemId)).toEqual([
      'steel-shield',
    ]);

    const shieldUpdate = makeOnUpdate();
    const { result: shieldResult } = renderHandlers(makeDoc({ equipment }), shieldUpdate);
    act(() => shieldResult.current.unequipShield());
    expect(latest(shieldUpdate).system.equipment.map((entry) => entry.itemId)).toEqual(['plate']);
  });
});
