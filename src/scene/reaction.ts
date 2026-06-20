import type { SeededRng } from './seededRng';

/**
 * NPC reaction (disposition) on the classic 2d6 reaction table — a deterministic
 * GM-emulation tool for "how does this NPC take to the party?" without an AI.
 * A modifier (social skill, prior rapport) shifts the total; the band sets the
 * attitude. Honest: real seeded dice, the player interprets the result. The
 * free-text dialogue an NPC then speaks is a separate (AI-port) concern.
 */
export type SceneReactionDisposition =
  | 'hostile'
  | 'unfriendly'
  | 'indifferent'
  | 'friendly'
  | 'helpful';

export interface SceneReactionResult {
  /** The two d6 faces. */
  rolls: [number, number];
  modifier: number;
  total: number;
  disposition: SceneReactionDisposition;
}

/** Map a modified 2d6 total to a disposition band (≤2 hostile … ≥12 helpful). */
export function dispositionForTotal(total: number): SceneReactionDisposition {
  if (total <= 2) return 'hostile';
  if (total <= 5) return 'unfriendly';
  if (total <= 8) return 'indifferent';
  if (total <= 11) return 'friendly';
  return 'helpful';
}

/** Resolve a reaction from two d6 faces and a modifier. Pure. */
export function resolveReaction(a: number, b: number, modifier: number): SceneReactionResult {
  const total = a + b + modifier;
  return { rolls: [a, b], modifier, total, disposition: dispositionForTotal(total) };
}

/** Roll 2d6 from the RNG and resolve the reaction. */
export function rollReaction(rng: SeededRng, modifier: number): SceneReactionResult {
  return resolveReaction(rng.rollDie(6), rng.rollDie(6), modifier);
}
