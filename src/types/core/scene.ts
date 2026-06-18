export type SceneGridType = 'square';
export type SceneTokenKind = 'character' | 'monster' | 'npc' | 'object';
export type SceneMarkerKind = 'terrain' | 'hazard';

export interface SceneGrid {
  type: SceneGridType;
  width: number;
  height: number;
  cellSize: number;
}

export interface SceneCoordinate {
  x: number;
  y: number;
}

export interface SceneTokenHitPoints {
  current: number;
  max: number;
  temp?: number;
}

export interface SceneToken {
  id: string;
  name: string;
  kind: SceneTokenKind;
  position: SceneCoordinate;
  size: number;
  refId?: string;
  hidden?: boolean;
  /**
   * Optional combat hit points. Present for combatant tokens so applied damage
   * and healing land on the grid; absent for objects/markers. Additive — tokens
   * without hp behave exactly as before.
   */
  hp?: SceneTokenHitPoints;
  /**
   * Active condition ids (system vocabulary, e.g. 5e 'poisoned'). Additive —
   * tokens without conditions fight exactly as before; the combat bridge folds
   * these into attack resolution.
   */
  conditions?: string[];
  /**
   * When true, the autonomous round (Run Round) does not act for this token —
   * the human plays its turn. Defaults to false (engine-driven). Character
   * tokens are placed player-controlled so a solo player keeps their own party.
   */
  playerControlled?: boolean;
}

export interface SceneMarker {
  id: string;
  kind: SceneMarkerKind;
  label: string;
  position: SceneCoordinate;
  width: number;
  height: number;
  /**
   * Optional functional-terrain effects, drawn from the system-agnostic rules IR
   * (docs/rfc/003-rules-ir-and-effects.md). When present, the terrain becomes
   * mechanically real: a cell covered by this marker contributes these effects to
   * resolution (e.g. deep water halving fire damage, difficult terrain raising
   * movement cost). Additive and optional — markers without effects render and
   * behave exactly as before. The field is typed loosely here (the core scene
   * types do not depend on the rules module); the terrain helper validates shape.
   */
  effects?: SceneTerrainEffect[];
}

/**
 * A structurally-typed terrain effect stored on a scene marker. Mirrors the
 * shape of the rules IR `EffectInstance` without importing it, so `scene.ts`
 * stays free of a rules-module dependency. The terrain resolution helper in
 * `src/rules` maps these onto real `EffectInstance`s.
 */
export interface SceneTerrainEffect {
  target: string;
  operation: string;
  value: number | string | number[] | null;
  label: string;
  stackPolicy?: unknown;
}

export interface SceneInitiativeEntry {
  tokenId: string;
  value: number;
}

export type SceneCheckOutcome = 'success' | 'failure' | 'unresolved';

/**
 * A resolved d20 ability/skill check: `total` is `die + modifier`, and
 * `outcome` compares it to `dc` (or `unresolved` when no DC was given — a
 * bare roll the player adjudicates). Like {@link SceneTokenDamage}, the dice
 * are rolled before the event is created and the resolved values are stored,
 * so the fold stays pure and replay-deterministic.
 */
export interface SceneCheckResult {
  /** Raw d20 face (1–20). */
  die: number;
  modifier: number;
  dc?: number;
  total: number;
  outcome: SceneCheckOutcome;
}

/** A check result as it lives in the scene's check log. */
export interface SceneCheckLogEntry extends SceneCheckResult {
  /** The originating event id. */
  id: string;
  /** What was rolled, e.g. "Perception" or "Stealth". */
  label: string;
  /** The token that made the check, when tied to a combatant. */
  actorTokenId?: string;
  createdAt: Date;
}

export interface SceneState {
  sceneId: string;
  name: string;
  systemId: string;
  campaignId?: string;
  grid: SceneGrid;
  tokens: Record<string, SceneToken>;
  markers: Record<string, SceneMarker>;
  initiative: SceneInitiativeEntry[];
  round: number;
  activeTokenId?: string;
  seed: string;
  /** Resolved ability/skill checks, oldest first. */
  checkLog: SceneCheckLogEntry[];
}

export type SceneEventType =
  | 'token.added'
  | 'token.moved'
  | 'token.removed'
  | 'token.damaged'
  | 'token.conditions-set'
  | 'marker.added'
  | 'marker.removed'
  | 'initiative.set'
  | 'turn.advanced'
  | 'check.rolled';

/**
 * Applied hit-point delta for one token, recorded on a `token.damaged` event.
 * Positive `amount` is damage, negative is healing. The event stores the
 * already-resolved amount (RNG happens before the event is created), so the fold
 * stays pure and replay-deterministic.
 */
export interface SceneTokenDamage {
  tokenId: string;
  amount: number;
}

export interface SceneEventBase<TType extends SceneEventType, TPayload> {
  id: string;
  type: TType;
  sequence: number;
  createdAt: Date;
  actorId?: string;
  payload: TPayload;
}

export type SceneEvent =
  | SceneEventBase<'token.added', { token: SceneToken }>
  | SceneEventBase<'token.moved', { tokenId: string; position: SceneCoordinate }>
  | SceneEventBase<'token.removed', { tokenId: string }>
  | SceneEventBase<'token.damaged', { damages: SceneTokenDamage[]; cause?: string }>
  | SceneEventBase<'token.conditions-set', { tokenId: string; conditions: string[] }>
  | SceneEventBase<'marker.added', { marker: SceneMarker }>
  | SceneEventBase<'marker.removed', { markerId: string }>
  | SceneEventBase<'initiative.set', { entries: SceneInitiativeEntry[]; activeTokenId?: string }>
  | SceneEventBase<'turn.advanced', { nextTokenId?: string }>
  | SceneEventBase<'check.rolled', SceneCheckResult & { label: string; actorTokenId?: string }>;

export interface SceneDocument {
  id: string;
  name: string;
  systemId: string;
  campaignId?: string;
  initialState: SceneState;
  events: SceneEvent[];
  createdAt: Date;
  updatedAt: Date;
  version: 1;
}

export type SceneActionType =
  | 'place-token'
  | 'move-token'
  | 'remove-token'
  | 'apply-damage'
  | 'set-token-conditions'
  | 'add-marker'
  | 'remove-marker'
  | 'set-initiative'
  | 'advance-turn'
  | 'roll-check';

export type SceneActionIntent =
  | { type: 'place-token'; actorId?: string; token: SceneToken }
  | { type: 'move-token'; actorId?: string; tokenId: string; position: SceneCoordinate }
  | { type: 'remove-token'; actorId?: string; tokenId: string }
  | { type: 'apply-damage'; actorId?: string; damages: SceneTokenDamage[]; cause?: string }
  | { type: 'set-token-conditions'; actorId?: string; tokenId: string; conditions: string[] }
  | { type: 'add-marker'; actorId?: string; marker: SceneMarker }
  | { type: 'remove-marker'; actorId?: string; markerId: string }
  | {
      type: 'set-initiative';
      actorId?: string;
      entries: SceneInitiativeEntry[];
      activeTokenId?: string;
    }
  | { type: 'advance-turn'; actorId?: string }
  | {
      type: 'roll-check';
      actorId?: string;
      /** The token making the check, when tied to a combatant. */
      actorTokenId?: string;
      label: string;
      modifier: number;
      dc?: number;
    };

export interface SceneIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning';
  eventId?: string;
  sequence?: number;
}
