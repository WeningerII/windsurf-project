/**
 * The structured fact set a narration is judged against (Phase 13, the
 * narration critic — RFC 002 applied to prose).
 *
 * `scene-narration` hands the model ONE string: the deterministic recap from
 * `summarizeSceneForLog`. That string is the whole of what the narration is
 * allowed to assert, so it is the critic's primary ground truth. But a string
 * cannot answer "is Grish recorded as defeated?" without re-parsing prose, and
 * a critic that re-parses its own ground truth is guessing. So this module
 * carries the recap text ALONGSIDE the structured facts it was built from —
 * exact token names, which of them the scene records at 0 hp, and the round —
 * read straight off `SceneState`.
 *
 * Pure and side-effect free. It derives nothing the recap does not already
 * know; it just keeps the checkable parts in a checkable shape.
 */
import type { SceneState } from '../types/core/scene';
import { summarizeSceneForLog } from '../scene/sceneRecap';

export interface NarrationFacts {
  /**
   * The exact recap text the narrator was given. By the `scene-narration`
   * prompt's own rule ("use ONLY the facts below"), anything the narration
   * asserts that is absent from this text is unsupported.
   */
  text: string;
  /** Every token name in the scene, exactly as spelled. */
  names: readonly string[];
  /** Names the scene records at 0 or fewer hit points. */
  defeated: readonly string[];
  /** The round the scene reached. */
  round: number;
}

/**
 * Build the fact set from a scene. `text` defaults to the SHIPPED recap, so the
 * critic judges against the same string the narration surface sends rather than
 * a second, quieter idea of what happened; pass `text` explicitly only when the
 * caller narrated something else (an edited recap, say).
 */
export function narrationFactsFromScene(
  state: SceneState,
  options: { text?: string } = {}
): NarrationFacts {
  const tokens = Object.values(state.tokens);
  return {
    text: options.text ?? summarizeSceneForLog(state),
    names: tokens.map((token) => token.name),
    defeated: tokens
      .filter((token) => token.hp && token.hp.current <= 0)
      .map((token) => token.name),
    round: state.round,
  };
}

/**
 * Fact set for a caller that holds only the recap text (no scene). Every
 * text-derived check still runs; the checks that need the structured scene —
 * defeat attribution and omission — are inert, because there is nothing to
 * attribute against. That degradation is the honest one: a missing check
 * reports nothing, it never reports "supported".
 */
export function narrationFactsFromText(text: string): NarrationFacts {
  return { text, names: [], defeated: [], round: 0 };
}
