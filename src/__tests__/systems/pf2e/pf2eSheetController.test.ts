import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Species } from '../../../types/character-options/species';
import {
  loadArchetypesForSystem,
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../../utils/dataLoader';
import { fighter } from '../../../data/pathfinder/2e/classes/fighter';
import { human } from '../../../data/pathfinder/2e/ancestries/human';
import { pf2eBackgrounds } from '../../../data/pathfinder/2e/backgrounds';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../../systems/pf2e/data-model';
import { usePf2eSheetController } from '../../../systems/pf2e/usePf2eSheetController';

/**
 * Controller wiring for the PF2e sheet: the read-only guard on every per-tab
 * editing callback and the patches those callbacks emit. Catalogs are stubbed so
 * derived state (selectedClass / selectedAncestry / selectedBackground, the
 * class-DC score) is deterministic and the prop-assembly paths are isolated.
 */
vi.mock('../../../utils/dataLoader', () => ({
  loadArchetypesForSystem: vi.fn().mockResolvedValue([]),
  loadClassesForSystem: vi.fn().mockResolvedValue([]),
  loadEquipmentForSystem: vi.fn().mockResolvedValue([]),
  loadFeatsForSystem: vi.fn().mockResolvedValue([]),
  loadPf2eBackgroundsForSystem: vi.fn().mockResolvedValue([]),
  loadSpeciesForSystem: vi.fn().mockResolvedValue([]),
  loadSpellsForSystem: vi.fn().mockResolvedValue([]),
}));

const loadClasses = vi.mocked(loadClassesForSystem);
const loadSpecies = vi.mocked(loadSpeciesForSystem);
const loadBackgrounds = vi.mocked(loadPf2eBackgroundsForSystem);
const loadArchetypes = vi.mocked(loadArchetypesForSystem);
const loadFeats = vi.mocked(loadFeatsForSystem);
const loadSpells = vi.mocked(loadSpellsForSystem);
const loadEquipment = vi.mocked(loadEquipmentForSystem);

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-controller',
    name: 'Hero',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function renderController(
  document: CharacterDocument<Pf2eDataModel>,
  onUpdate?: ReturnType<typeof makeOnUpdate>
) {
  return renderHook(() => usePf2eSheetController({ document, onUpdate }));
}

function latest(onUpdate: ReturnType<typeof makeOnUpdate>): CharacterDocument<Pf2eDataModel> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Pf2eDataModel>;
}

// The controller's resource hook kicks off catalog loads on mount; flush those
// pending state updates so they land inside act() and don't warn after the test.
async function flushMountLoads() {
  await waitFor(() => {
    expect(loadClasses).toHaveBeenCalled();
    expect(loadBackgrounds).toHaveBeenCalled();
  });
}

describe('usePf2eSheetController', () => {
  beforeEach(() => {
    loadClasses.mockReset().mockResolvedValue([]);
    loadSpecies.mockReset().mockResolvedValue([]);
    loadBackgrounds.mockReset().mockResolvedValue([]);
    loadArchetypes.mockReset().mockResolvedValue([]);
    loadFeats.mockReset().mockResolvedValue([]);
    loadSpells.mockReset().mockResolvedValue([]);
    loadEquipment.mockReset().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('gates every per-tab editing callback off in read-only mode (no onUpdate)', async () => {
    const { result } = renderController(makeDoc());

    expect(result.current.data).toBeDefined();
    // Feats & conditions tab.
    expect(result.current.featsConditionsTabProps.onConditionsChange).toBeUndefined();
    expect(result.current.featsConditionsTabProps.onRemoveFeat).toBeUndefined();
    expect(result.current.featsConditionsTabProps.onActiveTogglesChange).toBeUndefined();
    // Archetypes / spells gate on onUpdate.
    expect(result.current.archetypesTabProps.onToggleArchetype).toBeUndefined();
    expect(result.current.spellsTabProps.onSpellcastingChange).toBeUndefined();
    // Inventory tab.
    expect(result.current.inventoryTabProps.onCurrencyChange).toBeUndefined();
    expect(result.current.inventoryTabProps.onAddItem).toBeUndefined();
    expect(result.current.inventoryTabProps.onRemoveItem).toBeUndefined();

    await flushMountLoads();
  });

  it('exposes the per-tab editing callbacks when onUpdate is provided', async () => {
    const { result } = renderController(makeDoc(), makeOnUpdate());

    expect(result.current.featsConditionsTabProps.onConditionsChange).toBeTypeOf('function');
    expect(result.current.featsConditionsTabProps.onRemoveFeat).toBeTypeOf('function');
    expect(result.current.featsConditionsTabProps.onActiveTogglesChange).toBeTypeOf('function');
    expect(result.current.archetypesTabProps.onToggleArchetype).toBeTypeOf('function');
    expect(result.current.spellsTabProps.onSpellcastingChange).toBeTypeOf('function');
    expect(result.current.inventoryTabProps.onCurrencyChange).toBeTypeOf('function');
    expect(result.current.inventoryTabProps.onAddItem).toBeTypeOf('function');
    expect(result.current.inventoryTabProps.onRemoveItem).toBeTypeOf('function');

    await flushMountLoads();
  });

  it('routes feats/conditions edits through onUpdate with the right patch', async () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      makeDoc({ feats: [{ id: 'power-attack', name: 'Power Attack' }] as Pf2eDataModel['feats'] }),
      onUpdate
    );

    const conditions = [{ id: 'cond-frightened', name: 'Frightened', value: 1 }];
    act(() => result.current.featsConditionsTabProps.onConditionsChange!(conditions));
    expect(latest(onUpdate).system.conditions).toEqual(conditions);

    act(() => result.current.featsConditionsTabProps.onActiveTogglesChange!(['rage']));
    expect(latest(onUpdate).system.activeToggles).toEqual(['rage']);

    act(() => result.current.featsConditionsTabProps.onRemoveFeat!('power-attack'));
    expect(latest(onUpdate).system.feats).toEqual([]);

    await flushMountLoads();
  });

  it('routes inventory edits through onUpdate (currency, add, remove)', async () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    const currency = { copper: 1, silver: 2, gold: 3, platinum: 4 };
    act(() => result.current.inventoryTabProps.onCurrencyChange!(currency));
    expect(latest(onUpdate).system.currency).toEqual(currency);

    act(() =>
      result.current.inventoryTabProps.onAddItem!({
        id: 'rope',
        name: 'Rope',
        quantity: 1,
        weight: 1,
      })
    );
    expect(latest(onUpdate).system.inventory.at(-1)).toMatchObject({
      itemId: 'rope',
      name: 'Rope',
    });

    await flushMountLoads();
  });

  it('routes notes edits through onUpdate, preserving the rest of personality', async () => {
    // Each handler spreads the document's current personality, so dependent
    // edits use a fresh render (the onUpdate spy doesn't feed state back).
    const descUpdate = makeOnUpdate();
    const { result: descResult } = renderController(
      makeDoc({ personality: { description: 'old', backstory: 'past' } }),
      descUpdate
    );
    act(() => descResult.current.notesTabProps.onDescriptionChange('A wandering knight.'));
    expect(latest(descUpdate).system.personality).toMatchObject({
      description: 'A wandering knight.',
      backstory: 'past',
    });

    const backstoryUpdate = makeOnUpdate();
    const { result: backstoryResult } = renderController(
      makeDoc({ personality: { description: 'old', backstory: 'past' } }),
      backstoryUpdate
    );
    act(() => backstoryResult.current.notesTabProps.onBackstoryChange('Orphaned young.'));
    expect(latest(backstoryUpdate).system.personality).toMatchObject({
      description: 'old',
      backstory: 'Orphaned young.',
    });

    const notesUpdate = makeOnUpdate();
    const { result: notesResult } = renderController(makeDoc(), notesUpdate);
    act(() => notesResult.current.notesTabProps.onNotesChange('Remember the password.'));
    expect(latest(notesUpdate).system.notes).toBe('Remember the password.');

    await flushMountLoads();
  });

  it('routes spellcasting edits through onUpdate', async () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    const spellcasting = {
      tradition: 'arcane',
      type: 'prepared',
      proficiency: { tier: 'trained', total: 0 },
      spellSlots: {},
      spellsKnown: [],
      focusSpells: [],
      focusPoints: { current: 0, max: 0 },
    } as Pf2eDataModel['spellcasting'];
    act(() => result.current.spellsTabProps.onSpellcastingChange!(spellcasting));

    expect(latest(onUpdate).system.spellcasting).toEqual(spellcasting);

    await flushMountLoads();
  });

  it('derives the trained-skill count and class-DC score from system data', async () => {
    const { result } = renderController(
      makeDoc({
        keyAbility: 'int',
        baseAttributes: { str: 10, dex: 14, con: 12, int: 18, wis: 16, cha: 8 },
        skillProficiencies: {
          arcana: { tier: 'trained', total: 3 },
          stealth: { tier: 'expert', total: 5 },
          athletics: { tier: 'untrained', total: 0 },
        },
      })
    );

    expect(result.current.trainedSkillCount).toBe(2);
    expect(result.current.overviewProps.classDcScore).toBe(18);

    await flushMountLoads();
  });

  it('resolves selected class/ancestry/background from the loaded catalogs', async () => {
    const classes: CharacterClass[] = [fighter];
    const species: Species[] = [human];
    loadClasses.mockResolvedValue(classes);
    loadSpecies.mockResolvedValue(species);
    loadBackgrounds.mockResolvedValue([pf2eBackgrounds[0]]);

    const { result } = renderController(
      makeDoc({
        classId: 'fighter',
        ancestryId: 'human',
        backgroundId: pf2eBackgrounds[0].id,
      }),
      makeOnUpdate()
    );

    await waitFor(() => {
      expect(result.current.headerProps.classes).toEqual(classes);
      expect(result.current.headerProps.ancestries).toEqual(species);
      expect(result.current.headerProps.backgrounds).toEqual([pf2eBackgrounds[0]]);
      // Heritage options come from the resolved ancestry.
      expect(result.current.headerProps.heritages).toEqual(human.subraces);
    });
  });

  it('routes header edits (XP, hero points) through the mutation handlers with parsing', async () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    act(() => result.current.headerProps.onExperiencePointsChange('45'));
    expect(latest(onUpdate).system.experiencePoints).toBe(45);

    // Non-numeric XP falls back to 0.
    act(() => result.current.headerProps.onExperiencePointsChange('xyz'));
    expect(latest(onUpdate).system.experiencePoints).toBe(0);

    act(() => result.current.headerProps.onHeroPointsChange(3));
    expect(latest(onUpdate).system.heroPoints).toBe(3);

    await flushMountLoads();
  });

  it('routes overview HP edits and ability edits through the mutation handlers', async () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      makeDoc({ hitPoints: { current: 10, max: 20, temp: 0 } }),
      onUpdate
    );

    act(() => result.current.overviewProps.onHitPointsChange(15, 22));
    expect(latest(onUpdate).system.hitPoints).toMatchObject({ current: 15, max: 22 });

    act(() => result.current.abilitiesTabProps.onBaseAttributeChange('str', 14));
    const patched = latest(onUpdate).system.baseAttributes;
    expect(patched.str).toBe(14);
    // Untouched abilities are preserved.
    expect(patched.dex).toBe(10);

    await flushMountLoads();
  });

  it('routes background skill/lore training edits through the resolved background template', async () => {
    // Scholar offers a CHOICE of skill (arcana/nature/...) and a fixed lore.
    const scholar = pf2eBackgrounds.find((b) => b.id === 'pf2e-bg-scholar')!;
    // Emissary offers a CHOICE of lore (society/city-lore).
    const emissary = pf2eBackgrounds.find((b) => b.id === 'pf2e-bg-emissary')!;
    loadBackgrounds.mockResolvedValue([scholar, emissary]);

    const skillUpdate = makeOnUpdate();
    const { result: skillResult } = renderController(
      makeDoc({ backgroundId: scholar.id }),
      skillUpdate
    );
    await waitFor(() =>
      expect(skillResult.current.skillsTabProps.backgroundSkillChoice).toBeDefined()
    );

    act(() => skillResult.current.skillsTabProps.onBackgroundSkillTrainingChange('nature'));
    expect(latest(skillUpdate).system.backgroundSkillTrainingSelection).toBe('nature');
    expect(latest(skillUpdate).system.skillProficiencies.nature?.tier).toBe('trained');

    const loreUpdate = makeOnUpdate();
    const { result: loreResult } = renderController(
      makeDoc({ backgroundId: emissary.id }),
      loreUpdate
    );
    await waitFor(() =>
      expect(loreResult.current.skillsTabProps.backgroundLoreChoice).toBeDefined()
    );

    act(() => loreResult.current.skillsTabProps.onBackgroundLoreTrainingChange('society'));
    expect(latest(loreUpdate).system.backgroundLoreTrainingSelection).toBe('society');
    expect(latest(loreUpdate).system.loreProficiencies.society?.tier).toBe('trained');
  });
});
