import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import * as dataLoader from '../../utils/dataLoader';
import { resilient } from '../../data/dnd/5e-2024/feats/general';
import { Dnd5eSheet } from '../../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { Dnd5e2024Sheet } from '../../systems/dnd5e-2024/components/Dnd5e2024Sheet';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { D20LegacySheet } from '../../systems/d20-legacy/sheet';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { Pf2eCharacterSheet } from '../../systems/pf2e/sheet';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { Mam3eCharacterSheet } from '../../systems/mam3e/sheet';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { DaggerheartSheet } from '../../systems/daggerheart/sheet';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import { applyDnd5eFeatTemplate } from '../../utils/featTemplate';
import { battlesuitArchetype } from '../../data/mutants-and-masterminds/3e/archetypes/battlesuit';
import { accident } from '../../data/mutants-and-masterminds/3e/complications';

vi.mock('../../components/FeatBrowser', () => ({
  FeatBrowser: ({
    feats,
    onSelectFeat,
  }: {
    feats: Array<{ id: string; name: string }>;
    onSelectFeat?: (feat: { id: string; name: string }) => void;
  }) => (
    <div>
      {feats.map((feat) => (
        <button key={feat.id} type="button" onClick={() => onSelectFeat?.(feat)}>
          Select {feat.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/FeatureOptionBrowser', () => ({
  FeatureOptionBrowser: ({
    options,
    onSelectOption,
  }: {
    options: Array<{ id: string; name: string }>;
    onSelectOption?: (option: { id: string; name: string }) => void;
  }) => (
    <div>
      {options.map((option) => (
        <button key={option.id} type="button" onClick={() => onSelectOption?.(option)}>
          Add {option.name}
        </button>
      ))}
    </div>
  ),
}));

function makeDoc(
  systemId: string,
  system: SystemDataModel,
  name = 'Sheet Hero'
): CharacterDocument<SystemDataModel> {
  return {
    id: `${systemId}-doc`,
    name,
    systemId,
    system,
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

describe('System Sheets', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Dnd5eSheet', () => {
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData());
    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={vi.fn()}
      />
    );
    expect(screen.getByText('Proficiency Bonus')).toBeInTheDocument();
    expect(screen.getByText('Armor Class')).toBeInTheDocument();
    expect(screen.getByText('Rest')).toBeInTheDocument();
    expect(screen.getByText('Death Saves')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Point Buy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Standard Array' })).toBeInTheDocument();
  });

  it('loads monsters in Dnd5eSheet and hides the source-limited 2014 feats browser tab', async () => {
    const user = userEvent.setup();
    const loadMonstersSpy = vi.spyOn(dataLoader, 'loadMonstersForSystem');
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData());

    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.queryByRole('tab', { name: /^feats$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /monsters/i }));

    await waitFor(() => {
      expect(loadMonstersSpy).toHaveBeenCalledWith('dnd-5e-2014');
    });
  });

  it('applies 5e-2014 feature options from the shared sheet features tab', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const loadFeatureOptionsSpy = vi
      .spyOn(dataLoader, 'loadFeatureOptionsForSystem')
      .mockResolvedValue([
        {
          id: 'agonizing-blast',
          group: 'invocations',
          name: 'Agonizing Blast',
          system: 'dnd-5e-2014',
          source: 'SRD 5.1',
          description: 'Add your Charisma modifier to eldritch blast damage.',
          classIds: ['warlock'],
          minLevel: 2,
        },
      ]);
    const system = createDefaultDnd5eData();
    system.classLevels = [{ classId: 'warlock', level: 3, hitDieRolls: [8, 5, 5] }];
    system.level = 3;
    const doc = makeDoc('dnd-5e-2014', system);

    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={onUpdate}
      />
    );

    await waitFor(() => {
      expect(loadFeatureOptionsSpy).toHaveBeenCalledWith('dnd-5e-2014');
    });

    await user.click(screen.getByRole('tab', { name: /features/i }));
    await user.click(await screen.findByRole('button', { name: 'Add Agonizing Blast' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.featureOptionSelections).toEqual([
      { id: 'agonizing-blast', group: 'invocations' },
    ]);
    expect(updatedDoc.system.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'feature-option:invocations:agonizing-blast',
          name: 'Agonizing Blast',
          source: 'Selected Invocation',
        }),
      ])
    );
  });

  it('renders Dnd5e2024Sheet and masteries tab', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const loadMonstersSpy = vi.spyOn(dataLoader, 'loadMonstersForSystem');
    const doc = makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data());
    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={onUpdate}
      />
    );
    expect(screen.getByRole('tab', { name: /^feats$/i })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /monsters/i }));
    await waitFor(() => {
      expect(loadMonstersSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });
    await user.click(screen.getByRole('tab', { name: /masteries/i }));
    expect(screen.getByText('Weapon Masteries')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cleave' }));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('applies feat automation from the Dnd5e2024Sheet feat browser', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([resilient]);
    const doc = makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data());

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /^feats$/i }));
    await waitFor(() => {
      expect(dataLoader.loadFeatsForSystem).toHaveBeenCalledWith('dnd-5e-2024');
    });

    await user.click(await screen.findByRole('button', { name: 'Select Resilient' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5e2024Data>
    >;
    expect(updatedDoc.system.feats[0]).toMatchObject({
      id: 'resilient',
      automation: {
        abilityScores: { str: 1 },
        savingThrows: ['str'],
      },
    });
    expect(updatedDoc.system.baseAttributes.str).toBe(11);
    expect(updatedDoc.system.savingThrowProficiencies).toContain('str');
  });

  it('reconfigures selected feat choices from the Dnd5e2024Sheet features tab', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const loadFeatsSpy = vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([resilient]);
    const seededDoc = applyDnd5eFeatTemplate(
      makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data()) as CharacterDocument<
        ReturnType<typeof createDefaultDnd5e2024Data>
      >,
      resilient
    );

    render(
      <Dnd5e2024Sheet
        document={seededDoc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={onUpdate}
      />
    );

    await waitFor(() => {
      expect(loadFeatsSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });

    await user.click(screen.getByRole('tab', { name: /features/i }));
    const selection = await screen.findByTitle('resilient ability-scores selection 1');

    await user.selectOptions(selection, 'wis');

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5e2024Data>
    >;
    expect(updatedDoc.system.baseAttributes.str).toBe(10);
    expect(updatedDoc.system.baseAttributes.wis).toBe(11);
    expect(updatedDoc.system.savingThrowProficiencies).toEqual(['wis']);
    expect(updatedDoc.system.feats[0].automation).toMatchObject({
      abilityScores: { wis: 1 },
      savingThrows: ['wis'],
    });
  });

  it('tracks death save updates in Dnd5eSheet when at 0 HP', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const system = createDefaultDnd5eData();
    system.hitPoints.current = 0;
    const doc = makeDoc('dnd-5e-2014', system);

    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByTitle('Mark death save success'));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('writes subclass choices from Dnd5eSheet class rows through the shared template sync', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const system = createDefaultDnd5eData();
    system.classLevels = [{ classId: 'wizard', level: 2, hitDieRolls: [6, 4] }];
    system.level = 2;
    const doc = makeDoc('dnd-5e-2014', system);

    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={onUpdate}
      />
    );

    const subclassSelect = await screen.findByTitle('wizard subclass');
    expect(subclassSelect).toBeEnabled();

    await user.selectOptions(subclassSelect, 'evocation');

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      subclassId: 'evocation',
      level: 2,
    });
    expect(updatedDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['evocation-savant', 'sculpt-spells'])
    );
  });

  it('disables subclass selection in Dnd5e2024Sheet until the class reaches its subclass level', async () => {
    const system = createDefaultDnd5e2024Data();
    system.classLevels = [{ classId: 'cleric', level: 2, hitDieRolls: [8, 5] }];
    system.level = 2;
    const doc = makeDoc('dnd-5e-2024', system);

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={vi.fn()}
      />
    );

    const subclassSelect = await screen.findByTitle('cleric subclass');
    expect(subclassSelect).toBeDisabled();
    expect(screen.getByText('Subclass unlocks at level 3.')).toBeInTheDocument();
  });

  it('renders D20LegacySheet (PF1e variant) and loads traits through the shared loader', async () => {
    const user = userEvent.setup();
    const loadTraitsSpy = vi.spyOn(dataLoader, 'loadTraitsForSystem');
    const doc = makeDoc('pf1e', createDefaultPf1eData());
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    await waitFor(() => {
      expect(loadTraitsSpy).toHaveBeenCalledWith('pf1e');
    });

    expect(screen.getByText('Pathfinder 1e')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /monsters/i })).not.toBeInTheDocument();

    await user.click(screen.getByTitle('Add class'));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Duelist' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('option', { name: 'Archmage' })).not.toBeInTheDocument();
  });

  it('shows a manual spell-progression warning for PF1e prestige casters', () => {
    const system = createDefaultPf1eData();
    system.classLevels = [
      {
        classId: 'mystic-theurge',
        level: 1,
        hitDieRolls: [6],
        bab: 'half',
        fortSave: 'poor',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
      },
    ];
    system.level = 1;
    system.hitPoints.max = 7;
    system.hitPoints.current = 7;

    const doc = makeDoc('pf1e', system);
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    expect(
      screen.getByText(/spell progression for mystic theurge is not automated yet/i)
    ).toBeInTheDocument();
  });

  it('renders Pf2eCharacterSheet and loads backgrounds through the shared loader', async () => {
    const loadBackgroundsSpy = vi.spyOn(dataLoader, 'loadPf2eBackgroundsForSystem');
    const loadArchetypesSpy = vi.spyOn(dataLoader, 'loadArchetypesForSystem');
    const user = userEvent.setup();
    const doc = makeDoc('pf2e', createDefaultPf2eData());
    render(
      <Pf2eCharacterSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>}
        onUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(loadBackgroundsSpy).toHaveBeenCalledWith('pf2e');
    });

    expect(screen.getByText('Hero Points')).toBeInTheDocument();
    expect(screen.getByText('Class DC')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /archetypes/i }));
    await waitFor(() => {
      expect(loadArchetypesSpy).toHaveBeenCalledWith('pf2e');
    });
  });

  it('renders Mam3eCharacterSheet condition track', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('mam3e', createDefaultMam3eData());
    render(
      <Mam3eCharacterSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultMam3eData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /conditions/i }));
    expect(screen.getByText('Condition Track')).toBeInTheDocument();
    await user.click(screen.getByText('Fail by 1-4: +1 Bruised'));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('pins M&M archetypes and inserts SRD complications', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const loadArchetypesSpy = vi
      .spyOn(dataLoader, 'loadMam3eArchetypesForSystem')
      .mockResolvedValue([battlesuitArchetype]);
    const loadComplicationsSpy = vi
      .spyOn(dataLoader, 'loadComplicationsForSystem')
      .mockResolvedValue([accident]);
    const doc = makeDoc('mam3e', createDefaultMam3eData());

    const { rerender } = render(
      <Mam3eCharacterSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultMam3eData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /archetypes/i }));
    await waitFor(() => {
      expect(loadArchetypesSpy).toHaveBeenCalledWith('mam3e');
    });

    await user.click(await screen.findByRole('button', { name: /pin battlesuit/i }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const pinnedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultMam3eData>
    >;
    expect(pinnedDoc.system.selectedArchetypeIds).toEqual(['mam3e-battlesuit']);

    onUpdate.mockClear();
    rerender(
      <Mam3eCharacterSheet
        document={pinnedDoc as CharacterDocument<ReturnType<typeof createDefaultMam3eData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /complications/i }));
    await waitFor(() => {
      expect(loadComplicationsSpy).toHaveBeenCalledWith('mam3e');
    });

    await user.click(await screen.findByRole('button', { name: 'Insert' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultMam3eData>
    >;
    expect(updatedDoc.system.complications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: accident.id,
          name: accident.name,
          source: accident.source,
          category: accident.category,
        }),
      ])
    );
  });

  it('renders M&M power modifiers from the Powers DB tab without crashing', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const loadPowersSpy = vi.spyOn(dataLoader, 'loadSpellsForSystem');
    const loadPowerModifiersSpy = vi.spyOn(dataLoader, 'loadPowerModifiersForSystem');
    const doc = makeDoc('mam3e', createDefaultMam3eData());

    render(
      <Mam3eCharacterSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultMam3eData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: /powers db/i }));

    await waitFor(() => {
      expect(loadPowersSpy).toHaveBeenCalledWith('mam3e');
      expect(loadPowerModifiersSpy).toHaveBeenCalledWith('mam3e');
    });

    expect(await screen.findByLabelText(/search spells/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/search modifiers/i)).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('renders DaggerheartSheet scaffold fields and updates manual entries', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('daggerheart', createDefaultDaggerheartData(), 'Hopebound');

    render(
      <DaggerheartSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Attributes')).toBeInTheDocument();
    expect(screen.getByText('Experiences')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add experience/i }));
    expect(onUpdate).toHaveBeenCalled();
  });
});
