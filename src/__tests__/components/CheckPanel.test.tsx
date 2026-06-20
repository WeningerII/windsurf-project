import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckPanel } from '../../components/scene/CheckPanel';
import type { SceneCheckLogEntry, SceneState, SceneToken } from '../../types/core/scene';

function token(id: string, name: string): SceneToken {
  return { id, name, kind: 'character', position: { x: 0, y: 0 }, size: 1 };
}

function makeState(checkLog: SceneCheckLogEntry[] = []): SceneState {
  return {
    sceneId: 's1',
    name: 'Scene',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 6, height: 6, cellSize: 70 },
    tokens: { rogue: token('rogue', 'Astra'), fighter: token('fighter', 'Borin') },
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
    checkLog,
    oracleLog: [],
  };
}

describe('CheckPanel', () => {
  it('disables Roll until a label is entered', async () => {
    const user = userEvent.setup();
    render(<CheckPanel state={makeState()} onRoll={vi.fn()} />);

    const roll = screen.getByRole('button', { name: /^Roll$/i });
    expect(roll).toBeDisabled();
    await user.type(screen.getByLabelText('Check label'), 'Perception');
    expect(roll).toBeEnabled();
  });

  it('emits the parsed label, modifier, and DC on roll', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn();
    render(<CheckPanel state={makeState()} onRoll={onRoll} />);

    await user.type(screen.getByLabelText('Check label'), 'Stealth');
    await user.type(screen.getByLabelText('Check modifier'), '7');
    await user.type(screen.getByLabelText('Check DC'), '15');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    expect(onRoll).toHaveBeenCalledWith({ label: 'Stealth', modifier: 7, dc: 15 });
  });

  it('omits the DC when left blank and defaults the modifier to 0', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn();
    render(<CheckPanel state={makeState()} onRoll={onRoll} />);

    await user.type(screen.getByLabelText('Check label'), 'Insight');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    expect(onRoll).toHaveBeenCalledWith({ label: 'Insight', modifier: 0 });
  });

  it('defaults the roller to the selected token and attributes the roll', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn();
    render(<CheckPanel state={makeState()} actorId="rogue" onRoll={onRoll} />);

    expect((screen.getByLabelText('Check roller') as HTMLSelectElement).value).toBe('rogue');
    await user.type(screen.getByLabelText('Check label'), 'Acrobatics');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    expect(onRoll).toHaveBeenCalledWith({
      label: 'Acrobatics',
      modifier: 0,
      actorTokenId: 'rogue',
    });
  });

  it('lets the GM pick Unattributed even while a grid token is selected', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn();
    render(<CheckPanel state={makeState()} actorId="rogue" onRoll={onRoll} />);

    const roller = screen.getByLabelText('Check roller') as HTMLSelectElement;
    expect(roller.value).toBe('rogue'); // defaults to the selected token
    await user.selectOptions(roller, '');
    // Must stick on the GM option, not snap back to the actorId default.
    expect((screen.getByLabelText('Check roller') as HTMLSelectElement).value).toBe('');

    await user.type(screen.getByLabelText('Check label'), 'Perception');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));
    expect(onRoll).toHaveBeenCalledWith({ label: 'Perception', modifier: 0 });
  });

  it('passes advantage mode when selected', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn();
    render(<CheckPanel state={makeState()} onRoll={onRoll} />);

    await user.type(screen.getByLabelText('Check label'), 'Athletics');
    await user.selectOptions(screen.getByLabelText('Roll mode'), 'advantage');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    expect(onRoll).toHaveBeenCalledWith({ label: 'Athletics', modifier: 0, mode: 'advantage' });
  });

  it('shows the discarded die and mode tag for an advantage roll', () => {
    render(
      <CheckPanel
        state={makeState([
          {
            id: 'c1',
            label: 'Athletics',
            die: 18,
            discardedDie: 4,
            mode: 'advantage',
            modifier: 3,
            total: 21,
            outcome: 'success',
            createdAt: new Date(),
          },
        ])}
        onRoll={vi.fn()}
      />
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('d20 18 4 (adv) + 3 = 21');
  });

  it('renders the check log newest-first with outcome and actor name', () => {
    render(
      <CheckPanel
        state={makeState([
          {
            id: 'c1',
            label: 'Perception',
            actorTokenId: 'rogue',
            die: 18,
            modifier: 4,
            dc: 15,
            total: 22,
            outcome: 'success',
            createdAt: new Date('2026-01-01'),
          },
          {
            id: 'c2',
            label: 'Arcana',
            die: 3,
            modifier: 1,
            dc: 20,
            total: 4,
            outcome: 'failure',
            createdAt: new Date('2026-01-02'),
          },
        ])}
        onRoll={vi.fn()}
      />
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Arcana'); // newest first
    expect(items[1]).toHaveTextContent('Perception');
    expect(items[1]).toHaveTextContent('Astra'); // actor name resolved
    expect(within(items[0]).getByText('Failure')).toBeInTheDocument();
    expect(within(items[1]).getByText('Success')).toBeInTheDocument();
  });
});
