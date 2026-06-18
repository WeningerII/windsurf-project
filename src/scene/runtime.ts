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
      const eventIssues = validateSceneEvent(state, event);
      issues.push(...eventIssues);
      if (eventIssues.some((issue) => issue.severity === 'error')) {
        return;
      }
      applySceneEvent(state, event);
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
    default:
      assertNever(event);
  }

  return issues;
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
    grid: { ...state.grid },
    tokens: Object.fromEntries(
      Object.entries(state.tokens).map(([id, token]) => [id, cloneToken(token)])
    ),
    markers: Object.fromEntries(
      Object.entries(state.markers).map(([id, marker]) => [id, cloneMarker(marker)])
    ),
    initiative: state.initiative.map((entry) => ({ ...entry })),
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
