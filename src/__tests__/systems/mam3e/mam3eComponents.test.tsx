import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import type { Advantage } from '../../../types/mam/advantages';
import type { Item } from '../../../types/equipment/items';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import type { PowerModifier } from '../../../types/mam/powerModifiers';
import type { Power } from '../../../types/mam/powers';
import type { Complication } from '../../../data/mutants-and-masterminds/3e/complications';
import type { ContributionLedgerEntry } from '../../../types/core/contributionLedger';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { MamAbilitiesTab } from '../../../systems/mam3e/components/MamAbilitiesTab';
import { MamAdvantageBrowserTab } from '../../../systems/mam3e/components/MamAdvantageBrowserTab';
import { MamArchetypesTab } from '../../../systems/mam3e/components/MamArchetypesTab';
import { MamComplicationsTab } from '../../../systems/mam3e/components/MamComplicationsTab';
import { MamConditionsTab } from '../../../systems/mam3e/components/MamConditionsTab';
import { MamEquipmentBrowserTab } from '../../../systems/mam3e/components/MamEquipmentBrowserTab';
import { MamHeader } from '../../../systems/mam3e/components/MamHeader';
import { MamNotesTab } from '../../../systems/mam3e/components/MamNotesTab';
import { MamPowerBrowserTab } from '../../../systems/mam3e/components/MamPowerBrowserTab';
import { MamPowersTab } from '../../../systems/mam3e/components/MamPowersTab';
import { MamResourceLoadError } from '../../../systems/mam3e/components/MamResourceLoadError';
import { MamSkillsAdvantagesTab } from '../../../systems/mam3e/components/MamSkillsAdvantagesTab';

function makeMam3eDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'mam3e-doc',
    name: 'Test Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
  };
}

function makePower(overrides: Partial<Power> = {}): Power {
  return {
    id: 'power-1',
    name: 'Blast',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'ranged',
    duration: 'instant',
    baseCost: 2,
    perRank: true,
    rank: 5,
    description: 'A ranged energy blast.',
    extras: [],
    flaws: [],
    modifierRanks: {},
    effects: ['Damage'],
    ...overrides,
  };
}

function makeModifier(overrides: Partial<PowerModifier> = {}): PowerModifier {
  return {
    id: 'accurate',
    name: 'Accurate',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'extra',
    costPerRank: 1,
    description: 'Improves attack accuracy.',
    effects: [],
    ...overrides,
  };
}

function makeAdvantage(overrides: Partial<Advantage> = {}): Advantage {
  return {
    id: 'assessment',
    name: 'Assessment',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Size up an opponent.',
    benefit: 'Compare your combat capabilities to a foe.',
    ...overrides,
  };
}

function makeArchetype(overrides: Partial<Mam3eArchetype> = {}): Mam3eArchetype {
  return {
    id: 'mam3e-battlesuit',
    name: 'Battlesuit',
    system: 'mam3e',
    source: "Hero's Handbook",
    description: 'A powered-armor hero.',
    suggestedSkills: [],
    features: [],
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MamResourceLoadError', () => {
  it('renders the failure message and fires retry when a handler is provided', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<MamResourceLoadError resourceLabel="the M&M power catalog" onRetry={onRetry} />);

    expect(screen.getByText(/Failed to load the M&M power catalog/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the retry button when no handler is provided', () => {
    render(<MamResourceLoadError resourceLabel="the M&M power catalog" />);

    expect(screen.getByText(/Failed to load the M&M power catalog/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });
});

describe('MamHeader', () => {
  function renderHeader(overrides?: {
    data?: Partial<Mam3eDataModel>;
    props?: Partial<React.ComponentProps<typeof MamHeader>>;
    img?: string;
  }) {
    const onNameChange = vi.fn();
    const onPowerLevelChange = vi.fn();
    const onTotalPowerPointsChange = vi.fn();
    const document = makeMam3eDoc(overrides?.data);
    if (overrides?.img) {
      document.img = overrides.img;
    }
    render(
      <MamHeader
        document={document}
        canUpdate
        ppSpent={50}
        ppOver={false}
        onNameChange={onNameChange}
        onPowerLevelChange={onPowerLevelChange}
        onTotalPowerPointsChange={onTotalPowerPointsChange}
        {...overrides?.props}
      />
    );
    return { onNameChange, onPowerLevelChange, onTotalPowerPointsChange };
  }

  it('shows the Zap fallback icon and forwards name, power level, and total PP edits', async () => {
    const user = userEvent.setup();
    const handlers = renderHeader();

    expect(screen.getByText('50 / 150')).toBeInTheDocument();

    await user.type(screen.getByTitle('Character name'), '!');
    expect(handlers.onNameChange).toHaveBeenCalled();

    const plInput = screen.getByTitle('Power level');
    await user.clear(plInput);
    await user.type(plInput, '12');
    expect(handlers.onPowerLevelChange).toHaveBeenCalled();

    const totalInput = screen.getByTitle('Total power points');
    await user.clear(totalInput);
    await user.type(totalInput, '180');
    expect(handlers.onTotalPowerPointsChange).toHaveBeenCalled();
  });

  it('renders the character image when one is set', () => {
    renderHeader({ img: 'https://example.com/hero.png' });
    const image = screen.getByRole('img', { name: 'Test Hero' });
    expect(image).toHaveAttribute('src', 'https://example.com/hero.png');
  });

  it('surfaces the over-budget warning and PL violations', () => {
    renderHeader({
      props: { ppSpent: 170, ppOver: true },
      data: {
        plViolations: [{ label: 'Toughness + Dodge', value: 22, limit: 20 }],
      },
    });

    expect(screen.getByText(/Over budget by 20/i)).toBeInTheDocument();
    expect(screen.getByText(/Toughness \+ Dodge: 22 exceeds 20/i)).toBeInTheDocument();
  });
});

describe('MamAbilitiesTab', () => {
  it('forwards ability and defense rank edits with the right keys', () => {
    const onAbilityChange =
      vi.fn<(ability: keyof Mam3eDataModel['abilities'], value: number) => void>();
    const onDefenseRankChange =
      vi.fn<(defense: keyof Mam3eDataModel['defenses'], value: number) => void>();
    const document = makeMam3eDoc({
      abilities: {
        str: 3,
        sta: 0,
        agi: 0,
        dex: 0,
        fgt: 0,
        int: 0,
        awe: 0,
        pre: 0,
      },
    });

    render(
      <MamAbilitiesTab
        document={document}
        canUpdate
        onAbilityChange={onAbilityChange}
        onDefenseRankChange={onDefenseRankChange}
      />
    );

    // The STR PP helper line reflects rank * 2.
    expect(screen.getByText('6 PP')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('STR rank'), { target: { value: '4' } });
    expect(onAbilityChange).toHaveBeenCalledWith('str', 4);

    // The Dodge defense row groups its label and rank input in one flex row.
    const dodgeRow = screen.getByText('Dodge').closest('div');
    const dodgeInput = within(dodgeRow as HTMLElement).getByRole('spinbutton');
    fireEvent.change(dodgeInput, { target: { value: '5' } });
    expect(onDefenseRankChange).toHaveBeenCalledWith('dodge', 5);
  });
});

describe('MamConditionsTab', () => {
  const baseTrack: Mam3eDataModel['conditionTrack'] = {
    bruised: 0,
    dazed: false,
    staggered: false,
    incapacitated: false,
  };

  it('drives bruised steppers, condition toggles, reset, and toughness failures', async () => {
    const user = userEvent.setup();
    const onConditionTrackChange = vi.fn();
    const onReset = vi.fn();
    const onApplyToughnessFailure = vi.fn();

    render(
      <MamConditionsTab
        conditionTrack={{ ...baseTrack, bruised: 2 }}
        canUpdate
        onConditionTrackChange={onConditionTrackChange}
        onReset={onReset}
        onApplyToughnessFailure={onApplyToughnessFailure}
      />
    );

    await user.click(screen.getByTitle('Add bruised'));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ bruised: 3 });

    await user.click(screen.getByTitle('Reduce bruised'));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ bruised: 1 });

    // The toggle button's accessible name combines the label and state text,
    // which disambiguates it from the "Fail by..." preset buttons.
    await user.click(screen.getByRole('button', { name: 'Dazed Inactive' }));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ dazed: true });

    await user.click(screen.getByRole('button', { name: 'Staggered Inactive' }));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ staggered: true });

    await user.click(screen.getByRole('button', { name: 'Incapacitated Inactive' }));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ incapacitated: true });

    await user.click(screen.getByRole('button', { name: /Reset/i }));
    expect(onReset).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Fail by 1-4: +1 Bruised'));
    expect(onApplyToughnessFailure).toHaveBeenCalledWith(2);

    await user.click(screen.getByText('Fail by 5-9: +1 Bruised, Dazed'));
    expect(onApplyToughnessFailure).toHaveBeenCalledWith(7);

    await user.click(screen.getByText('Fail by 10-14: +1 Bruised, Staggered'));
    expect(onApplyToughnessFailure).toHaveBeenCalledWith(12);

    await user.click(screen.getByText('Fail by 15+: Incapacitated'));
    expect(onApplyToughnessFailure).toHaveBeenCalledWith(16);
  });

  it('clamps bruised at zero when reducing', async () => {
    const user = userEvent.setup();
    const onConditionTrackChange = vi.fn();

    render(
      <MamConditionsTab
        conditionTrack={baseTrack}
        canUpdate
        onConditionTrackChange={onConditionTrackChange}
        onReset={vi.fn()}
        onApplyToughnessFailure={vi.fn()}
      />
    );

    await user.click(screen.getByTitle('Reduce bruised'));
    expect(onConditionTrackChange).toHaveBeenCalledWith({ bruised: 0 });
  });

  it('renders active condition states and hides controls when read-only', () => {
    render(
      <MamConditionsTab
        conditionTrack={{ bruised: 1, dazed: true, staggered: false, incapacitated: true }}
        canUpdate={false}
        onConditionTrackChange={vi.fn()}
        onReset={vi.fn()}
        onApplyToughnessFailure={vi.fn()}
      />
    );

    // Two conditions are active (dazed + incapacitated).
    expect(screen.getAllByText('Active')).toHaveLength(2);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Add bruised')).not.toBeInTheDocument();
  });
});

describe('MamNotesTab', () => {
  it('forwards notes edits', async () => {
    const user = userEvent.setup();
    const onNotesChange = vi.fn();

    render(<MamNotesTab notes="" canUpdate onNotesChange={onNotesChange} />);

    await user.type(screen.getByPlaceholderText(/Character notes/i), 'Backstory');
    expect(onNotesChange).toHaveBeenCalled();
  });

  it('disables the textarea when read-only', () => {
    render(<MamNotesTab notes="Existing" canUpdate={false} onNotesChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Character notes/i)).toBeDisabled();
  });
});

describe('MamSkillsAdvantagesTab', () => {
  function renderTab(overrides: Partial<Mam3eDataModel> = {}, canUpdate = true) {
    const onSkillRankChange = vi.fn();
    const onAdvantagesChange = vi.fn();
    const onRollCheck = vi.fn().mockResolvedValue({
      total: 12,
      formula: '1d20+2',
      isCritical: false,
      isFumble: false,
    } as never);
    render(
      <MamSkillsAdvantagesTab
        document={makeMam3eDoc(overrides)}
        canUpdate={canUpdate}
        onSkillRankChange={onSkillRankChange}
        onAdvantagesChange={onAdvantagesChange}
        onRollCheck={onRollCheck}
      />
    );
    return { onSkillRankChange, onAdvantagesChange, onRollCheck };
  }

  it('shows the empty advantages state and adds a new advantage', async () => {
    const user = userEvent.setup();
    const { onAdvantagesChange } = renderTab();

    expect(screen.getByText('No advantages added yet.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add Advantage/i }));
    expect(onAdvantagesChange).toHaveBeenCalledTimes(1);
    const next = onAdvantagesChange.mock.calls[0][0] as Mam3eDataModel['advantages'];
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe('New Advantage');
  });

  it('forwards a skill rank change and renders negative totals without a plus sign', () => {
    const { onSkillRankChange } = renderTab({
      // Negative AGI drives a negative Acrobatics total so the "+" branch is
      // skipped, while PRE feeds Deception's positive total.
      abilities: {
        str: 0,
        sta: 0,
        agi: -3,
        dex: 0,
        fgt: 0,
        int: 0,
        awe: 0,
        pre: 2,
      },
    });

    // AGI-keyed skills (Acrobatics, Stealth) total rank 0 + (-3) = -3 and
    // render without a leading '+'.
    expect(screen.getAllByText('-3').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByTitle('Deception ranks'), { target: { value: '3' } });
    // Deception keys off PRE (2). The handler receives the rank plus the
    // total computed from the *previous* render (rank 0 + ability 2 = 2).
    expect(onSkillRankChange).toHaveBeenCalledWith('deception', 3, 2);
  });

  it('rolls a skill check through the dice button', async () => {
    const user = userEvent.setup();
    const { onRollCheck } = renderTab();

    await user.click(screen.getByTitle('Roll Acrobatics Check'));
    await waitFor(() => {
      expect(onRollCheck).toHaveBeenCalledWith('acrobatics');
    });
  });

  it('edits one advantage among several and removes it without disturbing the rest', async () => {
    const user = userEvent.setup();
    // Two advantages ensure the per-entry map keeps untouched rows intact.
    const { onAdvantagesChange } = renderTab({
      advantages: [
        { id: 'adv-1', name: 'Luck', rank: 1 },
        { id: 'adv-2', name: 'Benefit', rank: 0 },
      ],
    });

    expect(screen.getByText('2')).toBeInTheDocument(); // header count badge

    const firstNameInput = screen.getAllByTitle('Advantage name')[0];
    await user.type(firstNameInput, '!');
    let last = onAdvantagesChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['advantages'];
    // The second entry passes through unchanged via the map's else branch.
    expect(last[1]).toEqual({ id: 'adv-2', name: 'Benefit', rank: 0 });
    onAdvantagesChange.mockClear();

    fireEvent.change(screen.getAllByTitle(/Advantage rank/i)[0], { target: { value: '3' } });
    last = onAdvantagesChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['advantages'];
    expect(last[0].rank).toBe(3);
    expect(last[1]).toEqual({ id: 'adv-2', name: 'Benefit', rank: 0 });
    onAdvantagesChange.mockClear();

    await user.click(screen.getAllByTitle('Remove advantage')[0]);
    expect(onAdvantagesChange).toHaveBeenCalledWith([{ id: 'adv-2', name: 'Benefit', rank: 0 }]);
  });

  it('clamps negative advantage ranks to zero', () => {
    const { onAdvantagesChange } = renderTab({
      advantages: [{ id: 'adv-1', name: 'Luck', rank: 1 }],
    });

    fireEvent.change(screen.getByTitle(/Advantage rank/i), { target: { value: '-5' } });
    const last = onAdvantagesChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['advantages'];
    expect(last[0].rank).toBe(0);
  });

  it('defaults a rankless advantage input to zero and coerces non-numeric input', () => {
    const { onAdvantagesChange } = renderTab({
      // No `rank` exercises the `advantage.rank ?? 0` input fallback.
      advantages: [{ id: 'adv-1', name: 'Luck' }],
    });

    const rankInput = screen.getByTitle(/Advantage rank/i) as HTMLInputElement;
    expect(rankInput.value).toBe('0');

    // A non-numeric value yields NaN, so the `|| 0` fallback applies.
    fireEvent.change(rankInput, { target: { value: 'abc' } });
    const last = onAdvantagesChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['advantages'];
    expect(last[0].rank).toBe(0);
  });

  it('renders ranked advantages read-only with a rank badge', () => {
    renderTab({ advantages: [{ id: 'adv-1', name: 'Luck', rank: 2 }] }, false);

    expect(screen.getByText('Luck')).toBeInTheDocument();
    expect(screen.getByText('Rank 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add Advantage/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Remove advantage')).not.toBeInTheDocument();
  });
});

describe('MamPowersTab', () => {
  function renderTab(
    overrides: {
      data?: Partial<Mam3eDataModel>;
      props?: Partial<React.ComponentProps<typeof MamPowersTab>>;
      contributionEntries?: ContributionLedgerEntry[];
    } = {}
  ) {
    const handlers = {
      onUpdatePowerRank: vi.fn(),
      onUpdatePowerBaseCost: vi.fn(),
      onChangeModifierRank: vi.fn(),
      onAddPowerModifier: vi.fn(),
      onRemovePowerModifier: vi.fn(),
      onRemovePower: vi.fn(),
      onAddPower: vi.fn(),
    };
    render(
      <MamPowersTab
        document={makeMam3eDoc(overrides.data)}
        canUpdate
        contributionEntries={overrides.contributionEntries ?? []}
        extraModifiers={[makeModifier({ id: 'accurate', name: 'Accurate', type: 'extra' })]}
        flawModifiers={[makeModifier({ id: 'limited', name: 'Limited', type: 'flaw' })]}
        modifierById={
          new Map<string, PowerModifier>([
            ['accurate', makeModifier({ id: 'accurate', name: 'Accurate', type: 'extra' })],
            ['limited', makeModifier({ id: 'limited', name: 'Limited', type: 'flaw' })],
          ])
        }
        {...handlers}
        {...overrides.props}
      />
    );
    return handlers;
  }

  it('shows the empty state and forwards Add Power', async () => {
    const user = userEvent.setup();
    const handlers = renderTab();

    expect(screen.getByText('No powers added yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Add Power/i }));
    expect(handlers.onAddPower).toHaveBeenCalledTimes(1);
  });

  it('renders a power, edits rank/base cost, adds modifiers, and removes the power', async () => {
    const user = userEvent.setup();
    // Undefined extras/flaws exercise the `?? []` fallbacks in the tab.
    const handlers = renderTab({
      data: { powers: [makePower({ extras: undefined, flaws: undefined })] },
    });

    expect(screen.getByText('Blast')).toBeInTheDocument();
    expect(screen.getByText('A ranged energy blast.')).toBeInTheDocument();
    // Both modifier columns start empty.
    expect(screen.getByText('No extras.')).toBeInTheDocument();
    expect(screen.getByText('No flaws.')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('Power rank'), { target: { value: '8' } });
    expect(handlers.onUpdatePowerRank).toHaveBeenCalledWith('power-1', 8);

    fireEvent.change(screen.getByTitle('Base cost per rank'), { target: { value: '3' } });
    expect(handlers.onUpdatePowerBaseCost).toHaveBeenCalledWith('power-1', 3);

    // Selecting the placeholder option is a no-op (the empty-value guard).
    fireEvent.change(screen.getByTitle('Add extra'), { target: { value: '' } });
    expect(handlers.onAddPowerModifier).not.toHaveBeenCalled();

    await user.selectOptions(screen.getByTitle('Add extra'), 'accurate');
    expect(handlers.onAddPowerModifier).toHaveBeenCalledWith('power-1', 'extra', 'accurate');

    await user.selectOptions(screen.getByTitle('Add flaw'), 'limited');
    expect(handlers.onAddPowerModifier).toHaveBeenCalledWith('power-1', 'flaw', 'limited');

    await user.click(screen.getByTitle('Remove power'));
    expect(handlers.onRemovePower).toHaveBeenCalledWith('power-1');
  });

  it('renders attached modifiers and drives rank steppers and removal', async () => {
    const user = userEvent.setup();
    const handlers = renderTab({
      data: {
        powers: [
          makePower({
            extras: ['accurate'],
            flaws: ['limited'],
            modifierRanks: { accurate: 2, limited: 1 },
          }),
        ],
      },
    });

    expect(screen.getByText('Accurate')).toBeInTheDocument();
    expect(screen.getByText('Limited')).toBeInTheDocument();

    // Both columns render rank steppers, so scope to the Extras column row.
    const extrasColumn = screen.getByText('Extras').parentElement as HTMLElement;
    const extrasScope = within(extrasColumn);

    await user.click(extrasScope.getByTitle('Increase modifier rank'));
    expect(handlers.onChangeModifierRank).toHaveBeenCalledWith('power-1', 'accurate', 1);

    await user.click(extrasScope.getByTitle('Decrease modifier rank'));
    expect(handlers.onChangeModifierRank).toHaveBeenCalledWith('power-1', 'accurate', -1);

    await user.click(extrasScope.getByTitle('Remove extra'));
    expect(handlers.onRemovePowerModifier).toHaveBeenCalledWith('power-1', 'extra', 'accurate');

    // The Flaws column wires removal through the flaw modifier type.
    const flawsColumn = screen.getByText('Flaws').parentElement as HTMLElement;
    await user.click(within(flawsColumn).getByTitle('Remove flaw'));
    expect(handlers.onRemovePowerModifier).toHaveBeenCalledWith('power-1', 'flaw', 'limited');
  });

  it('skips modifier ids that are not in the catalog', () => {
    renderTab({
      data: {
        powers: [makePower({ extras: ['ghost-modifier'], modifierRanks: {} })],
      },
    });

    // The unknown id renders nothing, so the column shows no modifier row.
    expect(screen.queryByText('ghost-modifier')).not.toBeInTheDocument();
    expect(screen.getByText('Blast')).toBeInTheDocument();
  });

  it('renders the non-per-rank path without a rank input', () => {
    renderTab({
      data: { powers: [makePower({ perRank: false, rank: undefined })] },
    });
    expect(screen.queryByTitle('Power rank')).not.toBeInTheDocument();
    expect(screen.getByTitle('Base cost per rank')).toBeInTheDocument();
  });

  it('renders contribution breakdowns when ledger entries target the power', () => {
    const contributionEntries: ContributionLedgerEntry[] = [
      {
        source: 'Enhanced Trait',
        target: 'powers.0.costPerRank',
        value: 1,
      } as unknown as ContributionLedgerEntry,
      {
        source: 'Feature',
        target: 'powers.0.flatCost',
        value: 2,
      } as unknown as ContributionLedgerEntry,
    ];

    renderTab({ data: { powers: [makePower()] }, contributionEntries });

    expect(screen.getByText(/Cost per rank/i)).toBeInTheDocument();
    expect(screen.getByText(/Flat cost/i)).toBeInTheDocument();
  });

  it('hides edit affordances when read-only', () => {
    renderTab({
      data: { powers: [makePower({ extras: ['accurate'] })] },
      props: { canUpdate: false },
    });

    expect(screen.queryByTitle('Remove power')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Add extra')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add Power/i })).not.toBeInTheDocument();
  });
});

describe('MamArchetypesTab', () => {
  it('renders the error state with retry', async () => {
    const user = userEvent.setup();
    const onRetryArchetypes = vi.fn();
    render(
      <MamArchetypesTab
        archetypesLoaded={false}
        archetypesError
        onRetryArchetypes={onRetryArchetypes}
        archetypes={[]}
        pinnedArchetypeIds={[]}
        pinnedArchetypes={[]}
      />
    );

    expect(screen.getByText(/Failed to load the M&M archetype catalog/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryArchetypes).toHaveBeenCalledTimes(1);
  });

  it('renders the not-yet-loaded placeholder', () => {
    render(
      <MamArchetypesTab
        archetypesLoaded={false}
        archetypes={[]}
        pinnedArchetypeIds={[]}
        pinnedArchetypes={[]}
      />
    );
    expect(screen.getByText('Click to load archetypes...')).toBeInTheDocument();
  });

  it('renders pinned archetypes and unpins via the toggle handler', async () => {
    const user = userEvent.setup();
    const onToggleArchetype = vi.fn();
    const archetype = makeArchetype();
    render(
      <MamArchetypesTab
        archetypesLoaded
        archetypes={[archetype]}
        pinnedArchetypeIds={[archetype.id]}
        pinnedArchetypes={[archetype]}
        onToggleArchetype={onToggleArchetype}
      />
    );

    const pinnedSection = screen.getByText('Pinned Archetypes').closest('section') as HTMLElement;
    expect(within(pinnedSection).getByText('A powered-armor hero.')).toBeInTheDocument();

    // The pinned card's unpin control uses a title; the lazy browser uses an
    // aria-label, so scoping to the pinned section keeps this unambiguous.
    await user.click(within(pinnedSection).getByTitle('Unpin Battlesuit'));
    expect(onToggleArchetype).toHaveBeenCalledWith(archetype);

    // The lazy MamArchetypeBrowser mounts after Suspense resolves.
    expect(await screen.findByPlaceholderText('Search archetypes...')).toBeInTheDocument();
  });
});

describe('MamPowerBrowserTab', () => {
  it('renders the power-catalog error and retries', async () => {
    const user = userEvent.setup();
    const onRetryPowerBrowser = vi.fn();
    render(
      <MamPowerBrowserTab
        powersLoaded={false}
        powersError
        powers={[]}
        powerModifiersLoaded={false}
        onRetryPowerBrowser={onRetryPowerBrowser}
        modifierCatalog={[]}
      />
    );

    expect(screen.getByText(/Failed to load the M&M power catalog/i)).toBeInTheDocument();
    // The modifier side shows its loading placeholder.
    expect(screen.getByText('Loading modifier catalog...')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryPowerBrowser).toHaveBeenCalledTimes(1);
  });

  it('renders the not-yet-loaded power placeholder', () => {
    render(
      <MamPowerBrowserTab
        powersLoaded={false}
        powers={[]}
        powerModifiersLoaded={false}
        modifierCatalog={[]}
      />
    );
    expect(screen.getByText('Click to load powers...')).toBeInTheDocument();
  });

  it('renders the modifier-catalog error state', () => {
    render(
      <MamPowerBrowserTab
        powersLoaded={false}
        powers={[]}
        powerModifiersLoaded={false}
        powerModifiersError
        modifierCatalog={[]}
      />
    );
    expect(screen.getByText(/Failed to load the M&M modifier catalog/i)).toBeInTheDocument();
  });

  it('renders the lazy power and modifier browsers when both catalogs are loaded', async () => {
    const power = makePower({ id: 'flight', name: 'Flight', type: 'movement', action: 'free' });
    // A rankless power exercises the `power.rank ?? 0` fallback in the mapper.
    const ranklessPower = makePower({
      id: 'immunity',
      name: 'Immunity',
      type: 'defense',
      rank: undefined,
    });
    render(
      <MamPowerBrowserTab
        powersLoaded
        powers={[power as never, ranklessPower as never]}
        powerModifiersLoaded
        modifierCatalog={[makeModifier()]}
      />
    );

    expect(await screen.findByText('Flight')).toBeInTheDocument();
  });
});

describe('MamAdvantageBrowserTab', () => {
  it('renders the error state and retries', async () => {
    const user = userEvent.setup();
    const onRetryAdvantages = vi.fn();
    render(
      <MamAdvantageBrowserTab
        advantagesLoaded={false}
        advantagesError
        onRetryAdvantages={onRetryAdvantages}
        advantages={[]}
      />
    );

    expect(screen.getByText(/Failed to load the M&M advantage catalog/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryAdvantages).toHaveBeenCalledTimes(1);
  });

  it('renders the not-yet-loaded placeholder', () => {
    render(<MamAdvantageBrowserTab advantagesLoaded={false} advantages={[]} />);
    expect(screen.getByText('Click to load advantages...')).toBeInTheDocument();
  });

  it('lists advantages, marks already-added rows, and adds the rest', async () => {
    const user = userEvent.setup();
    const onAddAdvantage = vi.fn();
    const assessment = makeAdvantage();
    const luck = makeAdvantage({
      id: 'luck',
      name: 'Luck',
      type: 'fortune',
      ranked: true,
      benefit: '',
      description: 'Spend a hero point for luck.',
    });

    render(
      <MamAdvantageBrowserTab
        advantagesLoaded
        advantages={[assessment, luck]}
        characterAdvantageNames={new Set(['Luck'])}
        onAddAdvantage={onAddAdvantage}
      />
    );

    expect(screen.getByText('SRD Advantages (2)')).toBeInTheDocument();
    // Ranked badge shows for the ranked advantage.
    expect(screen.getByText('Ranked')).toBeInTheDocument();
    // The description fallback renders when benefit is empty.
    expect(screen.getByText('Spend a hero point for luck.')).toBeInTheDocument();

    // Luck is already on the character -> button disabled and labelled Added.
    expect(screen.getByRole('button', { name: 'Added' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAddAdvantage).toHaveBeenCalledWith(assessment);
  });

  it('treats every row as not-yet-added when no character set is supplied', () => {
    render(
      <MamAdvantageBrowserTab
        advantagesLoaded
        advantages={[makeAdvantage()]}
        onAddAdvantage={vi.fn()}
      />
    );

    // Without characterAdvantageNames the alreadyAdded fallback is false.
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  });
});

describe('MamEquipmentBrowserTab', () => {
  it('renders the error state and retries', async () => {
    const user = userEvent.setup();
    const onRetryEquipment = vi.fn();
    render(
      <MamEquipmentBrowserTab
        equipmentLoaded={false}
        equipmentError
        onRetryEquipment={onRetryEquipment}
        equipmentItems={[]}
      />
    );

    expect(screen.getByText(/Failed to load the M&M equipment catalog/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryEquipment).toHaveBeenCalledTimes(1);
  });

  it('renders the not-yet-loaded placeholder', () => {
    render(<MamEquipmentBrowserTab equipmentLoaded={false} equipmentItems={[]} />);
    expect(screen.getByText('Click to load equipment...')).toBeInTheDocument();
  });

  it('renders the lazy equipment browser with formatted numeric and object costs', async () => {
    const numericItem = {
      id: 'utility-belt',
      name: 'Utility Belt',
      type: 'gear',
      rarity: 'common',
      description: 'A belt packed with hero tools.',
      cost: 3,
      weight: 2,
    } as unknown as Item;
    const objectCostItem = {
      id: 'jetpack',
      name: 'Jetpack',
      type: 'gear',
      rarity: 'rare',
      description: 'Personal flight pack.',
      cost: { amount: 5, currency: 'ep' },
    } as unknown as Item;
    // A string cost hits the bare '0' fallback (not an object, not a number).
    const stringCostItem = {
      id: 'mystery-gadget',
      name: 'Mystery Gadget',
      description: 'Cost unknown.',
      cost: 'priceless',
    } as unknown as Item;
    // An object cost with the wrong field types exercises the inner guard's
    // false branch before falling through to '0'.
    const malformedObjectCostItem = {
      id: 'odd-gizmo',
      name: 'Odd Gizmo',
      type: 'gear',
      rarity: 'common',
      description: 'Strange pricing.',
      cost: { amount: 'lots', currency: 7 },
      weight: 1,
    } as unknown as Item;

    render(
      <MamEquipmentBrowserTab
        equipmentLoaded
        equipmentItems={[numericItem, objectCostItem, stringCostItem, malformedObjectCostItem]}
      />
    );

    expect(await screen.findByText('Utility Belt')).toBeInTheDocument();
    expect(screen.getByText('Jetpack')).toBeInTheDocument();
    expect(screen.getByText('Mystery Gadget')).toBeInTheDocument();
    expect(screen.getByText('Odd Gizmo')).toBeInTheDocument();
  });
});

describe('MamComplicationsTab', () => {
  function makeComplication(overrides: Partial<Complication> = {}): Complication {
    return {
      id: 'comp-1',
      name: 'Enemy',
      description: 'A recurring foe.',
      system: 'mam3e',
      source: "Hero's Handbook",
      category: 'relationship',
      examples: ['A rival hero', 'A vengeful villain'],
      ...overrides,
    };
  }

  it('renders the empty state and adds a complication', async () => {
    const user = userEvent.setup();
    const onComplicationsChange = vi.fn();
    render(
      <MamComplicationsTab
        complications={[]}
        complicationCatalog={[]}
        complicationsLoaded={false}
        insertedComplicationIds={[]}
        onComplicationsChange={onComplicationsChange}
      />
    );

    expect(screen.getByText('No complications added yet.')).toBeInTheDocument();
    // The catalog placeholder (not loaded, not errored).
    expect(screen.getByText('Loading complication catalog...')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add Complication/i }));
    const next = onComplicationsChange.mock.calls[0][0] as Mam3eDataModel['complications'];
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe('');
  });

  it('edits name and description and removes a row, and shows badges', async () => {
    const user = userEvent.setup();
    const onComplicationsChange = vi.fn();
    render(
      <MamComplicationsTab
        complications={[
          {
            id: 'comp-1',
            name: 'Enemy',
            description: 'A foe.',
            category: 'motivation',
            source: 'GM',
          },
        ]}
        complicationCatalog={[]}
        complicationsLoaded={false}
        insertedComplicationIds={[]}
        onComplicationsChange={onComplicationsChange}
      />
    );

    expect(screen.getByText('motivation')).toBeInTheDocument();
    expect(screen.getByText('GM')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Complication name'), '!');
    let last = onComplicationsChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['complications'];
    expect(last[0].name).toBe('Enemy!');
    onComplicationsChange.mockClear();

    await user.type(screen.getByPlaceholderText('Description'), '!');
    last = onComplicationsChange.mock.calls.at(-1)?.[0] as Mam3eDataModel['complications'];
    expect(last[0].description).toBe('A foe.!');
    onComplicationsChange.mockClear();

    await user.click(screen.getByTitle('Remove complication'));
    expect(onComplicationsChange).toHaveBeenCalledWith([]);
  });

  it('renders the catalog error state with retry', async () => {
    const user = userEvent.setup();
    const onRetryComplications = vi.fn();
    render(
      <MamComplicationsTab
        complications={[]}
        complicationCatalog={[]}
        complicationsLoaded={false}
        complicationsError
        onRetryComplications={onRetryComplications}
        insertedComplicationIds={[]}
        onComplicationsChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Failed to load the M&M complication catalog/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryComplications).toHaveBeenCalledTimes(1);
  });

  it('renders read-only rows without inputs when no change handler is supplied', () => {
    // A legacy row without an id uses the positional key fallback.
    render(
      <MamComplicationsTab
        complications={[{ name: 'Enemy', description: 'A foe.' }]}
        complicationCatalog={[]}
        complicationsLoaded={false}
        insertedComplicationIds={[]}
      />
    );

    const nameInput = screen.getByPlaceholderText('Complication name');
    const descriptionInput = screen.getByPlaceholderText('Description');
    expect(nameInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(screen.queryByTitle('Remove complication')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add Complication/i })).not.toBeInTheDocument();

    // Firing change on the disabled inputs hits the read-only guard clauses
    // (no handler -> early return) without throwing.
    fireEvent.change(nameInput, { target: { value: 'Nemesis' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated' } });
    expect(nameInput).toBeDisabled();
  });

  it('renders the lazy complication browser and inserts a catalog entry', async () => {
    const user = userEvent.setup();
    const onInsertComplication = vi.fn();
    const catalogEntry = makeComplication({ id: 'accident', name: 'Accident' });

    render(
      <MamComplicationsTab
        complications={[]}
        complicationCatalog={[catalogEntry]}
        complicationsLoaded
        insertedComplicationIds={[]}
        onComplicationsChange={vi.fn()}
        onInsertComplication={onInsertComplication}
      />
    );

    expect(await screen.findByText('Accident')).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Insert' }));
    expect(onInsertComplication).toHaveBeenCalledWith(catalogEntry);
  });
});
