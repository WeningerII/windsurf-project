import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import type { PowerModifier } from '../../../data/mutants-and-masterminds/3e/modifiers/extras';
import {
  loadAdvantagesForSystem,
  loadComplicationsForSystem,
  loadEquipmentForSystem,
  loadMam3eArchetypesForSystem,
  loadPowerModifiersForSystem,
  loadSpellsForSystem,
} from '../../../utils/dataLoader';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { createEmptyMam3ePower } from '../../../systems/mam3e/mam3eSheetShared';
import { useMam3eSheetController } from '../../../systems/mam3e/useMam3eSheetController';
import { MamArchetypesTab } from '../../../systems/mam3e/components/MamArchetypesTab';
import { MamComplicationsTab } from '../../../systems/mam3e/components/MamComplicationsTab';
import { MamEquipmentBrowserTab } from '../../../systems/mam3e/components/MamEquipmentBrowserTab';
import { MamPowerBrowserTab } from '../../../systems/mam3e/components/MamPowerBrowserTab';

// The controller pulls catalogs through the resources hook, which loads them
// from dataLoader. Stub the loaders so the hook resolves synchronously instead
// of fetching real chunks (mirrors mam3eSheetResources.test.ts).
vi.mock('../../../utils/dataLoader', () => ({
  loadAdvantagesForSystem: vi.fn().mockResolvedValue([]),
  loadComplicationsForSystem: vi.fn().mockResolvedValue([]),
  loadEquipmentForSystem: vi.fn().mockResolvedValue([]),
  loadMam3eArchetypesForSystem: vi.fn().mockResolvedValue([]),
  loadPowerModifiersForSystem: vi.fn().mockResolvedValue([]),
  loadSpellsForSystem: vi.fn().mockResolvedValue([]),
}));

const loadArchetypes = vi.mocked(loadMam3eArchetypesForSystem);
const loadComplications = vi.mocked(loadComplicationsForSystem);
const loadEquipment = vi.mocked(loadEquipmentForSystem);
const loadPowers = vi.mocked(loadSpellsForSystem);
const loadAdvantages = vi.mocked(loadAdvantagesForSystem);
const loadPowerModifiers = vi.mocked(loadPowerModifiersForSystem);

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-controller-test',
    name: 'Controller Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

function makeOnUpdate() {
  return vi.fn<(document: CharacterDocument<SystemDataModel>) => void>();
}

function renderController(
  document: CharacterDocument<Mam3eDataModel>,
  onUpdate?: ReturnType<typeof makeOnUpdate>
) {
  return renderHook(() => useMam3eSheetController({ document, onUpdate }));
}

describe('useMam3eSheetController', () => {
  beforeEach(() => {
    loadArchetypes.mockReset().mockResolvedValue([]);
    loadComplications.mockReset().mockResolvedValue([]);
    loadEquipment.mockReset().mockResolvedValue([]);
    loadPowers.mockReset().mockResolvedValue([]);
    loadAdvantages.mockReset().mockResolvedValue([]);
    loadPowerModifiers.mockReset().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports canUpdate and exposes mutating handlers only when onUpdate is provided', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    expect(result.current.canUpdate).toBe(true);
    // canUpdate gates the per-tab editing affordances.
    expect(result.current.archetypesTabProps.onToggleArchetype).toBeTypeOf('function');
    expect(result.current.complicationsTabProps.onComplicationsChange).toBeTypeOf('function');
    expect(result.current.complicationsTabProps.onInsertComplication).toBeTypeOf('function');
    expect(result.current.advantageBrowserTabProps.onAddAdvantage).toBeTypeOf('function');
  });

  it('omits the mutating handlers in read-only mode (no onUpdate)', () => {
    const { result } = renderController(makeDoc());

    expect(result.current.canUpdate).toBe(false);
    expect(result.current.archetypesTabProps.onToggleArchetype).toBeUndefined();
    expect(result.current.complicationsTabProps.onComplicationsChange).toBeUndefined();
    expect(result.current.complicationsTabProps.onInsertComplication).toBeUndefined();
    expect(result.current.advantageBrowserTabProps.onAddAdvantage).toBeUndefined();
  });

  it('persists a complications replacement through onComplicationsChange', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);
    const next: Mam3eDataModel['complications'] = [
      { id: 'accident', name: 'Accident', description: 'Bad luck.' },
    ];

    act(() => result.current.complicationsTabProps.onComplicationsChange!(next));

    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.complications
    ).toEqual(next);
  });

  it('surfaces the engine-derived spend/over-budget totals through the header bundle', () => {
    // Spend matches getMam3eSheetState's sum of the five spent buckets and the
    // over-budget flag is spent > total.
    const document = makeDoc({
      powerPoints: {
        total: 40,
        spent: { abilities: 20, defenses: 8, powers: 12, advantages: 7, skills: 5 },
      },
    });
    const { result } = renderController(document, makeOnUpdate());

    expect(result.current.ppSpent).toBe(52);
    expect(result.current.ppOver).toBe(true);
    expect(result.current.headerProps.ppSpent).toBe(52);
    expect(result.current.headerProps.ppOver).toBe(true);
  });

  it('derives pinned archetype ids and inserted complication ids for the tab bundles', async () => {
    loadArchetypes.mockResolvedValue([
      { id: 'mam3e-battlesuit', name: 'Battlesuit' } as Mam3eArchetype,
      { id: 'mam3e-speedster', name: 'Speedster' } as Mam3eArchetype,
    ]);
    const document = makeDoc({
      selectedArchetypeIds: ['mam3e-battlesuit'],
      complications: [{ id: 'accident', name: 'Accident', description: 'Bad luck.' }],
    });
    const { result } = renderController(document, makeOnUpdate());

    expect(result.current.pinnedArchetypeIds).toEqual(['mam3e-battlesuit']);
    expect(result.current.archetypesTabProps.pinnedArchetypeIds).toEqual(['mam3e-battlesuit']);
    expect(result.current.complicationsTabProps.insertedComplicationIds).toEqual(['accident']);

    // Once the archetype catalog warms, the pinned id resolves to its entry.
    act(() => result.current.warmArchetypes());
    await waitFor(() => {
      expect(result.current.archetypesTabProps.pinnedArchetypes.map((a) => a.id)).toEqual([
        'mam3e-battlesuit',
      ]);
    });
  });

  it('splits the modifier catalog into sorted extras/flaws and a lookup map for the powers tab', () => {
    const { result } = renderController(makeDoc(), makeOnUpdate());
    const { extraModifiers, flawModifiers, modifierById } = result.current.powersTabProps;

    // The seeded fallback catalog is non-empty and partitioned by type.
    expect(extraModifiers.length).toBeGreaterThan(0);
    expect(extraModifiers.every((m) => m.type === 'extra')).toBe(true);
    expect(flawModifiers.every((m) => m.type === 'flaw')).toBe(true);
    // Sorted by name.
    const names = extraModifiers.map((m: PowerModifier) => m.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    // The map indexes every catalog entry by id.
    expect(modifierById.get(extraModifiers[0].id)?.name).toBe(extraModifiers[0].name);
  });

  it('routes header edits through the mutation handlers with parsed numbers', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    act(() => result.current.headerProps.onPowerLevelChange('12'));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powerLevel
    ).toBe(12);

    act(() => result.current.headerProps.onTotalPowerPointsChange('200'));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powerPoints.total
    ).toBe(200);

    // Non-numeric input falls back: powerLevel -> 1, total -> 0.
    act(() => result.current.headerProps.onPowerLevelChange('abc'));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powerLevel
    ).toBe(1);
    act(() => result.current.headerProps.onTotalPowerPointsChange(''));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powerPoints.total
    ).toBe(0);
  });

  it('writes a skill rank patch carrying both the parsed rank and the computed total', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    act(() => result.current.skillsAdvantagesTabProps.onSkillRankChange('acrobatics', 4, 9));

    const patched = onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>;
    expect(patched.system.skills.acrobatics).toEqual({ rank: 4, total: 9 });
  });

  it('passes advantages straight through onAdvantagesChange', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);
    const advantages: Mam3eDataModel['advantages'] = [{ id: 'a1', name: 'Assessment' }];

    act(() => result.current.skillsAdvantagesTabProps.onAdvantagesChange(advantages));

    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.advantages
    ).toEqual(advantages);
  });

  it('routes ability and defense edits through the abilities-tab handlers', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(makeDoc(), onUpdate);

    act(() => result.current.abilitiesTabProps.onAbilityChange('str', 4));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.abilities.str
    ).toBe(4);

    act(() => result.current.abilitiesTabProps.onDefenseRankChange('dodge', 3));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.defenses.dodge
        .rank
    ).toBe(3);
  });

  it('edits a power rank and base cost via the powers tab, flooring/clamping the rank', () => {
    const onUpdate = makeOnUpdate();
    const { result } = renderController(
      makeDoc({ powers: [createEmptyMam3ePower('p1')] }),
      onUpdate
    );

    act(() => result.current.powersTabProps.onUpdatePowerRank('p1', 5.9));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powers[0].rank
    ).toBe(5);

    act(() => result.current.powersTabProps.onUpdatePowerBaseCost('p1', 3));
    expect(
      (onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.powers[0]
        .baseCost
    ).toBe(3);
  });

  it('builds the contribution ledger for each power on the powers tab', () => {
    const { result } = renderController(
      makeDoc({ powers: [createEmptyMam3ePower('p1'), createEmptyMam3ePower('p2')] }),
      makeOnUpdate()
    );

    // The ledger is non-persisted but should carry an entry referencing each
    // power (the contributing power id rides on entry.source.id).
    const powerIds = new Set(
      result.current.powersTabProps.contributionEntries.map((entry) => entry.source.id)
    );
    expect(powerIds.has('p1')).toBe(true);
    expect(powerIds.has('p2')).toBe(true);
  });

  it('edits notes through the notes tab and defaults empty notes to a blank string', () => {
    const onUpdate = makeOnUpdate();
    // No notes field at all -> bundle exposes ''.
    const noNotesDoc = makeDoc();
    delete (noNotesDoc.system as { notes?: string }).notes;
    const { result } = renderController(noNotesDoc, onUpdate);

    expect(result.current.notesTabProps.notes).toBe('');

    act(() => result.current.notesTabProps.onNotesChange('Origin story.'));
    expect((onUpdate.mock.calls.at(-1)![0] as CharacterDocument<Mam3eDataModel>).system.notes).toBe(
      'Origin story.'
    );
  });

  it('exposes the character advantage-name set so the browser can mark owned advantages', () => {
    const { result } = renderController(
      makeDoc({ advantages: [{ id: 'a1', name: 'Assessment' }] }),
      makeOnUpdate()
    );

    expect(result.current.advantageBrowserTabProps.characterAdvantageNames.has('Assessment')).toBe(
      true
    );
  });

  it('wires the warm-loaders to fetch their catalog and preload their browser chunk', async () => {
    const preloadArchetypes = vi.spyOn(MamArchetypesTab, 'preload').mockResolvedValue(undefined);
    const preloadPowerBrowser = vi
      .spyOn(MamPowerBrowserTab, 'preload')
      .mockResolvedValue(undefined);
    const preloadEquipment = vi
      .spyOn(MamEquipmentBrowserTab, 'preload')
      .mockResolvedValue(undefined);
    const preloadComplications = vi
      .spyOn(MamComplicationsTab, 'preload')
      .mockResolvedValue(undefined);

    const { result } = renderController(makeDoc(), makeOnUpdate());

    act(() => {
      result.current.warmArchetypes();
      result.current.warmPowers();
      result.current.warmPowerBrowser();
      result.current.warmAdvantages();
      result.current.warmEquipmentBrowser();
      result.current.warmComplications();
    });

    await waitFor(() => {
      expect(loadArchetypes).toHaveBeenCalledWith('mam3e');
      expect(loadPowers).toHaveBeenCalledWith('mam3e');
      expect(loadAdvantages).toHaveBeenCalledWith('mam3e');
      expect(loadEquipment).toHaveBeenCalledWith('mam3e');
      expect(loadComplications).toHaveBeenCalledWith('mam3e');
      // warmPowers + warmPowerBrowser both warm the modifier catalog.
      expect(loadPowerModifiers).toHaveBeenCalledWith('mam3e');
    });

    expect(preloadArchetypes).toHaveBeenCalled();
    expect(preloadPowerBrowser).toHaveBeenCalled();
    expect(preloadEquipment).toHaveBeenCalled();
    expect(preloadComplications).toHaveBeenCalled();
  });

  it('threads the warm-loaders into the lazy tabs as retry handlers', () => {
    const { result } = renderController(makeDoc(), makeOnUpdate());

    expect(result.current.archetypesTabProps.onRetryArchetypes).toBe(result.current.warmArchetypes);
    expect(result.current.powerBrowserTabProps.onRetryPowerBrowser).toBe(
      result.current.warmPowerBrowser
    );
    expect(result.current.advantageBrowserTabProps.onRetryAdvantages).toBe(
      result.current.warmAdvantages
    );
    expect(result.current.equipmentBrowserTabProps.onRetryEquipment).toBe(
      result.current.warmEquipmentBrowser
    );
    expect(result.current.complicationsTabProps.onRetryComplications).toBe(
      result.current.warmComplications
    );
  });
});
