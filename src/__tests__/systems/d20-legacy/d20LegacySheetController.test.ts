import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../../systems/dnd35e/data-model';
import { createDefaultPf1eData, type Pf1eDataModel } from '../../../systems/pf1e/data-model';
import type { D20LegacyData } from '../../../systems/d20-legacy/d20LegacySheetShared';
import { getIterativeAttackBonuses } from '../../../systems/d20-legacy/d20LegacySheetShared';
import { useD20LegacySheetController } from '../../../systems/d20-legacy/useD20LegacySheetController';

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function make35Doc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<D20LegacyData> {
  return {
    id: 'd20-controller-35e',
    name: 'Controller Hero',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<D20LegacyData>;
}

function makePf1Doc(overrides: Partial<Pf1eDataModel> = {}): CharacterDocument<D20LegacyData> {
  return {
    id: 'd20-controller-pf1',
    name: 'Controller Hero',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<D20LegacyData>;
}

function renderController(
  document: CharacterDocument<D20LegacyData>,
  onUpdate?: ReturnType<typeof makeOnUpdate>
) {
  return renderHook(() =>
    useD20LegacySheetController({
      document: document as CharacterDocument<SystemDataModel>,
      onUpdate,
    })
  );
}

function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<D20LegacyData> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<D20LegacyData>;
}

describe('useD20LegacySheetController', () => {
  it('gates editing affordances on canUpdate (read-only when no onUpdate)', () => {
    const readonly = renderController(make35Doc());
    expect(readonly.result.current.headerProps.canUpdate).toBe(false);
    expect(readonly.result.current.restProps.onShortRest).toBeUndefined();
    expect(readonly.result.current.restProps.onLongRest).toBeUndefined();

    const editable = renderController(make35Doc(), makeOnUpdate());
    expect(editable.result.current.headerProps.canUpdate).toBe(true);
    expect(editable.result.current.combatProps.canUpdate).toBe(true);
    expect(editable.result.current.restProps.onShortRest).toBeTypeOf('function');
  });

  it('derives iterative attack bonuses from the BAB single source', () => {
    const { result } = renderController(make35Doc({ baseAttackBonus: 16 }), makeOnUpdate());
    // The controller must match the shared helper exactly, not a hardcoded list.
    expect(result.current.combatProps.iterativeAttackBonuses).toEqual(
      getIterativeAttackBonuses(16)
    );
    expect(result.current.combatProps.baseAttackBonus).toBe(16);
  });

  it('derives sorted, finite spell-slot levels from the spellsPerDay map', () => {
    const { result } = renderController(
      make35Doc({
        spellsPerDay: {
          2: { total: 1, used: 0 },
          0: { total: 4, used: 0 },
          1: { total: 3, used: 0 },
        },
      }),
      makeOnUpdate()
    );
    expect(result.current.tabsProps.spellSlotLevels).toEqual([0, 1, 2]);
    expect(result.current.tabsProps.spellSlots).toEqual({
      0: { total: 4, used: 0 },
      1: { total: 3, used: 0 },
      2: { total: 1, used: 0 },
    });
  });

  it('exposes 3.5e grapple but not PF1e CMB/CMD', () => {
    const { result } = renderController(make35Doc({ grapple: 9 }), makeOnUpdate());
    expect(result.current.combatProps.grapple).toBe(9);
    expect(result.current.combatProps.cmb).toBeUndefined();
    expect(result.current.combatProps.cmd).toBeUndefined();
  });

  it('exposes PF1e CMB/CMD and favored-class skill bonus, but not grapple', () => {
    const { result } = renderController(
      makePf1Doc({ cmb: 7, cmd: 18, favoredClassSkillBonus: 4 }),
      makeOnUpdate()
    );
    expect(result.current.combatProps.cmb).toBe(7);
    expect(result.current.combatProps.cmd).toBe(18);
    expect(result.current.combatProps.grapple).toBeUndefined();
    expect(result.current.headerProps.isPf1e).toBe(true);
    expect(result.current.headerProps.favoredClassSkillBonus).toBe(4);
  });

  it('clamps applied damage at 0 and applied healing at max through the combat handler', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      make35Doc({ hitPoints: { current: 5, max: 20, temp: 0 } }),
      onUpdate
    );

    act(() => result.current.combatProps.onApplyDamageOrHealing(50, 'damage'));
    expect(latest(onUpdate).system.hitPoints.current).toBe(0);

    // The hook closes over the original doc, so a fresh render exercises heal.
    const healUpdate = makeOnUpdate();
    const heal = renderController(
      make35Doc({ hitPoints: { current: 18, max: 20, temp: 0 } }),
      healUpdate
    );
    act(() => heal.result.current.combatProps.onApplyDamageOrHealing(50, 'heal'));
    expect(latest(healUpdate).system.hitPoints.current).toBe(20);
  });

  it('routes direct HP edits and header size/XP edits through the mutation patch', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      make35Doc({ hitPoints: { current: 10, max: 20, temp: 0 } }),
      onUpdate
    );

    act(() => result.current.combatProps.onHitPointsChange(15));
    expect(latest(onUpdate).system.hitPoints).toMatchObject({ current: 15, max: 20 });

    act(() => result.current.headerProps.onSizeCategoryChange('large'));
    expect(latest(onUpdate).system.sizeCategory).toBe('large');

    act(() => result.current.headerProps.onExperiencePointsChange(2500));
    expect(latest(onUpdate).system.experiencePoints).toBe(2500);
  });

  it('routes tab edits (conditions, toggles, notes) through the mutation patch', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(make35Doc(), onUpdate);

    act(() => result.current.tabsProps.onConditionChange([{ id: 'shaken', name: 'Shaken' }]));
    expect(latest(onUpdate).system.conditions).toEqual([{ id: 'shaken', name: 'Shaken' }]);

    act(() => result.current.tabsProps.onActiveTogglesChange(['power-attack']));
    expect(latest(onUpdate).system.activeToggles).toEqual(['power-attack']);

    act(() => result.current.tabsProps.onNotesChange('Beware the lich.'));
    expect(latest(onUpdate).system.notes).toBe('Beware the lich.');
  });

  it('removes a feat and an inventory item by id through the tab handlers', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      make35Doc({
        feats: [
          { id: 'cleave', name: 'Cleave', description: '', source: 'Custom' },
          { id: 'dodge', name: 'Dodge', description: '', source: 'Custom' },
        ],
        inventory: [
          { itemId: 'torch', name: 'Torch', quantity: 1, weight: 1 },
          { itemId: 'rope', name: 'Rope', quantity: 1, weight: 10 },
        ],
      }),
      onUpdate
    );

    act(() => result.current.tabsProps.onRemoveFeat('cleave'));
    expect(latest(onUpdate).system.feats.map((feat) => feat.id)).toEqual(['dodge']);

    const itemUpdate = makeOnUpdate();
    const itemResult = renderController(
      make35Doc({
        inventory: [
          { itemId: 'torch', name: 'Torch', quantity: 1, weight: 1 },
          { itemId: 'rope', name: 'Rope', quantity: 1, weight: 10 },
        ],
      }),
      itemUpdate
    );
    act(() => itemResult.result.current.tabsProps.onRemoveItem('torch'));
    expect(latest(itemUpdate).system.inventory.map((item) => item.itemId)).toEqual(['rope']);
  });

  it('derives spell-list ids only for casting classes once the catalog loads', async () => {
    const { result } = renderController(
      makePf1Doc({
        level: 4,
        classLevels: [
          {
            classId: 'wizard',
            level: 3,
            hitDieRolls: [6, 4, 4],
            bab: 'half',
            fortSave: 'poor',
            refSave: 'poor',
            willSave: 'good',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'hp',
          },
          {
            classId: 'fighter',
            level: 1,
            hitDieRolls: [10],
            bab: 'full',
            fortSave: 'good',
            refSave: 'poor',
            willSave: 'poor',
            skillPointsPerLevel: 2,
            favoredClassBonus: 'other',
          },
        ],
      }),
      makeOnUpdate()
    );

    // Before the catalog loads, no class resolves a spell table.
    expect(result.current.tabsProps.spellListIds).toEqual([]);

    // Once classes load, only the wizard (a caster) contributes a spell list;
    // the fighter has no spell table and is excluded.
    await waitFor(() => {
      expect(result.current.tabsProps.spellListIds).toEqual(['wizard']);
    });
  });
});
