import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import type { RollResult } from '../../../registry/types';
import type { Spell } from '../../../types/magic/spells';
import type { Archetype } from '../../../types/character-options/archetypes';
import {
  createDefaultPf2eData,
  type Pf2eDataModel,
  type Pf2eProficiency,
  type Pf2eProficiencyTier,
  type Pf2eSpellcasting,
} from '../../../systems/pf2e/data-model';
import { Pf2eProficiencyBadge } from '../../../systems/pf2e/components/Pf2eProficiencyBadge';
import { Pf2eOverview } from '../../../systems/pf2e/components/Pf2eOverview';
import { Pf2eHeader } from '../../../systems/pf2e/components/Pf2eHeader';
import { Pf2eAbilitiesTab } from '../../../systems/pf2e/components/Pf2eAbilitiesTab';
import { Pf2eSavesTab } from '../../../systems/pf2e/components/Pf2eSavesTab';
import { Pf2eSkillsTab } from '../../../systems/pf2e/components/Pf2eSkillsTab';
import { Pf2eNotesTab } from '../../../systems/pf2e/components/Pf2eNotesTab';
import { Pf2eInventoryTab } from '../../../systems/pf2e/components/Pf2eInventoryTab';
import { Pf2eFeatsConditionsTab } from '../../../systems/pf2e/components/Pf2eFeatsConditionsTab';
import { Pf2eArchetypesTab } from '../../../systems/pf2e/components/Pf2eArchetypesTab';
import { Pf2eSpellsTab } from '../../../systems/pf2e/components/Pf2eSpellsTab';
import { Pf2eFeatBrowserTab } from '../../../systems/pf2e/components/Pf2eFeatBrowserTab';
import { Pf2eEquipmentBrowserTab } from '../../../systems/pf2e/components/Pf2eEquipmentBrowserTab';
import { Pf2eSpellBrowserPanel } from '../../../systems/pf2e/components/Pf2eSpellBrowserPanel';

// The browser tabs lazy-load heavy catalog components. Stub them with light
// renderers so the "loaded" branch resolves synchronously and the tests stay
// fast while still exercising the prop-mapping in each tab wrapper.
vi.mock('../../../components/FeatBrowser', () => ({
  FeatBrowser: ({ feats }: { feats: Array<{ id: string; name: string }> }) => (
    <div data-testid="feat-browser">
      {feats.map((feat) => (
        <span key={feat.id}>{feat.name}</span>
      ))}
    </div>
  ),
}));

vi.mock('../../../components/EquipmentBrowser', () => ({
  EquipmentBrowser: ({ equipment }: { equipment: Array<{ id: string; name: string }> }) => (
    <div data-testid="equipment-browser">
      {equipment.map((item) => (
        <span key={item.id}>{item.name}</span>
      ))}
    </div>
  ),
}));

vi.mock('../../../components/SpellBrowser', () => ({
  SpellBrowser: ({
    spells,
    onSelectSpell,
  }: {
    spells: Array<{ id: string; name: string }>;
    onSelectSpell?: (spell: { id: string; name: string }) => void;
  }) => (
    <div data-testid="spell-browser">
      {spells.map((spell) => (
        <button key={spell.id} type="button" onClick={() => onSelectSpell?.(spell)}>
          Learn {spell.name}
        </button>
      ))}
    </div>
  ),
}));

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-doc',
    name: 'Pf2e Hero',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-06-23T00:00:00.000Z'),
    updatedAt: new Date('2026-06-23T00:00:00.000Z'),
  };
}

function prof(tier: Pf2eProficiencyTier, total = 0): Pf2eProficiency {
  return { tier, total };
}

const rollResult: RollResult = {
  total: 12,
  formula: '1d20+2',
  terms: [10],
  isCritical: false,
  isFumble: false,
};

function makeSpell(overrides: Partial<Spell> & Pick<Spell, 'id' | 'name' | 'level'>): Spell {
  return {
    system: 'pf2e',
    source: 'Core Rulebook',
    school: 'evocation',
    classes: ['wizard'],
    castingTime: { type: 'action', amount: 2 },
    range: { type: 'ranged', feet: 30 },
    components: { verbal: true, somatic: true, material: false },
    duration: { type: 'instant' },
    concentration: false,
    ritual: false,
    description: `${overrides.name} description`,
    ...overrides,
  };
}

function makeSpellcasting(overrides: Partial<Pf2eSpellcasting> = {}): Pf2eSpellcasting {
  return {
    tradition: 'arcane',
    type: 'prepared',
    proficiency: prof('trained', 3),
    spellSlots: {},
    spellsKnown: [],
    focusSpells: [],
    focusPoints: { current: 0, max: 0 },
    ...overrides,
  };
}

function makeArchetype(overrides: Partial<Archetype> & Pick<Archetype, 'id' | 'name'>): Archetype {
  return {
    system: 'pf2e',
    source: 'Core Rulebook',
    parentClassId: 'wizard',
    description: `${overrides.name} description`,
    features: [{ level: 2, name: `${overrides.name} Dedication`, description: 'Dedication feat.' }],
    ...overrides,
  } as Archetype;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Pf2eProficiencyBadge', () => {
  const tiers: Array<[Pf2eProficiencyTier, string]> = [
    ['untrained', 'U'],
    ['trained', 'T'],
    ['expert', 'E'],
    ['master', 'M'],
    ['legendary', 'L'],
  ];

  it.each(tiers)('renders the %s tier label and title', (tier, label) => {
    render(<Pf2eProficiencyBadge proficiency={prof(tier)} canUpdate={false} />);
    const badge = screen.getByRole('button', { name: label });
    expect(badge).toHaveAttribute('title', `${tier}. Click to cycle.`);
    expect(badge).toBeDisabled();
  });

  it('invokes onClick only when canUpdate is true', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <Pf2eProficiencyBadge proficiency={prof('trained')} canUpdate onClick={onClick} />
    );

    await user.click(screen.getByRole('button', { name: 'T' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Pf2eProficiencyBadge proficiency={prof('trained')} canUpdate={false} onClick={onClick} />
    );
    await user.click(screen.getByRole('button', { name: 'T' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Pf2eOverview', () => {
  it('edits current and max HP through both inputs', () => {
    const onHitPointsChange = vi.fn();
    render(
      <Pf2eOverview
        document={makeDoc()}
        canUpdate
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={onHitPointsChange}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    fireEvent.change(screen.getByTitle('Current HP'), { target: { value: '7' } });
    expect(onHitPointsChange).toHaveBeenLastCalledWith(7, 10);

    fireEvent.change(screen.getByTitle(/Max HP/), { target: { value: '15' } });
    expect(onHitPointsChange).toHaveBeenLastCalledWith(10, 15);
  });

  it('applies damage and healing through the DamageHealControl, clamping to bounds', async () => {
    const user = userEvent.setup();
    const onHitPointsChange = vi.fn();
    render(
      <Pf2eOverview
        document={makeDoc({ hitPoints: { current: 5, max: 10, temp: 0 } })}
        canUpdate
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={onHitPointsChange}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    const amount = screen.getByLabelText('Damage or heal amount');
    await user.type(amount, '3');
    await user.click(screen.getByTitle('Apply damage'));
    expect(onHitPointsChange).toHaveBeenLastCalledWith(2, 10);

    await user.type(screen.getByLabelText('Damage or heal amount'), '99');
    await user.click(screen.getByTitle('Apply healing'));
    // current(5) + 99 clamps to max(10)
    expect(onHitPointsChange).toHaveBeenLastCalledWith(10, 10);
  });

  it('shows manual max-bonus and temp HP annotations when present', () => {
    render(
      <Pf2eOverview
        document={makeDoc({ hitPoints: { current: 8, max: 12, temp: 4, maxBonus: 2 } })}
        canUpdate={false}
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    expect(screen.getByText('+2 manual max')).toBeInTheDocument();
    expect(screen.getByText('+4 temp')).toBeInTheDocument();
    // canUpdate=false hides the damage/heal control.
    expect(screen.queryByLabelText('Damage or heal amount')).not.toBeInTheDocument();
  });

  it('renders the class DC score and rolls perception', async () => {
    const user = userEvent.setup();
    const onPerceptionRoll = vi.fn().mockResolvedValue(rollResult);
    render(
      <Pf2eOverview
        document={makeDoc({
          baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 10 },
          perceptionProficiency: prof('expert', 6),
          classDcProficiency: prof('trained', 3),
        })}
        canUpdate
        classDcScore={18}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={onPerceptionRoll}
      />
    );

    // Class DC = 10 + proficiency.total(3) + abilityMod(18)=4 => 17
    expect(screen.getByText('17')).toBeInTheDocument();

    await user.click(screen.getByTitle('Roll Perception'));
    await waitFor(() => {
      expect(onPerceptionRoll).toHaveBeenCalled();
    });
  });

  it('renders a dash for the class DC when no key ability is set', () => {
    render(
      <Pf2eOverview
        document={makeDoc({ classDcProficiency: undefined })}
        canUpdate={false}
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('toggles a raised shield and renders the raised label with its bonus', async () => {
    const user = userEvent.setup();
    const onToggleShieldRaised = vi.fn();
    const doc = makeDoc({
      equipment: [
        {
          itemId: 'steel-shield',
          name: 'Steel Shield',
          bulk: 1,
          equipped: true,
          shieldBonus: 2,
          raised: false,
        },
      ],
    });

    const { rerender } = render(
      <Pf2eOverview
        document={doc}
        canUpdate
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
        onToggleShieldRaised={onToggleShieldRaised}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Raise Shield' }));
    expect(onToggleShieldRaised).toHaveBeenCalledTimes(1);

    rerender(
      <Pf2eOverview
        document={makeDoc({
          equipment: [
            {
              itemId: 'steel-shield',
              name: 'Steel Shield',
              bulk: 1,
              equipped: true,
              shieldBonus: 2,
              raised: true,
            },
          ],
        })}
        canUpdate
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
        onToggleShieldRaised={onToggleShieldRaised}
      />
    );
    expect(screen.getByRole('button', { name: 'Shield raised (+2)' })).toBeInTheDocument();
  });

  it('renders an armor-class contribution breakdown when ledger entries target armorClass', async () => {
    const user = userEvent.setup();
    render(
      <Pf2eOverview
        document={makeDoc({ armorClass: 18 })}
        canUpdate={false}
        classDcScore={null}
        contributionEntries={[
          {
            id: 'ac-base',
            systemId: 'pf2e',
            target: 'armorClass',
            label: 'Base',
            operation: 'set',
            value: 10,
            category: 'defense',
            source: { kind: 'system', id: 'base', label: 'Base' },
          },
          {
            id: 'ac-dex',
            systemId: 'pf2e',
            target: 'armorClass',
            label: 'Dexterity',
            operation: 'add',
            value: 4,
            category: 'ability',
            source: { kind: 'feature', id: 'dex', label: 'Dexterity' },
          },
        ]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    expect(screen.getByText('18')).toBeInTheDocument();
    // The breakdown is a collapsed disclosure showing the label and folded total.
    const disclosure = screen.getByRole('button', { name: /Armor Class/i });
    await user.click(disclosure);
    // Expanding reveals the labelled contribution list with each source row.
    expect(screen.getByLabelText('Armor Class contributions')).toBeInTheDocument();
    expect(screen.getByText('Dexterity')).toBeInTheDocument();
  });

  it('wires the rest controls when handlers are provided', async () => {
    const user = userEvent.setup();
    const onShortRest = vi.fn();
    const onLongRest = vi.fn();
    render(
      <Pf2eOverview
        document={makeDoc()}
        canUpdate
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
        onShortRest={onShortRest}
        onLongRest={onLongRest}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Short Rest' }));
    await user.click(screen.getByRole('button', { name: 'Long Rest' }));
    expect(onShortRest).toHaveBeenCalledTimes(1);
    expect(onLongRest).toHaveBeenCalledTimes(1);
  });
});

describe('Pf2eHeader', () => {
  function renderHeader(
    overrides: Partial<React.ComponentProps<typeof Pf2eHeader>> = {},
    docOverrides: Partial<Pf2eDataModel> = {}
  ) {
    const props: React.ComponentProps<typeof Pf2eHeader> = {
      document: makeDoc(docOverrides),
      canUpdate: true,
      classes: [{ id: 'wizard', name: 'Wizard' } as never],
      ancestries: [{ id: 'human', name: 'Human' } as never],
      heritages: [{ id: 'versatile', name: 'Versatile Heritage' } as never],
      backgrounds: [{ id: 'scholar', name: 'Scholar' } as never],
      backgroundsLoaded: true,
      onNameChange: vi.fn(),
      onLevelChange: vi.fn(),
      onClassChange: vi.fn(),
      onAncestryChange: vi.fn(),
      onHeritageChange: vi.fn(),
      onBackgroundChange: vi.fn(),
      onExperiencePointsChange: vi.fn(),
      onHeroPointsChange: vi.fn(),
      onLoadOptions: vi.fn(),
      onLoadBackgrounds: vi.fn(),
      ...overrides,
    };
    render(<Pf2eHeader {...props} />);
    return props;
  }

  it('edits the name, level and experience and reports raw values', () => {
    const onNameChange = vi.fn();
    const onLevelChange = vi.fn();
    const onExperiencePointsChange = vi.fn();
    renderHeader({ onNameChange, onLevelChange, onExperiencePointsChange });

    fireEvent.change(screen.getByTitle('Character name'), { target: { value: 'Ezren' } });
    expect(onNameChange).toHaveBeenLastCalledWith('Ezren');

    fireEvent.change(screen.getByTitle('Character level'), { target: { value: '5' } });
    expect(onLevelChange).toHaveBeenLastCalledWith('5');

    fireEvent.change(screen.getByTitle('Experience points'), { target: { value: '120' } });
    expect(onExperiencePointsChange).toHaveBeenLastCalledWith('120');
  });

  it('loads options on class/ancestry focus and reports selections', async () => {
    const user = userEvent.setup();
    const onLoadOptions = vi.fn();
    const onClassChange = vi.fn();
    const onAncestryChange = vi.fn();
    const onHeritageChange = vi.fn();
    renderHeader({ onLoadOptions, onClassChange, onAncestryChange, onHeritageChange });

    await user.selectOptions(screen.getByTitle('Class'), 'wizard');
    expect(onLoadOptions).toHaveBeenCalled();
    expect(onClassChange).toHaveBeenLastCalledWith('wizard');

    await user.selectOptions(screen.getByTitle('Ancestry'), 'human');
    expect(onAncestryChange).toHaveBeenLastCalledWith('human');

    await user.selectOptions(screen.getByTitle('Heritage'), 'versatile');
    expect(onHeritageChange).toHaveBeenLastCalledWith('versatile');
  });

  it('loads and reports background selection on focus', async () => {
    const user = userEvent.setup();
    const onLoadBackgrounds = vi.fn();
    const onBackgroundChange = vi.fn();
    renderHeader({ onLoadBackgrounds, onBackgroundChange });

    await user.selectOptions(screen.getByTitle('Background'), 'scholar');
    expect(onLoadBackgrounds).toHaveBeenCalled();
    expect(onBackgroundChange).toHaveBeenLastCalledWith('scholar');
  });

  it('disables the heritage select and shows the placeholder when no heritages exist', () => {
    renderHeader({ heritages: [] });
    const heritageSelect = screen.getByTitle('Heritage');
    expect(heritageSelect).toBeDisabled();
    expect(within(heritageSelect).getByRole('option', { name: 'Heritage...' })).toBeInTheDocument();
  });

  it('shows the loading placeholder while backgrounds are still loading', () => {
    renderHeader({ backgroundsLoaded: false, backgrounds: [] });
    expect(screen.getByRole('option', { name: 'Loading backgrounds...' })).toBeInTheDocument();
  });

  it('grants a hero point on an empty pip and spends one on a filled pip', async () => {
    const user = userEvent.setup();
    const onHeroPointsChange = vi.fn();
    // heroPoints=1 → first pip filled (index 0), rest empty.
    renderHeader({ onHeroPointsChange }, { heroPoints: 1 });

    const pips = screen.getAllByTitle('1/3 Hero Points');
    // Clicking the filled pip (index 0) spends down to that index.
    await user.click(pips[0]);
    expect(onHeroPointsChange).toHaveBeenLastCalledWith(0);

    // Clicking an empty pip (index 1) grants up to index+1.
    await user.click(pips[1]);
    expect(onHeroPointsChange).toHaveBeenLastCalledWith(2);
  });
});

describe('Pf2eAbilitiesTab', () => {
  function baseProps(
    overrides: Partial<React.ComponentProps<typeof Pf2eAbilitiesTab>> = {}
  ): React.ComponentProps<typeof Pf2eAbilitiesTab> {
    return {
      document: makeDoc(),
      canUpdate: true,
      ancestryChoiceSlots: [],
      backgroundRestrictedBoost: '',
      backgroundFreeBoost: '',
      backgroundFreeBoostOptions: [],
      onBaseAttributeChange: vi.fn(),
      onAncestryBoostChange: vi.fn(),
      onBackgroundAbilityBoostChange: vi.fn(),
      ...overrides,
    };
  }

  it('edits a base ability score', () => {
    const onBaseAttributeChange = vi.fn();
    render(<Pf2eAbilitiesTab {...baseProps({ onBaseAttributeChange })} />);

    fireEvent.change(screen.getByTitle('Strength score'), { target: { value: '16' } });
    expect(onBaseAttributeChange).toHaveBeenLastCalledWith('str', 16);
  });

  it('shows the empty build-choice hint when no ancestry or background is selected', () => {
    render(<Pf2eAbilitiesTab {...baseProps()} />);
    expect(
      screen.getByText(/Choose an ancestry or background to apply build-time boosts/i)
    ).toBeInTheDocument();
  });

  it('renders ancestry boost slots and reports a chosen ability, formatting compound labels', async () => {
    const user = userEvent.setup();
    const onAncestryBoostChange = vi.fn();
    render(
      <Pf2eAbilitiesTab
        {...baseProps({
          selectedAncestryName: 'Human',
          ancestryChoiceSlots: [
            { slotIndex: 0, label: 'Free boost', value: '', options: ['str', 'free-choice'] },
          ],
          onAncestryBoostChange,
        })}
      />
    );

    expect(screen.getByText('Human ability boosts')).toBeInTheDocument();
    const select = screen.getByLabelText('Ancestry boost 1');
    // The non-ability option goes through the title-case fallback formatter.
    expect(within(select).getByRole('option', { name: 'Free Choice' })).toBeInTheDocument();
    expect(within(select).getByRole('option', { name: 'Strength' })).toBeInTheDocument();

    await user.selectOptions(select, 'str');
    expect(onAncestryBoostChange).toHaveBeenLastCalledWith(0, 'str');
  });

  it('renders background restricted and free boosts and reports both slots', async () => {
    const user = userEvent.setup();
    const onBackgroundAbilityBoostChange = vi.fn();
    render(
      <Pf2eAbilitiesTab
        {...baseProps({
          selectedBackground: {
            name: 'Scholar',
            abilityBoosts: { label: 'Choose Int or Wis', options: ['int', 'wis'] },
          },
          backgroundRestrictedBoost: 'int',
          backgroundFreeBoost: 'cha',
          backgroundFreeBoostOptions: ['cha', 'str'],
          onBackgroundAbilityBoostChange,
        })}
      />
    );

    expect(screen.getByText('Scholar ability boosts')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Background restricted boost'), 'wis');
    expect(onBackgroundAbilityBoostChange).toHaveBeenLastCalledWith(0, 'wis');

    await user.selectOptions(screen.getByLabelText('Background free boost'), 'str');
    expect(onBackgroundAbilityBoostChange).toHaveBeenLastCalledWith(1, 'str');
  });
});

describe('Pf2eSavesTab', () => {
  it('renders each save with its total and cycles a tier', async () => {
    const user = userEvent.setup();
    const onCycleSaveTier = vi.fn();
    render(
      <Pf2eSavesTab
        document={makeDoc({
          baseAttributes: { str: 10, dex: 14, con: 16, int: 10, wis: 12, cha: 10 },
          saveProficiencies: {
            fortitude: prof('expert', 6),
            reflex: prof('trained', 3),
            will: prof('trained', 3),
          },
        })}
        canUpdate
        onCycleSaveTier={onCycleSaveTier}
        onRollCheck={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    expect(screen.getByText('fortitude')).toBeInTheDocument();
    // fortitude = abilityMod(con 16)=3 + total(6) => +9
    expect(screen.getByText('+9')).toBeInTheDocument();

    // The fortitude badge is the expert "E" pip.
    await user.click(screen.getByRole('button', { name: 'E' }));
    expect(onCycleSaveTier).toHaveBeenLastCalledWith('fortitude');
  });

  it('rolls a save check with the save id', async () => {
    const user = userEvent.setup();
    const onRollCheck = vi.fn().mockResolvedValue(rollResult);
    render(
      <Pf2eSavesTab
        document={makeDoc()}
        canUpdate
        onCycleSaveTier={vi.fn()}
        onRollCheck={onRollCheck}
      />
    );

    await user.click(screen.getByTitle('Roll reflex Save'));
    await waitFor(() => {
      expect(onRollCheck).toHaveBeenCalledWith('reflex');
    });
  });
});

describe('Pf2eSkillsTab', () => {
  function baseProps(
    overrides: Partial<React.ComponentProps<typeof Pf2eSkillsTab>> = {}
  ): React.ComponentProps<typeof Pf2eSkillsTab> {
    return {
      document: makeDoc(),
      canUpdate: true,
      loreIds: [],
      onCycleSkillTier: vi.fn(),
      onCycleLoreTier: vi.fn(),
      onBackgroundSkillTrainingChange: vi.fn(),
      onBackgroundLoreTrainingChange: vi.fn(),
      onRollCheck: vi.fn().mockResolvedValue(rollResult),
      ...overrides,
    };
  }

  it('cycles a skill tier and rolls a skill check', async () => {
    const user = userEvent.setup();
    const onCycleSkillTier = vi.fn();
    const onRollCheck = vi.fn().mockResolvedValue(rollResult);
    render(
      <Pf2eSkillsTab
        {...baseProps({
          document: makeDoc({
            skillProficiencies: { acrobatics: prof('trained', 3) },
          }),
          onCycleSkillTier,
          onRollCheck,
        })}
      />
    );

    expect(screen.getByText('acrobatics')).toBeInTheDocument();
    // The acrobatics badge is the only trained "T" pip among untrained skills.
    await user.click(screen.getByRole('button', { name: 'T' }));
    expect(onCycleSkillTier).toHaveBeenLastCalledWith('acrobatics');

    await user.click(screen.getByTitle('Roll acrobatics Check'));
    await waitFor(() => {
      expect(onRollCheck).toHaveBeenCalledWith('acrobatics');
    });
  });

  it('renders background skill and lore training selectors and reports changes', async () => {
    const user = userEvent.setup();
    const onBackgroundSkillTrainingChange = vi.fn();
    const onBackgroundLoreTrainingChange = vi.fn();
    render(
      <Pf2eSkillsTab
        {...baseProps({
          backgroundSkillChoice: { label: 'Trained skill', options: ['arcana', 'society'] },
          backgroundLoreChoice: { label: 'Lore', options: ['academia-lore'] },
          onBackgroundSkillTrainingChange,
          onBackgroundLoreTrainingChange,
        })}
      />
    );

    expect(screen.getByText('Background Training')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Background skill training'), 'arcana');
    expect(onBackgroundSkillTrainingChange).toHaveBeenLastCalledWith('arcana');

    const loreSelect = screen.getByLabelText('Background lore training');
    expect(within(loreSelect).getByRole('option', { name: 'Academia Lore' })).toBeInTheDocument();
    await user.selectOptions(loreSelect, 'academia-lore');
    expect(onBackgroundLoreTrainingChange).toHaveBeenLastCalledWith('academia-lore');
  });

  it('renders the Lore section and cycles a lore tier', async () => {
    const user = userEvent.setup();
    const onCycleLoreTier = vi.fn();
    render(
      <Pf2eSkillsTab
        {...baseProps({
          loreIds: ['warfare-lore'],
          document: makeDoc({
            baseAttributes: { str: 10, dex: 10, con: 10, int: 14, wis: 10, cha: 10 },
            loreProficiencies: { 'warfare-lore': prof('expert', 6) },
          }),
          onCycleLoreTier,
        })}
      />
    );

    expect(screen.getByText('Lore')).toBeInTheDocument();
    expect(screen.getByText('warfare lore')).toBeInTheDocument();
    // lore total = abilityMod(int 14)=2 + total(6) => +8
    expect(screen.getByText('+8')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'E' }));
    expect(onCycleLoreTier).toHaveBeenLastCalledWith('warfare-lore');
  });
});

describe('Pf2eNotesTab', () => {
  it('writes description, backstory and notes fields', () => {
    const onDescriptionChange = vi.fn();
    const onBackstoryChange = vi.fn();
    const onNotesChange = vi.fn();
    render(
      <Pf2eNotesTab
        document={makeDoc()}
        canUpdate
        onDescriptionChange={onDescriptionChange}
        onBackstoryChange={onBackstoryChange}
        onNotesChange={onNotesChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Physical description...'), {
      target: { value: 'Weathered traveler' },
    });
    expect(onDescriptionChange).toHaveBeenLastCalledWith('Weathered traveler');

    fireEvent.change(screen.getByPlaceholderText('Character backstory...'), {
      target: { value: 'Raised in the academy' },
    });
    expect(onBackstoryChange).toHaveBeenLastCalledWith('Raised in the academy');

    fireEvent.change(screen.getByPlaceholderText('Additional notes...'), {
      target: { value: 'Owes a debt' },
    });
    expect(onNotesChange).toHaveBeenLastCalledWith('Owes a debt');
  });

  it('reflects existing personality values and disables editing when read-only', () => {
    render(
      <Pf2eNotesTab
        document={makeDoc({
          personality: { description: 'Stoic', backstory: 'Orphan' },
          notes: 'Secret keeper',
        })}
        canUpdate={false}
        onDescriptionChange={vi.fn()}
        onBackstoryChange={vi.fn()}
        onNotesChange={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('Stoic')).toBeDisabled();
    expect(screen.getByDisplayValue('Orphan')).toBeDisabled();
    expect(screen.getByDisplayValue('Secret keeper')).toBeDisabled();
  });
});

describe('Pf2eInventoryTab', () => {
  it('reports an unencumbered bulk total without warning badges', () => {
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          inventory: [{ itemId: 'rope', name: 'Rope', quantity: 1, bulk: 1 }],
        })}
        canUpdate
      />
    );

    expect(screen.getByText('Total Bulk')).toBeInTheDocument();
    expect(screen.queryByText('Encumbered')).not.toBeInTheDocument();
    expect(screen.queryByText('Overloaded')).not.toBeInTheDocument();
  });

  it('shows the Encumbered badge when bulk exceeds the encumbered threshold', () => {
    // str mod +2 => encumbered over 7, max 12. Equip 9 bulk to be encumbered.
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          equipment: [{ itemId: 'heavy-armor', name: 'Full Plate', bulk: 9, equipped: true }],
        })}
        canUpdate
      />
    );

    expect(screen.getByText('Encumbered')).toBeInTheDocument();
    expect(screen.queryByText('Overloaded')).not.toBeInTheDocument();
  });

  it('shows the Overloaded badge when bulk exceeds the maximum', () => {
    // str mod +2 => max 12. Carry 15 bulk to be overloaded.
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          inventory: [{ itemId: 'anvil', name: 'Anvil', quantity: 3, bulk: 5 }],
        })}
        canUpdate
      />
    );

    expect(screen.getByText('Overloaded')).toBeInTheDocument();
  });

  it('edits currency through the editor', () => {
    const onCurrencyChange = vi.fn();
    render(
      <Pf2eInventoryTab
        document={makeDoc({ currency: { copper: 0, silver: 0, gold: 5, platinum: 0 } })}
        canUpdate
        onCurrencyChange={onCurrencyChange}
      />
    );

    fireEvent.change(screen.getByTitle('GP'), { target: { value: '12' } });
    expect(onCurrencyChange).toHaveBeenLastCalledWith(expect.objectContaining({ gold: 12 }));
  });

  it('renders existing inventory rows and removes an item', async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          inventory: [{ itemId: 'torch', name: 'Torch', quantity: 2, bulk: 0.1 }],
        })}
        canUpdate
        onRemoveItem={onRemoveItem}
      />
    );

    expect(screen.getByText('Torch')).toBeInTheDocument();
    await user.click(screen.getByTitle('Remove item'));
    expect(onRemoveItem).toHaveBeenCalledWith('torch');
  });

  it('adds an item through the inventory manager form', async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();
    render(<Pf2eInventoryTab document={makeDoc()} canUpdate onAddItem={onAddItem} />);

    expect(screen.getByText('No items in inventory. Add one to get started!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add item/i }));
    await user.type(screen.getByPlaceholderText('e.g., Longsword'), 'Dagger');
    // Two "Add Item" buttons exist once the form is open (header + form submit).
    const addButtons = screen.getAllByRole('button', { name: 'Add Item' });
    await user.click(addButtons[addButtons.length - 1]);

    expect(onAddItem).toHaveBeenCalledWith(expect.objectContaining({ name: 'Dagger' }));
  });

  it('disables editing affordances when read-only', async () => {
    const user = userEvent.setup();
    const onCurrencyChange = vi.fn();
    const onRemoveItem = vi.fn();
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          currency: { copper: 0, silver: 0, gold: 5, platinum: 0 },
          inventory: [{ itemId: 'torch', name: 'Torch', quantity: 1, bulk: 0.1 }],
        })}
        canUpdate={false}
        onCurrencyChange={onCurrencyChange}
        onAddItem={vi.fn()}
        onRemoveItem={onRemoveItem}
      />
    );

    // canUpdate=false routes undefined handlers into the child controls, so the
    // currency editor disables its inputs and the remove control is inert.
    expect(screen.getByTitle('GP')).toBeDisabled();
    await user.click(screen.getByTitle('Remove item'));
    expect(onRemoveItem).not.toHaveBeenCalled();
  });
});

describe('Pf2eFeatsConditionsTab', () => {
  it('shows empty states for features and feats', () => {
    render(<Pf2eFeatsConditionsTab document={makeDoc()} canUpdate />);

    expect(screen.getByText('No ancestry, class, or archetype features yet.')).toBeInTheDocument();
    expect(screen.getByText('No feats selected.')).toBeInTheDocument();
    // No combat toggles are available without a gating feature.
    expect(screen.queryByText('Combat Toggles')).not.toBeInTheDocument();
  });

  it('renders features and feats and removes a feat', async () => {
    const user = userEvent.setup();
    const onRemoveFeat = vi.fn();
    render(
      <Pf2eFeatsConditionsTab
        document={makeDoc({
          features: [
            {
              id: 'darkvision',
              name: 'Darkvision',
              source: 'Ancestry',
              description: 'See in the dark.',
            },
          ],
          feats: [
            {
              id: 'power-attack',
              name: 'Power Attack',
              description: 'A mighty blow.',
              level: 1,
              type: 'class',
              source: 'Fighter',
            },
          ],
        })}
        canUpdate
        onRemoveFeat={onRemoveFeat}
      />
    );

    expect(screen.getByText('Darkvision')).toBeInTheDocument();
    expect(screen.getByText('See in the dark.')).toBeInTheDocument();
    expect(screen.getByText('Power Attack')).toBeInTheDocument();
    expect(screen.getByText('Lv 1')).toBeInTheDocument();

    await user.click(screen.getByTitle('Remove feat'));
    expect(onRemoveFeat).toHaveBeenCalledWith('power-attack');
  });

  it('surfaces feature-gated combat toggles and reports activation', async () => {
    const user = userEvent.setup();
    const onActiveTogglesChange = vi.fn();
    render(
      <Pf2eFeatsConditionsTab
        document={makeDoc({
          features: [{ id: 'rage', name: 'Rage', source: 'Barbarian', description: '' }],
          activeToggles: [],
        })}
        canUpdate
        onActiveTogglesChange={onActiveTogglesChange}
      />
    );

    const rageToggle = screen.getByRole('button', { name: 'Rage (+2 melee damage)' });
    await user.click(rageToggle);
    expect(onActiveTogglesChange).toHaveBeenLastCalledWith(['rage']);
  });

  it('adds a condition through the condition picker', async () => {
    const user = userEvent.setup();
    const onConditionsChange = vi.fn();
    render(
      <Pf2eFeatsConditionsTab
        document={makeDoc({ conditions: [] })}
        canUpdate
        onConditionsChange={onConditionsChange}
      />
    );

    expect(screen.getByText('No active conditions.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^add$/i }));
    await user.click(screen.getByRole('button', { name: 'Prone' }));
    expect(onConditionsChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: 'prone', name: 'Prone' }),
    ]);
  });

  it('hides the feat remove control when read-only', () => {
    render(
      <Pf2eFeatsConditionsTab
        document={makeDoc({
          feats: [
            {
              id: 'toughness',
              name: 'Toughness',
              description: 'Extra HP.',
              level: 1,
              type: 'general',
              source: 'General',
            },
          ],
        })}
        canUpdate={false}
        onRemoveFeat={vi.fn()}
      />
    );

    expect(screen.getByText('Toughness')).toBeInTheDocument();
    expect(screen.queryByTitle('Remove feat')).not.toBeInTheDocument();
  });
});

describe('Pf2eArchetypesTab', () => {
  it('renders the load prompt before archetypes load', () => {
    render(
      <Pf2eArchetypesTab
        archetypesLoaded={false}
        selectedArchetypeIds={[]}
        selectedArchetypes={[]}
        orderedArchetypes={[]}
      />
    );
    expect(screen.getByText('Click to load archetype options...')).toBeInTheDocument();
  });

  it('shows the empty selected state and a matching-class badge for available archetypes', () => {
    const archetype = makeArchetype({ id: 'pirate', name: 'Pirate', parentClassId: 'wizard' });
    render(
      <Pf2eArchetypesTab
        archetypesLoaded
        classId="wizard"
        selectedArchetypeIds={[]}
        selectedArchetypes={[]}
        orderedArchetypes={[archetype]}
      />
    );

    expect(screen.getByText('No archetypes selected.')).toBeInTheDocument();
    expect(screen.getByText('Matches class')).toBeInTheDocument();
    expect(screen.getByText('Level 2: Pirate Dedication')).toBeInTheDocument();
  });

  it('renders read-only archetype lists without toggle affordances when no handler is given', () => {
    const scout = makeArchetype({ id: 'scout', name: 'Scout', parentClassId: 'ranger' });
    render(
      <Pf2eArchetypesTab
        archetypesLoaded
        classId="wizard"
        selectedArchetypeIds={['scout']}
        selectedArchetypes={[scout]}
        orderedArchetypes={[scout]}
      />
    );

    // Without onToggleArchetype, neither the remove icon nor the Add/Remove
    // action button is rendered, but the archetype still appears in both lists.
    expect(screen.getAllByText('Scout').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByTitle('Remove archetype')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('toggles archetypes through both the selected remove icon and the available action', async () => {
    const user = userEvent.setup();
    const onToggleArchetype = vi.fn();
    const scout = makeArchetype({ id: 'scout', name: 'Scout', parentClassId: 'ranger' });

    render(
      <Pf2eArchetypesTab
        archetypesLoaded
        classId="ranger"
        selectedArchetypeIds={['scout']}
        selectedArchetypes={[scout]}
        orderedArchetypes={[scout]}
        onToggleArchetype={onToggleArchetype}
      />
    );

    // Selected list exposes a "Remove archetype" icon button.
    await user.click(screen.getByTitle('Remove archetype'));
    expect(onToggleArchetype).toHaveBeenLastCalledWith(scout);

    // The available list shows a "Remove" text button for the already-selected scout.
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onToggleArchetype).toHaveBeenCalledTimes(2);
    expect(onToggleArchetype).toHaveBeenLastCalledWith(scout);
  });
});

describe('Pf2eFeatBrowserTab', () => {
  it('renders the load prompt before feats load', () => {
    render(<Pf2eFeatBrowserTab systemId="pf2e" featsLoaded={false} featDefs={[]} />);
    expect(screen.getByText('Click to load feat database...')).toBeInTheDocument();
  });

  it('renders the feat browser with mapped feats once loaded', async () => {
    render(
      <Pf2eFeatBrowserTab
        systemId="pf2e"
        featsLoaded
        featDefs={[
          {
            id: 'reactive-shield',
            name: 'Reactive Shield',
            system: 'pf2e',
            source: 'Player Core',
            description: 'Raise your shield as a reaction.',
            prerequisites: [{ type: 'level', value: 1 }],
            benefits: ['Raise a shield when struck.'],
          } as never,
        ]}
      />
    );

    expect(await screen.findByText('Reactive Shield')).toBeInTheDocument();
  });
});

describe('Pf2eEquipmentBrowserTab', () => {
  it('renders the load prompt before equipment loads', () => {
    render(<Pf2eEquipmentBrowserTab equipmentLoaded={false} equipmentItems={[]} />);
    expect(screen.getByText('Click to load equipment...')).toBeInTheDocument();
  });

  it('renders the equipment browser with mapped items once loaded', async () => {
    render(
      <Pf2eEquipmentBrowserTab
        equipmentLoaded
        equipmentItems={[
          {
            id: 'explorers-clothing',
            name: "Explorer's Clothing",
            type: 'armor',
            rarity: 'common',
            cost: { amount: 1, currency: 'gp' },
            weight: 1,
            description: 'Travel clothes.',
          } as never,
        ]}
      />
    );

    expect(await screen.findByText("Explorer's Clothing")).toBeInTheDocument();
  });
});

describe('Pf2eSpellsTab', () => {
  function baseProps(
    overrides: Partial<React.ComponentProps<typeof Pf2eSpellsTab>> = {}
  ): React.ComponentProps<typeof Pf2eSpellsTab> {
    return {
      spellsLoaded: true,
      spells: [],
      onSpellcastingChange: vi.fn(),
      onSpellProficiencyTierCycle: vi.fn(),
      ...overrides,
    };
  }

  it('shows the load prompt when spells are not loaded and no spellcasting exists', () => {
    render(<Pf2eSpellsTab {...baseProps({ spellsLoaded: false })} />);
    expect(screen.getByText('Click to load spells...')).toBeInTheDocument();
  });

  it('renders the spellcasting summary with attack/DC for a prepared caster', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 18,
          spellcasting: makeSpellcasting({
            tradition: 'arcane',
            type: 'prepared',
            proficiency: prof('trained', 3),
          }),
        })}
      />
    );

    expect(screen.getByText('Spellcasting')).toBeInTheDocument();
    expect(screen.getByText('arcane')).toBeInTheDocument();
    // attack = abilityMod(18)=4 + 3 => +7; DC = 10 + 7 => 17
    expect(screen.getByText('+7')).toBeInTheDocument();
    expect(screen.getByText('DC 17')).toBeInTheDocument();
    expect(
      screen.getByText('No spells tracked yet. Use the browser below to add spells.')
    ).toBeInTheDocument();
    expect(screen.getByText('No focus spells tracked.')).toBeInTheDocument();
  });

  it('renders dashes for spell attack/DC when no key ability is set', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: null,
          spellcasting: makeSpellcasting(),
        })}
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('DC —')).toBeInTheDocument();
  });

  it('spends and recovers focus points', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({ focusPoints: { current: 1, max: 2 } }),
        })}
      />
    );

    // First pip is filled → clicking spends it.
    await user.click(screen.getByTitle('Spend focus point'));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ focusPoints: { current: 0, max: 2 } })
    );

    // Second pip is empty → clicking recovers a point.
    await user.click(screen.getByTitle('Recover focus point'));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ focusPoints: { current: 2, max: 2 } })
    );
  });

  it('uses and recovers spell slots', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'spontaneous',
            spellSlots: { 1: { max: 2, used: 1 } },
          }),
        })}
      />
    );

    // remaining = 1; the first pip (index 0 < remaining) uses a slot.
    await user.click(screen.getByTitle('Use level 1 slot'));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellSlots: { 1: { max: 2, used: 2 } } })
    );

    // The second pip (index 1 >= remaining) recovers a slot.
    await user.click(screen.getByTitle('Recover level 1 slot'));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellSlots: { 1: { max: 2, used: 0 } } })
    );
  });

  it('learns a spell from the browser and forgets a tracked spell', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'spontaneous',
            spellsKnown: ['burning-hands'],
          }),
        })}
      />
    );

    expect(screen.getByText('Burning Hands')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Forget Burning Hands' }));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellsKnown: [] })
    );

    await user.click(await screen.findByRole('button', { name: 'Learn Burning Hands' }));
    // Already known → no-op; the previous forget call remains the latest.
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellsKnown: [] })
    );
  });

  it('renders always-prepared and unresolved tracked spells', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 16,
          spells: [],
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: ['ghost-spell'],
            alwaysPreparedSpellIds: ['always-spell'],
          }),
        })}
      />
    );

    expect(screen.getByText('Always Prepared')).toBeInTheDocument();
    // Both ids are unresolved (no matching loader spell) → fall back to the raw id.
    expect(screen.getAllByText('Unresolved').length).toBeGreaterThanOrEqual(1);
  });

  it('assigns a prepared spell to a rank slot for prepared casters', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: ['burning-hands'],
            spellSlots: { 1: { max: 1, used: 0 } },
            preparedSpellsByRank: {},
          }),
        })}
      />
    );

    expect(screen.getByText('Prepared Slots')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Prepared rank 1 slot 1'), 'burning-hands');
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ preparedSpellsByRank: { 1: ['burning-hands'] } })
    );
  });

  it('shows the spontaneous repertoire note instead of prepared slots', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 16,
          spellcasting: makeSpellcasting({ type: 'spontaneous' }),
        })}
      />
    );

    expect(screen.getByText(/This caster uses a spell repertoire/i)).toBeInTheDocument();
  });

  it('renders focus spells, including unresolved ones', () => {
    const lightSpell = makeSpell({ id: 'light', name: 'Light', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spells: [lightSpell],
          spellAbilityScore: 16,
          spellcasting: makeSpellcasting({
            focusSpells: ['light', 'missing-focus'],
            focusPoints: { current: 1, max: 1 },
          }),
        })}
      />
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Unresolved')).toBeInTheDocument();
  });

  it('keeps still-known prepared spells when forgetting another spell in the same rank', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    const magicMissile = makeSpell({ id: 'magic-missile', name: 'Magic Missile', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands, magicMissile],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: ['burning-hands', 'magic-missile'],
            spellSlots: { 1: { max: 2, used: 0 } },
            preparedSpellsByRank: { 1: ['burning-hands', 'magic-missile'] },
          }),
        })}
      />
    );

    // Forgetting burning-hands prunes only it from rank 1 while keeping the
    // still-known magic-missile preparation (prunePreparedRanks keep-branch).
    await user.click(screen.getByRole('button', { name: 'Forget Burning Hands' }));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        spellsKnown: ['magic-missile'],
        preparedSpellsByRank: { 1: ['magic-missile'] },
      })
    );
  });

  it('forgets a spell on a prepared caster that has no prepared ranks yet', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: ['burning-hands'],
            spellSlots: { 1: { max: 1, used: 0 } },
            // No preparedSpellsByRank → prunePreparedRanks short-circuits to {}.
            preparedSpellsByRank: undefined,
          }),
        })}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Forget Burning Hands' }));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellsKnown: [], preparedSpellsByRank: {} })
    );
  });

  it('clears a prepared rank when its last slot is emptied', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: ['burning-hands'],
            spellSlots: { 1: { max: 1, used: 0 } },
            preparedSpellsByRank: { 1: ['burning-hands'] },
          }),
        })}
      />
    );

    // Selecting "Open slot" (empty value) empties the only slot, so the trailing
    // pop-loop runs and the now-empty rank is deleted from preparedSpellsByRank.
    await user.selectOptions(screen.getByLabelText('Prepared rank 1 slot 1'), '');
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ preparedSpellsByRank: {} })
    );
  });

  it('renders an unresolved fallback option for a prepared spell no longer in the catalog', () => {
    const burningHands = makeSpell({ id: 'burning-hands', name: 'Burning Hands', level: 1 });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [burningHands],
          spellAbilityScore: 16,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            // 'phantom' is prepared but not in spellsKnown/catalog options.
            spellsKnown: ['burning-hands'],
            spellSlots: { 1: { max: 1, used: 0 } },
            preparedSpellsByRank: { 1: ['phantom'] },
          }),
        })}
      />
    );

    const slot = screen.getByLabelText('Prepared rank 1 slot 1');
    // Unresolved ids are humanized for display, e.g. 'phantom' → 'Phantom'.
    expect(within(slot).getByRole('option', { name: 'Phantom (unresolved)' })).toBeInTheDocument();
  });

  it('shows the no-available-spells hint for a rank with slots but nothing trackable', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          classId: 'wizard',
          spells: [],
          spellAbilityScore: 16,
          spellcasting: makeSpellcasting({
            type: 'prepared',
            spellsKnown: [],
            spellSlots: { 2: { max: 1, used: 0 } },
            preparedSpellsByRank: {},
          }),
        })}
      />
    );

    expect(
      screen.getByText('No tracked rank 2 spells are currently available to prepare.')
    ).toBeInTheDocument();
  });

  it('disables focus and slot pips and the forget control when read-only', () => {
    render(
      <Pf2eSpellsTab
        spellsLoaded
        spells={[makeSpell({ id: 'shock', name: 'Shock', level: 1, classes: ['wizard'] })]}
        spellAbilityScore={16}
        // No onSpellcastingChange → all mutation affordances render disabled.
        spellcasting={makeSpellcasting({
          type: 'spontaneous',
          spellsKnown: ['shock'],
          spellSlots: { 1: { max: 1, used: 0 } },
          focusPoints: { current: 0, max: 1 },
        })}
      />
    );

    expect(screen.getByTitle('Recover focus point')).toBeDisabled();
    expect(screen.getByTitle('Use level 1 slot')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Forget Shock' })).toBeDisabled();
  });

  it('shows the innate spellcasting note for innate casters', () => {
    render(
      <Pf2eSpellsTab
        {...baseProps({
          spellAbilityScore: 16,
          spellcasting: makeSpellcasting({ type: 'innate' }),
        })}
      />
    );

    expect(
      screen.getByText(/Innate spellcasting does not use daily prepared slots/i)
    ).toBeInTheDocument();
  });

  it('browses the full unfiltered spell list when no class id constrains it', async () => {
    const user = userEvent.setup();
    const onSpellcastingChange = vi.fn();
    const offClassSpell = makeSpell({
      id: 'heal',
      name: 'Heal',
      level: 1,
      classes: ['cleric'],
    });
    render(
      <Pf2eSpellsTab
        {...baseProps({
          // No classId → browseableSpells is the full list, not class-filtered.
          spells: [offClassSpell],
          spellAbilityScore: 16,
          onSpellcastingChange,
          spellcasting: makeSpellcasting({ type: 'spontaneous', spellsKnown: [] }),
        })}
      />
    );

    await user.click(await screen.findByRole('button', { name: 'Learn Heal' }));
    expect(onSpellcastingChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ spellsKnown: ['heal'] })
    );
  });
});

describe('component fallback branches', () => {
  it('defaults missing ability scores to 10 in the abilities tab', () => {
    render(
      <Pf2eAbilitiesTab
        document={makeDoc({
          // Sparse baseAttributes: str is absent, so the card falls back to 10.
          baseAttributes: { dex: 12 } as Record<string, number>,
          languages: [],
        })}
        canUpdate
        ancestryChoiceSlots={[]}
        backgroundRestrictedBoost=""
        backgroundFreeBoost=""
        backgroundFreeBoostOptions={[]}
        onBaseAttributeChange={vi.fn()}
        onAncestryBoostChange={vi.fn()}
        onBackgroundAbilityBoostChange={vi.fn()}
      />
    );

    // Missing str renders the default score 10; the languages fall back to None.
    expect(screen.getByTitle('Strength score')).toHaveValue(10);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('lists ancestry languages when present', () => {
    render(
      <Pf2eAbilitiesTab
        document={makeDoc({ languages: ['Common', 'Draconic'] })}
        canUpdate
        ancestryChoiceSlots={[]}
        backgroundRestrictedBoost=""
        backgroundFreeBoost=""
        backgroundFreeBoostOptions={[]}
        onBaseAttributeChange={vi.fn()}
        onAncestryBoostChange={vi.fn()}
        onBackgroundAbilityBoostChange={vi.fn()}
      />
    );

    expect(screen.getByText('Common, Draconic')).toBeInTheDocument();
  });

  it('sums only equipped bulk plus carried inventory bulk', () => {
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          equipment: [
            // Equipped item contributes its bulk; the stowed one contributes 0.
            { itemId: 'worn', name: 'Worn Armor', bulk: 2, equipped: true },
            { itemId: 'spare', name: 'Spare Armor', bulk: 5, equipped: false },
          ],
          inventory: [{ itemId: 'kit', name: 'Repair Kit', quantity: 2, bulk: 1 }],
        })}
        canUpdate
      />
    );

    // equipped(2) + inventory(2 * 1) = 4 total bulk; the stowed +5 is ignored.
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('keeps the shield toggle inert when read-only', async () => {
    const user = userEvent.setup();
    const onToggleShieldRaised = vi.fn();
    render(
      <Pf2eOverview
        document={makeDoc({
          // Negative manual max bonus exercises the formatMod minus path.
          hitPoints: { current: 8, max: 10, temp: 0, maxBonus: -2 },
          equipment: [
            {
              itemId: 'shield',
              name: 'Wooden Shield',
              bulk: 1,
              equipped: true,
              shieldBonus: 2,
              raised: false,
            },
          ],
        })}
        canUpdate={false}
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
        onToggleShieldRaised={onToggleShieldRaised}
      />
    );

    expect(screen.getByText('-2 manual max')).toBeInTheDocument();
    const shieldButton = screen.getByRole('button', { name: 'Raise Shield' });
    expect(shieldButton).toBeDisabled();
    await user.click(shieldButton);
    expect(onToggleShieldRaised).not.toHaveBeenCalled();
  });

  it('maps equipment with missing optional fields to safe defaults', async () => {
    render(
      <Pf2eEquipmentBrowserTab
        equipmentLoaded
        equipmentItems={[
          // No type/rarity/cost/weight → the wrapper supplies gear/common/0 gp/0.
          { id: 'mystery', name: 'Mystery Item', description: 'Unlabelled.' } as never,
        ]}
      />
    );

    expect(await screen.findByText('Mystery Item')).toBeInTheDocument();
  });

  it('renders a spell with no class list and forwards the original on selection', async () => {
    const user = userEvent.setup();
    const onSelectSpell = vi.fn();
    const noClassSpell = makeSpell({
      id: 'no-class',
      name: 'No Class Spell',
      level: 0,
      classes: undefined as never,
    });
    render(<Pf2eSpellBrowserPanel spells={[noClassSpell]} onSelectSpell={onSelectSpell} />);

    const learnButton = await screen.findByRole('button', { name: 'Learn No Class Spell' });
    await user.click(learnButton);
    // The panel maps to a browser shape then resolves back to the original Spell.
    expect(onSelectSpell).toHaveBeenCalledWith(noClassSpell);
  });

  it('passes no selection handler to the browser panel when omitted', async () => {
    render(
      <Pf2eSpellBrowserPanel
        spells={[makeSpell({ id: 'frost', name: 'Frost', level: 1, classes: ['wizard'] })]}
      />
    );

    // Without onSelectSpell the wrapper forwards undefined (the falsy ternary
    // branch) and the spell still lists in the browser.
    expect(await screen.findByText('Learn Frost')).toBeInTheDocument();
  });

  it('labels tracked cantrips and resolves always-prepared spell names', () => {
    const cantrip = makeSpell({ id: 'detect-magic', name: 'Detect Magic', level: 0 });
    const resolvedAlways = makeSpell({ id: 'guidance', name: 'Guidance', level: 0 });
    render(
      <Pf2eSpellsTab
        spellsLoaded
        spells={[cantrip, resolvedAlways]}
        spellAbilityScore={16}
        onSpellcastingChange={vi.fn()}
        onSpellProficiencyTierCycle={vi.fn()}
        spellcasting={makeSpellcasting({
          type: 'spontaneous',
          spellsKnown: ['detect-magic'],
          alwaysPreparedSpellIds: ['guidance'],
        })}
      />
    );

    // A level-0 tracked spell renders the "Cantrip" rank badge (level===0 branch).
    expect(screen.getByText('Cantrip')).toBeInTheDocument();
    // The always-prepared spell resolves to its real name (the resolved branch).
    expect(screen.getByText('Guidance')).toBeInTheDocument();
    expect(screen.getByText('Detect Magic')).toBeInTheDocument();
  });

  it('defaults a missing wisdom score to 10 for the perception modifier', () => {
    render(
      <Pf2eOverview
        document={makeDoc({
          // Sparse baseAttributes: wis absent → perception uses the 10 default.
          baseAttributes: { str: 10 } as Record<string, number>,
          perceptionProficiency: prof('trained', 3),
        })}
        canUpdate={false}
        classDcScore={null}
        contributionEntries={[]}
        onHitPointsChange={vi.fn()}
        onClassDcTierCycle={vi.fn()}
        onPerceptionTierCycle={vi.fn()}
        onPerceptionRoll={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    // perception = abilityMod(wis default 10)=0 + total(3) => +3
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('defaults missing skill ability scores to 10', () => {
    render(
      <Pf2eSkillsTab
        document={makeDoc({
          // No ability scores at all → every skill falls back to the 10 default.
          baseAttributes: {} as Record<string, number>,
          skillProficiencies: {},
          loreProficiencies: {},
        })}
        canUpdate
        loreIds={[]}
        onCycleSkillTier={vi.fn()}
        onCycleLoreTier={vi.fn()}
        onBackgroundSkillTrainingChange={vi.fn()}
        onBackgroundLoreTrainingChange={vi.fn()}
        onRollCheck={vi.fn().mockResolvedValue(rollResult)}
      />
    );

    // Untrained skills with the default ability modifier all read +0.
    expect(screen.getByText('acrobatics')).toBeInTheDocument();
    expect(screen.getAllByText('+0').length).toBeGreaterThan(0);
  });

  it('defaults a missing strength score to 10 when computing bulk limits', () => {
    render(
      <Pf2eInventoryTab
        document={makeDoc({
          // No str → strengthModifier falls back to abilityMod(10)=0.
          baseAttributes: {} as Record<string, number>,
          inventory: [{ itemId: 'sack', name: 'Sack', quantity: 1, bulk: 1 }],
        })}
        canUpdate
      />
    );

    // str mod 0 => encumbered over 5, max 10; total bulk 1 stays unencumbered,
    // so neither the Encumbered nor Overloaded warning badge is rendered.
    expect(screen.getByText('Total Bulk')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('Overloaded')).not.toBeInTheDocument();
  });
});
