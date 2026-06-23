import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { CharacterDocument } from '../../../types/core/document';
import type { Species } from '../../../types/character-options/species';
import type { Archetype } from '../../../types/character-options/archetypes';
import { fighter } from '../../../data/pathfinder/2e/classes/fighter';
import { wizard } from '../../../data/pathfinder/2e/classes/wizard';
import { human } from '../../../data/pathfinder/2e/ancestries/human';
import { pf2eBackgrounds } from '../../../data/pathfinder/2e/backgrounds';
import type { Pf2eBackgroundDefinition } from '../../../data/pathfinder/2e/backgrounds';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../../systems/pf2e/data-model';
import { usePf2eTemplateHandlers } from '../../../systems/pf2e/usePf2eTemplateHandlers';

/**
 * Controller-template wiring: the handlers translate dropdown/boost edits into
 * either a full-document `replaceDocument` (when a template can be applied) or a
 * lightweight `update` patch (when the selected option is unknown or the
 * template can't run). Each test asserts the resulting document/patch, anchored
 * to the real PF2e template behaviour in utils/pf2eTemplate.ts.
 */

const classes: CharacterClass[] = [fighter, wizard];
const ancestries: Species[] = [human];
const backgrounds: Pf2eBackgroundDefinition[] = pf2eBackgrounds;

// A background with a SINGLE skill-training option (a plain string), so its
// template grants a deterministic skill proficiency. Acrobat trains Acrobatics.
const acrobat = pf2eBackgrounds.find((b) => b.id === 'pf2e-bg-acrobat')!;
// A background with a CHOICE of skills, used to exercise the explicit selection
// path through applySelectedBackgroundTemplate.
const scholar = pf2eBackgrounds.find((b) => b.id === 'pf2e-bg-scholar')!;

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-template-handlers',
    name: 'Hero',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

interface RenderArgs {
  document: CharacterDocument<Pf2eDataModel>;
  selectedClass?: CharacterClass;
  selectedAncestry?: Species;
  selectedHeritage?: NonNullable<Species['subraces']>[number];
  selectedBackground?: Pf2eBackgroundDefinition;
  selectedArchetypeIds?: string[];
}

function renderHandlers(args: RenderArgs) {
  const replaceDocument = vi.fn<(next: CharacterDocument<Pf2eDataModel>) => void>();
  const update = vi.fn<(patch: Partial<Pf2eDataModel>) => void>();
  const { result } = renderHook(() =>
    usePf2eTemplateHandlers({
      document: args.document,
      data: args.document.system,
      classes,
      ancestries,
      backgrounds,
      selectedClass: args.selectedClass,
      selectedAncestry: args.selectedAncestry,
      selectedHeritage: args.selectedHeritage,
      selectedBackground: args.selectedBackground,
      selectedArchetypeIds: args.selectedArchetypeIds ?? [],
      replaceDocument,
      update,
    })
  );
  return { result, replaceDocument, update };
}

function lastReplaced(replaceDocument: ReturnType<typeof vi.fn>): CharacterDocument<Pf2eDataModel> {
  return replaceDocument.mock.calls.at(-1)![0] as CharacterDocument<Pf2eDataModel>;
}

describe('usePf2eTemplateHandlers', () => {
  describe('handleClassChange', () => {
    it('applies a known class template through replaceDocument', () => {
      const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleClassChange('fighter'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.classId).toBe('fighter');
      // Fighter's key ability defaults to its first primary ability.
      expect(next.system.keyAbility).toBe(fighter.primaryAbility[0]);
      // CRB Fighter: expert in Fortitude AND Reflex.
      expect(next.system.saveProficiencies.fortitude.tier).toBe('expert');
      expect(next.system.saveProficiencies.reflex.tier).toBe('expert');
      expect(update).not.toHaveBeenCalled();
    });

    it('clears the class (empty id) through the template, dropping classId/keyAbility', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ classId: 'fighter', keyAbility: 'str' }),
        selectedClass: fighter,
      });
      act(() => result.current.handleClassChange(''));

      const next = lastReplaced(replaceDocument);
      expect(next.system.classId).toBeUndefined();
      expect(next.system.keyAbility).toBeUndefined();
    });

    it('falls back to a plain id patch for a class not in the catalog', () => {
      const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleClassChange('not-a-class'));

      expect(update).toHaveBeenCalledWith({ classId: 'not-a-class' });
      expect(replaceDocument).not.toHaveBeenCalled();
    });
  });

  describe('handleLevelChange', () => {
    it('re-applies the class template at the new level when a class is selected', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ classId: 'fighter', level: 1 }),
        selectedClass: fighter,
      });
      act(() => result.current.handleLevelChange('5'));

      expect(lastReplaced(replaceDocument).system.level).toBe(5);
    });

    it('writes a bare level patch when no class is selected', () => {
      const { result, update, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleLevelChange('7'));

      expect(update).toHaveBeenCalledWith({ level: 7 });
      expect(replaceDocument).not.toHaveBeenCalled();
    });

    it('defaults a non-numeric level to 1', () => {
      const { result, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleLevelChange('abc'));

      expect(update).toHaveBeenCalledWith({ level: 1 });
    });
  });

  describe('handleAncestryChange', () => {
    it('applies a known ancestry template (HP, size, speed, languages)', () => {
      const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleAncestryChange('human'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.ancestryId).toBe('human');
      expect(next.system.ancestryHP).toBe(8);
      expect(next.system.size).toBe('medium');
      expect(next.system.speed).toBe(25);
      expect(next.system.languages).toContain('Common');
      expect(update).not.toHaveBeenCalled();
    });

    it('clears the ancestry (empty id), resetting ancestry-derived data to defaults', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ ancestryId: 'human', heritageId: 'skilled' }),
        selectedAncestry: human,
      });
      act(() => result.current.handleAncestryChange(''));

      const next = lastReplaced(replaceDocument);
      expect(next.system.ancestryId).toBeUndefined();
      expect(next.system.heritageId).toBeUndefined();
      expect(next.system.ancestryAbilityBoostSelections).toEqual([]);
    });

    it('falls back to an id patch (and clears heritage) for an unknown ancestry', () => {
      const { result, update, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleAncestryChange('not-an-ancestry'));

      expect(update).toHaveBeenCalledWith({ ancestryId: 'not-an-ancestry', heritageId: undefined });
      expect(replaceDocument).not.toHaveBeenCalled();
    });
  });

  describe('handleHeritageChange', () => {
    it('applies the heritage onto the selected ancestry via the template', () => {
      const { result, replaceDocument, update } = renderHandlers({
        document: makeDoc({ ancestryId: 'human' }),
        selectedAncestry: human,
      });
      act(() => result.current.handleHeritageChange('skilled'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.heritageId).toBe('skilled');
      // The ancestry is preserved through the heritage application.
      expect(next.system.ancestryId).toBe('human');
      expect(update).not.toHaveBeenCalled();
    });

    it('writes only a heritageId patch when no ancestry is selected', () => {
      const { result, update, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleHeritageChange('skilled'));

      expect(update).toHaveBeenCalledWith({ heritageId: 'skilled' });
      expect(replaceDocument).not.toHaveBeenCalled();
    });

    it('normalises an empty heritage id to undefined when no ancestry is selected', () => {
      const { result, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleHeritageChange(''));

      expect(update).toHaveBeenCalledWith({ heritageId: undefined });
    });
  });

  describe('handleBackgroundChange', () => {
    it('applies a background template, granting its skill training and feat', () => {
      const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleBackgroundChange('pf2e-bg-acrobat'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.backgroundId).toBe('pf2e-bg-acrobat');
      // Acrobat trains Acrobatics (a fixed, single-skill background).
      expect(next.system.skillProficiencies.acrobatics?.tier).toBe('trained');
      // The background grants its signature feat (Steady Balance).
      expect(next.system.feats.map((f) => f.id)).toContain(acrobat.feat.id);
    });
  });

  describe('handleAncestryBoostChange', () => {
    it('records an ancestry ability-boost selection at the given slot', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ ancestryId: 'human', ancestryAbilityBoostSelections: ['', ''] }),
        selectedAncestry: human,
      });
      act(() => result.current.handleAncestryBoostChange(0, 'str'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.ancestryAbilityBoostSelections![0]).toBe('str');
      // Human's free boost is +2; applied to the base 10.
      expect(next.system.baseAttributes.str).toBe(12);
    });

    it('is a no-op when no ancestry is selected', () => {
      const { result, replaceDocument, update } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleAncestryBoostChange(0, 'str'));

      expect(replaceDocument).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
    });
  });

  describe('background ability boost + skill/lore training selections', () => {
    it('records a background ability boost via the selected-background template', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ backgroundId: 'pf2e-bg-acrobat' }),
        selectedBackground: acrobat,
      });
      // Slot 0 is the restricted boost; Acrobat allows str or dex.
      act(() => result.current.handleBackgroundAbilityBoostChange(0, 'dex'));

      const next = lastReplaced(replaceDocument);
      expect(next.system.backgroundAbilityBoostSelections![0]).toBe('dex');
      expect(next.system.baseAttributes.dex).toBe(12);
    });

    it('applies a chosen background skill training through applySelectedBackgroundTemplate', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ backgroundId: 'pf2e-bg-scholar' }),
        selectedBackground: scholar,
      });
      act(() =>
        result.current.applySelectedBackgroundTemplate({ skillTrainingSelection: 'arcana' })
      );

      const next = lastReplaced(replaceDocument);
      expect(next.system.backgroundSkillTrainingSelection).toBe('arcana');
      expect(next.system.skillProficiencies.arcana?.tier).toBe('trained');
    });

    it('is a no-op when applySelectedBackgroundTemplate runs without a selected background', () => {
      const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() =>
        result.current.applySelectedBackgroundTemplate({ skillTrainingSelection: 'arcana' })
      );

      expect(replaceDocument).not.toHaveBeenCalled();
    });
  });

  describe('handleArchetypeToggle', () => {
    const archetype: Archetype = {
      id: 'acrobat-dedication',
      name: 'Acrobat Dedication',
      system: 'pf2e',
      source: 'Core Rulebook',
      parentClassId: 'fighter',
      description: 'A mobile combatant.',
      features: [],
    };

    it('adds an archetype that is not yet selected', () => {
      const { result, replaceDocument } = renderHandlers({ document: makeDoc() });
      act(() => result.current.handleArchetypeToggle(archetype));

      expect(lastReplaced(replaceDocument).system.selectedArchetypeIds).toContain(
        'acrobat-dedication'
      );
    });

    it('removes an archetype that is already selected', () => {
      const { result, replaceDocument } = renderHandlers({
        document: makeDoc({ selectedArchetypeIds: ['acrobat-dedication'] }),
        selectedArchetypeIds: ['acrobat-dedication'],
      });
      act(() => result.current.handleArchetypeToggle(archetype));

      expect(lastReplaced(replaceDocument).system.selectedArchetypeIds).not.toContain(
        'acrobat-dedication'
      );
    });
  });
});
