import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import * as dataLoader from '../../utils/dataLoader';
import { FeatDefinition } from '../../types/character-options/feats';
import { bard as bardClass } from '../../data/dnd/5e-2014/classes/bard';
import { cleric as clericClass } from '../../data/dnd/5e-2014/classes/cleric';
import { wizard as wizardClass } from '../../data/dnd/5e-2014/classes/wizard';
import { halfElf as halfElfSpecies } from '../../data/dnd/5e-2014/species/half-elf';
import { dnd5eSpellsById } from '../../data/dnd/5e-2014/spells';
import { dnd5e2024SpellsById } from '../../data/dnd/5e-2024/spells';
import { dnd5eEquipmentById } from '../../data/dnd/5e-2014/equipment';
import { Dnd5eSheet } from '../../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { Dnd5eSheetBase } from '../../systems/dnd5e/shared/Dnd5eSheetBase';
import { Dnd5e2024Sheet } from '../../systems/dnd5e-2024/components/Dnd5e2024Sheet';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import { D20LegacySheet } from '../../systems/d20-legacy/sheet';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData } from '../../systems/pf1e/data-model';
import { wizard as wizard35 } from '../../data/dnd/3.5e/classes/wizard';
import { Pf2eCharacterSheet } from '../../systems/pf2e/sheet';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { Mam3eCharacterSheet } from '../../systems/mam3e/sheet';
import { createDefaultMam3eData } from '../../systems/mam3e/data-model';
import { DaggerheartSheet } from '../../systems/daggerheart/sheet';
import { createDefaultDaggerheartData } from '../../systems/daggerheart/data-model';
import { applyDnd5eFeatTemplate } from '../../utils/featTemplate';
import { acolyte as acolyteBackground } from '../../data/dnd/5e-2014/backgrounds/acolyte';
import { ranger as rangerClass2024 } from '../../data/dnd/5e-2024/classes/ranger';
import { battlesuitArchetype } from '../../data/mutants-and-masterminds/3e/archetypes/battlesuit';
import { accident } from '../../data/mutants-and-masterminds/3e/complications';
import { human } from '../../data/pathfinder/2e/ancestries/human';
import { pf2eBackgrounds } from '../../data/pathfinder/2e/backgrounds';
import { wizard as wizardPf1 } from '../../data/pathfinder/1e/classes/wizard';
import { cleric as clericPf1 } from '../../data/pathfinder/1e/classes/cleric';
import { sorcerer as sorcererPf1 } from '../../data/pathfinder/1e/classes/sorcerer';
import { dragonDisciple as dragonDisciplePf1 } from '../../data/pathfinder/1e/prestige-classes/dragon-disciple';
import { mysticTheurge as mysticTheurgePf1 } from '../../data/pathfinder/1e/prestige-classes/mystic-theurge';

// Neutral feat fixture (the 5e-2024 Resilient feat was removed as non-SRD
// content). It keeps id 'resilient' so the engine's ability-choice + saving
// throw handling still applies, and the mechanical ability benefit line.
const resilient: FeatDefinition = {
  id: 'resilient',
  name: 'Resilient',
  system: 'dnd-5e-2024',
  source: 'Test Fixture',
  prerequisites: [{ type: 'level', value: 4 }],
  abilityScoreIncrease: { type: 'choice', totalIncrease: 1 },
  description: 'Test fixture: ability choice plus the matching saving throw.',
  benefits: ['Ability Score Increase: Increase any ability score by 1, to a maximum of 20.'],
};

// Neutral background fixture (the 5e-2014 Criminal was removed as non-SRD
// content). It keeps the `one-gaming-set` choice token the test resolves.
const outlawBackground = {
  ...acolyteBackground,
  id: 'outlaw',
  name: 'Outlaw',
  skillProficiencies: ['deception', 'stealth'],
  toolProficiencies: ['thieves-tools', 'one-gaming-set'],
  equipment: ['pouch'],
  gold: 15,
  feature: {
    id: 'outlaw-contact',
    name: 'Outlaw Contact',
    source: 'Outlaw Background',
    description: 'Test fixture feature.',
  },
};

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

vi.mock('../../components/SpellBrowser', () => ({
  SpellBrowser: ({
    spells,
    onSelectSpell,
  }: {
    spells: Array<{ id: string; name: string }>;
    onSelectSpell?: (spell: { id: string; name: string }) => void;
  }) => (
    <div>
      {spells.map((spell) => (
        <button key={spell.id} type="button" onClick={() => onSelectSpell?.(spell)}>
          Learn {spell.name}
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

function make5eSpellSlots() {
  return {
    1: { max: 4, used: 0 },
    2: { max: 2, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  };
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

const HEAVY_SHEET_WAIT_TIMEOUT_MS = 60000;
const HEAVY_SHEET_TEST_TIMEOUT_MS = 120000;

function makePf2eSpell(
  overrides: Partial<Spell> & Pick<Spell, 'id' | 'name' | 'level' | 'classes'>
): Spell {
  return {
    // id, name, level, and classes come straight from the required part of
    // `overrides` via the spread below.
    system: 'pf2e',
    source: 'Core Rulebook',
    school: overrides.school ?? 'evocation',
    castingTime: overrides.castingTime ?? { type: 'action', amount: 2 },
    range: overrides.range ?? { type: 'ranged', feet: 30 },
    components: overrides.components ?? { verbal: true, somatic: true, material: false },
    duration: overrides.duration ?? { type: 'instant' },
    concentration: overrides.concentration ?? false,
    ritual: overrides.ritual ?? false,
    description: overrides.description ?? `${overrides.name} description`,
    ...overrides,
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

  it('updates experience points from the extracted Dnd5e header section', () => {
    const onUpdate = vi.fn();
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    render(<Dnd5eSheet document={doc} onUpdate={onUpdate} />);

    fireEvent.change(screen.getByTitle('Experience points'), {
      target: { value: '900' },
    });

    expect(onUpdate).toHaveBeenCalled();
    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.experiencePoints).toBe(900);
  });

  it('keeps shared 5e prepared-spell toggles and spell selection wired through the host', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([wizardClass]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      dnd5eSpellsById['magic-missile'],
      dnd5eSpellsById['shield'],
    ]);

    let currentDoc = makeDoc('dnd-5e-2014', {
      ...createDefaultDnd5eData(),
      classLevels: [{ classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] }],
      spellcasting: {
        classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 3 }],
        spellsKnown: ['magic-missile'],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });
    expect(await screen.findByText(/Prepared Spells 0\/3/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Magic Missile' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.spellsPrepared).toEqual(['magic-missile']);
    expect(await screen.findByText(/Prepared Spells 1\/3/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Learn Shield' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.spellsKnown).toEqual(['magic-missile', 'shield']);
  });

  it('surfaces shared 5e always-prepared grants separately and keeps them out of manual tracking', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([clericClass]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      dnd5eSpellsById.bless,
      dnd5eSpellsById['cure-wounds'],
      dnd5eSpellsById['healing-word'],
    ]);

    let currentDoc = makeDoc('dnd-5e-2014', {
      ...createDefaultDnd5eData(),
      classLevels: [
        { classId: 'cleric', subclassId: 'life-domain', level: 3, hitDieRolls: [8, 5, 5] },
      ],
      spellcasting: {
        classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: 3 }],
        spellsKnown: ['healing-word'],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });

    expect(await screen.findByText('Always Prepared')).toBeInTheDocument();
    expect(screen.getByText('Bless')).toBeInTheDocument();
    expect(screen.getByText('Cure Wounds')).toBeInTheDocument();
    expect(screen.getByText(/Prepared Spells 0\/3/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Learn Bless' }));
    expect(onUpdate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Healing Word' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.spellsKnown).toEqual(['healing-word']);
    expect(currentDoc.system.spellcasting?.spellsPrepared).toEqual(['healing-word']);
    expect(await screen.findByText(/Prepared Spells 1\/3/i)).toBeInTheDocument();
  });

  it('disables prepared toggles for known-only 5e spellcasters', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([bardClass]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      dnd5eSpellsById['magic-missile'],
    ]);

    const doc = makeDoc('dnd-5e-2014', {
      ...createDefaultDnd5eData(),
      classLevels: [{ classId: 'bard', level: 3, hitDieRolls: [6, 4, 5] }],
      spellcasting: {
        classes: [{ classId: 'bard', ability: 'cha', spellcastingLevel: 3 }],
        spellsKnown: ['magic-missile'],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

    render(<Dnd5eSheet document={doc} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    expect(
      screen.getByText(/Your current spellcasting classes use known-spell casting/i)
    ).toBeInTheDocument();

    const preparedToggle = screen.getByRole('button', { name: 'Magic Missile' });
    expect(preparedToggle).toBeDisabled();

    await user.click(preparedToggle);
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('keeps multiclass prepared-caster allocation explicitly manual in the shared 5e host', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([wizardClass, clericClass]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      dnd5eSpellsById['magic-missile'],
    ]);

    const doc = makeDoc('dnd-5e-2014', {
      ...createDefaultDnd5eData(),
      baseAttributes: {
        str: 10,
        dex: 10,
        con: 10,
        int: 14,
        wis: 16,
        cha: 10,
      },
      classLevels: [
        { classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] },
        { classId: 'cleric', level: 2, hitDieRolls: [8, 5] },
      ],
      spellcasting: {
        classes: [
          { classId: 'wizard', ability: 'int', spellcastingLevel: 3 },
          { classId: 'cleric', ability: 'wis', spellcastingLevel: 2 },
        ],
        spellsKnown: ['magic-missile'],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

    render(<Dnd5eSheet document={doc} onUpdate={vi.fn()} />);

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    expect(
      await screen.findByText(/Multiple prepared casting classes are active/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Wizard 5, Cleric 5\./i)).toBeInTheDocument();
    expect(screen.getByText(/Prepared Spells 0 total/i)).toBeInTheDocument();
  });

  it('shows unresolved shared 5e always-prepared grants explicitly when the spell dataset does not ship them', async () => {
    const user = userEvent.setup();
    // Grant a fictional always-prepared spell the dataset does not ship, so it
    // must surface as an unresolved grant. (The real SRD Ranger only grants
    // Hunter's Mark, which is shipped and resolves normally.)
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([
      {
        ...rangerClass2024,
        alwaysPreparedSpellsByLevel: {
          ...rangerClass2024.alwaysPreparedSpellsByLevel,
          9: ['test-unresolved-grant'],
        },
      },
    ]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      dnd5e2024SpellsById['hunters-mark'],
    ]);

    const doc = makeDoc('dnd-5e-2024', {
      ...createDefaultDnd5e2024Data(),
      classLevels: [{ classId: 'ranger', level: 13, hitDieRolls: [10] }],
      spellcasting: {
        classes: [{ classId: 'ranger', ability: 'wis', spellcastingLevel: 13 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>;

    render(<Dnd5e2024Sheet document={doc} onUpdate={vi.fn()} />);

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('dnd-5e-2024');
    });

    expect(await screen.findByText('Always Prepared')).toBeInTheDocument();
    expect(screen.getByText("Hunter's Mark")).toBeInTheDocument();
    expect(screen.getByText('Test Unresolved Grant')).toBeInTheDocument();
    expect(screen.getAllByText('Unresolved')).toHaveLength(1);
  });

  it('keeps shared 5e equipment loading and selection wired through the host', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([
      dnd5eEquipmentById.leather,
      dnd5eEquipmentById.shield,
    ]);

    let currentDoc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /equipment/i }));

    await waitFor(() => {
      expect(dataLoader.loadEquipmentForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });

    await user.click(await screen.findByText('Leather'));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.inventory.some((entry) => entry.itemId === 'leather')).toBe(true);
    expect(currentDoc.system.equipment.some((entry) => entry.itemId === 'leather')).toBe(true);
  });

  it('applies and clears 5e background language choices from the sheet', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([acolyteBackground]);

    let currentDoc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await waitFor(() => {
      expect(dataLoader.loadBackgroundsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });

    expect(await screen.findByRole('option', { name: 'Acolyte' })).toBeInTheDocument();
    await user.selectOptions(screen.getByTitle('Background'), 'acolyte');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.click(screen.getByRole('tab', { name: /features/i }));

    await user.selectOptions(screen.getByLabelText('Background language 1'), 'Draconic');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByLabelText('Background language 2'), 'Elvish');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.backgroundId).toBe('acolyte');
    expect(currentDoc.system.backgroundLanguageSelections).toEqual(['Draconic', 'Elvish']);
    expect(currentDoc.system.languageProficiencies).toEqual(['Draconic', 'Elvish']);
    expect(
      currentDoc.system.features.some((feature) => feature.id === 'shelter-of-the-faithful')
    ).toBe(true);

    await user.selectOptions(screen.getByTitle('Background'), '');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.backgroundId).toBeUndefined();
    expect(currentDoc.system.backgroundLanguageSelections).toEqual([]);
    expect(currentDoc.system.languageProficiencies).toEqual([]);
    expect(
      currentDoc.system.features.some((feature) => feature.id === 'shelter-of-the-faithful')
    ).toBe(false);
  });

  it('applies and clears 5e background tool choices from the sheet', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([outlawBackground]);

    let currentDoc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await waitFor(() => {
      expect(dataLoader.loadBackgroundsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Outlaw' })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTitle('Background'), 'outlaw');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.click(screen.getByRole('tab', { name: /features/i }));

    await user.selectOptions(screen.getByLabelText('Background tool 1'), 'playing-card-set');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.backgroundId).toBe('outlaw');
    expect(currentDoc.system.backgroundToolSelections).toEqual(['playing-card-set']);
    expect(currentDoc.system.toolProficiencies).toEqual(['thieves-tools', 'playing-card-set']);
    expect(currentDoc.system.features.some((feature) => feature.id === 'outlaw-contact')).toBe(
      true
    );

    await user.selectOptions(screen.getByTitle('Background'), '');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.backgroundId).toBeUndefined();
    expect(currentDoc.system.backgroundToolSelections).toEqual([]);
    expect(currentDoc.system.toolProficiencies).toEqual([]);
    expect(currentDoc.system.features.some((feature) => feature.id === 'outlaw-contact')).toBe(
      false
    );
  });

  it('shows feats tab for 5e-2014 and loads monsters', async () => {
    const user = userEvent.setup();
    const loadMonstersSpy = vi.spyOn(dataLoader, 'loadMonstersForSystem');
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData());

    render(
      <Dnd5eSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByRole('tab', { name: /^feats$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /monsters/i }));

    await waitFor(() => {
      expect(loadMonstersSpy).toHaveBeenCalledWith('dnd-5e-2014');
    });
  });

  it('persists 5e-2014 feature options through shared sheet rerenders', async () => {
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
    let currentDoc = makeDoc('dnd-5e-2014', system) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    const featuresTab = screen.getByRole('tab', { name: /features/i });
    fireEvent.focus(featuresTab);
    fireEvent.pointerEnter(featuresTab);
    fireEvent.focus(featuresTab);

    await waitFor(() => {
      expect(loadFeatureOptionsSpy).toHaveBeenCalledWith('dnd-5e-2014');
    });

    await user.click(featuresTab);
    await user.click(await screen.findByRole('button', { name: 'Add Agonizing Blast' }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();
    expect(loadFeatureOptionsSpy).toHaveBeenCalledTimes(1);

    expect(currentDoc.system.featureOptionSelections).toEqual([
      { id: 'agonizing-blast', group: 'invocations' },
    ]);
    expect(currentDoc.system.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'feature-option:invocations:agonizing-blast',
          name: 'Agonizing Blast',
          source: 'Selected Invocation',
        }),
      ])
    );

    const selectedFeatureOptionsSection = screen
      .getByText('Selected Feature Options')
      .closest('section');
    expect(selectedFeatureOptionsSection).toBeTruthy();
    expect(within(selectedFeatureOptionsSection!).getByText('Agonizing Blast')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Agonizing Blast' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.featureOptionSelections).toEqual([
      { id: 'agonizing-blast', group: 'invocations' },
    ]);
    expect(
      currentDoc.system.features.filter(
        (feature) => feature.id === 'feature-option:invocations:agonizing-blast'
      )
    ).toHaveLength(1);

    const selectedFeatureOptionsSectionAfterDuplicate = screen
      .getByText('Selected Feature Options')
      .closest('section');
    expect(selectedFeatureOptionsSectionAfterDuplicate).toBeTruthy();
    await user.click(
      within(selectedFeatureOptionsSectionAfterDuplicate!).getByRole('button', { name: 'Remove' })
    );
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.featureOptionSelections).toEqual([]);
    expect(
      currentDoc.system.features.some(
        (feature) => feature.id === 'feature-option:invocations:agonizing-blast'
      )
    ).toBe(false);
  });

  it('warms and renders the extracted shared 5e feat browser tab', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
    const loadFeatsSpy = vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([resilient]);
    const doc = makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data());

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={vi.fn()}
      />
    );

    const featsTab = screen.getByRole('tab', { name: /^feats$/i });
    fireEvent.focus(featsTab);
    fireEvent.pointerEnter(featsTab);
    fireEvent.focus(featsTab);
    await waitFor(() => {
      expect(loadFeatsSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });
    await user.click(featsTab);
    expect(await screen.findByRole('button', { name: 'Select Resilient' })).toBeInTheDocument();
    await waitFor(() => {
      expect(loadFeatsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('warms and renders the extracted shared 5e spells tab', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
    const loadSpellsSpy = vi
      .spyOn(dataLoader, 'loadSpellsForSystem')
      .mockResolvedValue([dnd5eSpellsById['magic-missile']]);
    const doc = makeDoc('dnd-5e-2024', {
      ...createDefaultDnd5e2024Data(),
      spellcasting: {
        classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 1 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    });

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={vi.fn()}
      />
    );

    const spellsTab = screen.getByRole('tab', { name: /^spells$/i });
    fireEvent.focus(spellsTab);
    fireEvent.pointerEnter(spellsTab);
    await waitFor(() => {
      expect(loadSpellsSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });
    await user.click(spellsTab);
    expect(await screen.findByRole('button', { name: 'Learn Magic Missile' })).toBeInTheDocument();
    await waitFor(() => {
      expect(loadSpellsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('reloads shared 5e spell resources when the base sheet switches system ids mid-load', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);

    const spells2014 = createDeferred<Spell[]>();
    const spells2024 = createDeferred<Spell[]>();
    const spell2024: Spell = {
      ...dnd5eSpellsById.shield,
      id: 'shield-2024',
      name: 'Shield 2024',
      system: 'dnd-5e-2024',
      classes: ['wizard'],
    };

    const loadSpellsSpy = vi
      .spyOn(dataLoader, 'loadSpellsForSystem')
      .mockImplementation(async (systemId) => {
        if (systemId === 'dnd-5e-2014') {
          return spells2014.promise;
        }

        if (systemId === 'dnd-5e-2024') {
          return spells2024.promise;
        }

        return [];
      });

    type Shared5eDoc = CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData> | ReturnType<typeof createDefaultDnd5e2024Data>
    >;

    const doc2014 = makeDoc('dnd-5e-2014', {
      ...createDefaultDnd5eData(),
      classLevels: [{ classId: 'wizard', level: 1, hitDieRolls: [6] }],
      spellcasting: {
        classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 1 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as Shared5eDoc;

    const doc2024 = makeDoc('dnd-5e-2024', {
      ...createDefaultDnd5e2024Data(),
      classLevels: [{ classId: 'wizard', level: 1, hitDieRolls: [6] }],
      spellcasting: {
        classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 1 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: make5eSpellSlots(),
      },
    }) as Shared5eDoc;

    const { rerender } = render(<Dnd5eSheetBase document={doc2014} />);

    await user.click(screen.getByRole('tab', { name: /^spells$/i }));
    await waitFor(() => {
      expect(loadSpellsSpy).toHaveBeenCalledWith('dnd-5e-2014');
    });

    rerender(<Dnd5eSheetBase document={doc2024} enableWeaponMasteries />);

    await user.click(screen.getByRole('tab', { name: /^spells$/i }));
    await waitFor(() => {
      expect(loadSpellsSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });

    await act(async () => {
      spells2014.resolve([dnd5eSpellsById['magic-missile']]);
      await spells2014.promise;
    });
    expect(screen.queryByText('Learn Magic Missile')).not.toBeInTheDocument();

    await act(async () => {
      spells2024.resolve([spell2024]);
      await spells2024.promise;
    });
    expect(await screen.findByText('Learn Shield 2024')).toBeInTheDocument();
  });

  it('warms and renders the extracted shared 5e equipment tab', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
    const loadEquipmentSpy = vi
      .spyOn(dataLoader, 'loadEquipmentForSystem')
      .mockResolvedValue([dnd5eEquipmentById.leather]);
    const doc = makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data());

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={vi.fn()}
      />
    );

    const equipmentTab = screen.getByRole('tab', { name: /^equipment$/i });
    fireEvent.focus(equipmentTab);
    fireEvent.pointerEnter(equipmentTab);
    await waitFor(() => {
      expect(loadEquipmentSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });
    await user.click(equipmentTab);
    expect(await screen.findByPlaceholderText(/search equipment/i)).toBeInTheDocument();
    expect(await screen.findByText('Leather')).toBeInTheDocument();
    await waitFor(() => {
      expect(loadEquipmentSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('warms and renders the extracted shared 5e monster tab', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
    const loadMonstersSpy = vi.spyOn(dataLoader, 'loadMonstersForSystem').mockResolvedValue([
      {
        id: 'young-red-dragon',
        name: 'Young Red Dragon',
        type: 'dragon',
        size: 'large',
        alignment: 'chaotic evil',
        challengeRating: 10,
        experiencePoints: 5900,
        armorClass: 18,
        hitPoints: { count: 19, die: 10, bonus: 76 },
        speed: 40,
        specialAbilities: [
          {
            name: 'Fire Breath',
            description: 'The dragon exhales fire in a cone.',
          },
        ],
      } as never,
    ]);
    const doc = makeDoc('dnd-5e-2024', createDefaultDnd5e2024Data());

    render(
      <Dnd5e2024Sheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDnd5e2024Data>>}
        onUpdate={vi.fn()}
      />
    );

    const monstersTab = screen.getByRole('tab', { name: /^monsters$/i });
    fireEvent.focus(monstersTab);
    fireEvent.pointerEnter(monstersTab);
    fireEvent.focus(monstersTab);
    await waitFor(() => {
      expect(loadMonstersSpy).toHaveBeenCalledWith('dnd-5e-2024');
    });
    await user.click(monstersTab);
    expect(await screen.findByText('Young Red Dragon')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/search monsters/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(loadMonstersSpy).toHaveBeenCalledTimes(1);
    });
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

  it('updates exhaustion from the extracted Dnd5e overview section', () => {
    const onUpdate = vi.fn();
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    render(<Dnd5eSheet document={doc} onUpdate={onUpdate} />);

    fireEvent.change(screen.getByTitle('Exhaustion Level'), {
      target: { value: '2' },
    });

    expect(onUpdate).toHaveBeenCalled();
    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.exhaustionLevel).toBe(2);
  });

  it('toggles saving throw proficiency from the extracted Dnd5e saves tab', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    render(<Dnd5eSheet document={doc} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('tab', { name: /saves/i }));
    await user.click(screen.getByTitle('Toggle Strength save proficiency'));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.savingThrowProficiencies).toContain('str');
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

  it('writes starting-class skill and tool choices from Dnd5eSheet class rows', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([bardClass]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);

    let currentDoc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await waitFor(() => {
      expect(dataLoader.loadClassesForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Bard' })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTitle('Add class'), 'bard');
    await user.click(screen.getByRole('button', { name: 'Add Class' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByTitle('bard skill choice 1'), 'deception');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByTitle('bard tool choice 1'), 'lute');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.classLevels[0]).toMatchObject({
      classId: 'bard',
    });
    expect(currentDoc.system.classLevels[0].skillSelections?.[0]).toBe('deception');
    expect(currentDoc.system.classLevels[0].toolSelections?.[0]).toBe('lute');
    expect(currentDoc.system.skillProficiencies.deception?.source).toEqual(['Bard']);
    expect(currentDoc.system.toolProficiencies).toContain('lute');
  });

  it('writes notes fields from the extracted Dnd5e notes tab', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const doc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    render(<Dnd5eSheet document={doc} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('tab', { name: /notes/i }));
    fireEvent.change(screen.getByLabelText('Appearance'), {
      target: { value: 'Tall and scarred' },
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;
    expect(updatedDoc.system.personality?.appearance).toBe('Tall and scarred');
  });

  it('applies and clears 5e species choices from the sheet', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([halfElfSpecies]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);

    let currentDoc = makeDoc('dnd-5e-2014', createDefaultDnd5eData()) as CharacterDocument<
      ReturnType<typeof createDefaultDnd5eData>
    >;

    const { rerender } = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd5eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await waitFor(() => {
      expect(dataLoader.loadSpeciesForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    });

    await waitFor(
      () => {
        expect(screen.getByRole('option', { name: 'Half-Elf' })).toBeInTheDocument();
      },
      { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
    );

    await user.selectOptions(screen.getByTitle('Species'), 'half-elf');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.click(screen.getByRole('tab', { name: /features/i }));

    await user.selectOptions(screen.getByLabelText('Species ability 1'), 'wis');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByLabelText('Species ability 2'), 'int');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByLabelText('Species language 1'), 'Draconic');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByLabelText('Species skill 1'), 'insight');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    await user.selectOptions(screen.getByLabelText('Species skill 2'), 'stealth');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.speciesId).toBe('half-elf');
    expect(currentDoc.system.speciesAbilitySelections).toEqual(['wis', 'int']);
    expect(currentDoc.system.speciesLanguageSelections).toEqual(['Draconic']);
    expect(currentDoc.system.speciesSkillSelections).toEqual(['insight', 'stealth']);
    expect(currentDoc.system.baseAttributes).toMatchObject({
      str: 10,
      dex: 10,
      con: 10,
      int: 11,
      wis: 11,
      cha: 12,
    });
    expect(currentDoc.system.languageProficiencies).toEqual(['Common', 'Elvish', 'Draconic']);
    expect(currentDoc.system.skillProficiencies.insight?.source).toEqual(['Half-Elf']);
    expect(currentDoc.system.skillProficiencies.stealth?.source).toEqual(['Half-Elf']);

    await user.selectOptions(screen.getByTitle('Species'), '');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.speciesId).toBeUndefined();
    expect(currentDoc.system.speciesAbilitySelections).toEqual([]);
    expect(currentDoc.system.speciesLanguageSelections).toEqual([]);
    expect(currentDoc.system.speciesSkillSelections).toEqual([]);
    expect(currentDoc.system.baseAttributes).toMatchObject({
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    });
    expect(currentDoc.system.languageProficiencies).toEqual([]);
    expect(currentDoc.system.skillProficiencies.insight).toBeUndefined();
    expect(currentDoc.system.skillProficiencies.stealth).toBeUndefined();
    expect(currentDoc.system.features.some((feature) => feature.source === 'Half-Elf')).toBe(false);
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

  it('renders D20LegacySheet (3.5e variant) with the full core prestige catalog in the add-class flow', async () => {
    const user = userEvent.setup();
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    expect(screen.getByText('D&D 3.5e')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /monsters/i })).not.toBeInTheDocument();

    await user.click(screen.getByTitle('Add class'));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Arcane Archer' })).toBeInTheDocument();
    });
    expect(screen.getByRole('option', { name: 'Assassin' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Blackguard' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dragon Disciple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Duelist' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Shadowdancer' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Horizon Walker' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dwarven Defender' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Arcane Trickster' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Archmage' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Eldritch Knight' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hierophant' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Loremaster' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Mystic Theurge' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Thaumaturgist' })).toBeInTheDocument();
  });

  it('deduplicates shared D20 class and species option loading across header and class controls', async () => {
    const loadClassesSpy = vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([
      {
        id: 'wizard',
        name: 'Wizard',
      } as never,
    ]);
    const loadSpeciesSpy = vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([
      {
        id: 'human',
        name: 'Human',
      } as never,
    ]);
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());

    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    const raceSelect = screen.getByTitle('Race');
    fireEvent.focus(raceSelect);
    fireEvent.focus(raceSelect);

    const addClassSelect = screen.getByTitle('Add class');
    fireEvent.focus(addClassSelect);

    await waitFor(() => {
      expect(loadClassesSpy).toHaveBeenCalledWith('dnd-3.5e');
      expect(loadSpeciesSpy).toHaveBeenCalledWith('dnd-3.5e');
    });
    await waitFor(() => {
      expect(loadClassesSpy).toHaveBeenCalledTimes(1);
      expect(loadSpeciesSpy).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole('option', { name: 'Human' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Wizard' })).toBeInTheDocument();
  });

  it(
    'warms and renders the extracted shared D20 browser tabs',
    async () => {
      const user = userEvent.setup();
      const loadFeatsSpy = vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([
        {
          id: 'power-attack',
          name: 'Power Attack',
          description: 'Trade accuracy for damage.',
          benefits: ['Take a penalty on attack rolls to gain bonus damage.'],
          source: 'SRD',
        } as never,
      ]);
      const loadSpellsSpy = vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
        {
          id: 'magic-missile',
          name: 'Magic Missile',
          level: 1,
          school: 'Evocation',
          castingTime: { type: 'action', amount: 1 },
          range: { type: 'medium' },
          duration: { type: 'instant' },
          description: 'Force darts strike unerringly.',
          classes: ['wizard'],
        } as never,
      ]);
      const loadEquipmentSpy = vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([
        {
          id: 'chain-shirt',
          name: 'Chain Shirt',
          type: 'armor',
          rarity: 'common',
          description: 'Light armor made of interlocking metal links.',
          cost: { amount: 100, currency: 'gp' },
          weight: 25,
        } as never,
      ]);
      const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());

      render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

      const browseTab = screen.getByRole('tab', { name: /^browse$/i });
      fireEvent.focus(browseTab);
      fireEvent.pointerEnter(browseTab);
      fireEvent.focus(browseTab);
      await waitFor(
        () => {
          expect(loadFeatsSpy).toHaveBeenCalledWith('dnd-3.5e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(browseTab);
      expect(
        await screen.findByRole(
          'button',
          { name: 'Select Power Attack' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadFeatsSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      const spellsTab = screen.getByRole('tab', { name: /^spells$/i });
      fireEvent.focus(spellsTab);
      fireEvent.pointerEnter(spellsTab);
      await waitFor(
        () => {
          expect(loadSpellsSpy).toHaveBeenCalledWith('dnd-3.5e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(spellsTab);
      expect(
        await screen.findByRole(
          'button',
          { name: 'Learn Magic Missile' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadSpellsSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      const equipmentTab = screen.getByRole('tab', { name: /^equipment$/i });
      fireEvent.focus(equipmentTab);
      fireEvent.pointerEnter(equipmentTab);
      await waitFor(
        () => {
          expect(loadEquipmentSpy).toHaveBeenCalledWith('dnd-3.5e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(equipmentTab);
      expect(
        await screen.findByPlaceholderText(
          /search equipment/i,
          {},
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Chain Shirt', {}, { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS })
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadEquipmentSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it('tracks legacy d20 spellbook and prepared slots through the shared sheet host', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([wizard35]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      {
        id: 'acid-splash',
        name: 'Acid Splash',
        level: 0,
        school: 'Conjuration',
        castingTime: { type: 'action', amount: 1 },
        range: { type: 'close' },
        duration: { type: 'instant' },
        description: 'Orb of acid.',
        classes: ['wizard'],
      } as never,
      {
        id: 'magic-missile',
        name: 'Magic Missile',
        level: 1,
        school: 'Evocation',
        castingTime: { type: 'action', amount: 1 },
        range: { type: 'medium' },
        duration: { type: 'instant' },
        description: 'Force darts strike unerringly.',
        classes: ['wizard'],
      } as never,
    ]);

    let currentDoc = makeDoc('dnd-3.5e', {
      ...createDefaultDnd35eData(),
      classLevels: [
        {
          classId: 'wizard',
          level: 3,
          hitDieRolls: [4, 3, 3],
          bab: 'half',
          fortSave: 'poor',
          refSave: 'poor',
          willSave: 'good',
          skillPointsPerLevel: 2,
        },
      ],
      level: 3,
      hitPoints: { current: 9, max: 9, temp: 0 },
      spellsPerDay: {
        0: { total: 1, used: 0 },
        1: { total: 2, used: 0 },
      },
      spellsKnown: [],
      preparedSpellsByLevel: {},
    }) as CharacterDocument<ReturnType<typeof createDefaultDnd35eData>>;

    const { rerender } = render(<D20LegacySheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDnd35eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<D20LegacySheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /^spells$/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('dnd-3.5e');
    });

    expect(
      screen.getByText('Cleric and druid domain slots are applied manually.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Wizard specialist-school bonus slots are applied manually.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Spontaneous cure/inflict conversion is applied manually.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Dragon Disciple bonus arcane slots are applied manually.')
    ).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Learn Magic Missile' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellsKnown).toEqual(['magic-missile']);

    await user.selectOptions(screen.getByLabelText('Prepared level 1 slot 1'), 'magic-missile');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.preparedSpellsByLevel).toEqual({
      1: ['magic-missile'],
    });

    await user.click(screen.getByRole('button', { name: 'Forget Magic Missile' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellsKnown).toEqual([]);
    expect(currentDoc.system.preparedSpellsByLevel).toEqual({});
  });

  it(
    'warms and renders the extracted PF2e browser tabs',
    async () => {
      const user = userEvent.setup();
      const loadFeatsSpy = vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([
        {
          id: 'reactive-shield',
          name: 'Reactive Shield',
          description: 'Raise your shield as a reaction.',
          benefits: ['Raise a shield when struck.'],
          source: 'Player Core',
        } as never,
      ]);
      const loadArchetypesSpy = vi.spyOn(dataLoader, 'loadArchetypesForSystem').mockResolvedValue([
        {
          id: 'pf2e-ranger-archetype',
          name: 'Ranger Archetype',
          system: 'pf2e',
          source: 'Core Rulebook',
          parentClassId: 'ranger',
          description: 'Tracking and hunting techniques.',
          features: [
            {
              level: 1,
              name: 'Archetype Dedication',
              description: 'Gain the dedication feat.',
            },
          ],
        } as never,
      ]);
      const loadSpellsSpy = vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
        {
          id: 'magic-weapon',
          name: 'Magic Weapon',
          level: 1,
          school: 'Transmutation',
          castingTime: { type: 'action', amount: 2 },
          range: { type: 'touch' },
          duration: { type: 'minute', amount: 1 },
          description: 'A weapon becomes magically potent.',
          classes: ['cleric', 'wizard'],
        } as never,
      ]);
      const loadEquipmentSpy = vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([
        {
          id: 'explorers-clothing',
          name: "Explorer's Clothing",
          type: 'armor',
          rarity: 'common',
          description: 'Travel clothes reinforced for the road.',
          cost: { amount: 1, currency: 'gp' },
          weight: 1,
        } as never,
      ]);
      const doc = makeDoc('pf2e', createDefaultPf2eData());

      render(
        <Pf2eCharacterSheet
          document={doc as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>}
          onUpdate={vi.fn()}
        />
      );

      const browseTab = screen.getByRole('tab', { name: /^browse$/i });
      fireEvent.focus(browseTab);
      fireEvent.pointerEnter(browseTab);
      fireEvent.focus(browseTab);
      await waitFor(
        () => {
          expect(loadFeatsSpy).toHaveBeenCalledWith('pf2e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(browseTab);
      expect(
        await screen.findByRole(
          'button',
          { name: 'Select Reactive Shield' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadFeatsSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      const archetypesTab = screen.getByRole('tab', { name: /archetypes/i });
      fireEvent.focus(archetypesTab);
      fireEvent.pointerEnter(archetypesTab);
      await waitFor(
        () => {
          expect(loadArchetypesSpy).toHaveBeenCalledWith('pf2e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(archetypesTab);
      expect(
        await screen.findByText('Ranger Archetype', {}, { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS })
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadArchetypesSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      const spellsTab = screen.getByRole('tab', { name: /^spells$/i });
      fireEvent.focus(spellsTab);
      fireEvent.pointerEnter(spellsTab);
      await waitFor(
        () => {
          expect(loadSpellsSpy).toHaveBeenCalledWith('pf2e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(spellsTab);
      expect(
        await screen.findByRole(
          'button',
          { name: 'Learn Magic Weapon' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadSpellsSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      const equipmentTab = screen.getByRole('tab', { name: /^equipment$/i });
      fireEvent.focus(equipmentTab);
      fireEvent.pointerEnter(equipmentTab);
      await waitFor(
        () => {
          expect(loadEquipmentSpy).toHaveBeenCalledWith('pf2e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      await user.click(equipmentTab);
      expect(
        await screen.findByPlaceholderText(
          /search equipment/i,
          {},
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Explorer's Clothing", {}, { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS })
      ).toBeInTheDocument();
      await waitFor(
        () => {
          expect(loadEquipmentSpy).toHaveBeenCalledTimes(1);
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it('does not show a spell-progression warning for the non-spellcasting PF1e assassin prestige class', () => {
    const system = createDefaultPf1eData();
    system.classLevels = [
      {
        classId: 'assassin',
        level: 1,
        hitDieRolls: [6],
        bab: 'three-quarter',
        fortSave: 'poor',
        refSave: 'poor',
        willSave: 'poor',
        skillPointsPerLevel: 4,
        favoredClassBonus: 'hp',
      },
    ];
    system.level = 1;
    system.hitPoints.max = 7;
    system.hitPoints.current = 7;

    const doc = makeDoc('pf1e', system);
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    expect(
      screen.queryByText(/spell progression for assassin is not automated yet/i)
    ).not.toBeInTheDocument();
  });

  it('renders automated PF1e prestige spellcasting selectors for mystic theurge rows', async () => {
    const user = userEvent.setup();
    const system = createDefaultPf1eData();
    system.classLevels = [
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
        classId: 'cleric',
        level: 3,
        hitDieRolls: [8, 5, 5],
        bab: 'three-quarter',
        fortSave: 'good',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
      },
      {
        classId: 'mystic-theurge',
        level: 2,
        hitDieRolls: [6, 4],
        bab: 'half',
        fortSave: 'poor',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
        spellcastingSelections: ['wizard', 'cleric'],
      },
    ];
    system.level = 8;
    system.hitPoints.max = 33;
    system.hitPoints.current = 33;

    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([
      wizardPf1,
      clericPf1,
      mysticTheurgePf1,
    ]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadTraitsForSystem').mockResolvedValue([]);

    const doc = makeDoc('pf1e', system);
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    await user.click(screen.getByTitle('Add class'));
    await waitFor(() => {
      expect(dataLoader.loadClassesForSystem).toHaveBeenCalledWith('pf1e');
    });

    await waitFor(() => {
      expect(screen.getByTitle('mystic-theurge Arcane Spellcasting Class')).toHaveValue('wizard');
    });

    expect(screen.getByTitle('mystic-theurge Divine Spellcasting Class')).toHaveValue('cleric');
    expect(
      screen.queryByText(/spell progression for mystic theurge is not automated yet/i)
    ).not.toBeInTheDocument();
  });

  it('renders automated PF1e dragon disciple selectors and restricts them to spontaneous arcane classes', async () => {
    const user = userEvent.setup();
    const system = createDefaultPf1eData();
    system.classLevels = [
      {
        classId: 'wizard',
        level: 5,
        hitDieRolls: [6, 4, 4, 4, 4],
        bab: 'half',
        fortSave: 'poor',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
      },
      {
        classId: 'sorcerer',
        level: 5,
        hitDieRolls: [6, 4, 4, 4, 4],
        bab: 'half',
        fortSave: 'poor',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
      },
      {
        classId: 'dragon-disciple',
        level: 2,
        hitDieRolls: [12, 7],
        bab: 'three-quarter',
        fortSave: 'good',
        refSave: 'poor',
        willSave: 'good',
        skillPointsPerLevel: 2,
        favoredClassBonus: 'hp',
        spellcastingSelections: ['sorcerer'],
      },
    ];
    system.level = 12;
    system.hitPoints.max = 47;
    system.hitPoints.current = 47;

    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([
      wizardPf1,
      sorcererPf1,
      dragonDisciplePf1,
    ]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadTraitsForSystem').mockResolvedValue([]);

    const doc = makeDoc('pf1e', system);
    render(<D20LegacySheet document={doc} onUpdate={vi.fn()} />);

    await user.click(screen.getByTitle('Add class'));
    await waitFor(() => {
      expect(dataLoader.loadClassesForSystem).toHaveBeenCalledWith('pf1e');
    });

    const spellcastingSelect = await screen.findByTitle(
      'dragon-disciple Arcane Spellcasting Class'
    );
    expect(spellcastingSelect).toHaveValue('sorcerer');
    expect(
      within(spellcastingSelect).queryByRole('option', { name: 'Wizard' })
    ).not.toBeInTheDocument();
    expect(
      within(spellcastingSelect).getByRole('option', { name: 'Sorcerer' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/spell progression for dragon disciple is not automated yet/i)
    ).not.toBeInTheDocument();
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

  it('persists PF2e archetype selections through sheet rerenders', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const wizardDedication = {
      id: 'wizard-dedication',
      name: 'Wizard Dedication',
      system: 'pf2e',
      source: 'Core Rulebook',
      parentClassId: 'wizard',
      description: 'A spellcasting archetype.',
      features: [
        {
          level: 2,
          name: 'Dedication Spellcasting',
          description: 'You gain basic wizard spellcasting.',
        },
      ],
    };

    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadPf2eBackgroundsForSystem').mockResolvedValue([]);
    const loadArchetypesSpy = vi
      .spyOn(dataLoader, 'loadArchetypesForSystem')
      .mockResolvedValue([wizardDedication as never]);

    let currentDoc = makeDoc('pf2e', {
      ...createDefaultPf2eData(),
      classId: 'wizard',
      // Archetype features are level-gated at apply time; the fixture's
      // dedication feature is level 2 (RAW: dedications start at level 2).
      level: 2,
    }) as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>;

    const { rerender } = render(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultPf2eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    const archetypesTab = screen.getByRole('tab', { name: /archetypes/i });
    fireEvent.focus(archetypesTab);
    fireEvent.pointerEnter(archetypesTab);

    await waitFor(
      () => {
        expect(loadArchetypesSpy).toHaveBeenCalledWith('pf2e');
      },
      { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
    );

    await user.click(archetypesTab);
    expect(
      await screen.findByText('Wizard Dedication', {}, { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(
      () => {
        expect(onUpdate).toHaveBeenCalled();
      },
      { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
    );
    applyLatestUpdate();

    expect(currentDoc.system.selectedArchetypeIds).toEqual(['wizard-dedication']);
    expect(currentDoc.system.features).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'wizard-dedication:2:dedication-spellcasting',
          source: 'Archetype: Wizard Dedication',
        }),
      ])
    );

    const selectedArchetypesSection = screen.getByText('Selected Archetypes').closest('section');
    expect(selectedArchetypesSection).toBeTruthy();
    expect(within(selectedArchetypesSection!).getByText('Wizard Dedication')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(
      () => {
        expect(onUpdate).toHaveBeenCalled();
      },
      { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
    );
    applyLatestUpdate();

    expect(currentDoc.system.selectedArchetypeIds).toEqual([]);
    expect(
      currentDoc.system.features.some(
        (feature) => feature.id === 'wizard-dedication:2:dedication-spellcasting'
      )
    ).toBe(false);
    expect(screen.getByText('No archetypes selected.')).toBeInTheDocument();
  });

  it(
    'applies PF2e ancestry and background choice automation from the sheet',
    async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      const scholar = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-scholar');

      if (!scholar) {
        throw new Error('Expected Scholar background to exist.');
      }

      vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
      vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([human]);
      vi.spyOn(dataLoader, 'loadPf2eBackgroundsForSystem').mockResolvedValue([scholar]);

      let currentDoc = makeDoc('pf2e', createDefaultPf2eData()) as CharacterDocument<
        ReturnType<typeof createDefaultPf2eData>
      >;

      const { rerender } = render(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);

      const applyLatestUpdate = () => {
        const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
          ReturnType<typeof createDefaultPf2eData>
        >;
        expect(updatedDoc).toBeDefined();
        currentDoc = updatedDoc;
        onUpdate.mockClear();
        rerender(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);
      };

      await waitFor(
        () => {
          expect(dataLoader.loadSpeciesForSystem).toHaveBeenCalledWith('pf2e');
          expect(dataLoader.loadPf2eBackgroundsForSystem).toHaveBeenCalledWith('pf2e');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      await waitFor(
        () => {
          expect(screen.getByRole('option', { name: 'Human' })).toBeInTheDocument();
          expect(screen.getByRole('option', { name: 'Scholar' })).toBeInTheDocument();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      await user.selectOptions(screen.getByTitle('Ancestry'), 'human');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.selectOptions(screen.getByLabelText('Ancestry boost 1'), 'dex');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.selectOptions(screen.getByLabelText('Ancestry boost 2'), 'wis');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.selectOptions(screen.getByTitle('Background'), 'pf2e-bg-scholar');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.selectOptions(screen.getByLabelText('Background restricted boost'), 'int');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.selectOptions(screen.getByLabelText('Background free boost'), 'cha');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      await user.click(screen.getByRole('tab', { name: /skills/i }));
      await user.selectOptions(screen.getByLabelText('Background skill training'), 'religion');
      await waitFor(
        () => {
          expect(onUpdate).toHaveBeenCalled();
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );
      applyLatestUpdate();

      expect(currentDoc.system.ancestryId).toBe('human');
      expect(currentDoc.system.ancestryAbilityBoostSelections).toEqual(['dex', 'wis']);
      expect(currentDoc.system.backgroundId).toBe('pf2e-bg-scholar');
      expect(currentDoc.system.backgroundAbilityBoostSelections).toEqual(['int', 'cha']);
      expect(currentDoc.system.backgroundSkillTrainingSelection).toBe('religion');
      expect(currentDoc.system.backgroundLoreTrainingSelection).toBe('academia-lore');
      expect(currentDoc.system.baseAttributes).toMatchObject({
        dex: 12,
        int: 12,
        wis: 12,
        cha: 12,
      });
      expect(currentDoc.system.skillProficiencies.religion).toEqual({
        tier: 'trained',
        total: 0,
        source: ['Scholar'],
      });
      expect(currentDoc.system.loreProficiencies['academia-lore']).toEqual({
        tier: 'trained',
        total: 0,
        source: ['Scholar'],
      });
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it('tracks PF2e prepared spells by rank through the sheet host', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadPf2eBackgroundsForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      makePf2eSpell({
        id: 'burning-hands-pf2e',
        name: 'Burning Hands',
        level: 1,
        classes: ['wizard'],
      }),
      makePf2eSpell({
        id: 'shield-pf2e',
        name: 'Shield',
        level: 1,
        classes: ['wizard'],
        school: 'abjuration',
      }),
    ]);

    let currentDoc = makeDoc('pf2e', {
      ...createDefaultPf2eData(),
      classId: 'wizard',
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 3 },
        spellSlots: { 1: { max: 2, used: 0 } },
        spellsKnown: [],
        preparedSpellsByRank: {},
        focusPoints: { current: 1, max: 1 },
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>;

    const { rerender } = render(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultPf2eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('pf2e');
    });

    await user.click(screen.getByRole('button', { name: 'Learn Burning Hands' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.spellsKnown).toEqual(['burning-hands-pf2e']);

    await user.selectOptions(screen.getByLabelText('Prepared rank 1 slot 1'), 'burning-hands-pf2e');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.preparedSpellsByRank).toEqual({
      1: ['burning-hands-pf2e'],
    });

    await user.click(screen.getByRole('button', { name: 'Forget Burning Hands' }));
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.spellsKnown).toEqual([]);
    expect(currentDoc.system.spellcasting?.preparedSpellsByRank).toEqual({});
  });

  it('keeps unresolved PF2e prepared selections editable instead of dropping them from slot controls', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadPf2eBackgroundsForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      makePf2eSpell({
        id: 'burning-hands-pf2e',
        name: 'Burning Hands',
        level: 1,
        classes: ['wizard'],
      }),
    ]);

    let currentDoc = makeDoc('pf2e', {
      ...createDefaultPf2eData(),
      classId: 'wizard',
      spellcasting: {
        tradition: 'arcane',
        type: 'prepared',
        proficiency: { tier: 'trained', total: 3 },
        spellSlots: { 1: { max: 1, used: 0 } },
        spellsKnown: ['burning-hands-pf2e', 'mystery-burst-pf2e'],
        preparedSpellsByRank: { 1: ['mystery-burst-pf2e'] },
        focusPoints: { current: 1, max: 1 },
      },
    }) as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>;

    const { rerender } = render(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultPf2eData>
      >;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Pf2eCharacterSheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /spells/i }));

    await waitFor(() => {
      expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('pf2e');
    });

    expect(await screen.findByText('Mystery Burst Pf2e')).toBeInTheDocument();
    expect(screen.getByText('Unresolved')).toBeInTheDocument();

    const preparedSlot = screen.getByLabelText('Prepared rank 1 slot 1') as HTMLSelectElement;
    expect(preparedSlot.value).toBe('mystery-burst-pf2e');
    expect(
      within(preparedSlot).getByRole('option', { name: 'Mystery Burst Pf2e (unresolved)' })
    ).toBeInTheDocument();

    await user.selectOptions(preparedSlot, 'burning-hands-pf2e');
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
    applyLatestUpdate();

    expect(currentDoc.system.spellcasting?.preparedSpellsByRank).toEqual({
      1: ['burning-hands-pf2e'],
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

  it('warms and renders the extracted M&M catalog tabs', async () => {
    const user = userEvent.setup();
    const loadArchetypesSpy = vi
      .spyOn(dataLoader, 'loadMam3eArchetypesForSystem')
      .mockResolvedValue([battlesuitArchetype]);
    const loadComplicationsSpy = vi
      .spyOn(dataLoader, 'loadComplicationsForSystem')
      .mockResolvedValue([accident]);
    const loadPowersSpy = vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([
      {
        id: 'flight',
        name: 'Flight',
        system: 'mam3e',
        source: "Hero's Handbook",
        type: 'movement',
        action: 'free',
        range: 'personal',
        duration: 'sustained',
        baseCost: 2,
        perRank: true,
        rank: 5,
        description: 'You can fly.',
        extras: [],
        flaws: [],
        modifierRanks: {},
        effects: [],
      } as never,
    ]);
    const loadPowerModifiersSpy = vi
      .spyOn(dataLoader, 'loadPowerModifiersForSystem')
      .mockResolvedValue([]);
    const loadAdvantagesSpy = vi.spyOn(dataLoader, 'loadAdvantagesForSystem').mockResolvedValue([
      {
        id: 'assessment',
        name: 'Assessment',
        system: 'mam3e',
        source: "Hero's Handbook",
        type: 'general',
        ranked: false,
        description: 'Size up an opponent.',
        benefit: 'Compare your combat capabilities to a foe.',
      } as never,
    ]);
    const loadEquipmentSpy = vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([
      {
        id: 'utility-belt',
        name: 'Utility Belt',
        type: 'gear',
        rarity: 'common',
        description: 'A belt packed with hero tools.',
        cost: 1,
        weight: 2,
      } as never,
    ]);
    const doc = makeDoc('mam3e', createDefaultMam3eData());

    render(
      <Mam3eCharacterSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultMam3eData>>}
        onUpdate={vi.fn()}
      />
    );

    const archetypesTab = screen.getByRole('tab', { name: /archetypes/i });
    fireEvent.focus(archetypesTab);
    fireEvent.pointerEnter(archetypesTab);
    await waitFor(() => {
      expect(loadArchetypesSpy).toHaveBeenCalledWith('mam3e');
    });
    await user.click(archetypesTab);
    expect(await screen.findByText('Battlesuit')).toBeInTheDocument();
    await waitFor(() => {
      expect(loadArchetypesSpy).toHaveBeenCalledTimes(1);
    });

    const complicationsTab = screen.getByRole('tab', { name: /complications/i });
    fireEvent.focus(complicationsTab);
    fireEvent.pointerEnter(complicationsTab);
    await waitFor(() => {
      expect(loadComplicationsSpy).toHaveBeenCalledWith('mam3e');
    });
    await user.click(complicationsTab);
    expect(await screen.findByText(accident.name)).toBeInTheDocument();
    await waitFor(() => {
      expect(loadComplicationsSpy).toHaveBeenCalledTimes(1);
    });

    const powersDbTab = screen.getByRole('tab', { name: /powers db/i });
    fireEvent.focus(powersDbTab);
    fireEvent.pointerEnter(powersDbTab);
    await waitFor(() => {
      expect(loadPowersSpy).toHaveBeenCalledWith('mam3e');
      expect(loadPowerModifiersSpy).toHaveBeenCalledWith('mam3e');
    });
    await user.click(powersDbTab);
    expect(await screen.findByRole('button', { name: 'Learn Flight' })).toBeInTheDocument();
    expect(await screen.findByLabelText(/search modifiers/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(loadPowersSpy).toHaveBeenCalledTimes(1);
      expect(loadPowerModifiersSpy).toHaveBeenCalledTimes(1);
    });

    const advantagesTab = screen.getByRole('tab', { name: /advantages db/i });
    fireEvent.focus(advantagesTab);
    fireEvent.pointerEnter(advantagesTab);
    await waitFor(() => {
      expect(loadAdvantagesSpy).toHaveBeenCalledWith('mam3e');
    });
    await user.click(advantagesTab);
    expect(await screen.findByText('Assessment')).toBeInTheDocument();
    await waitFor(() => {
      expect(loadAdvantagesSpy).toHaveBeenCalledTimes(1);
    });

    const equipmentTab = screen.getByRole('tab', { name: /^equipment$/i });
    fireEvent.focus(equipmentTab);
    fireEvent.pointerEnter(equipmentTab);
    await waitFor(() => {
      expect(loadEquipmentSpy).toHaveBeenCalledWith('mam3e');
    });
    await user.click(equipmentTab);
    expect(await screen.findByPlaceholderText(/search equipment/i)).toBeInTheDocument();
    expect(await screen.findByText('Utility Belt')).toBeInTheDocument();
    await waitFor(() => {
      expect(loadEquipmentSpy).toHaveBeenCalledTimes(1);
    });
  });

  it(
    'loads Daggerheart SRD selectors and surfaces the selected reference data',
    async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      const loadClassesSpy = vi.spyOn(dataLoader, 'loadDaggerheartClassesForSystem');
      const loadAncestriesSpy = vi.spyOn(dataLoader, 'loadDaggerheartAncestriesForSystem');
      const loadCommunitiesSpy = vi.spyOn(dataLoader, 'loadDaggerheartCommunitiesForSystem');
      const loadDomainsSpy = vi.spyOn(dataLoader, 'loadDaggerheartDomainsForSystem');
      const loadDomainCardsSpy = vi.spyOn(dataLoader, 'loadDaggerheartDomainCardsForSystem');
      const loadWeaponsSpy = vi.spyOn(dataLoader, 'loadDaggerheartWeaponsForSystem');
      const loadArmorSpy = vi.spyOn(dataLoader, 'loadDaggerheartArmorForSystem');
      const loadLootSpy = vi.spyOn(dataLoader, 'loadDaggerheartLootForSystem');
      const loadConsumablesSpy = vi.spyOn(dataLoader, 'loadDaggerheartConsumablesForSystem');
      const doc = makeDoc('daggerheart', createDefaultDaggerheartData(), 'Hopebound');

      const { rerender } = render(
        <DaggerheartSheet
          document={doc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Attributes')).toBeInTheDocument();
      expect(screen.getByText('Experiences')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(loadClassesSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadAncestriesSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadCommunitiesSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadDomainsSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadDomainCardsSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadWeaponsSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadArmorSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadLootSpy).toHaveBeenCalledWith('daggerheart');
          expect(loadConsumablesSpy).toHaveBeenCalledWith('daggerheart');
        },
        { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
      );

      expect(
        await screen.findByRole(
          'option',
          { name: 'Bard' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Equipment Loadout')).toBeInTheDocument();
      expect(screen.getByText('Inventory & Gold')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Human' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Wanderborne' })).toBeInTheDocument();

      await user.selectOptions(screen.getByTitle('Class'), 'Bard');
      let updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.class).toBe('Bard');
      expect(updatedDoc.system.evasion).toBe(10);
      expect(updatedDoc.system.hitPoints).toEqual({ current: 5, max: 5 });
      expect(updatedDoc.system.inventory.map((item) => item.name)).toEqual([
        'A romance novel',
        'A letter never opened',
      ]);
      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.selectOptions(screen.getByTitle('Ancestry'), 'Human');
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );
      expect(updatedDoc.system.heritage).toBe('Human');
      expect(updatedDoc.system.stress.max).toBe(7);

      await user.selectOptions(screen.getByTitle('Community'), 'Wanderborne');
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.class).toBe('Bard');
      expect(updatedDoc.system.heritage).toBe('Human');
      expect(updatedDoc.system.community).toBe('Wanderborne');
      expect(updatedDoc.system.inventory.map((item) => item.name)).toEqual([
        'A romance novel',
        'A letter never opened',
        'Nomadic Pack',
      ]);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.selectOptions(screen.getByTitle('Subclass'), 'Troubadour');

      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.subclass).toBe('Troubadour');

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Domains: Grace / Codex')).toBeInTheDocument();
      expect(screen.getAllByText('Starting Evasion').length).toBeGreaterThan(0);
      expect(screen.getByText('High Stamina.')).toBeInTheDocument();
      expect(screen.getAllByText('Nomadic Pack.').length).toBeGreaterThan(0);
      expect(screen.getByDisplayValue('A romance novel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Nomadic Pack')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Troubadour' })).toBeInTheDocument();
      expect(screen.getByText('Loadout 0/5')).toBeInTheDocument();
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it(
    'keeps unresolved Daggerheart identity selections explicit and editable in the sheet',
    async () => {
      render(
        <DaggerheartSheet
          document={
            makeDoc(
              'daggerheart',
              {
                ...createDefaultDaggerheartData(),
                class: 'Custom Virtuoso',
                subclass: 'Mystery Path',
                heritage: 'Ashfolk',
                community: 'Sky Market',
              },
              'Fallback Hero'
            ) as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={vi.fn()}
        />
      );

      expect(
        await screen.findByRole(
          'option',
          { name: 'Bard' },
          { timeout: HEAVY_SHEET_WAIT_TIMEOUT_MS }
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /manual or unresolved selections remain editable, but srd reference details are not available/i
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Class: Custom Virtuoso')).toBeInTheDocument();
      expect(screen.getByText('Subclass: Mystery Path')).toBeInTheDocument();
      expect(screen.getByText('Ancestry: Ashfolk')).toBeInTheDocument();
      expect(screen.getByText('Community: Sky Market')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Custom Virtuoso (manual)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Mystery Path (manual)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Ashfolk (manual)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sky Market (manual)' })).toBeInTheDocument();
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it(
    'browses Daggerheart SRD libraries and applies entries from the tabs',
    async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      const doc = makeDoc('daggerheart', createDefaultDaggerheartData(), 'Library Hero');

      const { rerender } = render(
        <DaggerheartSheet
          document={doc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
          onUpdate={onUpdate}
        />
      );

      expect(await screen.findByRole('tab', { name: 'Class Library' })).toBeInTheDocument();
      expect(screen.getByText('Reference Library')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Apply Bard' }));
      let updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.class).toBe('Bard');
      expect(updatedDoc.system.inventory.map((item) => item.name)).toEqual([
        'A romance novel',
        'A letter never opened',
      ]);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Ancestry Library' }));
      await user.click(screen.getByRole('button', { name: 'Apply Human' }));
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.heritage).toBe('Human');
      expect(updatedDoc.system.stress.max).toBe(7);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Community Library' }));
      await user.click(screen.getByRole('button', { name: 'Apply Wanderborne' }));
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.community).toBe('Wanderborne');
      expect(updatedDoc.system.inventory.map((item) => item.name)).toEqual([
        'A romance novel',
        'A letter never opened',
        'Nomadic Pack',
      ]);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Primary Library' }));
      const broadswordCard = screen.getByText('Broadsword').closest('article');
      expect(broadswordCard).not.toBeNull();
      await user.click(
        within(broadswordCard as HTMLElement).getByRole('button', { name: 'Equip Primary' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.weapons.primaryId).toBe(
        'daggerheart-weapon-primary-broadsword-tier-1'
      );

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Secondary Library' }));
      const roundShieldCard = screen.getByText('Round Shield').closest('article');
      expect(roundShieldCard).not.toBeNull();
      await user.click(
        within(roundShieldCard as HTMLElement).getByRole('button', { name: 'Equip Secondary' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.weapons.secondaryId).toBe(
        'daggerheart-weapon-secondary-round-shield-tier-1'
      );

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Armor Library' }));
      const chainmailCard = screen.getByText('Chainmail Armor').closest('article');
      expect(chainmailCard).not.toBeNull();
      await user.click(
        within(chainmailCard as HTMLElement).getByRole('button', { name: 'Equip Armor' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.armorId).toBe('daggerheart-armor-chainmail-armor-tier-1');

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Card Library' }));
      const inspirationalWordsCard = screen.getByText('Inspirational Words').closest('article');
      expect(inspirationalWordsCard).not.toBeNull();
      await user.click(
        within(inspirationalWordsCard as HTMLElement).getByRole('button', {
          name: 'Add to Loadout',
        })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.domainCards).toEqual([
        expect.objectContaining({
          id: 'grace-inspirational-words',
          cardId: 'grace-inspirational-words',
          name: 'Inspirational Words',
          domain: 'grace',
          level: 1,
          type: 'ability',
          recallCost: 1,
          location: 'loadout',
        }),
      ]);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Loot Library' }));
      const relicCard = screen.getByText('Stride Relic').closest('article');
      expect(relicCard).not.toBeNull();
      await user.click(
        within(relicCard as HTMLElement).getByRole('button', { name: 'Add to Inventory' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(
        updatedDoc.system.inventory.some(
          (entry) => entry.itemId === 'daggerheart-loot-stride-relic'
        )
      ).toBe(true);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Consumables' }));
      const potionCard = screen.getByText('Minor Health Potion').closest('article');
      expect(potionCard).not.toBeNull();
      await user.click(
        within(potionCard as HTMLElement).getByRole('button', { name: 'Add to Inventory' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );
      const updatedPotionCard = screen.getByText('Minor Health Potion').closest('article');
      expect(updatedPotionCard).not.toBeNull();
      await user.click(
        within(updatedPotionCard as HTMLElement).getByRole('button', { name: 'Add Another' })
      );
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(
        updatedDoc.system.inventory.find(
          (entry) => entry.itemId === 'daggerheart-consumable-minor-health-potion'
        )?.quantity
      ).toBe(2);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      await user.click(screen.getByRole('tab', { name: 'Inventory' }));
      await user.click(screen.getByRole('button', { name: 'Use One' }));
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(
        updatedDoc.system.inventory.find(
          (entry) => entry.itemId === 'daggerheart-consumable-minor-health-potion'
        )?.quantity
      ).toBe(1);

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      fireEvent.change(screen.getByTitle('Handfuls'), { target: { value: '10' } });
      updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
        ReturnType<typeof createDefaultDaggerheartData>
      >;
      expect(updatedDoc.system.currency).toEqual({ handfuls: 0, bags: 1, chests: 0 });

      rerender(
        <DaggerheartSheet
          document={
            updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
          }
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByRole('tab', { name: 'Class Library' })).toBeInTheDocument();
      expect(screen.getAllByText('Nomadic Pack.').length).toBeGreaterThan(0);
      expect(screen.getByDisplayValue('Nomadic Pack')).toBeInTheDocument();
      expect(screen.getByText('Burden 2/2')).toBeInTheDocument();
      expect(screen.getByText('Primary Weapon')).toBeInTheDocument();
      expect(screen.getByText('Secondary Weapon')).toBeInTheDocument();
      expect(screen.getAllByText('Chainmail Armor').length).toBeGreaterThan(0);
      expect(screen.getByText('Loadout 1/5')).toBeInTheDocument();
      expect(screen.getByText('Inspirational Words')).toBeInTheDocument();
      expect(screen.getByText('Stride Relic')).toBeInTheDocument();
      expect(screen.getByText('Gold 0H / 1B / 0C')).toBeInTheDocument();
    },
    HEAVY_SHEET_TEST_TIMEOUT_MS
  );

  it('shows Daggerheart domain-card automation status in the library', async () => {
    const user = userEvent.setup();
    const doc = makeDoc(
      'daggerheart',
      {
        ...createDefaultDaggerheartData(),
        level: 10,
      },
      'Automation Hero'
    );

    render(
      <DaggerheartSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
        onUpdate={vi.fn()}
      />
    );

    await user.click(await screen.findByRole('tab', { name: 'Card Library' }));

    const arcanaTouchedCard = screen.getByText('Arcana-touched').closest('article');
    expect(arcanaTouchedCard).not.toBeNull();
    expect(within(arcanaTouchedCard as HTMLElement).getByText('Auto-applied')).toBeInTheDocument();
    expect(
      within(arcanaTouchedCard as HTMLElement).getByText('Loadout Synergy')
    ).toBeInTheDocument();

    const wallWalkCard = screen.getByText('Wall Walk').closest('article');
    expect(wallWalkCard).not.toBeNull();
    expect(within(wallWalkCard as HTMLElement).getByText('Manual')).toBeInTheDocument();
    expect(within(wallWalkCard as HTMLElement).getByText('Mobility')).toBeInTheDocument();

    const inspirationalWordsCard = screen.getByText('Inspirational Words').closest('article');
    expect(inspirationalWordsCard).not.toBeNull();
    expect(within(inspirationalWordsCard as HTMLElement).getByText('Manual')).toBeInTheDocument();

    const healingHandsCard = screen.getByText('Healing Hands').closest('article');
    expect(healingHandsCard).not.toBeNull();
    expect(within(healingHandsCard as HTMLElement).getByText('Manual')).toBeInTheDocument();
    expect(within(healingHandsCard as HTMLElement).getByText('Support')).toBeInTheDocument();

    const codexTouchedCard = screen.getByText('Codex-touched').closest('article');
    expect(codexTouchedCard).not.toBeNull();
    expect(within(codexTouchedCard as HTMLElement).getByText('Manual')).toBeInTheDocument();
    expect(
      within(codexTouchedCard as HTMLElement).getByText('Loadout Synergy')
    ).toBeInTheDocument();
    expect(within(codexTouchedCard as HTMLElement).getByText('Spellcast')).toBeInTheDocument();

    const notoriousCard = screen.getByText('Notorious').closest('article');
    expect(notoriousCard).not.toBeNull();
    expect(within(notoriousCard as HTMLElement).getByText('Reference')).toBeInTheDocument();

    const shadowhunterCard = screen.getByText('Shadowhunter').closest('article');
    expect(shadowhunterCard).not.toBeNull();
    expect(within(shadowhunterCard as HTMLElement).getByText('Manual')).toBeInTheDocument();
    expect(within(shadowhunterCard as HTMLElement).getByText('Defense')).toBeInTheDocument();
    expect(within(shadowhunterCard as HTMLElement).getByText('Evasion')).toBeInTheDocument();

    const untouchableCard = screen.getByText('Untouchable').closest('article');
    expect(untouchableCard).not.toBeNull();
    expect(within(untouchableCard as HTMLElement).getByText('Auto-applied')).toBeInTheDocument();
    expect(within(untouchableCard as HTMLElement).getByText('Evasion')).toBeInTheDocument();
  }, 30000);

  it('shows Daggerheart spellcast bonuses and level-gates the card library', async () => {
    const user = userEvent.setup();
    const doc = makeDoc(
      'daggerheart',
      {
        ...createDefaultDaggerheartData(),
        level: 1,
        class: 'Bard',
        subclass: 'Troubadour',
        heritage: 'Human',
        community: 'Wanderborne',
        inventory: [
          {
            itemId: 'daggerheart-loot-arcane-prism',
            name: 'Arcane Prism',
            quantity: 1,
            description: '',
          },
        ],
      },
      'Spellcast Hero'
    );

    render(
      <DaggerheartSheet
        document={doc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
        onUpdate={vi.fn()}
      />
    );

    await screen.findByText(/Spellcast Trait:/i);
    expect(screen.getByText(/Spellcast Trait:/i)).toBeInTheDocument();
    expect(screen.getByText(/Spellcast Bonus: \+1/i)).toBeInTheDocument();

    await user.click(await screen.findByRole('tab', { name: 'Card Library' }));

    expect(screen.getByText('Inspirational Words')).toBeInTheDocument();
    expect(screen.queryByText('Notorious')).not.toBeInTheDocument();
  }, 30000);

  it('renders Daggerheart deterministic passive defense formulas from loadout cards', async () => {
    render(
      <DaggerheartSheet
        document={
          makeDoc(
            'daggerheart',
            {
              ...createDefaultDaggerheartData(),
              level: 6,
              class: 'Guardian',
              heritage: 'Human',
              attributes: {
                agility: 3,
                strength: 2,
                finesse: 0,
                instinct: 0,
                presence: 0,
                knowledge: 0,
              },
              domainCards: [
                {
                  id: 'bone-untouchable:1',
                  cardId: 'bone-untouchable',
                  name: 'Untouchable',
                  domain: 'bone',
                  level: 1,
                  type: 'ability',
                  recallCost: 1,
                  location: 'loadout',
                  description: '',
                },
                {
                  id: 'valor-rise-up:1',
                  cardId: 'valor-rise-up',
                  name: 'Rise Up',
                  domain: 'valor',
                  level: 6,
                  type: 'ability',
                  recallCost: 2,
                  location: 'loadout',
                  description: '',
                },
                {
                  id: 'valor-bare-bones:1',
                  cardId: 'valor-bare-bones',
                  name: 'Bare Bones',
                  domain: 'valor',
                  level: 4,
                  type: 'ability',
                  recallCost: 1,
                  location: 'loadout',
                  description: '',
                },
              ],
            },
            'Defense Hero'
          ) as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>
        }
        onUpdate={vi.fn()}
      />
    );

    await screen.findByText('Attributes');

    const expectMetricCard = (label: string, value: string) => {
      const labelNode = screen
        .getAllByText(label)
        .find(
          (node) =>
            node.tagName === 'DIV' &&
            node.parentElement?.className.includes('rounded-lg border bg-card p-3 text-center')
        );
      expect(labelNode).toBeDefined();
      const card = labelNode?.parentElement;
      expect(card).not.toBeNull();
      expect(within(card as HTMLElement).getByText(value)).toBeInTheDocument();
    };

    expectMetricCard('Evasion', '10');
    expectMetricCard('Armor Score', '5');
    expectMetricCard('Major Threshold', '13');
    expectMetricCard('Severe Threshold', '34');
  });

  it('moves Daggerheart domain cards between loadout and vault', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    let updatedDoc = makeDoc(
      'daggerheart',
      {
        ...createDefaultDaggerheartData(),
        level: 5,
        domainCards: [
          {
            id: 'owned-inspirational-words',
            cardId: 'grace-inspirational-words',
            name: 'Inspirational Words',
            domain: 'grace',
            level: 1,
            type: 'ability',
            recallCost: 1,
            location: 'loadout',
            description: '',
          },
        ],
      },
      'Vault Hero'
    ) as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>;

    const { rerender } = render(
      <DaggerheartSheet
        document={updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
        onUpdate={onUpdate}
      />
    );

    await screen.findByText('Domain Cards');
    await user.click(screen.getByRole('button', { name: 'Move to Vault' }));

    updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDaggerheartData>
    >;
    expect(updatedDoc.system.domainCards[0]?.location).toBe('vault');

    rerender(
      <DaggerheartSheet
        document={updatedDoc as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Vault' }));
    await user.click(screen.getByRole('button', { name: 'Move to Loadout' }));

    updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as CharacterDocument<
      ReturnType<typeof createDefaultDaggerheartData>
    >;
    expect(updatedDoc.system.domainCards[0]?.location).toBe('loadout');
  });
});
