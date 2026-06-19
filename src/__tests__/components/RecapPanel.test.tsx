import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecapPanel } from '../../components/scene/RecapPanel';
import type { SceneState } from '../../types/core/scene';

function makeState(): SceneState {
  return {
    sceneId: 's1',
    name: 'The Crypt',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 6, height: 6, cellSize: 70 },
    tokens: {},
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
    checkLog: [
      {
        id: 'k1',
        label: 'Perception',
        die: 14,
        modifier: 3,
        dc: 15,
        total: 17,
        outcome: 'success',
        createdAt: new Date(),
      },
    ],
    oracleLog: [],
  };
}

describe('RecapPanel', () => {
  it('previews the factual recap text', () => {
    render(<RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={vi.fn()} />);
    expect(screen.getByText(/Checks: Perception 17 vs DC 15 \(success\)\./)).toBeInTheDocument();
  });

  it('logs the scene name and recap, then confirms', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    render(<RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={onLog} />);

    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));

    expect(onLog).toHaveBeenCalledWith('The Crypt', 'Checks: Perception 17 vs DC 15 (success).');
    // Button flips to a logged state and a confirmation appears.
    expect(screen.getByRole('button', { name: /Logged/i })).toBeInTheDocument();
    expect(screen.getByText(/Added to Saltmarsh/i)).toBeInTheDocument();
  });

  it('clears the Logged confirmation once the recap changes (more play happened)', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={vi.fn()} />
    );
    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));
    expect(screen.getByRole('button', { name: /Logged/i })).toBeInTheDocument();

    // A new oracle result lands → the recap grows → the stale "Logged" latch
    // must clear so it doesn't imply the newer recap was saved.
    const grown = makeState();
    grown.oracleLog = [
      {
        id: 'o1',
        question: 'Trapped?',
        odds: 'even',
        roll: 80,
        target: 50,
        answer: 'no',
        createdAt: new Date(),
      },
    ];
    rerender(<RecapPanel state={grown} campaignName="Saltmarsh" onLog={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Log to Saltmarsh/i })).toBeInTheDocument();
    expect(screen.queryByText(/Added to Saltmarsh/i)).not.toBeInTheDocument();
  });
});
