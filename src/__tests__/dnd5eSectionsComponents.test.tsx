// purpose: Render/interaction coverage for the D&D 5e presentational section/tab
// components under src/systems/dnd5e/shared/components. Each component takes a
// plain prop bundle, so we render it directly with hand-built props and assert
// real observables (visible text/role, handlers called with expected args, and
// read-only vs editable branches). Tab-body components return a <TabsContent>,
// which only renders inside a matching <Tabs> context, so those are wrapped.
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tabs } from '../components/ui/Tabs';
import type { RollResult } from '../registry/types';
import type { Background } from '../types/character-options/backgrounds';
import type { Species } from '../types/character-options/species';
import type { CharacterClass } from '../types/character-options/classes';
import type { ClassLevel, Feat, SkillProficiency } from '../types/core/character';
import type { FeatDefinition } from '../types/character-options/feats';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../types/character-options/feature-options';
import { Dnd5eSkillsTab } from '../systems/dnd5e/shared/components/Dnd5eSkillsTab';
import { Dnd5eSavesTab } from '../systems/dnd5e/shared/components/Dnd5eSavesTab';
import { Dnd5eNotesTab } from '../systems/dnd5e/shared/components/Dnd5eNotesTab';
import { Dnd5eOverviewSection } from '../systems/dnd5e/shared/components/Dnd5eOverviewSection';
import { Dnd5eBackgroundSection } from '../systems/dnd5e/shared/components/Dnd5eBackgroundSection';
import { Dnd5eSpeciesSection } from '../systems/dnd5e/shared/components/Dnd5eSpeciesSection';
import { Dnd5eClassesSection } from '../systems/dnd5e/shared/components/Dnd5eClassesSection';
import { Dnd5eWeaponMasteriesTab } from '../systems/dnd5e/shared/components/Dnd5eWeaponMasteriesTab';
import { Dnd5eMonsterBrowserTab } from '../systems/dnd5e/shared/components/Dnd5eMonsterBrowserTab';
import { Dnd5eFeatBrowserTab } from '../systems/dnd5e/shared/components/Dnd5eFeatBrowserTab';
import { Dnd5eSelectedFeatsSection } from '../systems/dnd5e/shared/components/Dnd5eSelectedFeatsSection';
import { Dnd5eFeatureOptionsSection } from '../systems/dnd5e/shared/components/Dnd5eFeatureOptionsSection';
import { Dnd5eSpellsTab } from '../systems/dnd5e/shared/components/Dnd5eSpellsTab';

afterEach(() => {
  vi.clearAllMocks();
});

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const rollOf = (total: number): RollResult => ({
  total,
  formula: `1d20+${total - 10}`,
  terms: [total - (total - 10)],
  isCritical: false,
  isFumble: false,
});

/** Wrap a tab body so its <TabsContent value> is the active tab and renders. */
function renderTab(value: string, node: React.ReactNode) {
  return render(<Tabs defaultValue={value}>{node}</Tabs>);
}

describe('Dnd5eSkillsTab', () => {
  const skills = [
    { id: 'athletics', name: 'Athletics', ability: 'str' },
    { id: 'stealth', name: 'Stealth', ability: 'dex' },
    { id: 'arcana', name: 'Arcana', ability: 'int' },
  ];
  const attributes = { str: 16, dex: 14, int: 8 };

  it('renders proficiency badge letters and derived totals per skill', () => {
    const proficiencies: Record<string, SkillProficiency> = {
      athletics: { level: 'proficient', source: [] },
      stealth: { level: 'expertise', source: [] },
      arcana: { level: 'half', source: [] },
    };
    renderTab(
      'skills',
      <Dnd5eSkillsTab
        skills={skills}
        attributes={attributes}
        skillProficiencies={proficiencies}
        profBonus={3}
        canUpdate
      />
    );

    // str +3, proficient +3 => +6
    const athletics = screen
      .getByText('Athletics')
      .closest('div.flex.items-center')!.parentElement!;
    expect(within(athletics).getByText('P')).toBeInTheDocument();
    // dex +2, expertise +6 => +8
    const stealth = screen.getByText('Stealth').closest('div.flex.items-center')!.parentElement!;
    expect(within(stealth).getByText('E')).toBeInTheDocument();
    // Derived totals appear as +6 / +8 / -1 (int -1 + floor(3*0.5)=1 => 0)
    expect(screen.getByText('+6')).toBeInTheDocument();
    expect(screen.getByText('+8')).toBeInTheDocument();
    expect(screen.getByText('+0')).toBeInTheDocument();
  });

  it('fires onToggleProficiency with the skill id when editable', async () => {
    const onToggleProficiency = vi.fn();
    renderTab(
      'skills',
      <Dnd5eSkillsTab
        skills={skills}
        attributes={attributes}
        skillProficiencies={{}}
        profBonus={2}
        canUpdate
        onToggleProficiency={onToggleProficiency}
      />
    );
    await userEvent.click(screen.getByTitle('Toggle Stealth proficiency'));
    expect(onToggleProficiency).toHaveBeenCalledWith('stealth');
  });

  it('disables the proficiency toggles when canUpdate is false', () => {
    renderTab(
      'skills',
      <Dnd5eSkillsTab
        skills={skills}
        attributes={attributes}
        skillProficiencies={{}}
        profBonus={2}
        canUpdate={false}
      />
    );
    expect(screen.getByTitle('Toggle Athletics proficiency')).toBeDisabled();
  });

  it('renders a roll button per skill and resolves onRollSkill', async () => {
    const onRollSkill = vi.fn().mockResolvedValue(rollOf(17));
    renderTab(
      'skills',
      <Dnd5eSkillsTab
        skills={[skills[0]]}
        attributes={attributes}
        skillProficiencies={{}}
        profBonus={2}
        canUpdate
        onRollSkill={onRollSkill}
      />
    );
    await userEvent.click(screen.getByTitle('Roll Athletics Check'));
    expect(onRollSkill).toHaveBeenCalledWith('athletics');
    expect(await screen.findByText('17')).toBeInTheDocument();
  });

  it('defaults a missing ability score to 10 (+0) for the skill total', () => {
    // arcana's int is absent => abilityMod falls back to 10 (+0); no proficiency.
    renderTab(
      'skills',
      <Dnd5eSkillsTab
        skills={[{ id: 'arcana', name: 'Arcana', ability: 'int' }]}
        attributes={{}}
        skillProficiencies={{}}
        profBonus={2}
        canUpdate
      />
    );
    expect(screen.getByText('+0')).toBeInTheDocument();
  });
});

describe('Dnd5eSavesTab', () => {
  const attributes = { str: 12, dex: 14, con: 16, int: 10, wis: 8, cha: 18 };

  it('marks proficient saves and computes totals', () => {
    renderTab(
      'saves',
      <Dnd5eSavesTab
        abilityNames={ABILITY_NAMES}
        attributes={attributes}
        savingThrowProficiencies={['con', 'cha']}
        profBonus={2}
        canUpdate
      />
    );
    // con +3 + prof 2 => +5 ; cha +4 + prof 2 => +6 ; dex +2 (no prof)
    expect(screen.getByText('+5')).toBeInTheDocument();
    expect(screen.getByText('+6')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('fires onToggleProficiency and resolves onRollSave', async () => {
    const onToggleProficiency = vi.fn();
    const onRollSave = vi.fn().mockResolvedValue(rollOf(11));
    renderTab(
      'saves',
      <Dnd5eSavesTab
        abilityNames={{ dex: 'Dexterity' }}
        attributes={{ dex: 14 }}
        savingThrowProficiencies={[]}
        profBonus={2}
        canUpdate
        onToggleProficiency={onToggleProficiency}
        onRollSave={onRollSave}
      />
    );
    await userEvent.click(screen.getByTitle('Toggle Dexterity save proficiency'));
    expect(onToggleProficiency).toHaveBeenCalledWith('dex');

    await userEvent.click(screen.getByTitle('Roll Dexterity Save'));
    expect(onRollSave).toHaveBeenCalledWith('dex');
    expect(await screen.findByText('11')).toBeInTheDocument();
  });

  it('disables toggles in read-only mode', () => {
    renderTab(
      'saves',
      <Dnd5eSavesTab
        abilityNames={{ str: 'Strength' }}
        attributes={{ str: 10 }}
        savingThrowProficiencies={[]}
        profBonus={2}
        canUpdate={false}
      />
    );
    expect(screen.getByTitle('Toggle Strength save proficiency')).toBeDisabled();
  });

  it('defaults a missing ability score to 10 (+0) before adding proficiency', () => {
    // wis absent from attributes => abilityMod falls back to 10 (=> +0); with a
    // proficient save the total is just the proficiency bonus.
    renderTab(
      'saves',
      <Dnd5eSavesTab
        abilityNames={{ wis: 'Wisdom' }}
        attributes={{}}
        savingThrowProficiencies={['wis']}
        profBonus={3}
        canUpdate
      />
    );
    expect(screen.getByText('+3')).toBeInTheDocument();
  });
});

describe('Dnd5eNotesTab', () => {
  it('renders existing values and fires every change handler', () => {
    const onAppearanceChange = vi.fn();
    const onBackstoryChange = vi.fn();
    const onPersonalityFieldChange = vi.fn();
    const onNotesChange = vi.fn();
    renderTab(
      'notes',
      <Dnd5eNotesTab
        personality={{
          appearance: 'Tall',
          backstory: 'Orphan',
          traits: 'Brave',
          ideals: 'Justice',
          bonds: 'Family',
          flaws: 'Pride',
        }}
        notes="Misc"
        canUpdate
        onAppearanceChange={onAppearanceChange}
        onBackstoryChange={onBackstoryChange}
        onPersonalityFieldChange={onPersonalityFieldChange}
        onNotesChange={onNotesChange}
      />
    );

    expect(screen.getByLabelText('Appearance')).toHaveValue('Tall');
    expect(screen.getByLabelText('Backstory')).toHaveValue('Orphan');

    fireEvent.change(screen.getByLabelText('Appearance'), { target: { value: 'Short' } });
    expect(onAppearanceChange).toHaveBeenCalledWith('Short');

    fireEvent.change(screen.getByLabelText('Backstory'), { target: { value: 'Noble' } });
    expect(onBackstoryChange).toHaveBeenCalledWith('Noble');

    fireEvent.change(screen.getByLabelText('traits'), { target: { value: 'Calm' } });
    expect(onPersonalityFieldChange).toHaveBeenCalledWith('traits', 'Calm');

    fireEvent.change(screen.getByLabelText('flaws'), { target: { value: 'Greedy' } });
    expect(onPersonalityFieldChange).toHaveBeenCalledWith('flaws', 'Greedy');

    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Updated' } });
    expect(onNotesChange).toHaveBeenCalledWith('Updated');
  });

  it('falls back to empty strings and disables fields when read-only', () => {
    renderTab('notes', <Dnd5eNotesTab canUpdate={false} />);
    expect(screen.getByLabelText('Appearance')).toHaveValue('');
    expect(screen.getByLabelText('Notes')).toBeDisabled();
    expect(screen.getByLabelText('ideals')).toBeDisabled();
  });
});

describe('Dnd5eOverviewSection', () => {
  const baseProps = {
    armorClass: 16,
    hitPoints: { current: 22, max: 30, temp: 5 },
    initiative: 3,
    speed: 30,
    exhaustionLevel: 0,
    deathSaves: { successes: 0, failures: 0 },
    hitDice: [{ die: 'd8', total: 3, remaining: 3 }],
    canUpdate: true,
  };

  it('renders combat stats, temp HP badge, and edits both HP fields', () => {
    const onHitPointsChange = vi.fn();
    render(
      <Dnd5eOverviewSection
        {...baseProps}
        onHitPointsChange={onHitPointsChange}
        spellcasting={undefined}
      />
    );

    expect(screen.getByText('Armor Class')).toBeInTheDocument();
    // HP is rendered via editable inputs (the card uses children, not the value prop).
    expect(screen.getByTitle('Current hit points')).toHaveValue(22);
    expect(screen.getByTitle('Maximum hit points')).toHaveValue(30);
    expect(screen.getByText('+5 temp')).toBeInTheDocument();
    expect(screen.getByText('No spellcasting')).toBeInTheDocument();
    // initiative formatted with sign
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('30 ft')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('Current hit points'), { target: { value: '10' } });
    expect(onHitPointsChange).toHaveBeenCalledWith({ current: 10 });

    fireEvent.change(screen.getByTitle('Maximum hit points'), { target: { value: '40' } });
    expect(onHitPointsChange).toHaveBeenCalledWith({ max: 40 });
  });

  it('summarises spellcasting slot counts and class count when present', () => {
    render(
      <Dnd5eOverviewSection
        {...baseProps}
        hitPoints={{ current: 10, max: 10, temp: 0 }}
        spellcasting={{
          classes: [{}, {}],
          spellSlots: {
            1: { max: 4, used: 0 },
            2: { max: 3, used: 0 },
            3: { max: 0, used: 0 },
            4: { max: 0, used: 0 },
            5: { max: 0, used: 0 },
            6: { max: 0, used: 0 },
            7: { max: 0, used: 0 },
            8: { max: 0, used: 0 },
            9: { max: 0, used: 0 },
          },
          pactMagic: { level: 1, max: 2, used: 0 },
        }}
      />
    );
    // 4 + 3 + 2 (pact) = 9 slots total. The subtitle and value live in the same
    // CombatStatCard, so locate the count relative to the class-count subtitle
    // (the heading text "Spell Slots" also appears in the slot tracker below).
    const subtitle = screen.getByText('2 casting class(es)');
    const card = subtitle.parentElement!;
    expect(within(card).getByText('9')).toBeInTheDocument();
  });

  it('hides the damage/heal control and temp badge when read-only with no temp HP', () => {
    render(
      <Dnd5eOverviewSection
        {...baseProps}
        canUpdate={false}
        hitPoints={{ current: 10, max: 10, temp: 0 }}
        onDamageHeal={vi.fn()}
        spellcasting={undefined}
      />
    );
    expect(screen.queryByText(/temp$/)).not.toBeInTheDocument();
    expect(screen.getByTitle('Current hit points')).toBeDisabled();
  });
});

describe('Dnd5eBackgroundSection', () => {
  const makeBackground = (overrides: Partial<Background> = {}): Background =>
    ({
      id: 'acolyte',
      name: 'Acolyte',
      system: 'dnd-5e-2014',
      source: 'PHB',
      skillProficiencies: ['insight', 'religion'],
      equipment: [],
      gold: 15,
      feature: {
        id: 'shelter',
        name: 'Shelter of the Faithful',
        source: 'Acolyte',
        description: '',
      },
      suggestedCharacteristics: { traits: [], ideals: [], bonds: [], flaws: [] },
      description: '',
      ...overrides,
    }) as Background;

  it('renders fixed tools and a tool choice select that fires on change', () => {
    const onBackgroundToolChange = vi.fn();
    render(
      <Dnd5eBackgroundSection
        selectedBackground={makeBackground()}
        backgroundFixedTools={['thieves-tools']}
        backgroundToolSlots={[
          { slotIndex: 0, label: 'Artisan Tool', value: '', options: ['smiths-tools'] },
        ]}
        backgroundLanguageSlots={[]}
        canUpdate
        onBackgroundToolChange={onBackgroundToolChange}
      />
    );

    expect(screen.getByText('Acolyte')).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Shelter of the Faithful')).toBeInTheDocument();
    expect(screen.getByText('Background Tools')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Background tool 1'), {
      target: { value: 'smiths-tools' },
    });
    expect(onBackgroundToolChange).toHaveBeenCalledWith(0, 'smiths-tools');
  });

  it('renders a fixed language list when languageProficiencies is an array (legacy data)', () => {
    render(
      <Dnd5eBackgroundSection
        selectedBackground={makeBackground({
          // Legacy SRD shape: a plain array rather than a Choice<string>.
          languageProficiencies: [
            'Common',
            'Elvish',
          ] as unknown as Background['languageProficiencies'],
        })}
        backgroundFixedTools={[]}
        backgroundToolSlots={[]}
        backgroundLanguageSlots={[]}
        canUpdate
      />
    );
    expect(screen.getByText('Background Languages')).toBeInTheDocument();
    expect(screen.getByText('Common, Elvish')).toBeInTheDocument();
  });

  it('renders language choice selects and fires onBackgroundLanguageChange', () => {
    const onBackgroundLanguageChange = vi.fn();
    render(
      <Dnd5eBackgroundSection
        selectedBackground={makeBackground({
          languageProficiencies: { count: 1, options: ['Dwarvish'], label: 'Language' },
        })}
        backgroundFixedTools={[]}
        backgroundToolSlots={[]}
        backgroundLanguageSlots={[
          { slotIndex: 0, label: 'Bonus Language', value: '', options: ['Dwarvish'] },
        ]}
        canUpdate={false}
        onBackgroundLanguageChange={onBackgroundLanguageChange}
      />
    );
    const select = screen.getByLabelText('Background language 1');
    expect(select).toBeDisabled();
    // Re-render editable to fire the handler.
    render(
      <Dnd5eBackgroundSection
        selectedBackground={makeBackground({
          languageProficiencies: { count: 1, options: ['Dwarvish'], label: 'Language' },
        })}
        backgroundFixedTools={[]}
        backgroundToolSlots={[]}
        backgroundLanguageSlots={[
          { slotIndex: 1, label: 'Bonus Language', value: '', options: ['Dwarvish'] },
        ]}
        canUpdate
        onBackgroundLanguageChange={onBackgroundLanguageChange}
      />
    );
    fireEvent.change(screen.getByLabelText('Background language 2'), {
      target: { value: 'Dwarvish' },
    });
    expect(onBackgroundLanguageChange).toHaveBeenCalledWith(1, 'Dwarvish');
  });
});

describe('Dnd5eSpeciesSection', () => {
  const baseSpecies: Species = {
    id: 'half-elf',
    name: 'Half-Elf',
    system: 'dnd-5e-2014',
    source: 'PHB',
    size: 'Medium',
    speed: 30,
    traits: [],
    sizeDescription: 'Medium',
  } as unknown as Species;

  const emptyArgs = {
    abilityNames: ABILITY_NAMES,
    skillNames: new Map<string, string>([['stealth', 'Stealth']]),
    canUpdate: true,
  };

  it('renders only the species header when there are no choice slots', () => {
    render(
      <Dnd5eSpeciesSection
        selectedSpecies={baseSpecies}
        speciesAbilitySlots={[]}
        speciesLanguageSlots={[]}
        speciesSkillSlots={[]}
        speciesToolSlots={[]}
        {...emptyArgs}
      />
    );
    expect(screen.getByText('Half-Elf')).toBeInTheDocument();
    expect(screen.getByText('Species')).toBeInTheDocument();
    expect(screen.queryByText('Species Ability Choices')).not.toBeInTheDocument();
  });

  it('renders every choice-slot group and fires each handler', () => {
    const onSpeciesAbilityChange = vi.fn();
    const onSpeciesLanguageChange = vi.fn();
    const onSpeciesSkillChange = vi.fn();
    const onSpeciesToolChange = vi.fn();
    render(
      <Dnd5eSpeciesSection
        selectedSpecies={baseSpecies}
        speciesAbilitySlots={[
          { slotIndex: 0, label: 'Ability', value: '', options: ['str', 'mystery-stat'] },
        ]}
        speciesLanguageSlots={[{ slotIndex: 0, label: 'Language', value: '', options: ['Elvish'] }]}
        speciesSkillSlots={[
          { slotIndex: 0, label: 'Skill', value: '', options: ['stealth', 'mystery-skill'] },
        ]}
        speciesToolSlots={[{ slotIndex: 0, label: 'Tool', value: '', options: ['smiths-tools'] }]}
        {...emptyArgs}
        onSpeciesAbilityChange={onSpeciesAbilityChange}
        onSpeciesLanguageChange={onSpeciesLanguageChange}
        onSpeciesSkillChange={onSpeciesSkillChange}
        onSpeciesToolChange={onSpeciesToolChange}
      />
    );

    expect(screen.getByText('Species Ability Choices')).toBeInTheDocument();
    expect(screen.getByText('Species Languages')).toBeInTheDocument();
    expect(screen.getByText('Species Skills')).toBeInTheDocument();
    expect(screen.getByText('Species Tools')).toBeInTheDocument();
    // The ability option resolves to its display name.
    expect(
      within(screen.getByLabelText('Species ability 1')).getByText('Strength')
    ).toBeInTheDocument();
    // An option absent from abilityNames falls back to its raw id.
    expect(
      within(screen.getByLabelText('Species ability 1')).getByText('mystery-stat')
    ).toBeInTheDocument();
    // The skill option resolves through skillNames.
    expect(
      within(screen.getByLabelText('Species skill 1')).getByText('Stealth')
    ).toBeInTheDocument();
    // An option absent from skillNames falls back to its raw id.
    expect(
      within(screen.getByLabelText('Species skill 1')).getByText('mystery-skill')
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Species ability 1'), { target: { value: 'str' } });
    expect(onSpeciesAbilityChange).toHaveBeenCalledWith(0, 'str');
    fireEvent.change(screen.getByLabelText('Species language 1'), { target: { value: 'Elvish' } });
    expect(onSpeciesLanguageChange).toHaveBeenCalledWith(0, 'Elvish');
    fireEvent.change(screen.getByLabelText('Species skill 1'), { target: { value: 'stealth' } });
    expect(onSpeciesSkillChange).toHaveBeenCalledWith(0, 'stealth');
    fireEvent.change(screen.getByLabelText('Species tool 1'), {
      target: { value: 'smiths-tools' },
    });
    expect(onSpeciesToolChange).toHaveBeenCalledWith(0, 'smiths-tools');
  });

  it('disables tool selects when read-only', () => {
    render(
      <Dnd5eSpeciesSection
        selectedSpecies={baseSpecies}
        speciesAbilitySlots={[]}
        speciesLanguageSlots={[]}
        speciesSkillSlots={[]}
        speciesToolSlots={[{ slotIndex: 0, label: 'Tool', value: '', options: ['smiths-tools'] }]}
        {...emptyArgs}
        canUpdate={false}
      />
    );
    expect(screen.getByLabelText('Species tool 1')).toBeDisabled();
  });
});

describe('Dnd5eClassesSection', () => {
  // count >= options.length keeps buildChoiceSlots empty, so the row tests stay
  // focused on class/level/subclass/remove rather than class-skill pickers.
  const fighter: CharacterClass = {
    id: 'fighter',
    name: 'Fighter',
    subclassLevel: 3,
    subclasses: [{ id: 'champion', name: 'Champion' }],
    skillProficiencies: { count: 0, options: [], label: 'Skills' },
    toolProficiencies: [],
  } as unknown as CharacterClass;
  const wizard: CharacterClass = {
    id: 'wizard',
    name: 'Wizard',
    subclassLevel: 2,
    subclasses: [],
    skillProficiencies: { count: 0, options: [], label: 'Skills' },
    toolProficiencies: [],
  } as unknown as CharacterClass;
  const cleric: CharacterClass = {
    id: 'cleric',
    name: 'Cleric',
    subclassLevel: 1,
    subclasses: [],
    skillProficiencies: { count: 0, options: [], label: 'Skills' },
    toolProficiencies: [],
  } as unknown as CharacterClass;

  const baseHandlers = {
    onPendingClassIdChange: vi.fn(),
    onPendingClassLevelChange: vi.fn(),
    onClassRowChange: vi.fn(),
    onClassLevelChange: vi.fn(),
    onSubclassChange: vi.fn(),
    onClassSkillSelectionChange: vi.fn(),
    onClassToolSelectionChange: vi.fn(),
    onAddClass: vi.fn(),
    onRemoveClass: vi.fn(),
  };

  const makeProps = (
    overrides: Partial<React.ComponentProps<typeof Dnd5eClassesSection>> = {}
  ) => ({
    classLevels: [{ classId: 'fighter', level: 5 }] as ClassLevel[],
    classes: [fighter, wizard, cleric],
    totalLevel: 5,
    skillProficiencies: {} as Record<string, SkillProficiency>,
    toolProficiencies: [] as string[],
    pendingClassId: '',
    pendingClassLevel: '1',
    classTemplateError: null,
    skillNames: new Map<string, string>(),
    canUpdate: true,
    ...baseHandlers,
    ...overrides,
  });

  it('renders a class row with total-level badge and fires row/level/remove handlers', () => {
    const onClassRowChange = vi.fn();
    const onClassLevelChange = vi.fn();
    const onRemoveClass = vi.fn();
    render(
      <Dnd5eClassesSection
        {...makeProps({
          classLevels: [
            { classId: 'fighter', level: 5 },
            { classId: 'wizard', level: 2 },
          ] as ClassLevel[],
          totalLevel: 7,
          onClassRowChange,
          onClassLevelChange,
          onRemoveClass,
        })}
      />
    );

    expect(screen.getByText('Total Level 7')).toBeInTheDocument();
    expect(screen.getByText('Starting Class')).toBeInTheDocument();
    expect(screen.getByText('Class 2')).toBeInTheDocument();

    // Row 1 excludes wizard (used by row 2); cleric is still selectable.
    fireEvent.change(screen.getByTitle('Class 1'), { target: { value: 'cleric' } });
    expect(onClassRowChange).toHaveBeenCalledWith('fighter', 'cleric', 5);

    fireEvent.change(screen.getByTitle('fighter level'), { target: { value: '6' } });
    expect(onClassLevelChange).toHaveBeenCalledWith('fighter', '6');

    fireEvent.click(screen.getByTitle('Remove fighter'));
    expect(onRemoveClass).toHaveBeenCalledWith('fighter');
  });

  it('shows the subclass picker and fires onSubclassChange when unlocked', () => {
    const onSubclassChange = vi.fn();
    render(<Dnd5eClassesSection {...makeProps({ onSubclassChange })} />);
    // Fighter is level 5 (>= subclassLevel 3): picker is enabled.
    fireEvent.change(screen.getByTitle('fighter subclass'), { target: { value: 'champion' } });
    expect(onSubclassChange).toHaveBeenCalledWith('fighter', 'champion');
  });

  it('renders the empty state when there are no class levels', () => {
    render(<Dnd5eClassesSection {...makeProps({ classLevels: [], totalLevel: 0 })} />);
    expect(screen.getByText('No class template applied yet.')).toBeInTheDocument();
  });

  it('disables the remove button when only one class remains', () => {
    render(<Dnd5eClassesSection {...makeProps()} />);
    expect(screen.getByTitle('Remove fighter')).toBeDisabled();
  });

  it('fires onAddClass and shows the template error', async () => {
    const onAddClass = vi.fn();
    render(
      <Dnd5eClassesSection
        {...makeProps({
          pendingClassId: 'wizard',
          classTemplateError: 'Template failed',
          onAddClass,
        })}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Template failed');
    await userEvent.click(screen.getByRole('button', { name: /Add Class/ }));
    expect(onAddClass).toHaveBeenCalledTimes(1);
  });

  it('omits the add-class form when read-only', () => {
    render(<Dnd5eClassesSection {...makeProps({ canUpdate: false })} />);
    expect(screen.queryByText('Add Class')).not.toBeInTheDocument();
    expect(screen.getByTitle('Remove fighter')).toBeDisabled();
  });

  it('shows the locked-subclass placeholder before the subclass level', () => {
    // Fighter at level 1 (< subclassLevel 3) with subclasses present: the picker
    // shows but is disabled and surfaces the "Choose at level 3" placeholder.
    render(
      <Dnd5eClassesSection
        {...makeProps({ classLevels: [{ classId: 'fighter', level: 1 }] as ClassLevel[] })}
      />
    );
    const subclassSelect = screen.getByTitle('fighter subclass');
    expect(subclassSelect).toBeDisabled();
    expect(within(subclassSelect).getByText('Choose at level 3')).toBeInTheDocument();
    expect(screen.getByText('Subclass unlocks at level 3.')).toBeInTheDocument();
  });

  it('renders class skill/tool choice slots and fires their selection handlers', () => {
    const ranger: CharacterClass = {
      id: 'ranger',
      name: 'Ranger',
      subclassLevel: 3,
      subclasses: [],
      // options > count => buildChoiceSlots yields one rendered slot.
      skillProficiencies: { count: 1, options: ['athletics', 'mystery'], label: 'Skill' },
      // 'gaming-set' expands into several options => a tool slot renders too.
      toolProficiencies: [{ count: 1, options: ['gaming-set'], label: 'Tool' }],
    } as unknown as CharacterClass;
    const onClassSkillSelectionChange = vi.fn();
    const onClassToolSelectionChange = vi.fn();
    render(
      <Dnd5eClassesSection
        {...makeProps({
          classLevels: [{ classId: 'ranger', level: 1 }] as ClassLevel[],
          classes: [ranger],
          skillNames: new Map([['athletics', 'Athletics']]),
          onClassSkillSelectionChange,
          onClassToolSelectionChange,
        })}
      />
    );

    expect(screen.getByText('Class Skills')).toBeInTheDocument();
    expect(screen.getByText('Class Tools')).toBeInTheDocument();
    const skillSelect = screen.getByTitle('ranger skill choice 1');
    // Mapped name resolves; unmapped option falls back to its raw id.
    expect(within(skillSelect).getByText('Athletics')).toBeInTheDocument();
    expect(within(skillSelect).getByText('mystery')).toBeInTheDocument();

    fireEvent.change(skillSelect, { target: { value: 'athletics' } });
    expect(onClassSkillSelectionChange).toHaveBeenCalledWith(
      ranger,
      expect.objectContaining({ classId: 'ranger' }),
      0,
      'athletics'
    );

    const toolSelect = screen.getByTitle('ranger tool choice 1');
    const firstToolOption = within(toolSelect)
      .getAllByRole('option')
      .find((option) => (option as HTMLOptionElement).value !== '') as HTMLOptionElement;
    fireEvent.change(toolSelect, { target: { value: firstToolOption.value } });
    expect(onClassToolSelectionChange).toHaveBeenCalledWith(
      ranger,
      expect.objectContaining({ classId: 'ranger' }),
      0,
      firstToolOption.value
    );
  });
});

describe('Dnd5eWeaponMasteriesTab', () => {
  it('highlights active masteries and toggles when editable', async () => {
    const onToggleMastery = vi.fn();
    renderTab(
      'masteries',
      <Dnd5eWeaponMasteriesTab
        weaponMasteries={['sap']}
        options={['Sap', 'Cleave', 'Nick']}
        canUpdate
        onToggleMastery={onToggleMastery}
      />
    );

    // count badge reflects selected masteries
    expect(screen.getByText('1')).toBeInTheDocument();
    const sap = screen.getByRole('button', { name: 'Sap' });
    // active branch applies the primary styling.
    expect(sap.className).toContain('text-primary');
    const cleave = screen.getByRole('button', { name: 'Cleave' });
    expect(cleave.className).not.toContain('text-primary');

    await userEvent.click(cleave);
    expect(onToggleMastery).toHaveBeenCalledWith('Cleave');
  });

  it('disables mastery buttons when read-only', () => {
    renderTab(
      'masteries',
      <Dnd5eWeaponMasteriesTab weaponMasteries={[]} options={['Sap']} canUpdate={false} />
    );
    expect(screen.getByRole('button', { name: 'Sap' })).toBeDisabled();
  });
});

describe('Dnd5eMonsterBrowserTab', () => {
  it('prompts to open the tab before monsters are loaded', () => {
    renderTab('monsters', <Dnd5eMonsterBrowserTab monstersLoaded={false} monsters={[]} />);
    expect(screen.getByText('Open the Monsters tab to load monster data.')).toBeInTheDocument();
  });

  it('shows the empty-dataset message when loaded with no monsters', () => {
    renderTab('monsters', <Dnd5eMonsterBrowserTab monstersLoaded monsters={[]} />);
    expect(
      screen.getByText('No monster dataset is currently available for this system.')
    ).toBeInTheDocument();
  });

  it('renders the lazy monster browser when monsters are present', async () => {
    // A fully-formed monster so the resolved browser (sibling-owned) renders
    // cleanly; we only assert that the Suspense branch resolved.
    const goblin = {
      id: 'goblin',
      name: 'Goblin',
      system: 'dnd-5e-2014',
      source: 'SRD',
      size: 'small',
      type: 'humanoid',
      alignment: 'neutral evil',
      challengeRating: 0.25,
      experiencePoints: 50,
      armorClass: 15,
      hitPoints: { count: 2, die: 6, notation: '2d6', modifier: 0 },
      speed: 30,
      abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
      senses: ['darkvision 60 ft.'],
      languages: ['Common'],
      actions: [],
    } as never;
    renderTab('monsters', <Dnd5eMonsterBrowserTab monstersLoaded monsters={[goblin]} />);
    expect(
      await screen.findByPlaceholderText('Search monsters by name or ability...')
    ).toBeInTheDocument();
  });
});

describe('Dnd5eFeatBrowserTab', () => {
  it('prompts to open the tab before feats load', () => {
    renderTab(
      'feats',
      <Dnd5eFeatBrowserTab
        systemId="dnd-5e-2014"
        featsLoaded={false}
        featTemplateError={null}
        featDefs={[]}
      />
    );
    expect(screen.getByText('Open the Feats tab to load feat data.')).toBeInTheDocument();
  });

  it('surfaces the feat template error', () => {
    renderTab(
      'feats',
      <Dnd5eFeatBrowserTab
        systemId="dnd-5e-2014"
        featsLoaded={false}
        featTemplateError="Could not load feats"
        featDefs={[]}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load feats');
  });

  it('renders the lazy feat browser fallback once feats are loaded', async () => {
    renderTab(
      'feats',
      <Dnd5eFeatBrowserTab
        systemId="dnd-5e-2014"
        featsLoaded
        featTemplateError={null}
        featDefs={[
          {
            id: 'alert',
            name: 'Alert',
            source: 'PHB',
            description: 'Always ready.',
            benefits: ['+5 initiative'],
          } as unknown as FeatDefinition,
        ]}
        onSelectFeat={vi.fn()}
      />
    );
    expect(
      await screen.findByPlaceholderText('Search feats by name or description...')
    ).toBeInTheDocument();
  });
});

describe('Dnd5eSelectedFeatsSection', () => {
  const feats: Feat[] = [{ id: 'tough', name: 'Tough', source: 'PHB', description: 'Extra HP.' }];

  const baseProps = {
    featTemplateError: null,
    featDefinitionsById: new Map<string, FeatDefinition>(),
    canUpdate: true,
    resolveFeatSelections: vi.fn().mockReturnValue({}),
    optionDisabledForRequirement: vi.fn().mockReturnValue(false),
    baseAttributes: { str: 10 },
  };

  it('returns null (renders nothing) when there are no feats', () => {
    const { container } = render(<Dnd5eSelectedFeatsSection {...baseProps} feats={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lists feats and fires onFeatRemove with the feat id', async () => {
    const onFeatRemove = vi.fn();
    render(<Dnd5eSelectedFeatsSection {...baseProps} feats={feats} onFeatRemove={onFeatRemove} />);
    expect(screen.getByText('Tough')).toBeInTheDocument();
    expect(screen.getByText('Extra HP.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onFeatRemove).toHaveBeenCalledWith('tough');
  });

  it('shows the template error and hides remove buttons when read-only', () => {
    render(
      <Dnd5eSelectedFeatsSection
        {...baseProps}
        feats={feats}
        canUpdate={false}
        featTemplateError="Feat template failed"
        onFeatRemove={vi.fn()}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Feat template failed');
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('renders automation-choice selects for a feat with template requirements', async () => {
    // "three skills of your choice" expands into a 3-slot skill requirement via
    // getDnd5eFeatAutomationRequirements, so the automation block + selects render.
    const featDefinition = {
      id: 'tough',
      name: 'Tough',
      source: 'PHB',
      description: 'Extra HP.',
      benefits: [],
      proficienciesGranted: { skills: ['three skills of your choice'] },
    } as unknown as FeatDefinition;
    const onFeatSelectionChange = vi.fn();
    const optionDisabledForRequirement = vi.fn().mockReturnValue(false);
    render(
      <Dnd5eSelectedFeatsSection
        {...baseProps}
        feats={feats}
        featDefinitionsById={new Map([['tough', featDefinition]])}
        resolveFeatSelections={vi.fn().mockReturnValue({ skills: ['', '', ''] })}
        optionDisabledForRequirement={optionDisabledForRequirement}
        onFeatSelectionChange={onFeatSelectionChange}
      />
    );

    expect(screen.getByText('Automation Choices')).toBeInTheDocument();
    const select = screen.getByTitle('tough skills selection 1');
    fireEvent.change(select, { target: { value: 'arcana' } });
    expect(onFeatSelectionChange).toHaveBeenCalledWith(
      featDefinition,
      'tough',
      'skills',
      0,
      'arcana'
    );
    // The disable predicate is consulted while rendering each option.
    expect(optionDisabledForRequirement).toHaveBeenCalled();
  });
});

describe('Dnd5eFeatureOptionsSection', () => {
  const eldritchInvocation = (
    overrides: Partial<Dnd5eFeatureOptionDefinition> = {}
  ): Dnd5eFeatureOptionDefinition => ({
    id: 'agonizing-blast',
    group: 'invocations',
    name: 'Agonizing Blast',
    system: 'dnd-5e-2014',
    source: 'PHB',
    description: 'Add CHA to eldritch blast.',
    classIds: ['warlock'],
    ...overrides,
  });

  const baseProps = {
    featureOptionError: null,
    eligibleFeatureOptions: [] as Dnd5eFeatureOptionDefinition[],
    featureOptionSelections: [] as Dnd5eFeatureOptionSelection[],
    featureOptionsLoaded: true,
    canUpdate: true,
  };

  it('renders the empty state when nothing is selected', () => {
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        selectedFeatureOptions={[]}
        eligibleFeatureOptions={[]}
      />
    );
    expect(screen.getByText('No 5e-2014 feature options selected yet.')).toBeInTheDocument();
  });

  it('lists a selected option with prerequisites and fires remove', async () => {
    const onFeatureOptionRemove = vi.fn();
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        selectedFeatureOptions={[eldritchInvocation({ prerequisites: ['Eldritch Blast cantrip'] })]}
        onFeatureOptionRemove={onFeatureOptionRemove}
      />
    );
    expect(screen.getByText('Agonizing Blast')).toBeInTheDocument();
    expect(screen.getByText('Prerequisites: Eldritch Blast cantrip')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onFeatureOptionRemove).toHaveBeenCalledWith({
      id: 'agonizing-blast',
      group: 'invocations',
    });
  });

  it('surfaces the feature-option error', () => {
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        featureOptionError="Option load failed"
        selectedFeatureOptions={[]}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Option load failed');
  });

  it('renders the lazy option browser when eligible options exist', async () => {
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        selectedFeatureOptions={[]}
        eligibleFeatureOptions={[eldritchInvocation()]}
        onFeatureOptionSelect={vi.fn()}
      />
    );
    // Resolves to the real browser regardless of whether the chunk was preloaded.
    expect(await screen.findByPlaceholderText('Search feature options...')).toBeInTheDocument();
  });

  it('shows the empty-eligible message when loaded with no eligible options', () => {
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        selectedFeatureOptions={[]}
        eligibleFeatureOptions={[]}
      />
    );
    // emptyState copy from documentationCopy renders in the dashed panel.
    expect(
      screen.getByText((_content, element) =>
        element?.className?.includes('border-dashed') ? true : false
      )
    ).toBeInTheDocument();
  });

  it('shows the loading panel before feature options finish loading', () => {
    render(
      <Dnd5eFeatureOptionsSection
        {...baseProps}
        featureOptionsLoaded={false}
        selectedFeatureOptions={[]}
      />
    );
    expect(screen.getByText('Loading feature options...')).toBeInTheDocument();
  });
});

describe('Dnd5eSpellsTab', () => {
  const spell = (id: string, name: string): never =>
    ({
      id,
      name,
      level: 1,
      school: 'evocation',
      castingTime: { type: 'action' },
      range: { type: 'ranged', feet: 120 },
      duration: { type: 'instant' },
      description: `${name} description`,
      classes: ['wizard'],
    }) as never;

  const baseProps = {
    spellsLoaded: false,
    spells: [] as never[],
    spellNames: new Map<string, string>(),
    alwaysPreparedSpellIds: new Set<string>(),
    preparedSpellIds: new Set<string>(),
    preparedCasterSummaries: [],
  };

  it('shows the no-spellcasting message when spellcasting is undefined', () => {
    renderTab('spells', <Dnd5eSpellsTab {...baseProps} spellcasting={undefined} />);
    expect(
      screen.getByText('Select a spellcasting class to unlock spell slots and spell browsing.')
    ).toBeInTheDocument();
  });

  it('renders tracked badge and empty tracked-spell hint for a known caster', () => {
    renderTab(
      'spells',
      <Dnd5eSpellsTab {...baseProps} spellcasting={{ spellsKnown: [], spellsPrepared: [] }} />
    );
    expect(screen.getByText('0 tracked')).toBeInTheDocument();
    expect(
      screen.getByText('No spells selected yet. Use the browser below to add spells.')
    ).toBeInTheDocument();
  });

  it('toggles a prepared spell and enforces the single-caster prepared limit', async () => {
    const onTogglePreparedSpell = vi.fn();
    const fireball = spell('fireball', 'Fireball');
    const shield = spell('shield', 'Shield');
    renderTab(
      'spells',
      <Dnd5eSpellsTab
        {...baseProps}
        spells={[fireball, shield]}
        spellcasting={{
          spellsKnown: ['fireball', 'shield'],
          spellsPrepared: ['fireball'],
        }}
        preparedSpellIds={new Set(['fireball'])}
        preparedCasterSummaries={[
          { className: 'Wizard', ability: 'int', preparedLimit: 1 } as never,
        ]}
        onTogglePreparedSpell={onTogglePreparedSpell}
      />
    );

    // prepared/limit badge for a single prepared caster
    expect(screen.getByText('Prepared Spells 1/1')).toBeInTheDocument();
    // The prepared spell is clickable (to un-prepare).
    await userEvent.click(screen.getByRole('button', { name: 'Fireball' }));
    expect(onTogglePreparedSpell).toHaveBeenCalledWith('fireball');
    // Limit reached => the unprepared spell button is disabled.
    expect(screen.getByRole('button', { name: 'Shield' })).toBeDisabled();
  });

  it('shows the multiclass prepared total badge for multiple prepared casters', () => {
    renderTab(
      'spells',
      <Dnd5eSpellsTab
        {...baseProps}
        spellcasting={{ spellsKnown: [], spellsPrepared: [] }}
        preparedSpellIds={new Set(['a', 'b'])}
        preparedCasterSummaries={[
          { className: 'Cleric', ability: 'wis', preparedLimit: 4 } as never,
          { className: 'Wizard', ability: 'int', preparedLimit: 5 } as never,
        ]}
      />
    );
    expect(screen.getByText('Prepared Spells 2 total')).toBeInTheDocument();
  });

  it('renders always-prepared chips with source, no-source, and unresolved states', () => {
    renderTab(
      'spells',
      <Dnd5eSpellsTab
        {...baseProps}
        spells={[spell('bless', 'Bless'), spell('guidance', 'Guidance')]}
        spellcasting={{
          spellsKnown: [],
          spellsPrepared: [],
          // bless: resolved + source; guidance: resolved + no source; ghost: unresolved.
          alwaysPreparedSpellIds: ['bless', 'guidance', 'ghost-spell'],
        }}
        alwaysPreparedSpellIds={new Set(['bless', 'guidance', 'ghost-spell'])}
        alwaysPreparedSpellSources={[{ spellId: 'bless', source: 'Life Domain' } as never]}
      />
    );
    expect(screen.getByText('Bless')).toBeInTheDocument();
    expect(screen.getByText('Life Domain')).toBeInTheDocument();
    // A resolved always-prepared spell with no source entry renders without a title source.
    expect(screen.getByText('Guidance')).toBeInTheDocument();
    // A spell id not present in the loaded spell list resolves as unresolved.
    expect(screen.getByText('Unresolved')).toBeInTheDocument();
  });

  it('renders the lazy spell browser once spells are loaded', async () => {
    renderTab(
      'spells',
      <Dnd5eSpellsTab
        {...baseProps}
        spellsLoaded
        spells={[spell('fireball', 'Fireball')]}
        spellcasting={{ spellsKnown: ['fireball'], spellsPrepared: [] }}
        onSelectSpell={vi.fn()}
      />
    );
    expect(
      await screen.findByPlaceholderText('Search spells by name or description...')
    ).toBeInTheDocument();
  });
});
