import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Species } from '../../../types/character-options/species';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { GameSystemId } from '../../../types/game-systems';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../../systems/dnd35e/data-model';
import { createDefaultPf1eData, type Pf1eDataModel } from '../../../systems/pf1e/data-model';
import type { D20LegacyData } from '../../../systems/d20-legacy/d20LegacySheetShared';
import { useD20LegacyTemplateHandlers } from '../../../systems/d20-legacy/useD20LegacyTemplateHandlers';
import { fighter as fighter35 } from '../../../data/dnd/3.5e/classes/fighter';
import { wizard as wizard35 } from '../../../data/dnd/3.5e/classes/wizard';
import { cleric as cleric35 } from '../../../data/dnd/3.5e/classes/cleric';
import { sorcerer as sorcerer35 } from '../../../data/dnd/3.5e/classes/sorcerer';
import { mysticTheurge as mysticTheurge35 } from '../../../data/dnd/3.5e/prestige-classes/mystic-theurge';
import { human as human35 } from '../../../data/dnd/3.5e/races/human';
import { elf as elf35 } from '../../../data/dnd/3.5e/races/elf';
import { wizard as wizardPf1 } from '../../../data/pathfinder/1e/classes/wizard';
import { fighter as fighterPf1 } from '../../../data/pathfinder/1e/classes/fighter';

const DND35_CLASSES = [
  fighter35,
  wizard35,
  cleric35,
  sorcerer35,
  mysticTheurge35,
] as CharacterClass[];
const PF1_CLASSES = [wizardPf1, fighterPf1] as CharacterClass[];

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function make35Doc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<D20LegacyData> {
  return {
    id: 'd20-template-handlers-35e',
    name: 'Template Hero',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<D20LegacyData>;
}

function makePf1Doc(overrides: Partial<Pf1eDataModel> = {}): CharacterDocument<D20LegacyData> {
  return {
    id: 'd20-template-handlers-pf1',
    name: 'Template Hero',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<D20LegacyData>;
}

/**
 * Wire the hook the way useD20LegacySheetController does: replaceDocument emits
 * the whole next document and update emits a system patch, both forwarded to a
 * single onUpdate spy. The hook closes over the document/classes it was rendered
 * with, so dependent steps re-render from the previous emitted document.
 */
function renderHandlers(
  document: CharacterDocument<D20LegacyData>,
  onUpdate: ReturnType<typeof makeOnUpdate>,
  classes: CharacterClass[]
) {
  const isPf1e = document.systemId === 'pf1e';
  return renderHook(() =>
    useD20LegacyTemplateHandlers({
      typedDocument: document,
      systemId: document.systemId as GameSystemId,
      sys: document.system,
      isPf1e,
      classes,
      replaceDocument: (next) => onUpdate(next as CharacterDocument<SystemDataModel>),
      update: (patch) =>
        onUpdate({
          ...document,
          system: { ...document.system, ...patch } as SystemDataModel,
        }),
    })
  );
}

function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<D20LegacyData> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<D20LegacyData>;
}

describe('useD20LegacyTemplateHandlers', () => {
  it('adds a 3.5e class via the pending selection and resets the pending inputs', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(make35Doc(), onUpdate, DND35_CLASSES);

    act(() => result.current.setPendingClassId('fighter'));
    act(() => result.current.setPendingClassLevel('3'));
    act(() => result.current.handleAddClass());

    const sys = latest(onUpdate).system;
    expect(sys.classLevels).toHaveLength(1);
    expect(sys.classLevels[0]).toMatchObject({ classId: 'fighter', level: 3 });
    expect(sys.level).toBe(3);
    // The pending inputs reset after a successful apply.
    expect(result.current.pendingClassId).toBe('');
    expect(result.current.pendingClassLevel).toBe('1');
    expect(result.current.classTemplateError).toBeNull();
  });

  it('no-ops handleAddClass when no class is pending or the id is unknown', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(make35Doc(), onUpdate, DND35_CLASSES);

    act(() => result.current.handleAddClass());
    expect(onUpdate).not.toHaveBeenCalled();

    act(() => result.current.setPendingClassId('no-such-class'));
    act(() => result.current.handleAddClass());
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('replaces a class row in place via handleClassRowChange', () => {
    const onUpdate = makeOnUpdate();
    const seeded = make35Doc({
      level: 2,
      classLevels: [
        {
          classId: 'fighter',
          level: 2,
          hitDieRolls: [10, 6],
          bab: 'full',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'poor',
          skillPointsPerLevel: 2,
        },
      ],
    });
    const { result } = renderHandlers(seeded, onUpdate, DND35_CLASSES);

    act(() => result.current.handleClassRowChange('fighter', 'wizard', 2));

    const sys = latest(onUpdate).system;
    expect(sys.classLevels).toHaveLength(1);
    expect(sys.classLevels[0]).toMatchObject({ classId: 'wizard', level: 2, bab: 'half' });
  });

  it('no-ops handleClassRowChange for an empty target or unknown class id', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(make35Doc(), onUpdate, DND35_CLASSES);

    act(() => result.current.handleClassRowChange('fighter', '', 2));
    act(() => result.current.handleClassRowChange('fighter', 'no-such-class', 2));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('changes a class level (parsing the string input) via handleClassLevelChange', () => {
    const onUpdate = makeOnUpdate();
    const seeded = make35Doc({
      level: 2,
      classLevels: [
        {
          classId: 'fighter',
          level: 2,
          hitDieRolls: [10, 6],
          bab: 'full',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'poor',
          skillPointsPerLevel: 2,
        },
      ],
    });
    const { result } = renderHandlers(seeded, onUpdate, DND35_CLASSES);

    act(() => result.current.handleClassLevelChange('fighter', '5'));

    const sys = latest(onUpdate).system;
    expect(sys.classLevels[0]).toMatchObject({ classId: 'fighter', level: 5 });
    expect(sys.level).toBe(5);
  });

  it('no-ops handleClassLevelChange for an unknown class id', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(make35Doc(), onUpdate, DND35_CLASSES);

    act(() => result.current.handleClassLevelChange('no-such-class', '5'));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('removes a class row via handleRemoveClass', () => {
    const onUpdate = makeOnUpdate();
    const seeded = make35Doc({
      level: 3,
      classLevels: [
        {
          classId: 'fighter',
          level: 2,
          hitDieRolls: [10, 6],
          bab: 'full',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'poor',
          skillPointsPerLevel: 2,
        },
        {
          classId: 'wizard',
          level: 1,
          hitDieRolls: [4],
          bab: 'half',
          fortSave: 'poor',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
      ],
    });
    const { result } = renderHandlers(seeded, onUpdate, DND35_CLASSES);

    act(() => result.current.handleRemoveClass('wizard'));

    const sys = latest(onUpdate).system;
    expect(sys.classLevels.map((classLevel) => classLevel.classId)).toEqual(['fighter']);
    expect(sys.level).toBe(2);
  });

  it('captures the thrown message in classTemplateError when an updater fails', () => {
    const onUpdate = makeOnUpdate();
    // classes contains a malformed entry (no d20Profile/hitDie) so the template
    // application throws; the hook traps it into classTemplateError.
    const brokenClass = { id: 'broken', name: 'Broken' } as unknown as CharacterClass;
    const { result } = renderHandlers(make35Doc(), onUpdate, [brokenClass]);

    act(() => result.current.setPendingClassId('broken'));
    act(() => result.current.handleAddClass());

    expect(onUpdate).not.toHaveBeenCalled();
    expect(result.current.classTemplateError).toEqual(expect.any(String));
    expect(result.current.classTemplateError).not.toBeNull();
  });

  it('applies a race template through applyRaceTemplate', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(make35Doc(), onUpdate, DND35_CLASSES);

    act(() => result.current.applyRaceTemplate(elf35 as Species));

    const sys = latest(onUpdate).system;
    expect(sys.speciesId).toBe('elf');
    // 3.5e elf: +2 Dex / -2 Con from the default 10s.
    expect(sys.baseAttributes.dex).toBe(12);
    expect(sys.baseAttributes.con).toBe(8);
  });

  it('reverts a previous race adjustment when applyRaceTemplate passes the prior species', () => {
    const onUpdate = makeOnUpdate();
    const elfDoc = make35Doc({
      speciesId: 'elf',
      baseAttributes: { str: 10, dex: 12, con: 8, int: 10, wis: 10, cha: 10 },
    });
    const { result } = renderHandlers(elfDoc, onUpdate, DND35_CLASSES);

    act(() => result.current.applyRaceTemplate(human35 as Species, elf35 as Species));

    const sys = latest(onUpdate).system;
    expect(sys.speciesId).toBe('human');
    // The elf adjustment is unwound back to the racial-neutral baseline.
    expect(sys.baseAttributes.dex).toBe(10);
    expect(sys.baseAttributes.con).toBe(10);
  });

  it('syncs spellcasting selections through handleSpellcastingSelectionChange (3.5e mystic theurge)', () => {
    const onUpdate = makeOnUpdate();
    // Two prior arcane rows (wizard + sorcerer) give the mystic theurge's arcane
    // track a real choice, so re-pointing it is observable after the eligibility
    // sync (the divine track keeps cleric).
    const seeded = make35Doc({
      level: 9,
      classLevels: [
        {
          classId: 'wizard',
          level: 3,
          hitDieRolls: [4, 3, 4],
          bab: 'half',
          fortSave: 'poor',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
        {
          classId: 'sorcerer',
          level: 1,
          hitDieRolls: [4],
          bab: 'half',
          fortSave: 'poor',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
        {
          classId: 'cleric',
          level: 3,
          hitDieRolls: [8, 5, 5],
          bab: 'three-quarter',
          fortSave: 'good',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
        {
          classId: 'mystic-theurge-35e',
          level: 2,
          hitDieRolls: [4, 3],
          bab: 'half',
          fortSave: 'poor',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
          spellcastingSelections: ['wizard', 'cleric'],
        },
      ],
    });
    const { result } = renderHandlers(seeded, onUpdate, DND35_CLASSES);

    // Re-point the arcane (track 0) advancement from wizard to sorcerer.
    act(() =>
      result.current.handleSpellcastingSelectionChange('mystic-theurge-35e', 0, 'sorcerer')
    );

    const sys = latest(onUpdate).system;
    const theurgeRow = sys.classLevels.find(
      (classLevel) => classLevel.classId === 'mystic-theurge-35e'
    );
    // The eligibility sync preserves the valid arcane choice and the divine track.
    expect(theurgeRow?.spellcastingSelections?.[0]).toBe('sorcerer');
    expect(theurgeRow?.spellcastingSelections?.[1]).toBe('cleric');
  });

  it('adds a PF1e class with the favored-class default through the pf1e branch', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderHandlers(makePf1Doc(), onUpdate, PF1_CLASSES);

    act(() => result.current.setPendingClassId('wizard'));
    act(() => result.current.setPendingClassLevel('2'));
    act(() => result.current.handleAddClass());

    const sys = latest(onUpdate).system as Pf1eDataModel;
    expect(sys.classLevels[0]).toMatchObject({
      classId: 'wizard',
      level: 2,
      favoredClassBonus: 'hp',
    });
  });
});
