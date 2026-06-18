import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OraclePanel } from '../../components/scene/OraclePanel';
import type { SceneOracleLogEntry, SceneState } from '../../types/core/scene';

function makeState(oracleLog: SceneOracleLogEntry[] = []): SceneState {
  return {
    sceneId: 's1',
    name: 'Scene',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 6, height: 6, cellSize: 70 },
    tokens: {},
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
    checkLog: [],
    oracleLog,
  };
}

describe('OraclePanel', () => {
  it('consults with the chosen odds and question', async () => {
    const user = userEvent.setup();
    const onConsult = vi.fn();
    render(<OraclePanel state={makeState()} onConsult={onConsult} />);

    await user.type(screen.getByLabelText('Oracle question'), 'Is the bridge guarded?');
    await user.selectOptions(screen.getByLabelText('Oracle odds'), 'unlikely');
    await user.click(screen.getByRole('button', { name: /^Consult$/i }));

    expect(onConsult).toHaveBeenCalledWith({
      odds: 'unlikely',
      question: 'Is the bridge guarded?',
    });
  });

  it('omits the question when left blank, defaulting odds to even', async () => {
    const user = userEvent.setup();
    const onConsult = vi.fn();
    render(<OraclePanel state={makeState()} onConsult={onConsult} />);

    await user.click(screen.getByRole('button', { name: /^Consult$/i }));
    expect(onConsult).toHaveBeenCalledWith({ odds: 'even' });
  });

  it('renders the oracle log newest-first with the answer label', () => {
    render(
      <OraclePanel
        state={makeState([
          {
            id: 'o1',
            question: 'Older question?',
            odds: 'even',
            roll: 80,
            target: 50,
            answer: 'no',
            createdAt: new Date('2026-01-01'),
          },
          {
            id: 'o2',
            question: 'Newer question?',
            odds: 'likely',
            roll: 5,
            target: 70,
            answer: 'exceptional-yes',
            createdAt: new Date('2026-01-02'),
          },
        ])}
        onConsult={vi.fn()}
      />
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Newer question?');
    expect(within(items[0]).getByText('Exceptional Yes')).toBeInTheDocument();
    expect(items[1]).toHaveTextContent('Older question?');
    expect(within(items[1]).getByText('No')).toBeInTheDocument();
  });
});
