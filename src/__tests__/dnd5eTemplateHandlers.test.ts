import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDnd5eTemplateHandlers } from '../systems/dnd5e/shared/useDnd5eTemplateHandlers';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { fighter } from '../data/dnd/5e-2014/classes/fighter';
import { wizard } from '../data/dnd/5e-2014/classes/wizard';
import { halfElf } from '../data/dnd/5e-2014/species/half-elf';
import { acolyte } from '../data/dnd/5e-2014/backgrounds/acolyte';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { Background } from '../types/character-options/backgrounds';
import type { CharacterDocument } from '../types/core/document';

/**
 * Controller-template wiring: the handlers translate dropdown/level edits into
 * either a full-document `replaceDocument` (when a template applies) or a
 * lightweight `update` patch (unknown selection). Each test asserts the
 * resulting document/patch, anchored to the real 5e template behaviour in
 * utils/classTemplate.ts, speciesTemplate.ts, and backgroundTemplate.ts.
 */

const classes: CharacterClass[] = [fighter, wizard];
const species: Species[] = [halfElf];
const backgrounds: Background[] = [acolyte];

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-template-handlers',
    name: 'Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

interface RenderArgs {
  document: CharacterDocument<Dnd5eDataModel>;
  selectedSpecies?: Species;
  selectedBackground?: Background;
}

function renderHandlers(args: RenderArgs) {
  const replaceDocument = vi.fn<(next: CharacterDocument<Dnd5eDataModel>) => void>();
  const update = vi.fn<(patch: Partial<Dnd5eDataModel>) => void>();
  const { result } = renderHook(() =>
    useDnd5eTemplateHandlers({
      document: args.document,
      system: args.document.system,
      classes,
      species,
      backgrounds,
      selectedSpecies: args.selectedSpecies,
      selectedBackground: args.selectedBackground,
      replaceDocument,
      update,
    })
  );
  return { result, replaceDocument, update };
}

function lastReplaced(
  replaceDocument: ReturnType<typeof vi.fn>
): CharacterDocument<Dnd5eDataModel> {
  return replaceDocument.mock.calls.at(-1)![0] as CharacterDocument<Dnd5eDataModel>;
}

describe('useDnd5eTemplateHandlers — class composition', () => {
  it('adds a class via the pending-class flow and clears the pending inputs', () => {
    const { result, replaceDocument } = renderHandlers({ document: makeDoc() });

    act(() => result.current.setPendingClassId('fighter'));
    act(() => result.current.setPendingClassLevel('3'));
    act(() => result.current.handleAddClass());

    const next = lastReplaced(replaceDocument);
    expect(next.system.classLevels).toEqual([
      expect.objectContaining({ classId: 'fighter', level: 3 }),
    ]);
    // Successful application resets the pending selection state.
    expect(result.current.pendingClassId).toBe('');
    expect(result.current.pendingClassLevel).toBe('1');
    expect(result.current.classTemplateError).toBeNull();
  });

  it('is a no-op for handleAddClass with no pending class or an unknown class', () => {
    const { result, replaceDocument } = renderHandlers({ document: makeDoc() });

    act(() => result.current.handleAddClass()); // no pending id
    act(() => result.current.setPendingClassId('not-a-class'));
    act(() => result.current.handleAddClass()); // unknown id

    expect(replaceDocument).not.toHaveBeenCalled();
  });

  it('captures a template error when adding a duplicate class', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }] }),
    });

    act(() => result.current.setPendingClassId('fighter'));
    act(() => result.current.handleAddClass());

    // applyDnd5eClassTemplate throws on a duplicate add -> error surfaced, no replace.
    expect(replaceDocument).not.toHaveBeenCalled();
    expect(result.current.classTemplateError).toMatch(/already present/i);
  });

  it('changes a class row to a different known class', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 2, hitDieRolls: [6] }] }),
    });

    act(() => result.current.handleClassRowChange('fighter', 'wizard', 2));

    expect(lastReplaced(replaceDocument).system.classLevels).toEqual([
      expect.objectContaining({ classId: 'wizard', level: 2 }),
    ]);
  });

  it('ignores a class-row change to an empty or unknown class id', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }] }),
    });

    act(() => result.current.handleClassRowChange('fighter', '', 1));
    act(() => result.current.handleClassRowChange('fighter', 'not-a-class', 1));

    expect(replaceDocument).not.toHaveBeenCalled();
  });

  it('re-applies the class template at a new level (defaulting non-numeric to 1)', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }] }),
    });

    act(() => result.current.handleClassLevelChange('fighter', '5'));
    expect(lastReplaced(replaceDocument).system.classLevels[0].level).toBe(5);

    act(() => result.current.handleClassLevelChange('fighter', 'abc'));
    expect(lastReplaced(replaceDocument).system.classLevels[0].level).toBe(1);
  });

  it('ignores a level change for a class not in the catalog', () => {
    const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleClassLevelChange('not-a-class', '5'));
    expect(replaceDocument).not.toHaveBeenCalled();
  });

  it('applies and clears a subclass through the subclass template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [6, 6] }] }),
    });

    act(() => result.current.handleSubclassChange('fighter', 'champion'));
    expect(lastReplaced(replaceDocument).system.classLevels[0].subclassId).toBe('champion');

    // Empty string clears the subclass (passed through as undefined).
    act(() => result.current.handleSubclassChange('fighter', ''));
    expect(lastReplaced(replaceDocument).system.classLevels[0].subclassId).toBeUndefined();
  });

  it('records a class skill selection and routes tool selections through the template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ classLevels: [{ classId: 'fighter', level: 1, hitDieRolls: [] }] }),
    });
    // Omit skill/tool selection arrays so the handlers exercise their
    // "|| []" defaults when seeding the next selection list.
    const classLevel = {
      classId: 'fighter',
      level: 1,
      hitDieRolls: [],
    };

    // Fighter has class skill choices, so the chosen skill is retained.
    act(() => result.current.handleClassSkillSelectionChange(fighter, classLevel, 0, 'athletics'));
    expect(lastReplaced(replaceDocument).system.classLevels[0].skillSelections).toContain(
      'athletics'
    );

    // The tool handler re-applies the class template (Fighter grants no tool
    // choices, so the template normalizes the selection away — the handler path
    // still runs end-to-end and keeps the class on the document).
    replaceDocument.mockClear();
    act(() =>
      result.current.handleClassToolSelectionChange(fighter, classLevel, 0, 'smiths-tools')
    );
    expect(replaceDocument).toHaveBeenCalledTimes(1);
    expect(lastReplaced(replaceDocument).system.classLevels[0].classId).toBe('fighter');
  });

  it('removes a class through the remove template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({
        classLevels: [
          { classId: 'fighter', level: 1, hitDieRolls: [] },
          { classId: 'wizard', level: 1, hitDieRolls: [] },
        ],
      }),
    });

    act(() => result.current.handleRemoveClass('fighter'));

    const ids = lastReplaced(replaceDocument).system.classLevels.map((cl) => cl.classId);
    expect(ids).toEqual(['wizard']);
  });
});

describe('useDnd5eTemplateHandlers — species', () => {
  it('applies a known species template through replaceDocument', () => {
    const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleSpeciesChange('half-elf'));

    expect(lastReplaced(replaceDocument).system.speciesId).toBe('half-elf');
    expect(update).not.toHaveBeenCalled();
  });

  it('clears the species (empty id) through the template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ speciesId: 'half-elf' }),
      selectedSpecies: halfElf,
    });
    act(() => result.current.handleSpeciesChange(''));

    expect(lastReplaced(replaceDocument).system.speciesId).toBeUndefined();
  });

  it('falls back to a plain id patch for a species not in the catalog', () => {
    const { result, update, replaceDocument } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleSpeciesChange('not-a-species'));

    expect(update).toHaveBeenCalledWith({ speciesId: 'not-a-species' });
    expect(replaceDocument).not.toHaveBeenCalled();
  });

  it('records species ability/language/skill/tool selections via the selected-species template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({
        speciesId: 'half-elf',
        // Undefined selection arrays exercise the handlers' "|| []" defaults.
        speciesAbilitySelections: undefined,
        speciesLanguageSelections: undefined,
        speciesSkillSelections: undefined,
        speciesToolSelections: undefined,
      }),
      selectedSpecies: halfElf,
    });

    act(() => result.current.handleSpeciesAbilityChange(0, 'str'));
    expect(replaceDocument).toHaveBeenCalled();
    act(() => result.current.handleSpeciesLanguageChange(0, 'Draconic'));
    act(() => result.current.handleSpeciesSkillChange(0, 'arcana'));
    act(() => result.current.handleSpeciesToolChange(0, 'smiths-tools'));

    // Each handler routes through applySelectedSpeciesTemplate -> replaceDocument.
    expect(replaceDocument).toHaveBeenCalledTimes(4);
    const next = lastReplaced(replaceDocument);
    expect(next.system.speciesId).toBe('half-elf');
  });

  it('makes species selection handlers no-ops when no species is selected', () => {
    const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleSpeciesAbilityChange(0, 'str'));
    expect(replaceDocument).not.toHaveBeenCalled();
  });
});

describe('useDnd5eTemplateHandlers — background', () => {
  it('applies a known background template through replaceDocument', () => {
    const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleBackgroundChange('acolyte'));

    expect(lastReplaced(replaceDocument).system.backgroundId).toBe('acolyte');
    expect(update).not.toHaveBeenCalled();
  });

  it('clears the background (empty id) through the template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({ backgroundId: 'acolyte' }),
      selectedBackground: acolyte,
    });
    act(() => result.current.handleBackgroundChange(''));

    expect(lastReplaced(replaceDocument).system.backgroundId).toBeUndefined();
  });

  it('falls back to a plain id patch for an unknown background', () => {
    const { result, update, replaceDocument } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleBackgroundChange('not-a-background'));

    expect(update).toHaveBeenCalledWith({ backgroundId: 'not-a-background' });
    expect(replaceDocument).not.toHaveBeenCalled();
  });

  it('records background language/tool selections via the selected-background template', () => {
    const { result, replaceDocument } = renderHandlers({
      document: makeDoc({
        backgroundId: 'acolyte',
        // Undefined selection arrays exercise the handlers' "|| []" defaults.
        backgroundLanguageSelections: undefined,
        backgroundToolSelections: undefined,
      }),
      selectedBackground: acolyte,
    });

    act(() => result.current.handleBackgroundLanguageChange(0, 'Draconic'));
    act(() => result.current.handleBackgroundToolChange(0, 'smiths-tools'));

    expect(replaceDocument).toHaveBeenCalledTimes(2);
    expect(lastReplaced(replaceDocument).system.backgroundId).toBe('acolyte');
  });

  it('makes background selection handlers no-ops when no background is selected', () => {
    const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
    act(() => result.current.handleBackgroundLanguageChange(0, 'Draconic'));
    act(() => result.current.handleBackgroundToolChange(0, 'smiths-tools'));
    expect(replaceDocument).not.toHaveBeenCalled();
  });
});
