import type {
  SceneActionIntent,
  SceneDocument,
  SceneEvent,
  SceneGrid,
  SceneIssue,
  SceneMarker,
  SceneState,
  SceneToken,
} from '../types/core/scene';
import { cellKey, footprintCells, footprintWithinGrid } from './grid';
import { createSeededRng } from './seededRng';
import { resolveCheck } from './check';
import { isOracleOdds, resolveOracle } from './oracle';

export interface CreateSceneDocumentParams {
  id: string;
  name: string;
  systemId: string;
  campaignId?: string;
  grid?: Partial<SceneGrid>;
  seed?: string;
  now?: Date;
}

export interface SceneActionOptions {
  eventId: string;
  sequence?: number;
  createdAt?: Date;
}

export interface SceneFoldResult {
  state: SceneState;
  issues: SceneIssue[];
}

export interface SceneActionResult {
  event?: SceneEvent;
  issues: SceneIssue[];
}

const DEFAULT_GRID: SceneGrid = {
  type: 'square',
  width: 24,
  height: 18,
  cellSize: 70,
};

export function createSceneDocument(params: CreateSceneDocumentParams): SceneDocument {
  const now = params.now ?? new Date();
  const grid = normalizeGrid(params.grid);

  return {
    id: params.id,
    name: params.name,
    systemId: params.systemId,
    campaignId: params.campaignId,
    initialState: {
      sceneId: params.id,
      name: params.name,
      systemId: params.systemId,
      campaignId: params.campaignId,
      grid,
      tokens: {},
      markers: {},
      initiative: [],
      round: 1,
      seed: params.seed ?? params.id,
      checkLog: [],
      oracleLog: [],
    },
    events: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function foldSceneEvents(scene: SceneDocument): SceneFoldResult {
  const state = cloneSceneState(scene.initialState);
  const issues: SceneIssue[] = [];

  scene.events
    .slice()
    .sort((a, b) => a.sequence - b.sequence)
    .forEach((event) => {
      // Replay safety net: a corrupt persisted/imported event (missing or
      // wrong-shaped payload) must degrade to a recorded issue and a skipped
      // event, never crash hydration — the same parse-don't-cast guarantee the
      // storage boundary makes. The happy path (app-built events) never throws
      // here, so this masks no real logic; it only contains malformed data.
      try {
        const eventIssues = validateSceneEvent(state, event);
        issues.push(...eventIssues);
        if (eventIssues.some((issue) => issue.severity === 'error')) {
          return;
        }
        applySceneEvent(state, event);
      } catch {
        issues.push({
          code: 'scene-event-malformed',
          message: `Scene event '${event?.id ?? '?'}' could not be processed and was skipped.`,
          severity: 'error',
          eventId: event?.id,
          sequence: event?.sequence,
        });
      }
    });

  return { state, issues };
}

export function resolveSceneAction(
  scene: SceneDocument,
  intent: SceneActionIntent,
  options: SceneActionOptions
): SceneActionResult {
  const { state, issues: foldIssues } = foldSceneEvents(scene);
  if (foldIssues.some((issue) => issue.severity === 'error')) {
    return { issues: foldIssues };
  }

  const intentIssues = validateSceneIntent(state, intent, options);
  if (intentIssues.length > 0) {
    return { issues: intentIssues };
  }

  const event = buildEventFromIntent(scene, state, intent, options);
  const issues = validateSceneEvent(state, event);
  return issues.some((issue) => issue.severity === 'error') ? { issues } : { event, issues };
}

/**
 * Intent-level validation: rules that gate new ACTIONS but deliberately do NOT
 * invalidate historical events (replay compatibility). Advancing the turn with
 * no initiative order is rejected here, before an event is built; an old
 * `turn.advanced` event with an undefined `nextTokenId` still folds cleanly
 * (it clears the active token and leaves the round unchanged).
 */
function validateSceneIntent(
  state: SceneState,
  intent: SceneActionIntent,
  options: SceneActionOptions
): SceneIssue[] {
  if (intent.type === 'advance-turn' && state.initiative.length === 0) {
    return [
      {
        code: 'scene-initiative-empty',
        message: 'Cannot advance the turn: no initiative order has been set.',
        path: 'initiative',
        severity: 'error',
        eventId: options.eventId,
      },
    ];
  }
  if (intent.type === 'place-token') {
    return footprintPlacementIssues(
      state,
      intent.token.position,
      intent.token.size,
      undefined,
      options
    );
  }
  if (intent.type === 'move-token') {
    const moving = state.tokens[intent.tokenId];
    // An unknown token id is reported by the event-level validator; the size
    // comes from the existing token.
    if (moving) {
      return footprintPlacementIssues(state, intent.position, moving.size, intent.tokenId, options);
    }
  }
  if (intent.type === 'roll-check') {
    return checkIntentIssues(state, intent, options);
  }
  if (intent.type === 'consult-oracle' && !isOracleOdds(intent.odds)) {
    return [
      {
        code: 'scene-oracle-odds-invalid',
        message: 'An oracle consultation needs a recognized odds level.',
        path: 'odds',
        severity: 'error',
        eventId: options.eventId,
      },
    ];
  }
  return [];
}

/**
 * Forward-looking gate for a check roll: it needs a label, a finite modifier,
 * a finite DC when one is given, and — if attributed to a token — a real one.
 * Intent-level so it never invalidates a historical `check.rolled` event.
 */
function checkIntentIssues(
  state: SceneState,
  intent: Extract<SceneActionIntent, { type: 'roll-check' }>,
  options: SceneActionOptions
): SceneIssue[] {
  const issues: SceneIssue[] = [];
  const issue = (code: string, message: string, path: string) =>
    issues.push({ code, message, path, severity: 'error', eventId: options.eventId });

  if (!intent.label.trim()) {
    issue('scene-check-label-required', 'A check needs a label (what is being rolled).', 'label');
  }
  if (!Number.isFinite(intent.modifier)) {
    issue('scene-check-modifier-invalid', 'A check modifier must be a finite number.', 'modifier');
  }
  if (intent.dc !== undefined && !Number.isFinite(intent.dc)) {
    issue('scene-check-dc-invalid', 'A check DC must be a finite number when set.', 'dc');
  }
  if (intent.actorTokenId !== undefined && !state.tokens[intent.actorTokenId]) {
    issue(
      'scene-check-actor-unknown',
      `Token '${intent.actorTokenId}' does not exist in this scene.`,
      'actorTokenId'
    );
  }
  return issues;
}

/**
 * Forward-looking placement gate: a token's footprint (size x size cells) must
 * fit on the grid and must not overlap another token when a multi-cell creature
 * is involved. Size-1 tokens may still share a cell (the grid renders stacks);
 * the rule exists so nothing is placed "inside" a large creature's reserved
 * footprint that its single anchor cell doesn't visibly show. Intent-level, so
 * it never invalidates historical events.
 */
function footprintPlacementIssues(
  state: SceneState,
  position: { x: number; y: number },
  size: number,
  ignoreTokenId: string | undefined,
  options: SceneActionOptions
): SceneIssue[] {
  const span = Math.max(1, Math.trunc(size));
  // A multi-cell footprint can run off-grid even when its anchor cell is in
  // bounds (the event-level coordinate check only sees the anchor). Size-1
  // bounds are left to that existing check so its error code is unchanged.
  if (span > 1 && !footprintWithinGrid(position, size, state.grid.width, state.grid.height)) {
    return [
      {
        code: 'scene-footprint-out-of-bounds',
        message: `A ${span}x${span} token at (${position.x}, ${position.y}) does not fit on the grid.`,
        path: 'position',
        severity: 'error',
        eventId: options.eventId,
      },
    ];
  }

  // Cells occupied by OTHER tokens, keyed to the occupying token's size so we
  // permit size-1-on-size-1 stacking but reject overlap with any large one.
  const occupiedSizeByCell = new Map<string, number>();
  for (const token of Object.values(state.tokens)) {
    if (token.id === ignoreTokenId) continue;
    const tokenSpan = Math.max(1, Math.trunc(token.size));
    for (const cell of footprintCells(token.position, token.size)) {
      const key = cellKey(cell);
      occupiedSizeByCell.set(key, Math.max(occupiedSizeByCell.get(key) ?? 0, tokenSpan));
    }
  }
  const overlaps = footprintCells(position, size).some((cell) => {
    const occupiedSpan = occupiedSizeByCell.get(cellKey(cell));
    return occupiedSpan !== undefined && (span > 1 || occupiedSpan > 1);
  });
  if (overlaps) {
    return [
      {
        code: 'scene-footprint-occupied',
        message: `A ${span}x${span} token at (${position.x}, ${position.y}) overlaps another token's space.`,
        path: 'position',
        severity: 'error',
        eventId: options.eventId,
      },
    ];
  }
  return [];
}

export function appendSceneEvent(scene: SceneDocument, event: SceneEvent): SceneDocument {
  const { state, issues } = foldSceneEvents(scene);
  if (issues.some((issue) => issue.severity === 'error')) {
    throw new Error('Cannot append to a scene with invalid existing events.');
  }

  const eventIssues = validateSceneEvent(state, event);
  if (eventIssues.some((issue) => issue.severity === 'error')) {
    throw new Error(eventIssues.map((issue) => issue.message).join(' '));
  }

  return {
    ...scene,
    events: [...scene.events, event],
    updatedAt: event.createdAt,
  };
}

export function validateSceneEvent(state: SceneState, event: SceneEvent): SceneIssue[] {
  const issues: SceneIssue[] = [];
  pushSequenceIssue(issues, event);

  switch (event.type) {
    case 'token.added':
      validateTokenForAdd(state, event.payload.token, issues, event);
      break;
    case 'token.moved':
      validateKnownToken(state, event.payload.tokenId, issues, event, 'payload.tokenId');
      validateCoordinateInGrid(state, event.payload.position, issues, event, 'payload.position');
      break;
    case 'token.removed':
      validateKnownToken(state, event.payload.tokenId, issues, event, 'payload.tokenId');
      break;
    case 'token.conditions-set':
      validateKnownToken(state, event.payload.tokenId, issues, event, 'payload.tokenId');
      break;
    case 'token.damaged':
      validateDamages(state, event.payload.damages, issues, event);
      break;
    case 'marker.added':
      validateMarkerForAdd(state, event.payload.marker, issues, event);
      break;
    case 'marker.removed':
      validateKnownMarker(state, event.payload.markerId, issues, event, 'payload.markerId');
      break;
    case 'initiative.set':
      validateInitiative(state, event.payload.entries, event.payload.activeTokenId, issues, event);
      break;
    case 'turn.advanced':
      if (event.payload.nextTokenId) {
        validateKnownToken(state, event.payload.nextTokenId, issues, event, 'payload.nextTokenId');
      }
      break;
    case 'check.rolled':
      validateCheckEvent(state, event, issues);
      break;
    case 'oracle.consulted':
      if (!Number.isFinite(event.payload.roll) || !Number.isFinite(event.payload.target)) {
        pushIssue(issues, event, {
          code: 'scene-oracle-values-invalid',
          message: 'A consulted oracle must record finite roll and target values.',
          path: 'payload',
        });
      }
      break;
    default:
      assertNever(event);
  }

  return issues;
}

/**
 * Event-level (historical, lenient) validation of a rolled check. The die and
 * total must be finite numbers so the fold and any UI math can't break; an
 * attributed token, if named, must exist. The DC/outcome are not re-derived —
 * a replayed event keeps whatever it recorded.
 */
function validateCheckEvent(
  state: SceneState,
  event: Extract<SceneEvent, { type: 'check.rolled' }>,
  issues: SceneIssue[]
): void {
  const { die, total, modifier, actorTokenId } = event.payload;
  if (!Number.isFinite(die) || !Number.isFinite(total) || !Number.isFinite(modifier)) {
    pushIssue(issues, event, {
      code: 'scene-check-values-invalid',
      message: 'A rolled check must record finite die, modifier, and total values.',
      path: 'payload',
    });
  }
  if (actorTokenId) {
    validateKnownToken(state, actorTokenId, issues, event, 'payload.actorTokenId');
  }
}

function buildEventFromIntent(
  scene: SceneDocument,
  state: SceneState,
  intent: SceneActionIntent,
  options: SceneActionOptions
): SceneEvent {
  const base = {
    id: options.eventId,
    sequence: options.sequence ?? scene.events.length + 1,
    createdAt: options.createdAt ?? new Date(),
    actorId: intent.actorId,
  };

  switch (intent.type) {
    case 'place-token':
      return { ...base, type: 'token.added', payload: { token: cloneToken(intent.token) } };
    case 'move-token':
      return {
        ...base,
        type: 'token.moved',
        payload: { tokenId: intent.tokenId, position: { ...intent.position } },
      };
    case 'remove-token':
      return { ...base, type: 'token.removed', payload: { tokenId: intent.tokenId } };
    case 'apply-damage':
      return {
        ...base,
        type: 'token.damaged',
        payload: {
          damages: intent.damages.map((damage) => ({ ...damage })),
          cause: intent.cause,
        },
      };
    case 'set-token-conditions':
      return {
        ...base,
        type: 'token.conditions-set',
        // Dedupe while preserving order so replays are byte-stable.
        payload: { tokenId: intent.tokenId, conditions: [...new Set(intent.conditions)] },
      };
    case 'add-marker':
      return { ...base, type: 'marker.added', payload: { marker: cloneMarker(intent.marker) } };
    case 'remove-marker':
      return { ...base, type: 'marker.removed', payload: { markerId: intent.markerId } };
    case 'set-initiative':
      return {
        ...base,
        type: 'initiative.set',
        payload: {
          entries: intent.entries.map((entry) => ({ ...entry })),
          activeTokenId: intent.activeTokenId,
        },
      };
    case 'advance-turn':
      return {
        ...base,
        type: 'turn.advanced',
        payload: { nextTokenId: getNextInitiativeTokenId(state) },
      };
    case 'roll-check': {
      // Seed the d20(s) from the (caller-supplied, unique) event id: resolveSceneAction
      // stays a pure function of its inputs, each roll differs, and the resolved
      // result is stored on the event so the fold never re-rolls. Advantage/
      // disadvantage draws two from the same stream and keeps one.
      const rng = createSeededRng(base.id);
      const first = rng.rollDie(20);
      let die = first;
      let extra: { mode: 'advantage' | 'disadvantage'; discardedDie: number } | undefined;
      if (intent.mode === 'advantage' || intent.mode === 'disadvantage') {
        const second = rng.rollDie(20);
        const keepHigh = intent.mode === 'advantage';
        die = keepHigh ? Math.max(first, second) : Math.min(first, second);
        extra = {
          mode: intent.mode,
          discardedDie: keepHigh ? Math.min(first, second) : Math.max(first, second),
        };
      }
      const result = resolveCheck(die, intent.modifier, intent.dc);
      return {
        ...base,
        type: 'check.rolled',
        payload: {
          label: intent.label.trim(),
          actorTokenId: intent.actorTokenId,
          ...result,
          ...extra,
        },
      };
    }
    case 'consult-oracle': {
      // Same event-id-seeded roll as a check, on a d100.
      const roll = createSeededRng(base.id).rollDie(100);
      const result = resolveOracle(intent.odds, roll);
      const question = intent.question?.trim();
      return {
        ...base,
        type: 'oracle.consulted',
        payload: { ...result, ...(question ? { question } : {}) },
      };
    }
    default:
      assertNever(intent);
  }
}

function applySceneEvent(state: SceneState, event: SceneEvent): void {
  switch (event.type) {
    case 'token.added':
      state.tokens[event.payload.token.id] = cloneToken(event.payload.token);
      break;
    case 'token.moved':
      state.tokens[event.payload.tokenId] = {
        ...state.tokens[event.payload.tokenId],
        position: { ...event.payload.position },
      };
      break;
    case 'token.removed':
      delete state.tokens[event.payload.tokenId];
      state.initiative = state.initiative.filter(
        (entry) => entry.tokenId !== event.payload.tokenId
      );
      if (state.activeTokenId === event.payload.tokenId) {
        state.activeTokenId = state.initiative[0]?.tokenId;
      }
      break;
    case 'token.damaged':
      for (const damage of event.payload.damages) {
        const token = state.tokens[damage.tokenId];
        if (token?.hp) {
          token.hp = applyHitPointDelta(token.hp, damage.amount);
        }
      }
      break;
    case 'token.conditions-set': {
      const token = state.tokens[event.payload.tokenId];
      if (token) {
        state.tokens[event.payload.tokenId] = {
          ...token,
          conditions: [...event.payload.conditions],
        };
      }
      break;
    }
    case 'marker.added':
      state.markers[event.payload.marker.id] = cloneMarker(event.payload.marker);
      break;
    case 'marker.removed':
      delete state.markers[event.payload.markerId];
      break;
    case 'initiative.set':
      state.initiative = event.payload.entries.map((entry) => ({ ...entry }));
      state.activeTokenId = event.payload.activeTokenId ?? state.initiative[0]?.tokenId;
      break;
    case 'turn.advanced':
      state.activeTokenId = event.payload.nextTokenId;
      // The round only advances when the cycle actually wraps to the top of a
      // real initiative order. Without the null guard, an event recorded with
      // empty initiative (nextTokenId undefined) would match
      // `initiative[0]?.tokenId` (also undefined) and inflate the round —
      // historical events of that shape now fold to "round unchanged".
      if (
        event.payload.nextTokenId != null &&
        state.initiative[0]?.tokenId === event.payload.nextTokenId
      ) {
        state.round += 1;
      }
      break;
    case 'check.rolled': {
      const { label, actorTokenId, die, modifier, dc, total, outcome, mode, discardedDie } =
        event.payload;
      state.checkLog = [
        ...state.checkLog,
        {
          id: event.id,
          label,
          ...(actorTokenId !== undefined ? { actorTokenId } : {}),
          die,
          modifier,
          ...(dc !== undefined ? { dc } : {}),
          total,
          outcome,
          ...(mode !== undefined ? { mode } : {}),
          ...(discardedDie !== undefined ? { discardedDie } : {}),
          createdAt: event.createdAt,
        },
      ];
      break;
    }
    case 'oracle.consulted': {
      const { question, odds, roll, target, answer } = event.payload;
      state.oracleLog = [
        ...state.oracleLog,
        {
          id: event.id,
          ...(question !== undefined ? { question } : {}),
          odds,
          roll,
          target,
          answer,
          createdAt: event.createdAt,
        },
      ];
      break;
    }
    default:
      assertNever(event);
  }
}

function getNextInitiativeTokenId(state: SceneState): string | undefined {
  if (state.initiative.length === 0) {
    return undefined;
  }

  const activeIndex = state.initiative.findIndex((entry) => entry.tokenId === state.activeTokenId);
  const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % state.initiative.length;
  return state.initiative[nextIndex]?.tokenId;
}

function normalizeGrid(grid?: Partial<SceneGrid>): SceneGrid {
  return {
    type: 'square',
    width: positiveIntegerOrDefault(grid?.width, DEFAULT_GRID.width),
    height: positiveIntegerOrDefault(grid?.height, DEFAULT_GRID.height),
    cellSize: positiveIntegerOrDefault(grid?.cellSize, DEFAULT_GRID.cellSize),
  };
}

/**
 * A positive integer, or the fallback. Accepts a number (validated as-is) or a
 * string (parsed base-10), so the grid-dimension defaults here and the
 * form-input parsing in the scene UI share one implementation.
 */
export function positiveIntegerOrDefault(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  return Number.isInteger(parsed) && Number(parsed) > 0 ? Number(parsed) : fallback;
}

function validateTokenForAdd(
  state: SceneState,
  token: SceneToken,
  issues: SceneIssue[],
  event: SceneEvent
): void {
  if (state.tokens[token.id]) {
    pushIssue(issues, event, {
      code: 'scene-token-duplicate',
      message: `Token '${token.id}' already exists in this scene.`,
      path: 'payload.token.id',
    });
  }

  if (!token.name.trim()) {
    pushIssue(issues, event, {
      code: 'scene-token-name-required',
      message: 'Scene tokens require a name.',
      path: 'payload.token.name',
    });
  }

  if (!Number.isInteger(token.size) || token.size <= 0) {
    pushIssue(issues, event, {
      code: 'scene-token-size-invalid',
      message: 'Scene token size must be a positive integer.',
      path: 'payload.token.size',
    });
  }

  validateCoordinateInGrid(state, token.position, issues, event, 'payload.token.position');
}

function validateMarkerForAdd(
  state: SceneState,
  marker: SceneMarker,
  issues: SceneIssue[],
  event: SceneEvent
): void {
  if (state.markers[marker.id]) {
    pushIssue(issues, event, {
      code: 'scene-marker-duplicate',
      message: `Marker '${marker.id}' already exists in this scene.`,
      path: 'payload.marker.id',
    });
  }

  if (!marker.label.trim()) {
    pushIssue(issues, event, {
      code: 'scene-marker-label-required',
      message: 'Scene markers require a label.',
      path: 'payload.marker.label',
    });
  }

  if (!Number.isInteger(marker.width) || marker.width <= 0) {
    pushIssue(issues, event, {
      code: 'scene-marker-width-invalid',
      message: 'Scene marker width must be a positive integer.',
      path: 'payload.marker.width',
    });
  }

  if (!Number.isInteger(marker.height) || marker.height <= 0) {
    pushIssue(issues, event, {
      code: 'scene-marker-height-invalid',
      message: 'Scene marker height must be a positive integer.',
      path: 'payload.marker.height',
    });
  }

  validateCoordinateInGrid(state, marker.position, issues, event, 'payload.marker.position');
  validateCoordinateInGrid(
    state,
    { x: marker.position.x + marker.width - 1, y: marker.position.y + marker.height - 1 },
    issues,
    event,
    'payload.marker'
  );
}

function validateInitiative(
  state: SceneState,
  entries: Array<{ tokenId: string; value: number }>,
  activeTokenId: string | undefined,
  issues: SceneIssue[],
  event: SceneEvent
): void {
  const seen = new Set<string>();

  entries.forEach((entry, index) => {
    validateKnownToken(state, entry.tokenId, issues, event, `payload.entries.${index}.tokenId`);
    if (seen.has(entry.tokenId)) {
      pushIssue(issues, event, {
        code: 'scene-initiative-duplicate-token',
        message: `Token '${entry.tokenId}' appears more than once in initiative.`,
        path: `payload.entries.${index}.tokenId`,
      });
    }
    seen.add(entry.tokenId);

    if (!Number.isFinite(entry.value)) {
      pushIssue(issues, event, {
        code: 'scene-initiative-value-invalid',
        message: 'Initiative values must be finite numbers.',
        path: `payload.entries.${index}.value`,
      });
    }
  });

  if (activeTokenId && !seen.has(activeTokenId)) {
    pushIssue(issues, event, {
      code: 'scene-initiative-active-token-missing',
      message: `Active token '${activeTokenId}' is not in initiative.`,
      path: 'payload.activeTokenId',
    });
  }
}

function validateKnownToken(
  state: SceneState,
  tokenId: string,
  issues: SceneIssue[],
  event: SceneEvent,
  path: string
): void {
  if (!state.tokens[tokenId]) {
    pushIssue(issues, event, {
      code: 'scene-token-unknown',
      message: `Token '${tokenId}' does not exist in this scene.`,
      path,
    });
  }
}

function validateKnownMarker(
  state: SceneState,
  markerId: string,
  issues: SceneIssue[],
  event: SceneEvent,
  path: string
): void {
  if (!state.markers[markerId]) {
    pushIssue(issues, event, {
      code: 'scene-marker-unknown',
      message: `Marker '${markerId}' does not exist in this scene.`,
      path,
    });
  }
}

function validateCoordinateInGrid(
  state: SceneState,
  position: { x: number; y: number },
  issues: SceneIssue[],
  event: SceneEvent,
  path: string
): void {
  if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
    pushIssue(issues, event, {
      code: 'scene-coordinate-invalid',
      message: 'Scene coordinates must be integer grid cells.',
      path,
    });
    return;
  }

  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= state.grid.width ||
    position.y >= state.grid.height
  ) {
    pushIssue(issues, event, {
      code: 'scene-coordinate-out-of-bounds',
      message: `Scene coordinate (${position.x}, ${position.y}) is outside the grid.`,
      path,
    });
  }
}

function pushSequenceIssue(issues: SceneIssue[], event: SceneEvent): void {
  if (!Number.isInteger(event.sequence) || event.sequence <= 0) {
    pushIssue(issues, event, {
      code: 'scene-event-sequence-invalid',
      message: 'Scene event sequence must be a positive integer.',
      path: 'sequence',
    });
  }
}

function pushIssue(
  issues: SceneIssue[],
  event: SceneEvent,
  issue: Omit<SceneIssue, 'severity' | 'eventId' | 'sequence'>
): void {
  issues.push({
    ...issue,
    severity: 'error',
    eventId: event.id,
    sequence: event.sequence,
  });
}

function cloneSceneState(state: SceneState): SceneState {
  return {
    ...state,
    // normalizeGrid both copies and coerces: a corrupt import with a
    // non-positive width/height (parseSceneDocument only checks the grid is an
    // object) would otherwise fold to an unusable empty scene. Valid grids pass
    // through unchanged.
    grid: normalizeGrid(state.grid),
    tokens: Object.fromEntries(
      Object.entries(state.tokens).map(([id, token]) => [id, cloneToken(token)])
    ),
    markers: Object.fromEntries(
      Object.entries(state.markers).map(([id, marker]) => [id, cloneMarker(marker)])
    ),
    initiative: state.initiative.map((entry) => ({ ...entry })),
    // `parseSceneDocument` validates the grid/tokens/markers/initiative
    // substructure but not these initialState primitives; coerce so a corrupt
    // import can't make the round NaN (`undefined + 1` on turn.advanced) or
    // leave the seed a non-string the type claims is impossible.
    round: positiveIntegerOrDefault(state.round, 1),
    seed: typeof state.seed === 'string' ? state.seed : String(state.seed ?? state.sceneId ?? ''),
    // Default for scenes persisted before these logs existed; the Array.isArray
    // guard also hardens against a corrupt import whose initialState carries a
    // non-array here (`parseSceneDocument` does not deep-validate these derived
    // fields). Entries are flat value objects, so a shallow copy is a full clone.
    checkLog: (Array.isArray(state.checkLog) ? state.checkLog : []).map((entry) => ({ ...entry })),
    oracleLog: (Array.isArray(state.oracleLog) ? state.oracleLog : []).map((entry) => ({
      ...entry,
    })),
  };
}

function cloneToken(token: SceneToken): SceneToken {
  return {
    ...token,
    position: { ...token.position },
    hp: token.hp ? { ...token.hp } : undefined,
    conditions: token.conditions ? [...token.conditions] : undefined,
  };
}

/**
 * Apply a hit-point delta. Positive amount is damage (temp HP absorbs first,
 * current floors at 0); negative is healing (capped at max). Pure — returns a
 * new hp object.
 */
function applyHitPointDelta(
  hp: NonNullable<SceneToken['hp']>,
  amount: number
): NonNullable<SceneToken['hp']> {
  const next = { ...hp, temp: hp.temp ?? 0 };
  if (amount > 0) {
    let remaining = amount;
    const absorbed = Math.min(next.temp, remaining);
    next.temp -= absorbed;
    remaining -= absorbed;
    next.current = Math.max(0, next.current - remaining);
  } else if (amount < 0) {
    next.current = Math.min(next.max, next.current - amount);
  }
  return next;
}

function validateDamages(
  state: SceneState,
  damages: Array<{ tokenId: string; amount: number }>,
  issues: SceneIssue[],
  event: SceneEvent
): void {
  if (!Array.isArray(damages) || damages.length === 0) {
    pushIssue(issues, event, {
      code: 'scene-damage-empty',
      message: 'A damage event must include at least one token delta.',
      path: 'payload.damages',
    });
    return;
  }

  damages.forEach((damage, index) => {
    validateKnownToken(state, damage.tokenId, issues, event, `payload.damages.${index}.tokenId`);
    if (!Number.isFinite(damage.amount)) {
      pushIssue(issues, event, {
        code: 'scene-damage-amount-invalid',
        message: 'Damage amounts must be finite numbers.',
        path: `payload.damages.${index}.amount`,
      });
    }
  });
}

function cloneMarker(marker: SceneMarker): SceneMarker {
  return {
    ...marker,
    position: { ...marker.position },
    // Deep-copy terrain effects: a shared array reference would alias event
    // payloads, initialState, and every folded state, letting a consumer
    // mutation corrupt the event log retroactively.
    ...(marker.effects ? { effects: marker.effects.map((effect) => ({ ...effect })) } : {}),
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled scene runtime value: ${JSON.stringify(value)}`);
}
