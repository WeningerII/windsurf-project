import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../systems';
import { Dnd5eSheet } from '../systems/dnd5e/components/Dnd5eSheet';
import { Dnd5e2024Sheet } from '../systems/dnd5e-2024/components/Dnd5e2024Sheet';
import { Dnd5eSheetBase } from '../systems/dnd5e/shared/Dnd5eSheetBase';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import { createDefaultDnd5e2024Data } from '../systems/dnd5e-2024/data-model';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { SpellSlots } from '../types/core/character';
import * as dataLoader from '../utils/dataLoader';

type Dnd5eData = ReturnType<typeof createDefaultDnd5eData>;
type Dnd5eDocument = CharacterDocument<Dnd5eData>;
type Dnd5e2024Data = ReturnType<typeof createDefaultDnd5e2024Data>;
type Dnd5e2024Document = CharacterDocument<Dnd5e2024Data>;

function makeDnd5eDocument(systemOverrides: Partial<Dnd5eData> = {}): Dnd5eDocument {
  return {
    id: 'dnd5e-host-doc',
    name: 'Host Interaction Hero',
    systemId: 'dnd-5e-2014',
    system: {
      ...createDefaultDnd5eData(),
      ...systemOverrides,
    },
    createdAt: new Date('2026-06-23T00:00:00.000Z'),
    updatedAt: new Date('2026-06-23T00:00:00.000Z'),
  };
}

function make5eSpellSlots(overrides: Partial<SpellSlots> = {}): SpellSlots {
  return {
    1: { max: 0, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
    ...overrides,
  };
}

// The shared host loads its catalogs (classes/species/backgrounds/equipment/
// feats/feature-options) through dataLoader; tests stub them empty so the
// controller settles without network access. Specific tests override as needed.
function stubShared5eLoaders() {
  vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadFeatureOptionsForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadFeatsForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadMonstersForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadSpellsForSystem').mockResolvedValue([]);
}

function renderEditableDnd5eSheet(initialDoc: Dnd5eDocument) {
  let currentDoc = initialDoc;
  const onUpdate = vi.fn((nextDoc: CharacterDocument<SystemDataModel>) => {
    currentDoc = nextDoc as Dnd5eDocument;
  });
  const view = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

  const applyLatestUpdate = () => {
    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as Dnd5eDocument | undefined;
    expect(updatedDoc).toBeDefined();
    currentDoc = updatedDoc!;
    onUpdate.mockClear();
    view.rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    return currentDoc;
  };

  return {
    onUpdate,
    applyLatestUpdate,
    get currentDoc() {
      return currentDoc;
    },
  };
}

describe('shared 5e host interaction handlers', () => {
  beforeAll(() => {
    if (!registerAllSystems) {
      throw new Error('registerAllSystems missing');
    }
    registerAllSystems();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('applies a short rest through the shared host overview controls', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        features: [
          {
            id: 'second-wind',
            name: 'Second Wind',
            source: 'fighter',
            description: 'Fighter recovery.',
            uses: { current: 0, max: 1, recoveryType: 'short-rest' },
          },
        ],
      })
    );

    await user.click(screen.getByTitle('Short Rest'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    const updatedDoc = sheet.applyLatestUpdate();

    expect(updatedDoc.system.features[0].uses?.current).toBe(1);
  });

  it('applies a long rest through the shared host overview controls', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        hitPoints: { current: 1, max: 12, temp: 3 },
        hitDice: [{ die: 'd10', total: 4, remaining: 1 }],
        deathSaves: { successes: 1, failures: 2 },
      })
    );

    await user.click(screen.getByTitle('Long Rest'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    const updatedDoc = sheet.applyLatestUpdate();

    expect(updatedDoc.system.hitPoints).toEqual({ current: 12, max: 12, temp: 0 });
    expect(updatedDoc.system.hitDice[0].remaining).toBe(3);
    expect(updatedDoc.system.deathSaves).toEqual({ successes: 0, failures: 0 });
  });

  it('spends and recovers a hit die through the shared host hit-dice tracker', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        hitDice: [{ die: 'd8', total: 3, remaining: 2 }],
      })
    );

    // Two pips are filled (remaining 2). Clicking the first spends a die.
    await user.click(screen.getAllByTitle('Spend d8')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.hitDice[0].remaining).toBe(1);

    // After re-render there is one empty pip; clicking it recovers a die.
    await user.click(screen.getAllByTitle('Recover d8')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.hitDice[0].remaining).toBe(2);
  });

  it('uses and recovers a standard spell slot through the shared host spell-slot tracker', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        spellcasting: {
          classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 3 }],
          spellsKnown: [],
          spellsPrepared: [],
          spellSlots: make5eSpellSlots({ 1: { max: 2, used: 0 } }),
        },
      })
    );

    await user.click(screen.getAllByTitle('Use level 1 slot')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.spellcasting?.spellSlots[1].used).toBe(1);

    await user.click(screen.getAllByTitle('Recover level 1 slot')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.spellcasting?.spellSlots[1].used).toBe(0);
  });

  it('uses and recovers warlock pact slots through the shared host spell-slot tracker', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        spellcasting: {
          classes: [{ classId: 'warlock', ability: 'cha', spellcastingLevel: 3 }],
          spellsKnown: [],
          spellsPrepared: [],
          spellSlots: make5eSpellSlots(),
          pactMagic: { level: 2, max: 2, used: 0 },
        },
      })
    );

    await user.click(screen.getAllByTitle('Use pact slot')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.spellcasting?.pactMagic?.used).toBe(1);

    await user.click(screen.getAllByTitle('Recover pact slot')[0]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.spellcasting?.pactMagic?.used).toBe(0);
  });

  it('recovers all spell slots and pact magic through the shared host', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        spellcasting: {
          classes: [{ classId: 'warlock', ability: 'cha', spellcastingLevel: 5 }],
          spellsKnown: [],
          spellsPrepared: [],
          spellSlots: make5eSpellSlots({
            1: { max: 4, used: 3 },
            2: { max: 2, used: 1 },
          }),
          pactMagic: { level: 3, max: 2, used: 2 },
        },
      })
    );

    await user.click(screen.getByRole('button', { name: 'Recover All' }));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    const updatedDoc = sheet.applyLatestUpdate();

    expect(updatedDoc.system.spellcasting?.spellSlots[1].used).toBe(0);
    expect(updatedDoc.system.spellcasting?.spellSlots[2].used).toBe(0);
    expect(updatedDoc.system.spellcasting?.pactMagic?.used).toBe(0);
  });

  it('uses and recovers a feature with limited uses through the shared host features tab', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        features: [
          {
            id: 'channel-divinity',
            name: 'Channel Divinity',
            source: 'cleric',
            description: 'Channel divine power.',
            uses: { current: 1, max: 1, recoveryType: 'short-rest' },
          },
        ],
      })
    );

    await user.click(screen.getByRole('tab', { name: /features/i }));

    // One filled pip (current 1) -> clicking it spends the use.
    await user.click(await screen.findByTitle('Use'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.features[0].uses?.current).toBe(0);

    await user.click(await screen.findByTitle('Recover'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.features[0].uses?.current).toBe(1);
  });

  it('applies damage and healing through the shared host damage/heal control', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        hitPoints: { current: 10, max: 10, temp: 0 },
      })
    );

    const amountInput = screen.getByLabelText('Damage or heal amount');
    fireEvent.change(amountInput, { target: { value: '4' } });
    await user.click(screen.getByTitle('Apply damage'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.hitPoints.current).toBe(6);

    const healInput = screen.getByLabelText('Damage or heal amount');
    fireEvent.change(healInput, { target: { value: '3' } });
    await user.click(screen.getByTitle('Apply healing'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.hitPoints.current).toBe(9);
  });

  it('edits a base ability score through the shared host abilities tab', async () => {
    stubShared5eLoaders();
    // The abilities tab is the default tab, so its manual score grid is visible
    // on first render without a tab click.
    const sheet = renderEditableDnd5eSheet(makeDnd5eDocument());

    fireEvent.change(screen.getByTitle('Strength Score'), { target: { value: '15' } });
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    const updatedDoc = sheet.applyLatestUpdate();

    expect(updatedDoc.system.baseAttributes.str).toBe(15);
    expect(updatedDoc.system.baseAttributes.dex).toBe(10);
  });

  it('marks death saves through the shared host while downed', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        hitPoints: { current: 0, max: 10, temp: 0 },
      })
    );

    await user.click(screen.getByTitle('Mark death save success'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.deathSaves.successes).toBe(1);

    await user.click(screen.getByTitle('Mark death save failure'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.deathSaves.failures).toBe(1);
  });

  it('cycles skill proficiency none -> proficient -> expertise -> none through the shared host', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(makeDnd5eDocument());

    await user.click(screen.getByRole('tab', { name: /skills/i }));

    const toggle = screen.getByTitle('Toggle Acrobatics proficiency');
    await user.click(toggle);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.skillProficiencies.acrobatics).toEqual({
      level: 'proficient',
      source: ['manual'],
    });

    await user.click(screen.getByTitle('Toggle Acrobatics proficiency'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.skillProficiencies.acrobatics).toEqual({
      level: 'expertise',
      source: ['manual'],
    });

    await user.click(screen.getByTitle('Toggle Acrobatics proficiency'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.skillProficiencies.acrobatics).toBeUndefined();
  });

  it('keeps a non-manual skill grant at proficient when the manual claim is cleared', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        skillProficiencies: {
          stealth: { level: 'proficient', source: ['Rogue'] },
        },
      })
    );

    await user.click(screen.getByRole('tab', { name: /skills/i }));

    // none(record present via template) -> proficient cycles to expertise first
    await user.click(screen.getByTitle('Toggle Stealth proficiency'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.skillProficiencies.stealth).toEqual({
      level: 'expertise',
      source: ['Rogue', 'manual'],
    });

    // expertise -> none: template owner (Rogue) keeps the proficient record.
    await user.click(screen.getByTitle('Toggle Stealth proficiency'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.skillProficiencies.stealth).toEqual({
      level: 'proficient',
      source: ['Rogue'],
    });
  });

  it('adds and removes a condition through the shared host features tab', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(makeDnd5eDocument());

    await user.click(screen.getByRole('tab', { name: /features/i }));

    // Scope to the Conditions section: a separate "Add Class" button exists
    // in the always-visible classes section above the tabs.
    const conditionsSection = (await screen.findByText('Conditions')).closest('section');
    expect(conditionsSection).toBeTruthy();
    const conditions = within(conditionsSection!);

    await user.click(conditions.getByRole('button', { name: /add/i }));
    await user.click(conditions.getByRole('button', { name: 'Blinded' }));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.conditions).toEqual([{ id: 'blinded', name: 'Blinded' }]);

    await user.click(screen.getByTitle('Remove condition'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.conditions).toEqual([]);
  });

  it('toggles a feature-gated combat rider through the shared host features tab', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        features: [
          {
            id: 'rage',
            name: 'Rage',
            source: 'barbarian',
            description: 'Enter a rage.',
          },
        ],
      })
    );

    await user.click(screen.getByRole('tab', { name: /features/i }));

    const rageToggle = await screen.findByRole('button', { name: 'Rage' });
    expect(rageToggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(rageToggle);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.activeToggles).toEqual(['rage']);

    await user.click(screen.getByRole('button', { name: 'Rage' }));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.activeToggles).toEqual([]);
  });

  it('toggles weapon masteries through the shared host 2024 masteries tab', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    let currentDoc: Dnd5e2024Document = {
      id: 'dnd5e-2024-host-doc',
      name: 'Mastery Hero',
      systemId: 'dnd-5e-2024',
      system: createDefaultDnd5e2024Data(),
      createdAt: new Date('2026-06-23T00:00:00.000Z'),
      updatedAt: new Date('2026-06-23T00:00:00.000Z'),
    };
    const onUpdate = vi.fn((nextDoc: CharacterDocument<SystemDataModel>) => {
      currentDoc = nextDoc as Dnd5e2024Document;
    });
    const { rerender } = render(<Dnd5e2024Sheet document={currentDoc} onUpdate={onUpdate} />);

    const applyLatestUpdate = () => {
      const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as Dnd5e2024Document;
      expect(updatedDoc).toBeDefined();
      currentDoc = updatedDoc;
      onUpdate.mockClear();
      rerender(<Dnd5e2024Sheet document={currentDoc} onUpdate={onUpdate} />);
    };

    await user.click(screen.getByRole('tab', { name: /masteries/i }));

    await user.click(screen.getByRole('button', { name: 'Cleave' }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    applyLatestUpdate();
    expect(currentDoc.system.weaponMasteries).toEqual(['cleave']);

    await user.click(screen.getByRole('button', { name: 'Cleave' }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    applyLatestUpdate();
    expect(currentDoc.system.weaponMasteries).toEqual([]);
  });

  it('renders the shared resource-load error banner when catalog loading fails', async () => {
    // The resources hook loads classes/species/backgrounds together via
    // Promise.all and catches the rejection (the path under test). We reject the
    // *backgrounds* loader specifically: the contribution-ledger builder only
    // awaits the classes loader, so rejecting backgrounds keeps the failure
    // confined to the resources hook (no unrelated unhandled rejection), while
    // still surfacing the same shared error banner.
    vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
    vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockImplementation(() =>
      Promise.reject(new Error('boom'))
    );
    vi.spyOn(dataLoader, 'loadFeatureOptionsForSystem').mockResolvedValue([]);

    render(<Dnd5eSheet document={makeDnd5eDocument()} onUpdate={vi.fn()} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Failed to load classes/species/backgrounds for dnd-5e-2014.'
    );
  });

  it('ignores overview controls when the shared host is read-only (no onUpdate)', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    render(
      <Dnd5eSheetBase
        document={makeDnd5eDocument({
          hitDice: [{ die: 'd8', total: 2, remaining: 2 }],
          spellcasting: {
            classes: [{ classId: 'wizard', ability: 'int', spellcastingLevel: 1 }],
            spellsKnown: [],
            spellsPrepared: [],
            spellSlots: make5eSpellSlots({ 1: { max: 2, used: 0 } }),
          },
        })}
      />
    );

    // Rest controls are disabled without an onUpdate handler.
    expect(screen.getByTitle('Short Rest')).toBeDisabled();
    expect(screen.getByTitle('Long Rest')).toBeDisabled();

    // Hit-dice and spell-slot pips render but are inert (no callbacks wired).
    const slotPips = screen.getAllByTitle('Use level 1 slot');
    expect(slotPips[0]).toBeDisabled();
    await user.click(slotPips[0]);
  });
});
