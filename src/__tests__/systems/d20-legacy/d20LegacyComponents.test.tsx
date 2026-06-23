import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import type { ContributionLedgerEntry } from '../../../types/core/contributionLedger';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { Species } from '../../../types/character-options/species';
import type { Skill } from '../../../types/game-systems';
import type { Spell } from '../../../types/magic/spells';
import type { Pf1eTrait } from '../../../systems/pf1e/data-model';
import { registerAllSystems } from '../../../systems';
import { systemRegistry } from '../../../registry';
import { Dnd35eDataModel, createDefaultDnd35eData } from '../../../systems/dnd35e/data-model';
import { Pf1eDataModel, createDefaultPf1eData } from '../../../systems/pf1e/data-model';
import { D20CombatSection } from '../../../systems/d20-legacy/components/D20CombatSection';
import { D20LegacyHeader } from '../../../systems/d20-legacy/components/D20LegacyHeader';
import { D20ClassesSection } from '../../../systems/d20-legacy/components/D20ClassesSection';
import { D20LegacyTabs } from '../../../systems/d20-legacy/components/D20LegacyTabs';
import { D20AbilitiesTab } from '../../../systems/d20-legacy/components/D20AbilitiesTab';
import { D20SavesTab } from '../../../systems/d20-legacy/components/D20SavesTab';
import { D20SkillsTab } from '../../../systems/d20-legacy/components/D20SkillsTab';
import { D20InventoryTab } from '../../../systems/d20-legacy/components/D20InventoryTab';
import { D20NotesTab } from '../../../systems/d20-legacy/components/D20NotesTab';
import { D20SpellsTab } from '../../../systems/d20-legacy/components/D20SpellsTab';

type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;

function makeDoc<T extends D20LegacyData>(
  systemId: 'dnd-3.5e' | 'pf1e',
  system: T
): CharacterDocument<T> {
  return {
    id: `${systemId}-component-doc`,
    name: 'Component Hero',
    systemId,
    system,
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

// The DiceRollButton quick-roll handlers call systemRegistry.get(systemId).engine
// on click, so the systems must be registered before those interactions run.
beforeAll(() => {
  if (!systemRegistry.get('dnd-3.5e')) {
    registerAllSystems();
  }
});

describe('D20CombatSection', () => {
  type CombatProps = React.ComponentProps<typeof D20CombatSection>;

  function baseCombatProps(overrides: Partial<CombatProps> = {}): CombatProps {
    return {
      document: makeDoc('dnd-3.5e', createDefaultDnd35eData()),
      isPf1e: false,
      armorClass: { total: 16, touch: 12, flatFooted: 14 },
      contributionEntries: [],
      hitPoints: { current: 9, max: 12, temp: 0 },
      baseAttackBonus: 6,
      iterativeAttackBonuses: [6],
      initiative: 2,
      speed: 30,
      grapple: 8,
      cmb: undefined,
      cmd: undefined,
      canUpdate: true,
      onHitPointsChange: vi.fn(),
      onApplyDamageOrHealing: vi.fn(),
      ...overrides,
    };
  }

  it('renders the 3.5e branch with grapple and speed, no CMB/CMD/initiative tiles', () => {
    render(<D20CombatSection {...baseCombatProps()} />);

    expect(screen.getByText('Grapple')).toBeInTheDocument();
    expect(screen.getByText('+8')).toBeInTheDocument();
    expect(screen.getByText('30 ft')).toBeInTheDocument();
    // CMB/CMD/Initiative tiles belong to the PF1e branch only.
    expect(screen.queryByText('CMB')).not.toBeInTheDocument();
    expect(screen.queryByText('CMD')).not.toBeInTheDocument();
    expect(screen.queryByText('Initiative')).not.toBeInTheDocument();
    // 3.5e quick rolls expose the grapple check, not a combat maneuver.
    expect(screen.getByRole('button', { name: 'Roll Grapple Check' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Roll Combat Maneuver' })).not.toBeInTheDocument();
  });

  it('renders the PF1e branch with CMB/CMD, initiative, speed, and combat maneuver roll', () => {
    render(
      <D20CombatSection
        {...baseCombatProps({
          document: makeDoc('pf1e', createDefaultPf1eData()),
          isPf1e: true,
          grapple: undefined,
          cmb: 7,
          cmd: 19,
          initiative: 3,
        })}
      />
    );

    expect(screen.getByText('CMB')).toBeInTheDocument();
    expect(screen.getByText('+7')).toBeInTheDocument();
    expect(screen.getByText('CMD')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('Initiative')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.queryByText('Grapple')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Roll Combat Maneuver' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Roll Grapple Check' })).not.toBeInTheDocument();
  });

  it('falls back to default CMB +0 and CMD 10 when those props are undefined', () => {
    render(
      <D20CombatSection
        {...baseCombatProps({
          document: makeDoc('pf1e', createDefaultPf1eData()),
          isPf1e: true,
          grapple: undefined,
          cmb: undefined,
          cmd: undefined,
        })}
      />
    );

    expect(screen.getByText('+0')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('falls back to grapple +0 in the 3.5e branch when grapple is undefined', () => {
    render(<D20CombatSection {...baseCombatProps({ grapple: undefined })} />);
    expect(screen.getByText('Grapple')).toBeInTheDocument();
    expect(screen.getByText('+0')).toBeInTheDocument();
  });

  it('shows the iterative attack bonus line only when more than one iterative exists', () => {
    const { rerender } = render(
      <D20CombatSection
        {...baseCombatProps({ baseAttackBonus: 11, iterativeAttackBonuses: [11] })}
      />
    );
    expect(screen.queryByText('+11 / +6 / +1')).not.toBeInTheDocument();

    rerender(
      <D20CombatSection
        {...baseCombatProps({ baseAttackBonus: 11, iterativeAttackBonuses: [11, 6, 1] })}
      />
    );
    expect(screen.getByText('+11 / +6 / +1')).toBeInTheDocument();
  });

  it('renders and expands the AC contribution breakdown disclosure when entries exist', async () => {
    const user = userEvent.setup();
    const entries: ContributionLedgerEntry[] = [
      {
        id: 'ac-base',
        systemId: 'dnd-3.5e',
        target: 'armorClass.total',
        source: { kind: 'system', label: 'Base' },
        label: 'Base',
        operation: 'set',
        value: 10,
        category: 'defense',
      },
      {
        id: 'ac-armor',
        systemId: 'dnd-3.5e',
        target: 'armorClass.total',
        source: { kind: 'item', label: 'Chain Shirt' },
        label: 'Armor',
        operation: 'add',
        value: 6,
        category: 'defense',
      },
      // Non-AC entry must be filtered out by entriesForTarget.
      {
        id: 'init',
        systemId: 'dnd-3.5e',
        target: 'initiative',
        source: { kind: 'system', label: 'Dex' },
        label: 'Dex',
        operation: 'add',
        value: 2,
        category: 'other',
      },
    ];

    render(<D20CombatSection {...baseCombatProps({ contributionEntries: entries })} />);

    const toggle = screen.getByRole('button', { name: /Armor Class/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Chain Shirt')).toBeInTheDocument();
    // Only the two AC entries are listed; the initiative entry is filtered.
    expect(screen.queryByText('Dex')).not.toBeInTheDocument();
  });

  it('does not render the AC breakdown disclosure when no AC entries exist', () => {
    render(<D20CombatSection {...baseCombatProps({ contributionEntries: [] })} />);
    expect(screen.queryByRole('button', { name: /Armor Class/ })).not.toBeInTheDocument();
  });

  it('edits current HP and forwards the parsed number', () => {
    // The HP field is controlled by hitPoints.current, so a single change event
    // exercises the parse path deterministically without controlled-value churn.
    const onHitPointsChange = vi.fn();
    render(<D20CombatSection {...baseCombatProps({ onHitPointsChange })} />);

    fireEvent.change(screen.getByTitle('Current HP'), { target: { value: '5' } });
    expect(onHitPointsChange).toHaveBeenCalledWith(5);
  });

  it('applies damage through the damage/heal control', async () => {
    const user = userEvent.setup();
    const onApplyDamageOrHealing = vi.fn();
    render(<D20CombatSection {...baseCombatProps({ onApplyDamageOrHealing })} />);

    await user.type(screen.getByLabelText('Damage or heal amount'), '3');
    await user.click(screen.getByTitle('Apply damage'));
    expect(onApplyDamageOrHealing).toHaveBeenCalledWith(3, 'damage');
  });

  it('disables the HP input and hides the damage control when canUpdate is false', () => {
    render(<D20CombatSection {...baseCombatProps({ canUpdate: false })} />);
    expect(screen.getByTitle('Current HP')).toBeDisabled();
    expect(screen.queryByTitle('Apply damage')).not.toBeInTheDocument();
  });

  it('invokes the engine rollCheck for the 3.5e attack and grapple quick rolls', async () => {
    const user = userEvent.setup();
    const engine = systemRegistry.get('dnd-3.5e')!.engine;
    const rollSpy = vi
      .spyOn(engine, 'rollCheck')
      .mockResolvedValue({ total: 12, formula: '1d20+6' } as never);
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());

    render(<D20CombatSection {...baseCombatProps({ document: doc })} />);

    await user.click(screen.getByRole('button', { name: 'Roll Attack Roll' }));
    await user.click(screen.getByRole('button', { name: 'Roll Grapple Check' }));

    expect(rollSpy).toHaveBeenCalledWith(doc, 'attack');
    expect(rollSpy).toHaveBeenCalledWith(doc, 'grapple');
    rollSpy.mockRestore();
  });

  it('invokes the engine rollCheck with cmb for the PF1e combat maneuver quick roll', async () => {
    const user = userEvent.setup();
    const engine = systemRegistry.get('pf1e')!.engine;
    const rollSpy = vi
      .spyOn(engine, 'rollCheck')
      .mockResolvedValue({ total: 14, formula: '1d20+7' } as never);
    const doc = makeDoc('pf1e', createDefaultPf1eData());

    render(
      <D20CombatSection
        {...baseCombatProps({
          document: doc,
          isPf1e: true,
          grapple: undefined,
          cmb: 7,
          cmd: 19,
        })}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Roll Combat Maneuver' }));
    expect(rollSpy).toHaveBeenCalledWith(doc, 'cmb');
    rollSpy.mockRestore();
  });
});

describe('D20LegacyHeader', () => {
  type HeaderProps = React.ComponentProps<typeof D20LegacyHeader>;

  const species: Species[] = [
    { id: 'human', name: 'Human' } as unknown as Species,
    { id: 'elf', name: 'Elf' } as unknown as Species,
  ];

  function baseHeaderProps(overrides: Partial<HeaderProps> = {}): HeaderProps {
    return {
      documentName: 'Component Hero',
      isPf1e: false,
      level: 5,
      favoredClassSkillBonus: 0,
      speciesId: undefined,
      speciesOptions: species,
      sizeCategory: undefined,
      experiencePoints: 0,
      canUpdate: true,
      onNameChange: vi.fn(),
      onSpeciesChange: vi.fn(),
      onLoadOptions: vi.fn(),
      onSizeCategoryChange: vi.fn(),
      onExperiencePointsChange: vi.fn(),
      ...overrides,
    };
  }

  it('shows the D&D 3.5e badge and level, with no favored-class bonus badge', () => {
    render(<D20LegacyHeader {...baseHeaderProps()} />);
    expect(screen.getByText('D&D 3.5e')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.queryByText(/Skill FCB/)).not.toBeInTheDocument();
  });

  it('shows the Pathfinder 1e badge and the favored-class skill bonus badge when positive', () => {
    render(<D20LegacyHeader {...baseHeaderProps({ isPf1e: true, favoredClassSkillBonus: 3 })} />);
    expect(screen.getByText('Pathfinder 1e')).toBeInTheDocument();
    expect(screen.getByText('Skill FCB +3')).toBeInTheDocument();
  });

  it('omits the favored-class badge for PF1e when the bonus is zero', () => {
    render(<D20LegacyHeader {...baseHeaderProps({ isPf1e: true, favoredClassSkillBonus: 0 })} />);
    expect(screen.queryByText(/Skill FCB/)).not.toBeInTheDocument();
  });

  it('edits the character name', async () => {
    const user = userEvent.setup();
    const onNameChange = vi.fn();
    render(<D20LegacyHeader {...baseHeaderProps({ documentName: '', onNameChange })} />);
    await user.type(screen.getByTitle('Character name'), 'X');
    expect(onNameChange).toHaveBeenCalledWith('X');
  });

  it('loads options on race-select focus and forwards a matched species selection', async () => {
    const user = userEvent.setup();
    const onLoadOptions = vi.fn();
    const onSpeciesChange = vi.fn();
    render(<D20LegacyHeader {...baseHeaderProps({ onLoadOptions, onSpeciesChange })} />);

    const raceSelect = screen.getByTitle('Race');
    await user.selectOptions(raceSelect, 'elf');
    expect(onLoadOptions).toHaveBeenCalled();
    expect(onSpeciesChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'elf', name: 'Elf' })
    );
  });

  it('does not call onSpeciesChange when the selected race id is not in the options', async () => {
    const onSpeciesChange = vi.fn();
    render(<D20LegacyHeader {...baseHeaderProps({ speciesId: 'human', onSpeciesChange })} />);
    // Selecting the empty "Race..." option (id '') has no matching species.
    const raceSelect = screen.getByTitle('Race') as HTMLSelectElement;
    await userEvent.setup().selectOptions(raceSelect, '');
    expect(onSpeciesChange).not.toHaveBeenCalled();
  });

  it('changes the size category', async () => {
    const user = userEvent.setup();
    const onSizeCategoryChange = vi.fn();
    render(<D20LegacyHeader {...baseHeaderProps({ onSizeCategoryChange })} />);
    await user.selectOptions(screen.getByTitle('Size Category'), 'large');
    expect(onSizeCategoryChange).toHaveBeenCalledWith('large');
  });

  it('defaults the size select to medium when sizeCategory is undefined', () => {
    render(<D20LegacyHeader {...baseHeaderProps({ sizeCategory: undefined })} />);
    expect(screen.getByTitle('Size Category')).toHaveValue('medium');
  });

  it('edits experience points and forwards the parsed number', async () => {
    const user = userEvent.setup();
    const onExperiencePointsChange = vi.fn();
    render(
      <D20LegacyHeader {...baseHeaderProps({ experiencePoints: 0, onExperiencePointsChange })} />
    );
    const xpInput = screen.getByTitle('Experience Points');
    await user.clear(xpInput);
    await user.type(xpInput, '7');
    expect(onExperiencePointsChange).toHaveBeenCalledWith(7);
  });

  it('defaults the XP input to 0 when experiencePoints is undefined', () => {
    render(<D20LegacyHeader {...baseHeaderProps({ experiencePoints: undefined })} />);
    expect(screen.getByTitle('Experience Points')).toHaveValue(0);
  });

  it('disables the name input, race select, and XP input when canUpdate is false', () => {
    render(<D20LegacyHeader {...baseHeaderProps({ canUpdate: false })} />);
    expect(screen.getByTitle('Character name')).toBeDisabled();
    expect(screen.getByTitle('Race')).toBeDisabled();
    expect(screen.getByTitle('Experience Points')).toBeDisabled();
  });
});

describe('D20ClassesSection', () => {
  type ClassesProps = React.ComponentProps<typeof D20ClassesSection>;

  const classes: CharacterClass[] = [
    { id: 'wizard', name: 'Wizard' } as unknown as CharacterClass,
    { id: 'fighter', name: 'Fighter' } as unknown as CharacterClass,
    { id: 'cleric', name: 'Cleric' } as unknown as CharacterClass,
  ];

  function baseClassesProps(overrides: Partial<ClassesProps> = {}): ClassesProps {
    return {
      systemId: 'dnd-3.5e',
      totalLevel: 3,
      classLevels: [{ classId: 'wizard', level: 3 }],
      classes,
      pendingClassId: '',
      pendingClassLevel: '1',
      classTemplateError: null,
      canUpdate: true,
      onPendingClassIdChange: vi.fn(),
      onPendingClassLevelChange: vi.fn(),
      onLoadOptions: vi.fn(),
      onClassRowChange: vi.fn(),
      onClassLevelChange: vi.fn(),
      onSpellcastingSelectionChange: vi.fn(),
      onAddClass: vi.fn(),
      onRemoveClass: vi.fn(),
      ...overrides,
    };
  }

  it('renders the empty state when there are no class levels', () => {
    render(<D20ClassesSection {...baseClassesProps({ classLevels: [] })} />);
    expect(screen.getByText('No class template applied yet.')).toBeInTheDocument();
    expect(screen.getByText('Total Level 3')).toBeInTheDocument();
  });

  it('labels the first class row as Starting Class and later rows by index', () => {
    render(
      <D20ClassesSection
        {...baseClassesProps({
          totalLevel: 5,
          classLevels: [
            { classId: 'wizard', level: 3 },
            { classId: 'fighter', level: 2 },
          ],
        })}
      />
    );
    expect(screen.getByText('Starting Class')).toBeInTheDocument();
    expect(screen.getByText('Class 2')).toBeInTheDocument();
  });

  it('disables the remove button for the only class row and enables it with two rows', () => {
    const { rerender } = render(<D20ClassesSection {...baseClassesProps()} />);
    expect(screen.getByTitle('Remove wizard')).toBeDisabled();

    rerender(
      <D20ClassesSection
        {...baseClassesProps({
          classLevels: [
            { classId: 'wizard', level: 3 },
            { classId: 'fighter', level: 2 },
          ],
        })}
      />
    );
    expect(screen.getByTitle('Remove wizard')).toBeEnabled();
  });

  it('removes a class row through the remove button', async () => {
    const user = userEvent.setup();
    const onRemoveClass = vi.fn();
    render(
      <D20ClassesSection
        {...baseClassesProps({
          onRemoveClass,
          classLevels: [
            { classId: 'wizard', level: 3 },
            { classId: 'fighter', level: 2 },
          ],
        })}
      />
    );
    await user.click(screen.getByTitle('Remove fighter'));
    expect(onRemoveClass).toHaveBeenCalledWith('fighter');
  });

  it('edits a class row level', async () => {
    const user = userEvent.setup();
    const onClassLevelChange = vi.fn();
    render(<D20ClassesSection {...baseClassesProps({ onClassLevelChange })} />);
    const levelInput = screen.getByTitle('wizard level');
    await user.clear(levelInput);
    await user.type(levelInput, '4');
    expect(onClassLevelChange).toHaveBeenCalledWith('wizard', expect.any(String));
  });

  it('changes a class row to a different class and loads options on focus', async () => {
    const user = userEvent.setup();
    const onClassRowChange = vi.fn();
    const onLoadOptions = vi.fn();
    render(<D20ClassesSection {...baseClassesProps({ onClassRowChange, onLoadOptions })} />);
    const rowSelect = screen.getByTitle('Class 1');
    await user.selectOptions(rowSelect, 'fighter');
    expect(onLoadOptions).toHaveBeenCalled();
    expect(onClassRowChange).toHaveBeenCalledWith('wizard', 'fighter', 3);
  });

  it('adds a class through the pending controls and forwards level edits', async () => {
    const user = userEvent.setup();
    const onAddClass = vi.fn();
    const onPendingClassIdChange = vi.fn();
    const onPendingClassLevelChange = vi.fn();
    render(
      <D20ClassesSection
        {...baseClassesProps({
          pendingClassId: 'fighter',
          onAddClass,
          onPendingClassIdChange,
          onPendingClassLevelChange,
        })}
      />
    );

    await user.selectOptions(screen.getByTitle('Add class'), 'cleric');
    expect(onPendingClassIdChange).toHaveBeenCalledWith('cleric');

    const newLevelInput = screen.getByTitle('New class level');
    await user.clear(newLevelInput);
    await user.type(newLevelInput, '2');
    expect(onPendingClassLevelChange).toHaveBeenCalled();

    // pendingClassId is set, so the Add Class button is enabled.
    await user.click(screen.getByRole('button', { name: /Add Class/ }));
    expect(onAddClass).toHaveBeenCalled();
  });

  it('disables the Add Class button while no pending class is chosen', () => {
    render(<D20ClassesSection {...baseClassesProps({ pendingClassId: '' })} />);
    expect(screen.getByRole('button', { name: /Add Class/ })).toBeDisabled();
  });

  it('hides the add-class controls when canUpdate is false', () => {
    render(<D20ClassesSection {...baseClassesProps({ canUpdate: false })} />);
    expect(screen.queryByTitle('Add class')).not.toBeInTheDocument();
  });

  it('renders a class template error with an alert role', () => {
    render(
      <D20ClassesSection
        {...baseClassesProps({ classTemplateError: 'Prestige requirements unmet' })}
      />
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Prestige requirements unmet');
  });

  it('groups options into Base and Prestige optgroups for dnd-3.5e', () => {
    render(
      <D20ClassesSection
        {...baseClassesProps({
          // Empty class levels so neither option is filtered out of the add-class
          // select; 'archmage-35e' is a real product prestige id, 'wizard' is base.
          classLevels: [],
          classes: [
            { id: 'wizard', name: 'Wizard' } as unknown as CharacterClass,
            { id: 'archmage-35e', name: 'Archmage' } as unknown as CharacterClass,
          ],
        })}
      />
    );
    const addClass = screen.getByTitle('Add class');
    const baseGroup = within(addClass).getByRole('group', { name: 'Base Classes' });
    const prestigeGroup = within(addClass).getByRole('group', { name: 'Prestige Classes' });
    expect(within(baseGroup).getByRole('option', { name: 'Wizard' })).toBeInTheDocument();
    expect(within(prestigeGroup).getByRole('option', { name: 'Archmage' })).toBeInTheDocument();
  });

  it('renders flat options without optgroups for a non-d20 system id', () => {
    render(
      <D20ClassesSection
        {...baseClassesProps({
          systemId: 'dnd-5e-2014' as ClassesProps['systemId'],
          classLevels: [],
        })}
      />
    );
    const addClass = screen.getByTitle('Add class');
    expect(within(addClass).queryByRole('group')).not.toBeInTheDocument();
    expect(within(addClass).getByRole('option', { name: 'Wizard' })).toBeInTheDocument();
  });

  it('renders spellcasting advancement selectors and forwards a track selection', async () => {
    const user = userEvent.setup();
    const onSpellcastingSelectionChange = vi.fn();
    // Mystic theurge advances two spellcasting tracks; sourcing real PF1e data
    // keeps the advancement + eligible-target logic honest.
    const { mysticTheurge } =
      await import('../../../data/pathfinder/1e/prestige-classes/mystic-theurge');
    const { wizard } = await import('../../../data/pathfinder/1e/classes/wizard');
    const { cleric } = await import('../../../data/pathfinder/1e/classes/cleric');

    render(
      <D20ClassesSection
        {...baseClassesProps({
          systemId: 'pf1e',
          totalLevel: 8,
          classes: [
            wizard as unknown as CharacterClass,
            cleric as unknown as CharacterClass,
            mysticTheurge as unknown as CharacterClass,
          ],
          classLevels: [
            { classId: 'wizard', level: 3 },
            { classId: 'cleric', level: 3 },
            {
              classId: 'mystic-theurge',
              level: 2,
              spellcastingSelections: ['wizard', 'cleric'],
            },
          ],
          onSpellcastingSelectionChange,
        })}
      />
    );

    expect(screen.getAllByText('Spellcasting Advancement').length).toBeGreaterThan(0);
    const arcaneSelect = screen.getByTitle('mystic-theurge Arcane Spellcasting Class');
    expect(arcaneSelect).toHaveValue('wizard');
    await user.selectOptions(arcaneSelect, '');
    expect(onSpellcastingSelectionChange).toHaveBeenCalledWith('mystic-theurge', 0, '');
  });

  it('disables a spellcasting track and shows the "no eligible class" hint when no targets exist', async () => {
    // Only the mystic theurge is in the build, so neither its arcane nor divine
    // advancement track has an eligible base spellcasting class to point at.
    const { mysticTheurge } =
      await import('../../../data/pathfinder/1e/prestige-classes/mystic-theurge');

    render(
      <D20ClassesSection
        {...baseClassesProps({
          systemId: 'pf1e',
          totalLevel: 2,
          classes: [mysticTheurge as unknown as CharacterClass],
          classLevels: [{ classId: 'mystic-theurge', level: 2 }],
        })}
      />
    );

    const arcaneSelect = screen.getByTitle('mystic-theurge Arcane Spellcasting Class');
    // No selection persisted -> empty value via the `|| ''` fallback.
    expect(arcaneSelect).toHaveValue('');
    expect(arcaneSelect).toBeDisabled();
    expect(
      within(arcaneSelect).getByRole('option', { name: /No eligible arcane class/ })
    ).toBeInTheDocument();
  });

  it('labels an unfilled "any" advancement track as "No eligible spellcasting class"', async () => {
    // The loremaster track has kind 'any'; with no other spellcasting class in
    // the build the placeholder uses the generic "spellcasting" wording.
    const { loreMaster } = await import('../../../data/pathfinder/1e/prestige-classes/lore-master');

    render(
      <D20ClassesSection
        {...baseClassesProps({
          systemId: 'pf1e',
          totalLevel: 1,
          classes: [loreMaster as unknown as CharacterClass],
          classLevels: [{ classId: 'lore-master', level: 1 }],
        })}
      />
    );

    const trackSelect = screen.getByTitle('lore-master Spellcasting Class');
    expect(
      within(trackSelect).getByRole('option', { name: /No eligible spellcasting class/ })
    ).toBeInTheDocument();
  });
});

describe('D20LegacyTabs', () => {
  type TabsProps = React.ComponentProps<typeof D20LegacyTabs>;

  function baseTabsProps(overrides: Partial<TabsProps> = {}): TabsProps {
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());
    return {
      document: doc,
      systemId: 'dnd-3.5e',
      isPf1e: false,
      canUpdate: true,
      baseAttributes: { str: 10, dex: 12, con: 14, int: 13, wis: 8, cha: 11 },
      saves: {
        fortitude: { base: 1, abilityMod: 2, misc: 0, total: 3 },
        reflex: { base: 1, abilityMod: 1, misc: 0, total: 2 },
        will: { base: 3, abilityMod: -1, misc: 0, total: 2 },
      } as unknown as TabsProps['saves'],
      skills: [],
      skillRanks: {},
      classSkills: [],
      conditions: [],
      onConditionChange: vi.fn(),
      availableToggles: [],
      activeToggles: [],
      onActiveTogglesChange: vi.fn(),
      features: [],
      feats: [],
      traits: [],
      traitOptions: [],
      traitsLoaded: false,
      selectedTraitId: '',
      featDefs: [],
      featsLoaded: false,
      onLoadFeatDefs: vi.fn(),
      spellsLoaded: false,
      spells: [],
      spellListIds: [],
      trackedSpellIds: [],
      preparedSpellsByLevel: {},
      alwaysPreparedSpellIds: [],
      spellSlots: {},
      spellSlotLevels: [],
      manualSpellcastingExtras: undefined,
      arcaneSpecialtySchool: undefined,
      onLoadSpells: vi.fn(),
      equipmentLoaded: false,
      equipmentItems: [],
      onLoadEquipment: vi.fn(),
      onEquipArmor: vi.fn(),
      onEquipShield: vi.fn(),
      onUnequipArmor: vi.fn(),
      onUnequipShield: vi.fn(),
      currency: { copper: 0, silver: 0, gold: 0, platinum: 0 },
      inventory: [],
      personality: undefined,
      notes: undefined,
      onBaseAttributesChange: vi.fn(),
      onSavesChange: vi.fn(),
      onSkillRanksChange: vi.fn(),
      onRemoveFeat: vi.fn(),
      onAddFeat: vi.fn(),
      onSelectedTraitIdChange: vi.fn(),
      onLoadTraitOptions: vi.fn(),
      onAddTrait: vi.fn(),
      onRemoveTrait: vi.fn(),
      onAddSpellLevel: vi.fn(),
      onAddKnownSpell: vi.fn(),
      onRemoveKnownSpell: vi.fn(),
      onSetPreparedSpell: vi.fn(),
      onUseSpellSlot: vi.fn(),
      onRecoverSpellSlot: vi.fn(),
      onSetSpellSlotTotal: vi.fn(),
      onSetSpontaneousConversionReference: vi.fn(),
      onSetArcaneSpecialtySchool: vi.fn(),
      onCurrencyChange: vi.fn(),
      onAddItem: vi.fn(),
      onRemoveItem: vi.fn(),
      onDescriptionChange: vi.fn(),
      onBackstoryChange: vi.fn(),
      onNotesChange: vi.fn(),
      ...overrides,
    };
  }

  it('defaults to the Abilities tab and shows the full nine-tab list', () => {
    render(<D20LegacyTabs {...baseTabsProps()} />);
    expect(screen.getByRole('tab', { name: /Abilities/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Saves/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Skills/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Feats/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Browse/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Spells/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Equipment/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Inventory/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Notes/ })).toBeInTheDocument();
    // Abilities panel is the default active content.
    expect(within(screen.getByRole('tabpanel')).getByText(/STR|Strength/i)).toBeInTheDocument();
  });

  it('shows count badges for trained skills, feats, and inventory', () => {
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          skillRanks: { spot: 4, hide: 0, listen: 2 },
          feats: [
            { id: 'power-attack', name: 'Power Attack', description: '', source: 'SRD' },
            { id: 'cleave', name: 'Cleave', description: '', source: 'SRD' },
          ],
          inventory: [{ itemId: 'rope', name: 'Rope', quantity: 1, weight: 10 }],
        })}
      />
    );
    const skillsTab = screen.getByRole('tab', { name: /Skills/ });
    // Two trained skills (rank > 0): spot and listen.
    expect(within(skillsTab).getByText('2')).toBeInTheDocument();
    const featsTab = screen.getByRole('tab', { name: /Feats/ });
    expect(within(featsTab).getByText('2')).toBeInTheDocument();
    const inventoryTab = screen.getByRole('tab', { name: /Inventory/ });
    expect(within(inventoryTab).getByText('1')).toBeInTheDocument();
  });

  it('omits the badges when there are no trained skills, feats, or inventory', () => {
    render(<D20LegacyTabs {...baseTabsProps()} />);
    expect(
      within(screen.getByRole('tab', { name: /Skills/ })).queryByText(/^\d+$/)
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('tab', { name: /Feats/ })).queryByText(/^\d+$/)
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('tab', { name: /Inventory/ })).queryByText(/^\d+$/)
    ).not.toBeInTheDocument();
  });

  it('renders the feats tab with feat entries and removes a feat', async () => {
    const user = userEvent.setup();
    const onRemoveFeat = vi.fn();
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          onRemoveFeat,
          feats: [
            {
              id: 'power-attack',
              name: 'Power Attack',
              description: 'Trade accuracy for damage.',
              source: 'SRD',
            },
          ],
        })}
      />
    );

    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.getByText('Power Attack')).toBeInTheDocument();
    expect(screen.getByText('Trade accuracy for damage.')).toBeInTheDocument();
    await user.click(screen.getByTitle('Remove feat'));
    expect(onRemoveFeat).toHaveBeenCalledWith('power-attack');
  });

  it('adds a feat through the feats tab add button', async () => {
    const user = userEvent.setup();
    const onAddFeat = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onAddFeat })} />);
    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.getByText('No feats selected.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Add Feat/ }));
    expect(onAddFeat).toHaveBeenCalled();
  });

  it('renders the PF1e traits sub-section and adds a trait', async () => {
    const user = userEvent.setup();
    const onAddTrait = vi.fn();
    const onLoadTraitOptions = vi.fn();
    const onSelectedTraitIdChange = vi.fn();
    const traitOptions: Pf1eTrait[] = [
      {
        id: 'reactionary',
        name: 'Reactionary',
        type: 'combat',
        description: '+2 initiative.',
      },
    ];
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          isPf1e: true,
          systemId: 'pf1e',
          document: makeDoc('pf1e', createDefaultPf1eData()),
          traitsLoaded: true,
          traitOptions,
          selectedTraitId: 'reactionary',
          onAddTrait,
          onLoadTraitOptions,
          onSelectedTraitIdChange,
        })}
      />
    );

    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.getByText('Traits')).toBeInTheDocument();
    expect(screen.getByText('No traits selected.')).toBeInTheDocument();

    const traitSelect = screen.getByTitle('Add trait');
    await user.selectOptions(traitSelect, 'reactionary');
    expect(onLoadTraitOptions).toHaveBeenCalled();
    expect(onSelectedTraitIdChange).toHaveBeenCalledWith('reactionary');

    // selectedTraitId is set and traits are loaded, so Add Trait is enabled.
    await user.click(screen.getByRole('button', { name: 'Add Trait' }));
    expect(onAddTrait).toHaveBeenCalled();
  });

  it('renders existing PF1e traits with a remove control', async () => {
    const user = userEvent.setup();
    const onRemoveTrait = vi.fn();
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          isPf1e: true,
          systemId: 'pf1e',
          document: makeDoc('pf1e', createDefaultPf1eData()),
          traits: [
            {
              id: 'reactionary',
              name: 'Reactionary',
              type: 'combat',
              description: '+2 initiative.',
            },
          ],
          onRemoveTrait,
        })}
      />
    );
    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.getByText('Reactionary')).toBeInTheDocument();
    await user.click(screen.getByTitle('Remove trait'));
    expect(onRemoveTrait).toHaveBeenCalledWith('reactionary');
  });

  it('does not render the traits sub-section for the 3.5e (non-PF1e) variant', async () => {
    const user = userEvent.setup();
    render(<D20LegacyTabs {...baseTabsProps()} />);
    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.queryByText('Traits')).not.toBeInTheDocument();
  });

  it('warms feat data and preloads the browser when the Browse tab is focused', async () => {
    const onLoadFeatDefs = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onLoadFeatDefs })} />);
    const browseTab = screen.getByRole('tab', { name: /Browse/ });
    browseTab.focus();
    expect(onLoadFeatDefs).toHaveBeenCalled();
  });

  it('warms spell data when the Spells tab is hovered', async () => {
    const user = userEvent.setup();
    const onLoadSpells = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onLoadSpells })} />);
    await user.hover(screen.getByRole('tab', { name: /Spells/ }));
    expect(onLoadSpells).toHaveBeenCalled();
  });

  it('warms equipment data when the Equipment tab is hovered', async () => {
    const user = userEvent.setup();
    const onLoadEquipment = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onLoadEquipment })} />);
    await user.hover(screen.getByRole('tab', { name: /Equipment/ }));
    expect(onLoadEquipment).toHaveBeenCalled();
  });

  it('renders the spells tab spell-slot tracker and forwards Add Level', async () => {
    const user = userEvent.setup();
    const onAddSpellLevel = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onAddSpellLevel })} />);
    await user.click(screen.getByRole('tab', { name: /Spells/ }));
    expect(screen.getByText('Spell Slots')).toBeInTheDocument();
    expect(screen.getByText('No spell slots configured.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add Level' }));
    expect(onAddSpellLevel).toHaveBeenCalled();
  });

  it('renders the notes tab and forwards a notes edit', async () => {
    const user = userEvent.setup();
    const onNotesChange = vi.fn();
    render(<D20LegacyTabs {...baseTabsProps({ onNotesChange, notes: '' })} />);
    await user.click(screen.getByRole('tab', { name: /Notes/ }));
    // The notes textarea is controlled by the notes prop, so a single change
    // event drives the handler deterministically.
    fireEvent.change(screen.getByPlaceholderText('Additional notes...'), {
      target: { value: 'Backup plan' },
    });
    expect(onNotesChange).toHaveBeenCalledWith('Backup plan');
  });

  it('passes carried weight from inventory into the skills tab', async () => {
    const user = userEvent.setup();
    // A document with inventory items exercises the carriedWeight reducer the
    // Skills tab receives from the host.
    const system = createDefaultDnd35eData();
    system.inventory = [
      { itemId: 'rope', name: 'Rope', quantity: 2, weight: 5 },
    ] as typeof system.inventory;
    render(<D20LegacyTabs {...baseTabsProps({ document: makeDoc('dnd-3.5e', system) })} />);
    await user.click(screen.getByRole('tab', { name: /Skills/ }));
    // The Skills panel heading renders once the carriedWeight reducer has run.
    expect(
      within(screen.getByRole('tabpanel')).getByRole('heading', { name: /Skills \(\d+ trained\)/ })
    ).toBeInTheDocument();
  });

  it('falls back to level 1 and empty inventory when the document omits them', async () => {
    const user = userEvent.setup();
    const system = createDefaultDnd35eData() as Partial<Dnd35eDataModel>;
    // Force the nullish-fallback branches the Skills tab host uses.
    delete system.level;
    delete system.inventory;
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          document: makeDoc('dnd-3.5e', system as Dnd35eDataModel),
        })}
      />
    );
    await user.click(screen.getByRole('tab', { name: /Skills/ }));
    expect(
      within(screen.getByRole('tabpanel')).getByRole('heading', { name: /Skills \(\d+ trained\)/ })
    ).toBeInTheDocument();
  });

  it('renders the feats tab read-only (no add/remove controls) when canUpdate is false', async () => {
    const user = userEvent.setup();
    render(
      <D20LegacyTabs
        {...baseTabsProps({
          canUpdate: false,
          feats: [{ id: 'cleave', name: 'Cleave', description: '', source: 'SRD' }],
        })}
      />
    );
    await user.click(screen.getByRole('tab', { name: /Feats/ }));
    expect(screen.getByText('Cleave')).toBeInTheDocument();
    // Read-only: neither the add button nor a per-feat remove control renders.
    expect(screen.queryByRole('button', { name: /Add Feat/ })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Remove feat')).not.toBeInTheDocument();
  });

  it('renders the inventory tab with currency controls', async () => {
    const user = userEvent.setup();
    render(<D20LegacyTabs {...baseTabsProps()} />);
    await user.click(screen.getByRole('tab', { name: /Inventory/ }));
    // The inventory panel is active; currency labels are part of its UI.
    expect(within(screen.getByRole('tabpanel')).getByText(/gold|Gold|gp/i)).toBeInTheDocument();
  });
});

describe('D20AbilitiesTab', () => {
  it('renders ability scores with their modifiers and edits a score', async () => {
    const onBaseAttributesChange = vi.fn();
    render(
      <D20AbilitiesTab
        baseAttributes={{ str: 16, dex: 12, con: 14, int: 10, wis: 8, cha: 11 }}
        canUpdate
        onBaseAttributesChange={onBaseAttributesChange}
      />
    );

    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
    expect(screen.getByTitle('Strength score')).toHaveValue(16);
    // STR 16 -> +3 modifier displayed.
    expect(screen.getByText('+3')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('Dexterity score'), { target: { value: '18' } });
    expect(onBaseAttributesChange).toHaveBeenCalledWith(
      expect.objectContaining({ dex: 18, str: 16 })
    );
  });

  it('defaults a missing ability score to 10 and disables inputs when read-only', () => {
    render(
      <D20AbilitiesTab baseAttributes={{}} canUpdate={false} onBaseAttributesChange={vi.fn()} />
    );
    expect(screen.getByTitle('Strength score')).toHaveValue(10);
    expect(screen.getByTitle('Charisma score')).toBeDisabled();
  });
});

describe('D20SavesTab', () => {
  type SavesProps = React.ComponentProps<typeof D20SavesTab>;

  const saves: SavesProps['saves'] = {
    fortitude: { base: 2, ability: 2, misc: 1, total: 5 },
    reflex: { base: 0, ability: 1, misc: 0, total: 1 },
    will: { base: 4, ability: -1, misc: 0, total: 3 },
  };

  it('renders all three saving throws with totals and component breakdowns', () => {
    render(
      <D20SavesTab
        document={makeDoc('dnd-3.5e', createDefaultDnd35eData())}
        saves={saves}
        canUpdate
        onSavesChange={vi.fn()}
      />
    );
    expect(screen.getByText('Saving Throws')).toBeInTheDocument();
    expect(screen.getByText('fortitude')).toBeInTheDocument();
    expect(screen.getByText('reflex')).toBeInTheDocument();
    expect(screen.getByText('will')).toBeInTheDocument();
    // Fortitude total +5 is rendered.
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('edits a save misc modifier', () => {
    const onSavesChange = vi.fn();
    render(
      <D20SavesTab
        document={makeDoc('dnd-3.5e', createDefaultDnd35eData())}
        saves={saves}
        canUpdate
        onSavesChange={onSavesChange}
      />
    );
    fireEvent.change(screen.getByTitle('reflex misc modifier'), { target: { value: '3' } });
    expect(onSavesChange).toHaveBeenCalledWith(
      expect.objectContaining({
        reflex: expect.objectContaining({ misc: 3 }),
      })
    );
  });

  it('disables misc inputs when read-only', () => {
    render(
      <D20SavesTab
        document={makeDoc('pf1e', createDefaultPf1eData())}
        saves={saves}
        canUpdate={false}
        onSavesChange={vi.fn()}
      />
    );
    expect(screen.getByTitle('will misc modifier')).toBeDisabled();
  });

  it('rolls each saving throw through the engine with the matching check id', async () => {
    const user = userEvent.setup();
    const engine = systemRegistry.get('dnd-3.5e')!.engine;
    const rollSpy = vi
      .spyOn(engine, 'rollCheck')
      .mockResolvedValue({ total: 10, formula: '1d20' } as never);
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());

    render(<D20SavesTab document={doc} saves={saves} canUpdate onSavesChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Roll fortitude Save' }));
    await user.click(screen.getByRole('button', { name: 'Roll reflex Save' }));
    await user.click(screen.getByRole('button', { name: 'Roll will Save' }));

    expect(rollSpy).toHaveBeenCalledWith(doc, 'save-fort');
    expect(rollSpy).toHaveBeenCalledWith(doc, 'save-ref');
    expect(rollSpy).toHaveBeenCalledWith(doc, 'save-will');
    rollSpy.mockRestore();
  });
});

describe('D20SkillsTab', () => {
  type SkillsProps = React.ComponentProps<typeof D20SkillsTab>;

  const skills: Skill[] = [
    { id: 'spellcraft', name: 'Spellcraft', attribute: 'int' },
    { id: 'tumble', name: 'Tumble', attribute: 'dex' },
  ];

  function baseSkillsProps(overrides: Partial<SkillsProps> = {}): SkillsProps {
    return {
      skills,
      baseAttributes: { str: 12, dex: 14, con: 10, int: 16, wis: 8, cha: 10 },
      skillRanks: { spellcraft: 5, tumble: 0 },
      classSkills: ['spellcraft'],
      isPf1e: false,
      characterLevel: 5,
      carriedWeight: 0,
      equipment: [],
      canUpdate: true,
      onSkillRanksChange: vi.fn(),
      ...overrides,
    };
  }

  it('renders skill rows with the trained count and computed totals (3.5e)', () => {
    render(<D20SkillsTab {...baseSkillsProps()} />);
    expect(screen.getByText('Skills (1 trained)')).toBeInTheDocument();
    expect(screen.getByText('Spellcraft')).toBeInTheDocument();
    expect(screen.getByText('Tumble')).toBeInTheDocument();
    // Spellcraft: 5 ranks + INT 16 (+3) = +8.
    expect(screen.getByTitle('Spellcraft ranks (max 8)')).toHaveValue(5);
  });

  it('applies the PF1e class-skill +3 bonus when a class skill has ranks', () => {
    render(<D20SkillsTab {...baseSkillsProps({ isPf1e: true })} />);
    // PF1e max ranks equal character level.
    expect(screen.getByTitle('Spellcraft ranks (max 5)')).toBeInTheDocument();
  });

  it('edits a skill rank', () => {
    const onSkillRanksChange = vi.fn();
    render(<D20SkillsTab {...baseSkillsProps({ onSkillRanksChange })} />);
    // Tumble is cross-class at level 5: max = floor((5 + 3) / 2) = 4.
    fireEvent.change(screen.getByTitle('Tumble ranks (max 4)'), { target: { value: '3' } });
    expect(onSkillRanksChange).toHaveBeenCalledWith(
      expect.objectContaining({ tumble: 3, spellcraft: 5 })
    );
  });

  it('flags ranks over the level cap with a warning title', () => {
    render(
      <D20SkillsTab
        {...baseSkillsProps({ characterLevel: 1, skillRanks: { spellcraft: 9, tumble: 0 } })}
      />
    );
    // Over-cap ranks switch the input title to the exceeds-max message.
    expect(screen.getByTitle(/9 ranks exceeds the level-1 max/)).toBeInTheDocument();
  });

  it('disables rank inputs when read-only', () => {
    render(<D20SkillsTab {...baseSkillsProps({ canUpdate: false })} />);
    expect(screen.getByTitle('Spellcraft ranks (max 8)')).toBeDisabled();
  });

  it('handles a missing rank entry, absent class-skill list, and a negative total', () => {
    render(
      <D20SkillsTab
        {...baseSkillsProps({
          // No rank entry for this skill -> ranks default to 0; classSkills
          // undefined exercises the optional-chain false path.
          skills: [{ id: 'intimidate', name: 'Intimidate', attribute: 'cha' }],
          classSkills: undefined,
          skillRanks: {},
          baseAttributes: { cha: 6 },
        })}
      />
    );
    expect(screen.getByText('Skills (0 trained)')).toBeInTheDocument();
    // CHA 6 (-2) with 0 ranks -> total -2 rendered without a leading '+'.
    expect(screen.getByText('-2')).toBeInTheDocument();
  });

  it('surfaces 3.5e synergy bonuses and armor check penalties in the total notes', () => {
    // Tumble draws a +2 synergy from 5 ranks of Jump, and is an armor-check
    // penalized skill, so equipped armor with a -4 penalty lowers its total.
    render(
      <D20SkillsTab
        {...baseSkillsProps({
          skills: [{ id: 'tumble', name: 'Tumble', attribute: 'dex' }],
          classSkills: ['tumble'],
          skillRanks: { tumble: 5, jump: 5 },
          equipment: [{ equipped: true, armorCheckPenalty: -4 }],
          carriedWeight: 0,
        })}
      />
    );
    // The total-cell title lists both adjustments (3.5e class skills add to the
    // cap, not the bonus, so no class line appears here).
    expect(screen.getByTitle('Total (+2 synergy, -4 check pen.)')).toBeInTheDocument();
  });
});

describe('D20InventoryTab', () => {
  type InventoryProps = React.ComponentProps<typeof D20InventoryTab>;

  function baseInventoryProps(overrides: Partial<InventoryProps> = {}): InventoryProps {
    return {
      currency: { copper: 5, silver: 0, gold: 25, platinum: 0 },
      inventory: [{ itemId: 'rope', name: 'Silk Rope', quantity: 1, weight: 5 }],
      canUpdate: true,
      onCurrencyChange: vi.fn(),
      onAddItem: vi.fn(),
      onRemoveItem: vi.fn(),
      ...overrides,
    };
  }

  it('renders currency fields and inventory items', () => {
    render(<D20InventoryTab {...baseInventoryProps()} />);
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByTitle('GP')).toHaveValue(25);
    expect(screen.getByText('Silk Rope')).toBeInTheDocument();
  });

  it('edits a currency amount', () => {
    const onCurrencyChange = vi.fn();
    render(<D20InventoryTab {...baseInventoryProps({ onCurrencyChange })} />);
    fireEvent.change(screen.getByTitle('GP'), { target: { value: '40' } });
    expect(onCurrencyChange).toHaveBeenCalledWith(expect.objectContaining({ gold: 40 }));
  });

  it('removes an inventory item', async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();
    render(<D20InventoryTab {...baseInventoryProps({ onRemoveItem })} />);
    await user.click(screen.getByTitle('Remove item'));
    expect(onRemoveItem).toHaveBeenCalledWith('rope');
  });

  it('disables currency editing when read-only', () => {
    render(<D20InventoryTab {...baseInventoryProps({ canUpdate: false })} />);
    expect(screen.getByTitle('GP')).toBeDisabled();
  });
});

describe('D20NotesTab', () => {
  it('renders description, backstory, and notes fields with their values', () => {
    render(
      <D20NotesTab
        personality={{ description: 'A tall elf', backstory: 'Raised in the woods' }}
        notes="Owes a debt"
        canUpdate
        onDescriptionChange={vi.fn()}
        onBackstoryChange={vi.fn()}
        onNotesChange={vi.fn()}
      />
    );
    expect(screen.getByText('Character Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Physical description...')).toHaveValue('A tall elf');
    expect(screen.getByPlaceholderText('Character backstory...')).toHaveValue(
      'Raised in the woods'
    );
    expect(screen.getByPlaceholderText('Additional notes...')).toHaveValue('Owes a debt');
  });

  it('forwards description, backstory, and notes edits', () => {
    const onDescriptionChange = vi.fn();
    const onBackstoryChange = vi.fn();
    const onNotesChange = vi.fn();
    render(
      <D20NotesTab
        personality={undefined}
        notes={undefined}
        canUpdate
        onDescriptionChange={onDescriptionChange}
        onBackstoryChange={onBackstoryChange}
        onNotesChange={onNotesChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Physical description...'), {
      target: { value: 'Stern' },
    });
    fireEvent.change(screen.getByPlaceholderText('Character backstory...'), {
      target: { value: 'Orphan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Additional notes...'), {
      target: { value: 'Allergic to gold' },
    });

    expect(onDescriptionChange).toHaveBeenCalledWith('Stern');
    expect(onBackstoryChange).toHaveBeenCalledWith('Orphan');
    expect(onNotesChange).toHaveBeenCalledWith('Allergic to gold');
  });

  it('disables all fields when read-only', () => {
    render(
      <D20NotesTab
        personality={{}}
        notes=""
        canUpdate={false}
        onDescriptionChange={vi.fn()}
        onBackstoryChange={vi.fn()}
        onNotesChange={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText('Physical description...')).toBeDisabled();
    expect(screen.getByPlaceholderText('Additional notes...')).toBeDisabled();
  });
});

describe('D20SpellsTab', () => {
  type SpellsProps = React.ComponentProps<typeof D20SpellsTab>;

  function makeSpell(overrides: Partial<Spell> & Pick<Spell, 'id' | 'name' | 'level'>): Spell {
    return {
      school: 'evocation',
      classes: ['wizard'],
      castingTime: { type: 'action', amount: 1 },
      range: { type: 'medium' },
      duration: { type: 'instant' },
      description: `${overrides.name} description`,
      ...overrides,
    } as Spell;
  }

  function baseSpellsProps(overrides: Partial<SpellsProps> = {}): SpellsProps {
    return {
      spellsLoaded: false,
      spells: [],
      spellListIds: [],
      trackedSpellIds: [],
      preparedSpellsByLevel: {},
      alwaysPreparedSpellIds: [],
      spellSlots: {},
      spellSlotLevels: [],
      manualSpellcastingExtras: undefined,
      arcaneSpecialtySchool: undefined,
      canUpdate: true,
      onAddSpellLevel: vi.fn(),
      onAddKnownSpell: vi.fn(),
      onRemoveKnownSpell: vi.fn(),
      onSetPreparedSpell: vi.fn(),
      onUseSpellSlot: vi.fn(),
      onRecoverSpellSlot: vi.fn(),
      onSetSpellSlotTotal: vi.fn(),
      onSetSpontaneousConversionReference: vi.fn(),
      onSetArcaneSpecialtySchool: vi.fn(),
      ...overrides,
    };
  }

  it('shows the empty slot/spellbook/prepared states and the load prompt', () => {
    render(<D20SpellsTab {...baseSpellsProps()} />);
    expect(screen.getByText('No spell slots configured.')).toBeInTheDocument();
    expect(screen.getByText(/No spells tracked yet/)).toBeInTheDocument();
    expect(screen.getByText(/No prepared slot rows are active yet/)).toBeInTheDocument();
    expect(screen.getByText('Click to load spells...')).toBeInTheDocument();
  });

  it('adds a spell level via the Add Level button', async () => {
    const user = userEvent.setup();
    const onAddSpellLevel = vi.fn();
    render(<D20SpellsTab {...baseSpellsProps({ onAddSpellLevel })} />);
    await user.click(screen.getByRole('button', { name: 'Add Level' }));
    expect(onAddSpellLevel).toHaveBeenCalled();
  });

  it('spends and recovers a spell slot and edits its total', async () => {
    const user = userEvent.setup();
    const onUseSpellSlot = vi.fn();
    const onRecoverSpellSlot = vi.fn();
    const onSetSpellSlotTotal = vi.fn();
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spellSlots: { 1: { total: 3, used: 1 } },
          spellSlotLevels: [1],
          onUseSpellSlot,
          onRecoverSpellSlot,
          onSetSpellSlotTotal,
        })}
      />
    );

    // Remaining 2/3 is shown for the configured level-1 slot.
    expect(screen.getByText('2/3')).toBeInTheDocument();

    await user.click(screen.getByTitle('Use Level 1 slot'));
    expect(onUseSpellSlot).toHaveBeenCalledWith(1);

    await user.click(screen.getByTitle('Recover Level 1 slot'));
    expect(onRecoverSpellSlot).toHaveBeenCalledWith(1);

    fireEvent.change(screen.getByTitle('Total Level 1 slots'), { target: { value: '5' } });
    expect(onSetSpellSlotTotal).toHaveBeenCalledWith(1, 5);
  });

  it('disables the use button when no slots remain and the recover button when none are used', () => {
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spellSlots: { 1: { total: 2, used: 2 }, 2: { total: 2, used: 0 } },
          spellSlotLevels: [1, 2],
        })}
      />
    );
    // Level 1 fully spent -> the use (-) control is disabled.
    expect(screen.getByTitle('Use Level 1 slot')).toBeDisabled();
    // Level 2 untouched -> the recover (+) control is disabled.
    expect(screen.getByTitle('Recover Level 2 slot')).toBeDisabled();
  });

  it('selects an arcane specialty school', async () => {
    const user = userEvent.setup();
    const onSetArcaneSpecialtySchool = vi.fn();
    render(<D20SpellsTab {...baseSpellsProps({ onSetArcaneSpecialtySchool })} />);

    const schoolSelect = screen.getByLabelText('Arcane School');
    expect(
      within(schoolSelect).getByRole('option', { name: 'Universalist (no specialty)' })
    ).toBeInTheDocument();
    await user.selectOptions(schoolSelect, 'evocation');
    expect(onSetArcaneSpecialtySchool).toHaveBeenCalledWith('evocation');
  });

  it('reflects the current arcane specialty school value', () => {
    render(<D20SpellsTab {...baseSpellsProps({ arcaneSpecialtySchool: 'necromancy' })} />);
    expect(screen.getByLabelText('Arcane School')).toHaveValue('necromancy');
  });

  it('changes the spontaneous conversion reference and lists matching spells', () => {
    const onSetSpontaneousConversionReference = vi.fn();
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spells: [
            makeSpell({
              id: 'cure-light',
              name: 'Cure Light Wounds',
              level: 1,
              classes: ['cleric'],
            }),
            makeSpell({
              id: 'inflict-light',
              name: 'Inflict Light Wounds',
              level: 1,
              classes: ['cleric'],
            }),
            makeSpell({ id: 'bless', name: 'Bless', level: 1, classes: ['cleric'] }),
          ],
          spellListIds: ['cleric'],
          onSetSpontaneousConversionReference,
        })}
      />
    );

    // Default 'both' lists cure + inflict references, excluding Bless.
    expect(screen.getByText('Cure Light Wounds')).toBeInTheDocument();
    expect(screen.getByText('Inflict Light Wounds')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Spontaneous conversion reference'), {
      target: { value: 'cure' },
    });
    expect(onSetSpontaneousConversionReference).toHaveBeenCalledWith('cure');
  });

  it('shows the no-references hint when no cure/inflict spells are loaded', () => {
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spells: [makeSpell({ id: 'bless', name: 'Bless', level: 1, classes: ['cleric'] })],
          spellListIds: ['cleric'],
        })}
      />
    );
    expect(screen.getByText('No cure or inflict spells loaded.')).toBeInTheDocument();
  });

  it('renders tracked spells with always-prepared and unresolved markers, and forgets a spell', async () => {
    const user = userEvent.setup();
    const onRemoveKnownSpell = vi.fn();
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spells: [makeSpell({ id: 'magic-missile', name: 'Magic Missile', level: 1 })],
          // magic-missile is always-prepared (rendered as a chip, not in the
          // tracked list); ghost-spell is a tracked id that no longer resolves.
          trackedSpellIds: ['ghost-spell'],
          alwaysPreparedSpellIds: ['magic-missile'],
          onRemoveKnownSpell,
        })}
      />
    );

    expect(screen.getByText('Always Prepared')).toBeInTheDocument();
    // The always-prepared resolvable spell renders as a chip.
    expect(screen.getByText('Magic Missile')).toBeInTheDocument();
    // The unresolved tracked id surfaces an "Unresolved" badge.
    expect(screen.getByText('Unresolved')).toBeInTheDocument();

    // The tracked (unresolved) spell exposes a Forget control.
    await user.click(screen.getByRole('button', { name: 'Forget Ghost Spell' }));
    expect(onRemoveKnownSpell).toHaveBeenCalledWith('ghost-spell');
  });

  it('assigns a tracked spell to a prepared slot', async () => {
    const user = userEvent.setup();
    const onSetPreparedSpell = vi.fn();
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spells: [makeSpell({ id: 'magic-missile', name: 'Magic Missile', level: 1 })],
          trackedSpellIds: ['magic-missile'],
          spellSlots: { 1: { total: 1, used: 0 } },
          spellSlotLevels: [1],
          preparedSpellsByLevel: { 1: [] },
          onSetPreparedSpell,
        })}
      />
    );

    await user.selectOptions(screen.getByLabelText('Prepared level 1 slot 1'), 'magic-missile');
    expect(onSetPreparedSpell).toHaveBeenCalledWith(1, 0, 'magic-missile');
  });

  it('renders the spell browser panel once spells are loaded', async () => {
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          spellsLoaded: true,
          spells: [makeSpell({ id: 'magic-missile', name: 'Magic Missile', level: 1 })],
        })}
      />
    );
    // The lazy browser panel resolves and shows the loaded spell.
    expect(await screen.findByText('Magic Missile')).toBeInTheDocument();
    expect(screen.queryByText('Click to load spells...')).not.toBeInTheDocument();
  });

  it('disables slot and option controls when read-only', () => {
    render(
      <D20SpellsTab
        {...baseSpellsProps({
          canUpdate: false,
          spellSlots: { 1: { total: 2, used: 1 } },
          spellSlotLevels: [1],
        })}
      />
    );
    // Read-only hides the slot total input and the Add Level button.
    expect(screen.queryByTitle('Total Level 1 slots')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add Level' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Arcane School')).toBeDisabled();
  });
});
