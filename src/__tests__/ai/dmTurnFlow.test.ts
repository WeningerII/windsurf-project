/**
 * RFC 007 AI-DM runtime — the proposal → intent → event boundary.
 *
 * Every test here is about a privilege the AI-DM must NOT have. The happy path
 * is present only so the refusals are meaningful.
 */
import { describe, expect, it } from 'vitest';
import { runDmTurn, type DmTurnGatewayCall } from '../../ai/dmTurnFlow';
import { DEFAULT_DM_POLICY, type DmPolicy } from '../../ai/dmTurn';
import type { DmTurnIntentData, DmTurnIntentPayload, DmTurnProposal } from '../../ai/contracts';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneActionIntent, SceneDocument, SceneToken } from '../../types/core/scene';

const NOW = new Date('2026-08-01T12:00:00.000Z');

function token(id: string, kind: SceneToken['kind'], x: number, y: number): SceneToken {
  return { id, name: id, kind, position: { x, y }, size: 1 };
}

function append(scene: SceneDocument, intent: SceneActionIntent, eventId: string): SceneDocument {
  const result = resolveSceneAction(scene, intent, { eventId, createdAt: NOW });
  expect(result.issues).toEqual([]);
  return appendSceneEvent(scene, result.event!);
}

/** A goblin (acting) and a hero, with initiative set and the goblin up. */
function makeScene(systemId = 'dnd-5e-2024', withInitiative = true): SceneDocument {
  let scene = createSceneDocument({
    id: 'scene-dm',
    name: 'Ambush',
    systemId,
    grid: { width: 12, height: 12 },
    seed: 'dm-seed',
    now: NOW,
  });
  scene = append(scene, { type: 'place-token', token: token('goblin', 'monster', 5, 5) }, 'ev-1');
  scene = append(scene, { type: 'place-token', token: token('hero', 'character', 1, 1) }, 'ev-2');
  if (withInitiative) {
    scene = append(
      scene,
      {
        type: 'set-initiative',
        entries: [
          { tokenId: 'goblin', value: 18 },
          { tokenId: 'hero', value: 10 },
        ],
        activeTokenId: 'goblin',
      },
      'ev-3'
    );
  }
  return scene;
}

/** A gateway that answers with the given data, one response per call. */
function gateway(
  responses: DmTurnIntentData[],
  seen: DmTurnIntentPayload[] = []
): DmTurnGatewayCall {
  let index = 0;
  return <TData>(_task: 'dm-turn-intent', payload: unknown) => {
    seen.push(payload as DmTurnIntentPayload);
    const data = responses[Math.min(index, responses.length - 1)];
    index += 1;
    return Promise.resolve({
      ok: true as const,
      task: 'dm-turn-intent' as const,
      data: data as TData,
      usage: { source: 'fixture' as const },
    });
  };
}

/** Pinned event ids, so every seeded roll below is reproducible. */
function ids(prefix = 'dm-event'): () => string {
  let n = 0;
  return () => `${prefix}-${(n += 1)}`;
}

const MOVE: DmTurnProposal = { optionId: 'move', destination: { x: 6, y: 6 } };
const CHECKS = [{ label: 'Stealth', modifier: 4, dc: 13 }];

function policy(overrides: Partial<DmPolicy> = {}): DmPolicy {
  return { ...DEFAULT_DM_POLICY, ...overrides };
}

describe('runDmTurn — the proposal reaches the log only through the runtime', () => {
  it('applies an accepted move as an ordinary token.moved event, attributed to the AI-DM', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway([{ proposals: [MOVE], rationale: 'Flank the hero.' }]),
        eventIdFactory: ids(),
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.rejected).toEqual([]);
    expect(result.rationale).toBe('Flank the hero.');
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      type: 'token.moved',
      actorId: 'ai-dm',
      payload: { tokenId: 'goblin', position: { x: 6, y: 6 } },
    });
  });

  it('drops an option id the model invented, and applies nothing for it', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway([
          { proposals: [{ optionId: 'cast-fireball', destination: { x: 6, y: 6 } }] },
        ]),
        eventIdFactory: ids(),
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toEqual([]);
    expect(result.rejected.join(' ')).toMatch(/'cast-fireball' is not one of the offered actions/);
  });

  it('refuses to run a turn that is not the actor’s', async () => {
    const seen: DmTurnIntentPayload[] = [];
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'hero', moveDistance: 3 },
      { call: gateway([{ proposals: [MOVE] }], seen), eventIdFactory: ids() }
    );

    expect(result).toEqual({ ok: false, error: "It is not hero's turn." });
    // And it refused BEFORE spending a provider call.
    expect(seen).toEqual([]);
  });

  it('refuses an actor that is not in the scene', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'wyvern', moveDistance: 3 },
      { call: gateway([{ proposals: [MOVE] }]), eventIdFactory: ids() }
    );
    expect(result).toEqual({ ok: false, error: "Token 'wyvern' is not in this scene." });
  });

  it('surfaces the runtime’s veto instead of appending — a hold with no initiative', async () => {
    const result = await runDmTurn(
      makeScene('dnd-5e-2024', false),
      { actorTokenId: 'goblin', moveDistance: 0, policy: policy({ enabledVerbs: ['hold'] }) },
      { call: gateway([{ proposals: [{ optionId: 'hold' }] }]), eventIdFactory: ids() }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toEqual([]);
    expect(result.rejected.join(' ')).toMatch(/no initiative order has been set/);
  });

  it('caps applied proposals at the policy’s per-turn limit and reports the surplus', async () => {
    const scene = makeScene();
    const result = await runDmTurn(
      scene,
      {
        actorTokenId: 'goblin',
        moveDistance: 3,
        checks: CHECKS,
        policy: policy({ maxProposalsPerTurn: 1 }),
      },
      {
        call: gateway([{ proposals: [MOVE, { optionId: 'check-0' }] }]),
        eventIdFactory: ids(),
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(1);
    expect(result.events[0]!.type).toBe('token.moved');
    expect(result.rejected.join(' ')).toMatch(/at most 1 action\(s\) per turn/);
  });

  it('holds a confirm-listed verb back as a typed intent instead of applying it', async () => {
    const result = await runDmTurn(
      makeScene(),
      {
        actorTokenId: 'goblin',
        moveDistance: 3,
        checks: CHECKS,
        policy: policy({ confirmVerbs: ['check'] }),
      },
      {
        call: gateway([{ proposals: [MOVE, { optionId: 'check-0' }] }]),
        eventIdFactory: ids(),
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.map((event) => event.type)).toEqual(['token.moved']);
    expect(result.pending).toEqual([
      {
        option: {
          id: 'check-0',
          verb: 'check',
          label: 'Attempt Stealth (DC 13)',
          check: { label: 'Stealth', modifier: 4, dc: 13 },
        },
        intent: {
          type: 'roll-check',
          actorId: 'ai-dm',
          actorTokenId: 'goblin',
          label: 'Stealth',
          modifier: 4,
          dc: 13,
        },
      },
    ]);
  });

  it('spends exactly one bounded repair, and stops asking after it', async () => {
    const seen: DmTurnIntentPayload[] = [];
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway(
          [
            { proposals: [{ optionId: 'teleport' }] },
            { proposals: [{ optionId: 'teleport' }] },
            { proposals: [MOVE] },
          ],
          seen
        ),
        eventIdFactory: ids(),
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(seen).toHaveLength(2);
    expect(seen[0]!.repairIssues).toBeUndefined();
    expect(seen[1]!.repairIssues?.join(' ')).toMatch(/'teleport' is not one of the offered/);
    // The third, valid answer was never requested: the budget is 1, not "retry
    // until it works".
    expect(result.events).toEqual([]);
  });

  it('takes the repaired answer when the second attempt is valid', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway([{ proposals: [{ optionId: 'teleport' }] }, { proposals: [MOVE] }]),
        eventIdFactory: ids(),
      }
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(1);
    expect(result.rejected).toEqual([]);
  });

  it('sends only fold-derived facts and the closed option pool to the model', async () => {
    const seen: DmTurnIntentPayload[] = [];
    await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3, checks: CHECKS },
      { call: gateway([{ proposals: [MOVE] }], seen), eventIdFactory: ids() }
    );

    const payload = seen[0]!;
    expect(payload.systemId).toBe('dnd-5e-2024');
    expect(payload.round).toBe(1);
    expect(payload.actor).toEqual({
      id: 'goblin',
      name: 'goblin',
      allegiance: 'hostile',
      position: { x: 5, y: 5 },
    });
    expect(payload.tokens).toEqual([
      { id: 'hero', name: 'hero', allegiance: 'party', position: { x: 1, y: 1 } },
    ]);
    expect(payload.options.map((option) => option.id)).toEqual(['move', 'check-0', 'hold']);
  });
});

/**
 * The batch-level gates. Every proposal below is individually well-formed and
 * individually legal — an id from the pool, a destination in reach, a check the
 * caller offered. The privilege is bought by the SHAPE of the list, which is
 * the one thing neither `dmProposalToIntent` (one proposal at a time) nor
 * `resolveSceneAction` (one intent at a time, and it never gates who acts) is
 * positioned to see.
 */
describe('runDmTurn — a well-formed proposal LIST is not automatically a legal turn', () => {
  it('takes an offered check once, not twice — a repeat is a reroll of the same check', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 0, checks: CHECKS },
      {
        call: gateway([{ proposals: [{ optionId: 'check-0' }, { optionId: 'check-0' }] }]),
        eventIdFactory: ids(),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(1);
    expect(result.rejected.join(' ')).toMatch(/already taken this turn/);
  });

  it('measures a move once: a repeated move option cannot spend the same reach twice', async () => {
    const scene = makeScene();
    const result = await runDmTurn(
      scene,
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway([
          {
            proposals: [
              { optionId: 'move', destination: { x: 8, y: 5 } },
              // Legal on its own — 3 squares from where the goblin STARTED —
              // but 6 more from where the first move leaves it.
              { optionId: 'move', destination: { x: 2, y: 5 } },
            ],
          },
        ]),
        eventIdFactory: ids(),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events).toHaveLength(1);
    let applied = scene;
    for (const event of result.events) applied = appendSceneEvent(applied, event);
    const moved = foldSceneEvents(applied).state.tokens.goblin!;
    expect(moved.position).toEqual({ x: 8, y: 5 });
    expect(result.rejected.join(' ')).toMatch(/already taken this turn/);
  });

  it('passes the turn once — it cannot consume the next creature’s turn as well', async () => {
    const scene = makeScene();
    const result = await runDmTurn(
      scene,
      { actorTokenId: 'goblin', moveDistance: 0 },
      {
        call: gateway([{ proposals: [{ optionId: 'hold' }, { optionId: 'hold' }] }]),
        eventIdFactory: ids(),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.map((event) => event.type)).toEqual(['turn.advanced']);
    let applied = scene;
    for (const event of result.events) applied = appendSceneEvent(applied, event);
    const state = foldSceneEvents(applied).state;
    // The hero still gets the turn the AI-DM was about to skip past.
    expect(state.activeTokenId).toBe('hero');
    expect(state.round).toBe(1);
  });

  it('lets nothing act after the turn is passed — the pre-flight turn gate is not re-run', async () => {
    const scene = makeScene();
    const result = await runDmTurn(
      scene,
      { actorTokenId: 'goblin', moveDistance: 3 },
      {
        call: gateway([
          { proposals: [{ optionId: 'hold' }, { optionId: 'move', destination: { x: 8, y: 5 } }] },
        ]),
        eventIdFactory: ids(),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.map((event) => event.type)).toEqual(['turn.advanced']);
    let applied = scene;
    for (const event of result.events) applied = appendSceneEvent(applied, event);
    const state = foldSceneEvents(applied).state;
    expect(state.activeTokenId).toBe('hero');
    // The goblin did not move on the hero's turn.
    expect(state.tokens.goblin!.position).toEqual({ x: 5, y: 5 });
    expect(result.rejected.join(' ')).toMatch(/comes after the turn was passed/);
  });

  it('still allows two DIFFERENT offered actions in one turn', async () => {
    const result = await runDmTurn(
      makeScene(),
      { actorTokenId: 'goblin', moveDistance: 3, checks: CHECKS },
      {
        call: gateway([{ proposals: [MOVE, { optionId: 'check-0' }] }]),
        eventIdFactory: ids(),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.events.map((event) => event.type)).toEqual(['token.moved', 'check.rolled']);
    expect(result.rejected).toEqual([]);
  });
});

describe('runDmTurn — determinism and replay (RFC 006’s contract, unweakened)', () => {
  it('stores the resolved check on the event, so the fold never re-rolls it', async () => {
    const scene = makeScene();
    const result = await runDmTurn(
      scene,
      { actorTokenId: 'goblin', moveDistance: 0, checks: CHECKS },
      {
        call: gateway([{ proposals: [{ optionId: 'check-0' }] }]),
        eventIdFactory: ids('pinned'),
        now: () => NOW,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const event = result.events[0]!;
    expect(event.type).toBe('check.rolled');
    const payload = event.payload as { die: number; modifier: number; total: number };
    expect(payload.modifier).toBe(4);
    expect(payload.total).toBe(payload.die + 4);

    // The fold reads the stored figure rather than resolving anything itself:
    // replaying the same log twice produces byte-identical state, and the
    // logged total is the event's, not a fresh roll.
    const replayed = result.events.reduce(appendSceneEvent, scene);
    const first = JSON.stringify(foldSceneEvents(replayed).state);
    const second = JSON.stringify(foldSceneEvents(replayed).state);
    expect(first).toBe(second);
    expect(foldSceneEvents(replayed).state.checkLog[0]).toMatchObject({
      id: 'pinned-1',
      label: 'Stealth',
      total: payload.total,
    });
  });

  it('produces the identical event log for identical inputs — no model in the replay', async () => {
    const run = () =>
      runDmTurn(
        makeScene(),
        { actorTokenId: 'goblin', moveDistance: 3, checks: CHECKS },
        {
          call: gateway([{ proposals: [MOVE, { optionId: 'check-0' }] }]),
          eventIdFactory: ids('pinned'),
          now: () => NOW,
        }
      );
    const [a, b] = await Promise.all([run(), run()]);
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(JSON.stringify(a.events)).toBe(JSON.stringify(b.events));
  });
});

describe('runDmTurn — peer-system by construction', () => {
  const SYSTEMS = [
    'dnd-5e-2024',
    'dnd-5e',
    'dnd-3-5e',
    'pathfinder-1e',
    'pathfinder-2e',
    'mutants-masterminds-3e',
    'daggerheart',
  ];

  it('runs the same loop for all seven systems, with no per-system branch', async () => {
    const logs = await Promise.all(
      SYSTEMS.map(async (systemId) => {
        const seen: DmTurnIntentPayload[] = [];
        const result = await runDmTurn(
          makeScene(systemId),
          { actorTokenId: 'goblin', moveDistance: 3, checks: CHECKS },
          {
            call: gateway([{ proposals: [MOVE] }], seen),
            eventIdFactory: ids('pinned'),
            now: () => NOW,
          }
        );
        expect(result.ok).toBe(true);
        // The systemId reaches the prompt and nothing else.
        expect(seen[0]!.systemId).toBe(systemId);
        expect(seen[0]!.options.map((option) => option.id)).toEqual(['move', 'check-0', 'hold']);
        return result.ok ? JSON.stringify(result.events) : '';
      })
    );
    expect(new Set(logs).size).toBe(1);
  });
});
