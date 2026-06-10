import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../../../systems/dnd5e/data-model';
import { useDnd5eSheetActionHandlers } from '../../../systems/dnd5e/shared/useDnd5eSheetActionHandlers';
import type { CharacterDocument } from '../../../types/core/document';

function makeDoc(system: Dnd5eDataModel): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'toggle-skill-doc',
    name: 'Provenance Hero',
    systemId: 'dnd-5e-2014',
    system,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

function renderHandlers(system: Dnd5eDataModel) {
  const update = vi.fn();
  const noop = vi.fn();
  const { result } = renderHook(() =>
    useDnd5eSheetActionHandlers<Dnd5eDataModel>({
      document: makeDoc(system),
      system,
      enableWeaponMasteries: false,
      weaponMasteries: [],
      alwaysPreparedSpellIds: new Set(),
      preparedCasterCount: 0,
      replaceDocument: noop,
      replaceSystem: noop,
      update,
    })
  );
  return { result, update };
}

describe('toggleSkillProficiency provenance', () => {
  it('merges manual into existing template sources instead of replacing them', () => {
    const system = createDefaultDnd5eData();
    system.skillProficiencies = {
      athletics: { level: 'proficient', source: ['Fighter'] },
    };

    const { result, update } = renderHandlers(system);
    act(() => result.current.toggleSkillProficiency('athletics'));

    expect(update).toHaveBeenCalledWith({
      skillProficiencies: {
        athletics: { level: 'expertise', source: ['Fighter', 'manual'] },
      },
    });
  });

  it('cycling to none keeps the record at proficient when template sources remain', () => {
    const system = createDefaultDnd5eData();
    system.skillProficiencies = {
      religion: { level: 'expertise', source: ['Acolyte', 'manual'] },
    };

    const { result, update } = renderHandlers(system);
    act(() => result.current.toggleSkillProficiency('religion'));

    expect(update).toHaveBeenCalledWith({
      skillProficiencies: {
        religion: { level: 'proficient', source: ['Acolyte'] },
      },
    });
  });

  it('cycling a purely manual skill to none removes the record entirely', () => {
    const system = createDefaultDnd5eData();
    system.skillProficiencies = {
      stealth: { level: 'expertise', source: ['manual'] },
    };

    const { result, update } = renderHandlers(system);
    act(() => result.current.toggleSkillProficiency('stealth'));

    expect(update).toHaveBeenCalledWith({ skillProficiencies: {} });
  });
});
