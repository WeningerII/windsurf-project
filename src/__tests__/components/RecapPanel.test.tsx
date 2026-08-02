import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecapPanel } from '../../components/scene/RecapPanel';
import {
  critiqueNarrationWithAi,
  type NarrationCritiqueGatewayCall,
} from '../../ai/narrationCritiqueFlow';
import { narrationFactsFromScene } from '../../ai/narrationFacts';
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
    expect(
      screen.getByText(/Checks: Perception 17 vs difficulty 15 \(success\)\./)
    ).toBeInTheDocument();
  });

  it('logs the scene name and recap, then confirms', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    render(<RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={onLog} />);

    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));

    expect(onLog).toHaveBeenCalledWith(
      'The Crypt',
      'Checks: Perception 17 vs difficulty 15 (success).'
    );
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

  it('hides AI narration unless a narrate handler is provided', () => {
    render(<RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /narrate with ai/i })).not.toBeInTheDocument();
  });

  it('narrates the factual recap into editable prose, then logs the prose', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    const narrate = vi.fn(async () => ({ ok: true as const, narrative: 'The crypt fell silent.' }));
    render(
      <RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={onLog} narrate={narrate} />
    );

    await user.click(screen.getByRole('button', { name: /narrate with ai/i }));

    const draft = await screen.findByRole('textbox', { name: /ai narration draft/i });
    expect(draft).toHaveValue('The crypt fell silent.');
    // The deterministic recap is the model's only source material; tone defaults.
    expect(narrate).toHaveBeenCalledWith({
      facts: 'Checks: Perception 17 vs difficulty 15 (success).',
      tone: 'cinematic',
    });

    // Logging now saves the (editable) prose, not the factual recap.
    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));
    expect(onLog).toHaveBeenCalledWith('The Crypt', 'The crypt fell silent.');
  });

  it('surfaces a narration error and still logs the factual recap', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    const narrate = vi.fn(async () => ({ ok: false as const, error: 'AI is off.' }));
    render(
      <RecapPanel state={makeState()} campaignName="Saltmarsh" onLog={onLog} narrate={narrate} />
    );

    await user.click(screen.getByRole('button', { name: /narrate with ai/i }));
    expect(await screen.findByText(/AI is off\./)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /ai narration draft/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));
    expect(onLog).toHaveBeenCalledWith(
      'The Crypt',
      'Checks: Perception 17 vs difficulty 15 (success).'
    );
  });

  it('disables narration when the scene has no facts yet', () => {
    const empty: SceneState = { ...makeState(), checkLog: [], oracleLog: [] };
    render(<RecapPanel state={empty} campaignName="Saltmarsh" onLog={vi.fn()} narrate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /narrate with ai/i })).toBeDisabled();
  });
});

/**
 * Phase 13 — the fact-check beside the prose draft (WORK_PLAN §5.4).
 *
 * These build the `critique` closure out of the REAL `critiqueNarrationWithAi`
 * and the REAL `narrationFactsFromScene`, exactly as `SceneManager` does, so a
 * verdict asserted here is the verdict the shipped critic produces — the panel
 * cannot pass by agreeing with a hand-written fixture the gate would reject.
 * `includeModelReview` is false unless a test ticks the box, so no gateway is
 * involved in the deterministic path.
 */
describe('RecapPanel — narration fact-check', () => {
  function stateWithLivingMonster(): SceneState {
    const base = makeState();
    base.round = 2;
    base.tokens = {
      t1: {
        id: 't1',
        name: 'Grish',
        kind: 'monster',
        position: { x: 1, y: 1 },
        size: 1,
        hp: { current: 5, max: 10 },
      },
    };
    return base;
  }

  /** Narrations the shipped deterministic critic judges (verified in-test). */
  const REFUTED = 'Grish slumps and dies as the torchlight gutters.';
  const SUPPORTED = 'Grish peers into the dark and spots something.';

  function renderWithCritique(
    narrative: string,
    options: { call?: NarrationCritiqueGatewayCall } = {}
  ) {
    const state = stateWithLivingMonster();
    const critique = vi.fn(
      async (params: { narrative: string; includeModelReview: boolean }) =>
        await critiqueNarrationWithAi(
          { narrative: params.narrative, facts: narrationFactsFromScene(state) },
          {
            includeModelReview: params.includeModelReview,
            ...(options.call ? { call: options.call } : {}),
          }
        )
    );
    render(
      <RecapPanel
        state={state}
        campaignName="Saltmarsh"
        onLog={vi.fn()}
        narrate={async () => ({ ok: true, narrative })}
        critique={critique}
      />
    );
    return { critique };
  }

  /** Get a prose draft on screen; the fact-check only exists beside one. */
  async function narrate(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /Narrate with AI/i }));
    await screen.findByRole('textbox', { name: /AI narration draft/i });
  }

  it('offers no fact-check when the host injects no critique closure', async () => {
    const user = userEvent.setup();
    render(
      <RecapPanel
        state={stateWithLivingMonster()}
        campaignName="Saltmarsh"
        onLog={vi.fn()}
        narrate={async () => ({ ok: true, narrative: SUPPORTED })}
      />
    );
    await narrate(user);
    expect(screen.queryByRole('button', { name: /Fact-check/i })).not.toBeInTheDocument();
  });

  it('shows the deterministic verdict and the issue that produced it', async () => {
    const user = userEvent.setup();
    renderWithCritique(REFUTED);
    await narrate(user);

    await user.click(screen.getByRole('button', { name: /Fact-check/i }));

    expect(await screen.findByText(/Contradicts the facts/i)).toBeInTheDocument();
    expect(screen.getByText(/the scene records no such defeat/i)).toBeInTheDocument();
  });

  it('passes a supported narration and says so', async () => {
    const user = userEvent.setup();
    renderWithCritique(SUPPORTED);
    await narrate(user);

    await user.click(screen.getByRole('button', { name: /Fact-check/i }));

    expect(await screen.findByText(/Supported by the facts/i)).toBeInTheDocument();
  });

  it('never blocks logging on a refuted verdict — the check is advisory', async () => {
    const user = userEvent.setup();
    const onLog = vi.fn();
    const state = stateWithLivingMonster();
    render(
      <RecapPanel
        state={state}
        campaignName="Saltmarsh"
        onLog={onLog}
        narrate={async () => ({ ok: true, narrative: REFUTED })}
        critique={async (params) =>
          critiqueNarrationWithAi(
            { narrative: params.narrative, facts: narrationFactsFromScene(state) },
            { includeModelReview: params.includeModelReview }
          )
        }
      />
    );
    await narrate(user);
    await user.click(screen.getByRole('button', { name: /Fact-check/i }));
    await screen.findByText(/Contradicts the facts/i);

    await user.click(screen.getByRole('button', { name: /Log to Saltmarsh/i }));
    expect(onLog).toHaveBeenCalledWith('The Crypt', REFUTED);
  });

  it('drops the verdict once the GM edits the prose it judged', async () => {
    const user = userEvent.setup();
    renderWithCritique(REFUTED);
    await narrate(user);
    await user.click(screen.getByRole('button', { name: /Fact-check/i }));
    expect(await screen.findByText(/Contradicts the facts/i)).toBeInTheDocument();

    // The verdict describes the OLD wording. Leaving it on screen would claim
    // the critic judged text it has never seen.
    await user.type(screen.getByRole('textbox', { name: /AI narration draft/i }), ' Again.');
    expect(screen.queryByText(/Contradicts the facts/i)).not.toBeInTheDocument();
  });

  it('keeps the deterministic verdict when the opt-in model review fails', async () => {
    const user = userEvent.setup();
    const failing = vi.fn(async () => ({
      ok: false as const,
      code: 'provider-not-configured' as const,
      message: 'No provider key is configured.',
    })) as unknown as NarrationCritiqueGatewayCall;
    const { critique } = renderWithCritique(REFUTED, { call: failing });
    await narrate(user);

    await user.click(screen.getByRole('checkbox', { name: /advisory notes/i }));
    await user.click(screen.getByRole('button', { name: /Fact-check/i }));

    expect(critique).toHaveBeenCalledWith({ narrative: REFUTED, includeModelReview: true });
    // The outage is reported, and the verdict the deterministic critic reached
    // is still the one on screen.
    expect(await screen.findByText(/Contradicts the facts/i)).toBeInTheDocument();
    expect(screen.getByText(/optional model review did not run/i)).toBeInTheDocument();
  });
});
