import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CombatPanel } from '../../components/scene/CombatPanel';
import type { SceneState, SceneToken } from '../../types/core/scene';

function token(id: string, name: string): SceneToken {
  return {
    id,
    name,
    kind: 'monster',
    position: { x: 0, y: 0 },
    size: 1,
    hp: { current: 10, max: 10 },
  };
}

const baseState: SceneState = {
  sceneId: 'scene-1',
  name: 'Test Scene',
  systemId: 'dnd-5e-2014',
  grid: { type: 'square', width: 10, height: 10, cellSize: 5 },
  tokens: { a: token('a', 'Goblin'), b: token('b', 'Hero') },
  markers: {},
  initiative: [],
  round: 1,
  seed: 'seed',
  checkLog: [],
};

function renderPanel(overrides: Partial<React.ComponentProps<typeof CombatPanel>> = {}) {
  const props = {
    state: baseState,
    combatReadyIds: new Set(['a', 'b']),
    targetId: '',
    onTargetChange: vi.fn(),
    onAttack: vi.fn(),
    onRunRound: vi.fn(),
    log: [],
    ...overrides,
  } satisfies React.ComponentProps<typeof CombatPanel>;
  render(<CombatPanel {...props} />);
  return props;
}

describe('CombatPanel — Run Round gating', () => {
  it('enables Run Round with two combat-ready tokens and an unconcluded fight', () => {
    renderPanel({ combatConcluded: false });
    expect(screen.getByRole('button', { name: /run round/i })).toBeEnabled();
    expect(screen.queryByText('Combat over')).not.toBeInTheDocument();
  });

  it('disables Run Round and shows "Combat over" once only one faction remains', () => {
    renderPanel({ combatConcluded: true });
    expect(screen.getByRole('button', { name: /run round/i })).toBeDisabled();
    expect(screen.getByText('Combat over')).toBeInTheDocument();
  });

  it('disables Run Round when fewer than two tokens are combat-ready (no "Combat over")', () => {
    renderPanel({ combatReadyIds: new Set(['a']) });
    expect(screen.getByRole('button', { name: /run round/i })).toBeDisabled();
    expect(screen.queryByText('Combat over')).not.toBeInTheDocument();
  });
});
