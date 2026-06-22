export type SceneGridType = 'square';
export type SceneTokenKind = 'character' | 'monster' | 'npc' | 'object';
export type SceneMarkerKind = 'terrain' | 'hazard';

/**
 * A token's combat side. `party` and `hostile` are opposing; `neutral` is a
 * non-combatant (hostile to no one, targeted by no one in the autonomous round).
 * Derived from a token's kind by default; an explicit value overrides it (an
 * allied NPC, a charmed PC, a hostile shopkeeper).
 */
export type SceneAllegiance = 'party' | 'hostile' | 'neutral';

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
  /**
   * Combat side override. Absent means the side is derived from `kind`
   * (character → party, monster → hostile, npc/object → neutral). Set it to make
   * an NPC fight as an ally or enemy, or to re-side any token.
   */
  allegiance?: SceneAllegiance;
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

/**
 * A background map image, content-addressed by `hash`. The bytes live on the
 * {@link SceneDocument} (in `assets`), not in the event log; events reference the
 * map only by its hash, so the log stays small and a replay always points at the
 * same asset. Stored as a `data:image/...` URL (or an `https:` URL) — the import
 * boundary allowlists exactly those, since it renders as an `<img src>`.
 */
export interface SceneMapAsset {
  /** Content hash of `dataUrl` — the stable id events reference. */
  hash: string;
  /** IANA media type, e.g. `image/png`. */
  mediaType: string;
  /** The image as a `data:image/...;base64,...` (or `https:`) URL. */
  dataUrl: string;
}

/**
 * Manual registration of a {@link SceneMapAsset} onto the grid: which image
 * pixel sits under the grid origin (`offsetX/Y`) and how many image pixels make
 * one grid cell (`pixelsPerCell`). The GM sets and corrects these so the grid
 * lines up with the map art; all fields are plain data, so the registration
 * folds and replays deterministically.
 */
export interface SceneMapRegistration {
  assetHash: string;
  /** Image pixels per grid cell (positive). */
  pixelsPerCell: number;
  /** Image pixel offset of the grid origin. */
  offsetX: number;
  offsetY: number;
}

export type SceneCheckOutcome = 'success' | 'failure' | 'unresolved';

/** Roll two d20s and keep the higher (advantage) or lower (disadvantage). */
export type SceneCheckMode = 'advantage' | 'disadvantage';

/**
 * A resolved d20 ability/skill check: `total` is `die + modifier`, and
 * `outcome` compares it to `dc` (or `unresolved` when no DC was given — a
 * bare roll the player adjudicates). Like {@link SceneTokenDamage}, the dice
 * are rolled before the event is created and the resolved values are stored,
 * so the fold stays pure and replay-deterministic.
 */
export interface SceneCheckResult {
  /** The d20 face used for the total (the kept die under advantage/disadvantage). */
  die: number;
  modifier: number;
  dc?: number;
  total: number;
  outcome: SceneCheckOutcome;
  /** Present when rolled with advantage/disadvantage. */
  mode?: SceneCheckMode;
  /** The unused d20 under advantage/disadvantage, kept for transparency. */
  discardedDie?: number;
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

/**
 * How likely a "yes" is for an oracle question. Solo players consult an oracle
 * to adjudicate uncertain fiction without a GM; the odds set the d100 target.
 */
export type SceneOracleOdds = 'very-likely' | 'likely' | 'even' | 'unlikely' | 'very-unlikely';

/** Oracle answer, with exceptional bands signalling a strong/twist result. */
export type SceneOracleAnswer = 'exceptional-yes' | 'yes' | 'no' | 'exceptional-no';

/**
 * A resolved oracle consultation: a d100 `roll` against the odds-derived
 * `target` (yes when `roll <= target`), with the extreme bands promoted to
 * exceptional. Like a check, the die is rolled before the event is created and
 * the resolved values are stored so the fold stays pure.
 */
export interface SceneOracleResult {
  odds: SceneOracleOdds;
  roll: number;
  target: number;
  answer: SceneOracleAnswer;
}

/** An oracle result as it lives in the scene's oracle log. */
export interface SceneOracleLogEntry extends SceneOracleResult {
  id: string;
  /** The question that was asked, when the player recorded one. */
  question?: string;
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
  /** Resolved oracle consultations, oldest first. */
  oracleLog: SceneOracleLogEntry[];
  /** Background map registration (asset hash + manual grid alignment), if set. */
  map?: SceneMapRegistration;
}

export type SceneEventType =
  | 'token.added'
  | 'token.moved'
  | 'token.removed'
  | 'token.damaged'
  | 'token.conditions-set'
  | 'token.allegiance-set'
  | 'marker.added'
  | 'marker.removed'
  | 'initiative.set'
  | 'turn.advanced'
  | 'check.rolled'
  | 'oracle.consulted'
  | 'map.set'
  | 'map.cleared';

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
  | SceneEventBase<'token.allegiance-set', { tokenId: string; allegiance: SceneAllegiance }>
  | SceneEventBase<'marker.added', { marker: SceneMarker }>
  | SceneEventBase<'marker.removed', { markerId: string }>
  | SceneEventBase<'initiative.set', { entries: SceneInitiativeEntry[]; activeTokenId?: string }>
  | SceneEventBase<'turn.advanced', { nextTokenId?: string }>
  | SceneEventBase<'check.rolled', SceneCheckResult & { label: string; actorTokenId?: string }>
  | SceneEventBase<'oracle.consulted', SceneOracleResult & { question?: string }>
  | SceneEventBase<'map.set', { registration: SceneMapRegistration }>
  | SceneEventBase<'map.cleared', Record<string, never>>;

export interface SceneDocument {
  id: string;
  name: string;
  systemId: string;
  campaignId?: string;
  initialState: SceneState;
  events: SceneEvent[];
  /**
   * Content-addressed map assets referenced by `map.set` events, keyed by hash.
   * Document-level (not folded state, not in the event log) so the bytes are
   * stored once and travel with export/import; events reference them by hash.
   */
  assets?: Record<string, SceneMapAsset>;
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
  | 'set-token-allegiance'
  | 'add-marker'
  | 'remove-marker'
  | 'set-initiative'
  | 'advance-turn'
  | 'roll-check'
  | 'consult-oracle'
  | 'set-map'
  | 'clear-map';

export type SceneActionIntent =
  | { type: 'place-token'; actorId?: string; token: SceneToken }
  | { type: 'move-token'; actorId?: string; tokenId: string; position: SceneCoordinate }
  | { type: 'remove-token'; actorId?: string; tokenId: string }
  | { type: 'apply-damage'; actorId?: string; damages: SceneTokenDamage[]; cause?: string }
  | { type: 'set-token-conditions'; actorId?: string; tokenId: string; conditions: string[] }
  | { type: 'set-token-allegiance'; actorId?: string; tokenId: string; allegiance: SceneAllegiance }
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
      /** Roll with advantage/disadvantage; omit for a single d20. */
      mode?: SceneCheckMode;
    }
  | { type: 'consult-oracle'; actorId?: string; question?: string; odds: SceneOracleOdds }
  | { type: 'set-map'; actorId?: string; registration: SceneMapRegistration }
  | { type: 'clear-map'; actorId?: string };

export interface SceneIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning';
  eventId?: string;
  sequence?: number;
}
