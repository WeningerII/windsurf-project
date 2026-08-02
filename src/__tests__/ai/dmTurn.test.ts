/**
 * RFC 007 AI-DM runtime — the deterministic half, tested without a gateway.
 *
 * Everything here is about the two decisions the model is not allowed to make:
 * what may be offered, and what a chosen option may become.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DM_POLICY,
  DM_ACTOR_ID,
  buildDmTurnOptions,
  chebyshevDistance,
  dmProposalToIntent,
  toDmTurnTokenRef,
  type DmPolicy,
} from '../../ai/dmTurn';
import type { DmTurnActionOption, DmTurnProposal } from '../../ai/contracts';
import type { SceneToken } from '../../types/core/scene';

const ACTOR = { id: 'goblin', name: 'Goblin', position: { x: 5, y: 5 } };

const MOVE_OPTION: DmTurnActionOption = {
  id: 'move',
  verb: 'move',
  label: 'Move up to 3 squares',
  maxDistance: 3,
};

const CHECK_OPTION: DmTurnActionOption = {
  id: 'check-0',
  verb: 'check',
  label: 'Attempt Stealth (DC 13)',
  check: { label: 'Stealth', modifier: 4, dc: 13 },
};

function policy(overrides: Partial<DmPolicy> = {}): DmPolicy {
  return { ...DEFAULT_DM_POLICY, ...overrides };
}

describe('buildDmTurnOptions', () => {
  it('offers a move only when the actor can actually cover ground', () => {
    expect(buildDmTurnOptions({ moveDistance: 4 }).map((option) => option.id)).toContain('move');
    expect(buildDmTurnOptions({ moveDistance: 0 }).map((option) => option.id)).not.toContain(
      'move'
    );
    expect(buildDmTurnOptions({ moveDistance: 0.9 }).map((option) => option.id)).not.toContain(
      'move'
    );
  });

  it('carries the caller-supplied reach onto the move option', () => {
    const move = buildDmTurnOptions({ moveDistance: 6 }).find((option) => option.id === 'move');
    expect(move).toMatchObject({ verb: 'move', maxDistance: 6 });
  });

  it('turns each supplied check into one option that carries its own parameters', () => {
    const options = buildDmTurnOptions({
      moveDistance: 0,
      checks: [
        { label: 'Stealth', modifier: 4, dc: 13 },
        { label: 'Insight', modifier: -1 },
      ],
    });
    expect(options.filter((option) => option.verb === 'check')).toEqual([
      {
        id: 'check-0',
        verb: 'check',
        label: 'Attempt Stealth (DC 13)',
        check: { label: 'Stealth', modifier: 4, dc: 13 },
      },
      {
        id: 'check-1',
        verb: 'check',
        label: 'Attempt Insight',
        check: { label: 'Insight', modifier: -1 },
      },
    ]);
  });

  it('never offers a verb the policy disabled', () => {
    const options = buildDmTurnOptions(
      { moveDistance: 5, checks: [{ label: 'Stealth', modifier: 4 }] },
      policy({ enabledVerbs: ['hold'] })
    );
    expect(options.map((option) => option.verb)).toEqual(['hold']);
  });
});

describe('dmProposalToIntent — the gates the scene runtime does not apply', () => {
  it('rejects a destination beyond the option’s reach', () => {
    const far: DmTurnProposal = { optionId: 'move', destination: { x: 5, y: 12 } };
    const result = dmProposalToIntent(MOVE_OPTION, far, ACTOR);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/only 3 are available/);
  });

  it('accepts a destination exactly at the reach boundary', () => {
    const edge: DmTurnProposal = { optionId: 'move', destination: { x: 8, y: 8 } };
    expect(chebyshevDistance(ACTOR.position, { x: 8, y: 8 })).toBe(3);
    expect(dmProposalToIntent(MOVE_OPTION, edge, ACTOR).ok).toBe(true);
  });

  it('rejects a move that goes nowhere, a fractional cell, and a missing destination', () => {
    expect(dmProposalToIntent(MOVE_OPTION, { optionId: 'move' }, ACTOR).ok).toBe(false);
    expect(
      dmProposalToIntent(MOVE_OPTION, { optionId: 'move', destination: { x: 5, y: 5 } }, ACTOR).ok
    ).toBe(false);
    expect(
      dmProposalToIntent(MOVE_OPTION, { optionId: 'move', destination: { x: 5.5, y: 6 } }, ACTOR).ok
    ).toBe(false);
  });

  it('stamps the actor’s own token id onto the move, never anything from the proposal', () => {
    const proposal = {
      optionId: 'move',
      destination: { x: 6, y: 6 },
      tokenId: 'hero',
    } as unknown as DmTurnProposal;
    const result = dmProposalToIntent(MOVE_OPTION, proposal, ACTOR);
    expect(result).toEqual({
      ok: true,
      intent: {
        type: 'move-token',
        actorId: DM_ACTOR_ID,
        tokenId: 'goblin',
        position: { x: 6, y: 6 },
      },
    });
  });

  it('reads a check’s label, modifier and DC off the OPTION, not off the proposal', () => {
    // A model that echoes back its own arithmetic: every one of these fields is
    // ignored, because none of them is the model's to choose.
    const proposal = {
      optionId: 'check-0',
      label: 'Athletics',
      modifier: 99,
      dc: 1,
    } as unknown as DmTurnProposal;
    const result = dmProposalToIntent(CHECK_OPTION, proposal, ACTOR);
    expect(result).toEqual({
      ok: true,
      intent: {
        type: 'roll-check',
        actorId: DM_ACTOR_ID,
        actorTokenId: 'goblin',
        label: 'Stealth',
        modifier: 4,
        dc: 13,
      },
    });
  });

  it('maps hold to the runtime’s advance-turn intent and nothing else', () => {
    expect(
      dmProposalToIntent({ id: 'hold', verb: 'hold', label: 'Hold' }, { optionId: 'hold' }, ACTOR)
    ).toEqual({ ok: true, intent: { type: 'advance-turn', actorId: DM_ACTOR_ID } });
  });
});

describe('toDmTurnTokenRef', () => {
  it('resolves the effective allegiance rather than exposing the raw override', () => {
    const monster: SceneToken = {
      id: 'ogre',
      name: 'Ogre',
      kind: 'monster',
      position: { x: 2, y: 2 },
      size: 2,
    };
    expect(toDmTurnTokenRef(monster)).toEqual({
      id: 'ogre',
      name: 'Ogre',
      allegiance: 'hostile',
      position: { x: 2, y: 2 },
    });
    expect(toDmTurnTokenRef({ ...monster, allegiance: 'party' }).allegiance).toBe('party');
  });
});
