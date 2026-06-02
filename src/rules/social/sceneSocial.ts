/**
 * Scene social bridge — run a multi-NPC conversation on a scene.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution".
 *
 * The mirror of the scene combat bridge, for the social loop: a speaker token
 * addresses the scene's NPC tokens, each reacts on its own attitude-adjusted DC
 * (resolveSocialAction), and every shift becomes a `set-attitude` intent so it
 * lands through the same event-sourced path as combat damage. Pure and
 * deterministic — the only randomness is the seeded RNG inside the resolver.
 */

import type { SceneActionIntent, SceneState, SceneToken } from '../../types/core/scene';
import {
  ATTITUDES,
  resolveSocialAction,
  type Attitude,
  type SocialApproach,
  type SocialNpcOutcome,
} from '../resolver/socialResolution';

const DEFAULT_ATTITUDE: Attitude = 'indifferent';

/** Read a token's stored attitude string as a valid Attitude (default indifferent). */
export function tokenAttitude(token: SceneToken): Attitude {
  return (ATTITUDES as readonly string[]).includes(token.attitude ?? '')
    ? (token.attitude as Attitude)
    : DEFAULT_ATTITUDE;
}

export interface SceneSocialOutcome {
  /** One set-attitude intent per NPC whose disposition actually moved. */
  intents: SceneActionIntent[];
  /** Header + per-NPC lines for the conversation log. */
  log: string[];
  /** The full per-NPC resolution (for display / inspection). */
  outcomes: SocialNpcOutcome[];
}

/**
 * Resolve a social action by a speaker against the scene's NPC tokens (the N
 * participants). Each NPC reacts independently; shifts are returned as
 * `set-attitude` intents for the caller to apply as scene events.
 */
export function resolveSceneSocialAction(params: {
  state: SceneState;
  speakerId: string;
  /** The speaker's social skill modifier (GM-provided or sheet-derived). */
  modifier: number;
  baseDC: number;
  approach?: SocialApproach;
  seed: string;
  /** Restrict to specific NPC ids; default = every npc-kind token. */
  targetIds?: readonly string[];
}): SceneSocialOutcome {
  const { state, speakerId } = params;
  const nameOf = (id: string): string => state.tokens[id]?.name ?? id;

  const npcs = Object.values(state.tokens).filter(
    (token) =>
      token.id !== speakerId &&
      token.kind === 'npc' &&
      (!params.targetIds || params.targetIds.includes(token.id))
  );
  if (npcs.length === 0) {
    return {
      intents: [],
      log: [`${nameOf(speakerId)} addresses the room, but no NPCs are listening.`],
      outcomes: [],
    };
  }

  const result = resolveSocialAction({
    systemId: state.systemId,
    speakerId,
    modifier: params.modifier,
    baseDC: params.baseDC,
    targets: npcs.map((token) => ({ id: token.id, attitude: tokenAttitude(token) })),
    seed: params.seed,
    approach: params.approach,
  });

  const intents: SceneActionIntent[] = result.outcomes
    .filter((outcome) => outcome.after !== outcome.before)
    .map((outcome) => ({
      type: 'set-attitude',
      actorId: speakerId,
      tokenId: outcome.npcId,
      attitude: outcome.after,
    }));

  const header = `${nameOf(speakerId)} tries ${params.approach ?? 'persuasion'} on ${npcs.length} NPC(s).`;
  const lines = result.outcomes.map((outcome) => {
    const verb =
      outcome.steps > 0 ? 'warms to' : outcome.steps < 0 ? 'sours toward' : 'is unmoved by';
    const shift =
      outcome.before === outcome.after ? outcome.after : `${outcome.before}→${outcome.after}`;
    return `  ${nameOf(outcome.npcId)} ${verb} ${nameOf(speakerId)} — ${outcome.result.outcome} (${shift}).`;
  });

  return { intents, log: [header, ...lines], outcomes: result.outcomes };
}
