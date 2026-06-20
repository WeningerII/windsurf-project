import type { SceneAllegiance, SceneToken, SceneTokenKind } from '../types/core/scene';

/**
 * Default combat side for a token kind, before any per-token override:
 * characters fight with the party, monsters against it, and npc/object tokens
 * are non-combatants until explicitly sided. Shared by the combat layer
 * (targeting) and the grid view (rendering) so they never disagree on a token's
 * side, and kept dependency-light so the presentational grid need not import the
 * rules engine.
 */
export function defaultAllegiance(kind: SceneTokenKind): SceneAllegiance {
  switch (kind) {
    case 'character':
      return 'party';
    case 'monster':
      return 'hostile';
    default:
      return 'neutral';
  }
}

/** A token's effective combat side: its explicit allegiance, else the kind default. */
export function tokenAllegiance(token: Pick<SceneToken, 'kind' | 'allegiance'>): SceneAllegiance {
  return token.allegiance ?? defaultAllegiance(token.kind);
}
