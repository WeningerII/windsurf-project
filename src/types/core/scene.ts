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
  /**
   * Optional elevation in grid cells (same unit as x/y; one cell = 5 ft), for
   * flight and verticality. Absent means ground level (0). Stored as cells so the
   * per-system diagonal math stays integer; the UI shows/sets it in feet. The
   * grid footprint does not bound it — a token can be any height above its cell.
   */
  z?: number;
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
   * For an `object` token (a crate, statue, door): blocks line of effect like a
   * wall while it stands. With optional hit points it can be attacked and
   * destroyed, after which it no longer blocks — destructible cover.
   */
  blocksLineOfEffect?: boolean;
  /**
   * Optional wall height in cells for a blocking object (absent = full height),
   * so a low object can be seen and shot over, exactly like a low wall marker.
   */
  wallHeight?: number;
  /**
   * Optional combat hit points. Present for combatant tokens so applied damage
   * and healing land on the grid; absent for objects/markers. Additive — tokens
   * without hp behave exactly as before.
   */
  hp?: SceneTokenHitPoints;
  /**
   * Optional social attitude toward the party for NPC tokens, on the classic
   * hostile→helpful track (stored as a string to keep this layer decoupled from
   * the rules engine). Shifted by `token.attitude-changed` events; absent for
   * tokens that aren't part of a social scene.
   */
  attitude?: string;
  /**
   * Active named conditions on this token (prone, frightened, poisoned, …),
   * system-agnostic for tracking and set by `token.statuses-changed`. The rules
   * layer maps the ones it knows onto mechanics (e.g. 5e advantage/disadvantage);
   * the rest are still tracked and shown. Stored lowercased and de-duplicated.
   */
  statuses?: string[];
  /**
   * The spell this token is concentrating on (5e), or absent when not. Set by
   * `token.concentration-changed`; cleared when a failed concentration save on
   * taking damage breaks it.
   */
  concentration?: string;
  /**
   * 5e death-saving-throw tally for a downed character (at 0 HP, not yet dead).
   * Set by `token.death-saves-changed`; three successes stabilize, three
   * failures kill. Absent while the token is up.
   */
  deathSaves?: { successes: number; failures: number };
  /**
   * Optional M&M-style condition track (the systems without hit points track
   * harm as conditions, not HP). Accumulated by `token.conditions-changed`
   * events; `incapacitated` is the "down" state for such combatants.
   */
  conditions?: SceneConditionTrack;
}

/** A condition track for non-HP combatants (M&M 3e). Bruised stacks; the rest are flags. */
export interface SceneConditionTrack {
  bruised: number;
  dazed: boolean;
  staggered: boolean;
  incapacitated: boolean;
}

export interface SceneMarker {
  id: string;
  kind: SceneMarkerKind;
  label: string;
  position: SceneCoordinate;
  width: number;
  height: number;
  /**
   * Optional wall height in grid cells (one cell = 5 ft), for a line-of-effect
   * marker. Absent means a full-height wall (blocks at every elevation, the prior
   * behavior); a finite value lets a sight line pass over the top — a flyer can
   * see and shoot over a low wall that still blocks creatures on the ground.
   */
  wallHeight?: number;
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
}

export type SceneEventType =
  | 'token.added'
  | 'token.moved'
  | 'token.removed'
  | 'token.damaged'
  | 'token.attitude-changed'
  | 'token.conditions-changed'
  | 'token.statuses-changed'
  | 'token.concentration-changed'
  | 'token.death-saves-changed'
  | 'marker.added'
  | 'marker.removed'
  | 'initiative.set'
  | 'turn.advanced';

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
  | SceneEventBase<'token.attitude-changed', { tokenId: string; attitude: string }>
  | SceneEventBase<'token.conditions-changed', { tokenId: string; delta: SceneConditionTrack }>
  | SceneEventBase<'token.statuses-changed', { tokenId: string; statuses: string[] }>
  | SceneEventBase<'token.concentration-changed', { tokenId: string; spell?: string }>
  | SceneEventBase<
      'token.death-saves-changed',
      { tokenId: string; deathSaves?: { successes: number; failures: number } }
    >
  | SceneEventBase<'marker.added', { marker: SceneMarker }>
  | SceneEventBase<'marker.removed', { markerId: string }>
  | SceneEventBase<'initiative.set', { entries: SceneInitiativeEntry[]; activeTokenId?: string }>
  | SceneEventBase<'turn.advanced', { nextTokenId?: string }>;

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
  | 'add-marker'
  | 'remove-marker'
  | 'set-initiative'
  | 'advance-turn';

export type SceneActionIntent =
  | { type: 'place-token'; actorId?: string; token: SceneToken }
  | { type: 'move-token'; actorId?: string; tokenId: string; position: SceneCoordinate }
  | { type: 'remove-token'; actorId?: string; tokenId: string }
  | { type: 'apply-damage'; actorId?: string; damages: SceneTokenDamage[]; cause?: string }
  | { type: 'set-attitude'; actorId?: string; tokenId: string; attitude: string }
  | { type: 'apply-conditions'; actorId?: string; tokenId: string; delta: SceneConditionTrack }
  | { type: 'set-statuses'; actorId?: string; tokenId: string; statuses: string[] }
  | { type: 'set-concentration'; actorId?: string; tokenId: string; spell?: string }
  | {
      type: 'set-death-saves';
      actorId?: string;
      tokenId: string;
      deathSaves?: { successes: number; failures: number };
    }
  | { type: 'add-marker'; actorId?: string; marker: SceneMarker }
  | { type: 'remove-marker'; actorId?: string; markerId: string }
  | {
      type: 'set-initiative';
      actorId?: string;
      entries: SceneInitiativeEntry[];
      activeTokenId?: string;
    }
  | { type: 'advance-turn'; actorId?: string };

export interface SceneIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning';
  eventId?: string;
  sequence?: number;
}
