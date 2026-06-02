/**
 * AI provider seam — the gateway with a no-key deterministic fallback.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted): the LLM is "behind a
 * server function... with no key, every surface degrades to the deterministic/
 * manual tool. The resolver is the mechanics hot path; the LLM runs strictly
 * before (drafting) or after (narration)."
 *
 * This formalizes that gateway. An `AiProvider` bundles the two seams the rest
 * of the engine already exposes — the BEFORE strategist (bias the target choice
 * among enumerated legal candidates) and the AFTER narrator (describe a resolved
 * outcome). `resolveAiProvider` returns the deterministic fallback whenever no
 * provider/key is configured, which is always until a server gateway exists; a
 * real provider plugs in here without touching the mechanics. The fallback never
 * authors mechanics: its strategist defers to the resolver's own scoring and its
 * narrator is the seeded template pool.
 */

import { narrateAttack } from '../narration/combatNarrator';
import type { ScoredTarget, TacticalTarget } from '../tactical/targetScoring';

/** Bias the target choice among the enumerated LEGAL candidates (or defer). */
export type Strategist = (
  legal: readonly ScoredTarget[],
  targets: readonly TacticalTarget[]
) => string | undefined;

/** Describe a resolved attack outcome as prose. */
export type Narrator = typeof narrateAttack;

export interface AiProvider {
  /** The "before" seam: returns undefined to defer to the resolver's scoring. */
  strategist: Strategist;
  /** The "after" seam: turns a resolved outcome into narration. */
  narrator: Narrator;
}

/** The no-key fallback: defer the choice to scoring, narrate deterministically. */
export const deterministicAiProvider: AiProvider = {
  strategist: () => undefined,
  narrator: narrateAttack,
};

/**
 * Resolve the active AI provider from config. With no key (and no server
 * gateway yet), every surface degrades to the deterministic provider — the
 * RFC's mandated fallback. A real, server-gated provider is constructed here
 * once one exists; nothing downstream changes.
 */
export function resolveAiProvider(config?: { apiKey?: string }): AiProvider {
  // A keyed provider would be wired here, behind the server gateway. Until then,
  // and whenever the key is absent, the deterministic tool stands in.
  if (!config?.apiKey) return deterministicAiProvider;
  return deterministicAiProvider;
}
