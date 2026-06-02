/**
 * Deterministic combat narration — the no-key fallback for the resolution /
 * narration split.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted): the LLM runs strictly
 * before (drafting) or after (narration), and "with no key, every surface
 * degrades to the deterministic/manual tool." This is that degraded narration:
 * it turns a resolved outcome into varied prose chosen from a seeded template
 * pool, so a solo player gets vivid, replayable description without a model in
 * the loop. An LLM later embellishes the same structured outcome; nothing here
 * authors mechanics.
 */

import { createSeededRng } from '../../scene/seededRng';

/** The shape of an attack's outcome, abstracted from any one system. */
export type AttackTone = 'crit' | 'hit' | 'miss' | 'fumble';

type Template = (attacker: string, target: string, damage: number) => string;

const TEMPLATES: Record<AttackTone, Template[]> = {
  crit: [
    (a, t, d) => `${a} finds the opening — a savage blow rocks ${t} for ${d}.`,
    (a, t, d) => `${a} strikes true; ${t} reels under ${d} damage.`,
    (a, t, d) => `A perfect hit! ${a} tears into ${t} for ${d}.`,
  ],
  hit: [
    (a, t, d) => `${a} lands a solid hit on ${t} for ${d}.`,
    (a, t, d) => `${a} connects, dealing ${d} to ${t}.`,
    (a, t, d) => `${t} takes ${d} as ${a}'s attack gets through.`,
  ],
  miss: [
    (a, t) => `${a} swings at ${t} but comes up short.`,
    (a, t) => `${t} slips aside; ${a}'s attack finds only air.`,
    (a, t) => `${a} presses ${t}, but the blow is turned away.`,
  ],
  fumble: [
    (a, t) => `${a} overcommits and stumbles past ${t}.`,
    (a, t) => `${a}'s attack goes wide, badly out of measure with ${t}.`,
  ],
};

/**
 * Narrate one attack outcome. The variant is chosen deterministically from a
 * seed keyed by the attacker→target pairing, so a round replays identically yet
 * different exchanges read differently.
 */
export function narrateAttack(params: {
  attacker: string;
  target: string;
  tone: AttackTone;
  damage?: number;
  seed: string;
}): string {
  const variants = TEMPLATES[params.tone];
  const index = createSeededRng(
    `${params.seed}::narrate::${params.attacker}->${params.target}::${params.tone}`
  ).nextInt(variants.length);
  return variants[index](params.attacker, params.target, params.damage ?? 0);
}
