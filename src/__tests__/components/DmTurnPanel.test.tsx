import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DmTurnPanel } from '../../components/scene/DmTurnPanel';
import type { DmTurnResult } from '../../ai/dmTurnFlow';
import type { SceneEvent } from '../../types/core/scene';

const ACTOR = { id: 't1', name: 'Grish' };
const AT = new Date('2026-08-02T12:00:00.000Z');

const MOVE_EVENT: SceneEvent = {
  id: 'dm-1',
  type: 'token.moved',
  sequence: 2,
  createdAt: AT,
  actorId: 'ai-dm',
  payload: { tokenId: 't1', position: { x: 3, y: 1 } },
};

function renderPanel(
  overrides: {
    actor?: { id: string; name: string };
    onRunTurn?: (request: { moveDistance: number }) => Promise<DmTurnResult>;
    onApply?: (events: SceneEvent[]) => string | null;
  } = {}
) {
  const props = {
    actor: ACTOR as { id: string; name: string } | undefined,
    onRunTurn: vi.fn(async () => ({
      ok: true as const,
      events: [MOVE_EVENT],
      pending: [],
      rejected: [],
      rationale: 'Grish edges toward the doorway.',
    })),
    onApply: vi.fn(() => null),
    ...overrides,
  };
  render(<DmTurnPanel {...props} />);
  return props;
}

describe('DmTurnPanel', () => {
  it('is absent when AI is off (no run closure is injected)', () => {
    render(<DmTurnPanel actor={ACTOR} onApply={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Propose turn/i })).not.toBeInTheDocument();
  });

  it('is absent when no token is up', () => {
    render(<DmTurnPanel onRunTurn={vi.fn()} onApply={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Propose turn/i })).not.toBeInTheDocument();
  });

  it('sends the GM-entered reach, and the optional check, as the option pool', async () => {
    const user = userEvent.setup();
    const props = renderPanel();

    const distance = screen.getByRole('spinbutton', { name: /Move distance in squares/i });
    await user.clear(distance);
    await user.type(distance, '4');
    await user.type(screen.getByRole('textbox', { name: /check label/i }), 'Stealth');
    await user.type(screen.getByRole('spinbutton', { name: /check modifier/i }), '4');
    await user.type(screen.getByRole('spinbutton', { name: /check difficulty/i }), '13');
    await user.click(screen.getByRole('button', { name: /Propose turn/i }));

    expect(props.onRunTurn).toHaveBeenCalledWith({
      moveDistance: 4,
      check: { label: 'Stealth', modifier: 4, dc: 13 },
    });
  });

  it('shows the proposal and applies NOTHING until a human accepts it', async () => {
    const user = userEvent.setup();
    const props = renderPanel();

    await user.click(screen.getByRole('button', { name: /Propose turn/i }));

    expect(await screen.findByText(/Move to \(3, 1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Nothing has been applied/i)).toBeInTheDocument();
    // The load-bearing assertion of this whole surface.
    expect(props.onApply).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Apply turn/i }));
    expect(props.onApply).toHaveBeenCalledWith([MOVE_EVENT]);
  });

  it('discards a proposal without applying it', async () => {
    const user = userEvent.setup();
    const props = renderPanel();

    await user.click(screen.getByRole('button', { name: /Propose turn/i }));
    await screen.findByText(/Move to \(3, 1\)/);
    await user.click(screen.getByRole('button', { name: /Discard/i }));

    expect(props.onApply).not.toHaveBeenCalled();
    expect(screen.queryByText(/Move to \(3, 1\)/)).not.toBeInTheDocument();
  });

  it('keeps the proposal on screen and shows why when the host refuses to apply it', async () => {
    const user = userEvent.setup();
    renderPanel({ onApply: vi.fn(() => 'The scene changed since this turn was proposed.') });

    await user.click(screen.getByRole('button', { name: /Propose turn/i }));
    await screen.findByText(/Move to \(3, 1\)/);
    await user.click(screen.getByRole('button', { name: /Apply turn/i }));

    expect(
      screen.getByText(/The scene changed since this turn was proposed\./)
    ).toBeInTheDocument();
    // Still reviewable — the GM can read it, discard, and re-propose.
    expect(screen.getByText(/Move to \(3, 1\)/)).toBeInTheDocument();
  });

  it('reports every proposal the flow or the runtime refused', async () => {
    const user = userEvent.setup();
    renderPanel({
      onRunTurn: vi.fn(async () => ({
        ok: true as const,
        events: [],
        pending: [],
        rejected: ["'move' proposed moving 9 squares, but only 4 are available."],
      })),
    });

    await user.click(screen.getByRole('button', { name: /Propose turn/i }));

    expect(
      await screen.findByText(/proposed moving 9 squares, but only 4 are available/i)
    ).toBeInTheDocument();
    // Nothing survived, so there is nothing to accept.
    expect(screen.getByRole('button', { name: /Apply turn/i })).toBeDisabled();
  });

  it('surfaces a flow-level failure instead of an empty panel', async () => {
    const user = userEvent.setup();
    renderPanel({
      onRunTurn: vi.fn(async () => ({ ok: false as const, error: "It is not Grish's turn." })),
    });

    await user.click(screen.getByRole('button', { name: /Propose turn/i }));

    expect(await screen.findByText(/It is not Grish's turn\./)).toBeInTheDocument();
  });
});
