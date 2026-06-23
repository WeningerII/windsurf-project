import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Spell } from '../../../types/magic/spells';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../../systems/dnd35e/data-model';
import {
  createDefaultPf1eData,
  type Pf1eDataModel,
  type Pf1eTrait,
} from '../../../systems/pf1e/data-model';
import type { D20LegacyData } from '../../../systems/d20-legacy/d20LegacySheetShared';
import { useD20LegacyMutationHandlers } from '../../../systems/d20-legacy/useD20LegacyMutationHandlers';

function makeDnd35Doc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<D20LegacyData> {
  return {
    id: 'd20-mutation-test',
    name: 'Mutation Test',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<D20LegacyData>;
}

function makePf1Doc(overrides: Partial<Pf1eDataModel> = {}): {
  document: CharacterDocument<D20LegacyData>;
  pf1Data: Pf1eDataModel;
} {
  const pf1Data = { ...createDefaultPf1eData(), ...overrides };
  return {
    document: {
      id: 'pf1-mutation-test',
      name: 'Mutation Test',
      systemId: 'pf1e',
      system: pf1Data,
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    } as CharacterDocument<D20LegacyData>,
    pf1Data,
  };
}

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function renderHandlers(
  document: CharacterDocument<D20LegacyData>,
  onUpdate: ReturnType<typeof makeOnUpdate> | undefined,
  options: { pf1Data?: Pf1eDataModel | null; traitOptions?: Pf1eTrait[] } = {}
) {
  return renderHook(() =>
    useD20LegacyMutationHandlers({
      typedDocument: document,
      onUpdate,
      pf1Data: options.pf1Data ?? null,
      traitOptions: options.traitOptions ?? [],
    })
  );
}

function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<Dnd35eDataModel> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Dnd35eDataModel>;
}

describe('useD20LegacyMutationHandlers', () => {
  it('is a read-only no-op without onUpdate', () => {
    const { result } = renderHandlers(makeDnd35Doc(), undefined);
    expect(result.current.canUpdate).toBe(false);
    expect(result.current.onShortRest).toBeUndefined();
    expect(() => act(() => result.current.onNameChange('Ignored'))).not.toThrow();
  });

  it('renames through onNameChange', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDnd35Doc(), onUpdate);
    act(() => result.current.onNameChange('Tordek'));
    expect(latest(onUpdate).name).toBe('Tordek');
  });

  it('recovers HP on a short rest and fully restores + resets slots on a long rest', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDnd35Doc({
        level: 4,
        hitPoints: { current: 5, max: 30, temp: 3 },
        spellsPerDay: { 1: { total: 2, used: 2 } },
      }),
      onUpdate
    );

    act(() => result.current.onShortRest!());
    // Recovered = max(1, floor(4/2)) = 2.
    expect(latest(onUpdate).system.hitPoints.current).toBe(7);

    act(() => result.current.onLongRest!());
    expect(latest(onUpdate).system.hitPoints).toMatchObject({ current: 30, temp: 0 });
    expect(latest(onUpdate).system.spellsPerDay?.[1].used).toBe(0);
  });

  it('adds a custom feat and an inventory item', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDnd35Doc(), onUpdate);

    act(() => result.current.addFeat());
    expect(latest(onUpdate).system.feats.at(-1)).toMatchObject({ name: 'New Feat' });

    act(() => result.current.addItem({ id: 'torch', name: 'Torch', quantity: 2, weight: 1 }));
    expect(latest(onUpdate).system.inventory.at(-1)).toMatchObject({
      itemId: 'torch',
      quantity: 2,
      weight: 1,
    });
  });

  it('equips armor and a shield, each replacing its kind, then unequips them', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDnd35Doc({
        equipment: [
          { itemId: 'leather', name: 'Leather', equipped: true, armorClass: 2, armorType: 'light' },
        ],
      }),
      onUpdate
    );

    act(() =>
      result.current.equipArmor({
        id: 'full-plate',
        name: 'Full Plate',
        armorClass: 8,
        armorType: 'heavy',
        dexBonusMax: 1,
        armorCheckPenalty: -6,
      })
    );
    const armor = latest(onUpdate).system.equipment;
    expect(armor).toHaveLength(1);
    expect(armor[0]).toMatchObject({ itemId: 'full-plate', slot: 'armor', armorClass: 8 });

    const shieldDoc = makeDnd35Doc();
    const shieldUpdate = makeOnUpdate();
    const { result: shieldResult } = renderHandlers(shieldDoc, shieldUpdate);
    act(() =>
      shieldResult.current.equipShield({ id: 'heavy-shield', name: 'Heavy Shield', shieldBonus: 2 })
    );
    expect(latest(shieldUpdate).system.equipment.at(-1)).toMatchObject({
      itemId: 'heavy-shield',
      slot: 'shield',
      shieldBonus: 2,
    });

    const both = [
      { itemId: 'full-plate', name: 'Full Plate', equipped: true, armorClass: 8 },
      { itemId: 'heavy-shield', name: 'Heavy Shield', equipped: true, shieldBonus: 2 },
    ];
    const unequipUpdate = makeOnUpdate();
    const { result: unequip } = renderHandlers(makeDnd35Doc({ equipment: both }), unequipUpdate);
    act(() => unequip.current.unequipArmor());
    expect(latest(unequipUpdate).system.equipment.map((e) => e.itemId)).toEqual(['heavy-shield']);
  });

  it('adds a new spell level seeded as a manual bonus', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(
      makeDnd35Doc({ spellsPerDay: { 1: { total: 1, used: 0 } } }),
      onUpdate
    );

    act(() => result.current.addSpellLevel());

    // Next level above the highest present (1) is 2, recorded entirely as manual.
    expect(latest(onUpdate).system.spellsPerDay?.[2]).toEqual({
      total: 1,
      used: 0,
      manualBonus: 1,
    });
  });

  it('adds a known spell, de-dupes it, and prunes prepared slots on removal', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDnd35Doc({ spellsKnown: ['magic-missile'] }), onUpdate);

    act(() => result.current.addKnownSpell({ id: 'fireball', name: 'Fireball' } as Spell));
    expect(latest(onUpdate).system.spellsKnown).toEqual(['magic-missile', 'fireball']);

    onUpdate.mockClear();
    act(() =>
      result.current.addKnownSpell({ id: 'magic-missile', name: 'Magic Missile' } as Spell)
    );
    expect(onUpdate).not.toHaveBeenCalled();

    const removeUpdate = makeOnUpdate();
    const { result: remover } = renderHandlers(
      makeDnd35Doc({
        spellsKnown: ['magic-missile', 'fireball'],
        preparedSpellsByLevel: { 1: ['magic-missile'], 3: ['fireball'] },
      }),
      removeUpdate
    );
    act(() => remover.current.removeKnownSpell('fireball'));
    expect(latest(removeUpdate).system.spellsKnown).toEqual(['magic-missile']);
    // Level 3 held only the removed spell, so it is pruned entirely.
    expect(latest(removeUpdate).system.preparedSpellsByLevel).toEqual({ 1: ['magic-missile'] });
  });

  it('spends a spell slot and writes a prepared spell into a slot', () => {
    const slotUpdate = makeOnUpdate();
    const { result: slotResult } = renderHandlers(
      makeDnd35Doc({ spellsPerDay: { 1: { total: 2, used: 0 } } }),
      slotUpdate
    );
    act(() => slotResult.current.useSpellSlot(1));
    expect(latest(slotUpdate).system.spellsPerDay?.[1].used).toBe(1);

    const prepUpdate = makeOnUpdate();
    const { result: prepResult } = renderHandlers(makeDnd35Doc(), prepUpdate);
    act(() => prepResult.current.setPreparedSpell(1, 0, 'shield'));
    expect(latest(prepUpdate).system.preparedSpellsByLevel?.[1]?.[0]).toBe('shield');
  });

  it('sets and clears the arcane specialty school', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDnd35Doc(), onUpdate);

    act(() => result.current.setArcaneSpecialtySchool('evocation'));
    expect(latest(onUpdate).system.arcaneSpecialtySchool).toBe('evocation');

    act(() => result.current.setArcaneSpecialtySchool(''));
    expect(latest(onUpdate).system.arcaneSpecialtySchool).toBeUndefined();
  });

  it('records the spontaneous conversion reference (PF1e cure/inflict)', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makeDnd35Doc(), onUpdate);

    act(() => result.current.setSpontaneousConversionReference('cure'));

    expect(latest(onUpdate).system.manualSpellcastingExtras?.spontaneousConversionReference).toBe(
      'cure'
    );
  });

  it('adds a PF1e trait from the selected option and removes one by id', () => {
    const trait = { id: 'reactionary', name: 'Reactionary' } as Pf1eTrait;

    const addUpdate = makeOnUpdate();
    const fresh = makePf1Doc();
    const { result: adder } = renderHandlers(fresh.document, addUpdate, {
      pf1Data: fresh.pf1Data,
      traitOptions: [trait],
    });
    act(() => adder.current.setSelectedTraitId('reactionary'));
    act(() => adder.current.addTrait());
    expect(
      (latest(addUpdate).system as unknown as Pf1eDataModel).traits.map((entry) => entry.id)
    ).toEqual(['reactionary']);

    const removeUpdate = makeOnUpdate();
    const owned = makePf1Doc({ traits: [trait] });
    const { result: remover } = renderHandlers(owned.document, removeUpdate, {
      pf1Data: owned.pf1Data,
    });
    act(() => remover.current.removeTrait('reactionary'));
    expect((latest(removeUpdate).system as unknown as Pf1eDataModel).traits).toEqual([]);
  });
});
