import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TokenPanel } from '../../components/scene/TokenPanel';
import { CombatPanel } from '../../components/scene/CombatPanel';
import type { SceneState } from '../../types/core/scene';

/**
 * Real-DOM checks for the two scene controls added for running a campaign: the
 * selected token's damage/heal control and the 5e advantage/disadvantage
 * selector (shown only for 5e).
 */

const tokenBase = {
  eligibleDocuments: [],
  tokenDocumentId: '',
  onSelectLinkedDocument: vi.fn(),
  tokenName: 'Hero',
  onTokenNameChange: vi.fn(),
  tokenKind: 'character' as const,
  onTokenKindChange: vi.fn(),
  isPlacing: false,
  onTogglePlace: vi.fn(),
  canDeleteToken: true,
  onDeleteSelectedToken: vi.fn(),
};

describe('TokenPanel — HP control', () => {
  it('damages and heals the selected token by the entered amount', async () => {
    const user = userEvent.setup();
    const onApplyHpDelta = vi.fn();
    render(
      <TokenPanel
        {...tokenBase}
        selectedTokenHp={{ current: 10, max: 20 }}
        onApplyHpDelta={onApplyHpDelta}
      />
    );
    const input = screen.getByLabelText('HP amount');
    await user.type(input, '5');
    await user.click(screen.getByRole('button', { name: 'Damage' }));
    expect(onApplyHpDelta).toHaveBeenCalledWith(5); // positive = damage

    await user.type(input, '7');
    await user.click(screen.getByRole('button', { name: 'Heal' }));
    expect(onApplyHpDelta).toHaveBeenCalledWith(-7); // negative = heal
  });

  it('hides the HP control for a token without hit points', () => {
    render(<TokenPanel {...tokenBase} onApplyHpDelta={vi.fn()} />);
    expect(screen.queryByLabelText('HP amount')).not.toBeInTheDocument();
  });
});

describe('TokenPanel — conditions', () => {
  it('toggles a condition on and off, replacing the set', async () => {
    const user = userEvent.setup();
    const onSetStatuses = vi.fn();
    render(
      <TokenPanel
        {...tokenBase}
        selectedTokenStatuses={['poisoned']}
        onSetStatuses={onSetStatuses}
      />
    );
    // The active condition is pressed.
    expect(screen.getByRole('button', { name: 'poisoned' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    // Adding one keeps the existing condition.
    await user.click(screen.getByRole('button', { name: 'prone' }));
    expect(onSetStatuses).toHaveBeenCalledWith(['poisoned', 'prone']);
    // Clicking an active one removes it.
    await user.click(screen.getByRole('button', { name: 'poisoned' }));
    expect(onSetStatuses).toHaveBeenCalledWith([]);
  });

  it('hides conditions when no token is selected', () => {
    render(<TokenPanel {...tokenBase} onSetStatuses={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'prone' })).not.toBeInTheDocument();
  });
});

describe('TokenPanel — concentration', () => {
  it('sets and clears the concentrated spell', async () => {
    const user = userEvent.setup();
    const onSetConcentration = vi.fn();
    render(
      <TokenPanel
        {...tokenBase}
        selectedTokenStatuses={[]}
        selectedTokenConcentration="Bless"
        onSetConcentration={onSetConcentration}
      />
    );
    await user.type(screen.getByLabelText('Concentration spell'), 'Haste');
    await user.click(screen.getByRole('button', { name: 'Set' }));
    expect(onSetConcentration).toHaveBeenCalledWith('Haste');

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onSetConcentration).toHaveBeenCalledWith(''); // empty clears
  });
});

function sceneState(systemId: string): SceneState {
  return {
    sceneId: 's',
    name: 'S',
    systemId,
    grid: { width: 8, height: 8, cellSize: 5 },
    tokens: {
      a: { id: 'a', name: 'A', kind: 'character', position: { x: 0, y: 0 }, size: 1 },
    },
    markers: {},
    initiative: [],
    round: 1,
    seed: 's',
  };
}

const combatBase = {
  attackerId: 'a',
  combatReadyIds: new Set(['a']),
  targetId: '',
  onTargetChange: vi.fn(),
  onAttack: vi.fn(),
  onRunRound: vi.fn(),
  saveActions: [],
  selectedSaveActionName: '',
  onSaveActionChange: vi.fn(),
  onAreaEffect: vi.fn(),
  areaPreviewCount: 0,
  log: [],
};

describe('CombatPanel — 5e roll mode', () => {
  it('offers advantage/disadvantage for 5e and reports the choice', async () => {
    const user = userEvent.setup();
    const onRollModeChange = vi.fn();
    render(
      <CombatPanel
        {...combatBase}
        state={sceneState('dnd-5e-2014')}
        rollMode="normal"
        onRollModeChange={onRollModeChange}
      />
    );
    const select = screen.getByLabelText('Attack roll mode');
    await user.selectOptions(select, 'advantage');
    expect(onRollModeChange).toHaveBeenCalledWith('advantage');
  });

  it('hides the roll-mode selector for non-5e systems', () => {
    render(
      <CombatPanel
        {...combatBase}
        state={sceneState('pf2e')}
        rollMode="normal"
        onRollModeChange={vi.fn()}
      />
    );
    expect(screen.queryByLabelText('Attack roll mode')).not.toBeInTheDocument();
  });
});
