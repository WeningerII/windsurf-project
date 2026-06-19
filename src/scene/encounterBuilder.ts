import type { Monster } from '../types/creatures/monsters';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { SceneCoordinate, SceneDocument, SceneEvent } from '../types/core/scene';
import { appendSceneEvent, foldSceneEvents, resolveSceneAction } from './runtime';
import { cellKey } from './grid';
import { createSeededRng } from './seededRng';
import { monsterAverageHitPoints } from '../rules/combatants/monsterCombatant';

export interface EncounterMonsterSelection {
  monsterId: string;
  count: number;
}

export interface BuildEncounterEventsParams {
  scene: SceneDocument;
  monsters: Monster[];
  selections: EncounterMonsterSelection[];
  /**
   * Character documents the caller already holds, used to roll seeded
   * d20 + DEX initiative for pre-existing tokens whose `refId` points at one
   * (so the party rolls like the monsters do instead of clumping at 10).
   */
  documents?: CharacterDocument<SystemDataModel>[];
  origin?: SceneCoordinate;
  /**
   * Optional spawn zone (map-aware placement): monsters are placed only
   * inside this rectangle (intersected with the grid). When the zone cannot
   * fit the encounter, the builder reports `encounter-zone-full` instead of
   * spilling outside it.
   */
  zone?: { position: SceneCoordinate; width: number; height: number };
  createdAt?: Date;
  seed?: string;
  eventIdFactory?: () => string;
}

export interface EncounterBuilderIssue {
  code: string;
  message: string;
  path?: string;
}

export interface BuildEncounterEventsResult {
  events: SceneEvent[];
  issues: EncounterBuilderIssue[];
  totalXp: number;
}

export interface EncounterPlanEntry {
  monsterId: string;
  name: string;
  count: number;
  challengeRating: number;
  experiencePoints: number;
  totalXp: number;
  source: string;
}

export interface EncounterPlanSummary {
  entries: EncounterPlanEntry[];
  issues: EncounterBuilderIssue[];
  totalCount: number;
  totalXp: number;
}

export interface EncounterPartyMember {
  id: string;
  name: string;
  level: number;
}

export interface EncounterPartySummary {
  members: EncounterPartyMember[];
  totalLevel: number;
  averageLevel: number;
}

export const MAX_MONSTERS_PER_SELECTION = 20;

export function summarizeEncounterPlan({
  monsters,
  selections,
  systemId,
}: {
  monsters: Monster[];
  selections: EncounterMonsterSelection[];
  systemId?: string;
}): EncounterPlanSummary {
  const plan = planEncounterMonsters({ monsters, selections, systemId });

  return {
    entries: plan.entries,
    issues: plan.issues,
    totalCount: plan.entries.reduce((total, entry) => total + entry.count, 0),
    totalXp: plan.entries.reduce((total, entry) => total + entry.totalXp, 0),
  };
}

export function summarizeEncounterParty(
  documents: CharacterDocument<SystemDataModel>[]
): EncounterPartySummary {
  const members = documents.flatMap((document) => {
    const level = getCharacterLevel(document);
    return level
      ? [
          {
            id: document.id,
            name: document.name,
            level,
          },
        ]
      : [];
  });
  const totalLevel = members.reduce((total, member) => total + member.level, 0);

  return {
    members,
    totalLevel,
    averageLevel: members.length > 0 ? totalLevel / members.length : 0,
  };
}

export function buildEncounterSceneEvents({
  scene,
  monsters,
  selections,
  documents,
  origin,
  zone,
  createdAt = new Date(),
  seed,
  eventIdFactory,
}: BuildEncounterEventsParams): BuildEncounterEventsResult {
  const folded = foldSceneEvents(scene);
  if (folded.issues.some((issue) => issue.severity === 'error')) {
    return {
      events: [],
      issues: folded.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path,
      })),
      totalXp: 0,
    };
  }

  const plan = planEncounterMonsters({ monsters, selections, systemId: scene.systemId });
  const issues: EncounterBuilderIssue[] = [...plan.issues];
  const planned = plan.tokens;

  if (issues.length > 0) {
    return { events: [], issues, totalXp: 0 };
  }

  const occupied = buildOccupiedCells(folded.state);
  // Spawn bounds: the zone intersected with the grid, or the whole grid.
  const grid = folded.state.grid;
  const bounds = zone
    ? intersectBounds(zone, grid.width, grid.height)
    : { x: 0, y: 0, width: grid.width, height: grid.height };
  if (bounds.width <= 0 || bounds.height <= 0) {
    return {
      events: [],
      issues: [
        {
          code: 'encounter-zone-outside-grid',
          message: 'The spawn zone lies outside the scene grid.',
        },
      ],
      totalXp: 0,
    };
  }
  const spawnOrigin = origin ?? { x: bounds.x, y: bounds.y };
  const tokenIds = new Set(Object.keys(folded.state.tokens));
  // Tokens already on the scene from a prior batch, counted by source monster
  // (refId). Naming seeds from these so adding "2 Goblins" twice yields
  // "Goblin 3"/"Goblin 4", not a second "Goblin 1"/"Goblin 2" (the combat log
  // keys off names, so collisions make it ambiguous).
  const existingByRefId = new Map<string, number>();
  for (const token of Object.values(folded.state.tokens)) {
    if (token.refId) {
      existingByRefId.set(token.refId, (existingByRefId.get(token.refId) ?? 0) + 1);
    }
  }
  const monsterTotals = planned.reduce((totals, entry) => {
    totals.set(entry.monster.id, (totals.get(entry.monster.id) ?? 0) + 1);
    return totals;
  }, new Map<string, number>());
  const monsterOrdinals = new Map<string, number>(existingByRefId);
  const generatedTokens = planned.map(({ monster }) => {
    const size = getSceneTokenSize(monster.size);
    const position = findOpenPosition(bounds, size, {
      origin: spawnOrigin,
      occupied,
    });

    if (!position) {
      issues.push({
        code: zone ? 'encounter-zone-full' : 'encounter-grid-full',
        message: zone
          ? `No open ${size}x${size} space remains for ${monster.name} in the spawn zone.`
          : `No open ${size}x${size} space remains for ${monster.name}.`,
      });
      return undefined;
    }

    occupyCells(occupied, position, size);
    const tokenId = makeUniqueTokenId(monster.id, tokenIds);
    tokenIds.add(tokenId);
    const ordinal = (monsterOrdinals.get(monster.id) ?? 0) + 1;
    monsterOrdinals.set(monster.id, ordinal);

    // Suffix with the ordinal whenever this monster appears more than once
    // across the scene (existing tokens + this batch), so a lone addition that
    // joins an existing same-source token still gets a distinguishing number.
    const totalOfThisMonster =
      (existingByRefId.get(monster.id) ?? 0) + (monsterTotals.get(monster.id) ?? 0);
    return {
      id: tokenId,
      name: totalOfThisMonster > 1 ? `${monster.name} ${ordinal}` : monster.name,
      kind: 'monster' as const,
      position,
      size,
      refId: monster.id,
      monster,
    };
  });

  if (issues.length > 0) {
    return { events: [], issues, totalXp: 0 };
  }

  let workingScene = scene;
  const events: SceneEvent[] = [];

  for (const token of generatedTokens) {
    if (!token) continue;
    const result = resolveSceneAction(
      workingScene,
      {
        type: 'place-token',
        token: {
          id: token.id,
          name: token.name,
          kind: token.kind,
          position: token.position,
          size: token.size,
          refId: token.refId,
          // Average statblock HP so encounter monsters are combat-ready on the grid.
          hp: (() => {
            const max = monsterAverageHitPoints(token.monster);
            return { current: max, max, temp: 0 };
          })(),
        },
      },
      { eventId: nextEventId(scene, events, eventIdFactory), createdAt }
    );

    if (!result.event) {
      return {
        events: [],
        issues: result.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
        })),
        totalXp: 0,
      };
    }

    events.push(result.event);
    workingScene = appendSceneEvent(workingScene, result.event);
  }

  const initiativeEntries = buildInitiativeEntries(workingScene, generatedTokens, {
    seed: seed ?? `${scene.initialState.seed}:encounter:${scene.events.length}`,
    documents,
  });
  if (initiativeEntries.length > 0) {
    const result = resolveSceneAction(
      workingScene,
      {
        type: 'set-initiative',
        entries: initiativeEntries,
        activeTokenId: initiativeEntries[0]?.tokenId,
      },
      { eventId: nextEventId(scene, events, eventIdFactory), createdAt }
    );

    if (!result.event) {
      return {
        events: [],
        issues: result.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path,
        })),
        totalXp: 0,
      };
    }

    events.push(result.event);
  }

  return {
    events,
    issues: [],
    totalXp: plan.entries.reduce((total, entry) => total + entry.totalXp, 0),
  };
}

function planEncounterMonsters({
  monsters,
  selections,
  systemId,
}: {
  monsters: Monster[];
  selections: EncounterMonsterSelection[];
  systemId?: string;
}): {
  entries: EncounterPlanEntry[];
  issues: EncounterBuilderIssue[];
  tokens: Array<{ monster: Monster }>;
} {
  const monsterById = new Map(monsters.map((monster) => [monster.id, monster]));
  const issues: EncounterBuilderIssue[] = [];
  const entries: EncounterPlanEntry[] = [];
  const tokens: Array<{ monster: Monster }> = [];

  selections.forEach((selection, selectionIndex) => {
    const count = Number(selection.count);
    const monster = monsterById.get(selection.monsterId);

    if (!monster) {
      issues.push({
        code: 'encounter-monster-unknown',
        message: `Monster '${selection.monsterId}' is not available for this scene.`,
        path: `selections.${selectionIndex}.monsterId`,
      });
      return;
    }

    if (systemId && monster.system !== systemId) {
      issues.push({
        code: 'encounter-monster-system-mismatch',
        message: `${monster.name} belongs to ${monster.system}, not ${systemId}.`,
        path: `selections.${selectionIndex}.monsterId`,
      });
      return;
    }

    if (!Number.isInteger(count) || count <= 0 || count > MAX_MONSTERS_PER_SELECTION) {
      issues.push({
        code: 'encounter-monster-count-invalid',
        message: `Monster count must be between 1 and ${MAX_MONSTERS_PER_SELECTION}.`,
        path: `selections.${selectionIndex}.count`,
      });
      return;
    }

    entries.push({
      monsterId: monster.id,
      name: monster.name,
      count,
      challengeRating: monster.challengeRating,
      experiencePoints: monster.experiencePoints,
      totalXp: monster.experiencePoints * count,
      source: monster.source,
    });
    tokens.push(...Array.from({ length: count }, () => ({ monster })));
  });

  return { entries, issues, tokens };
}

function buildInitiativeEntries(
  scene: SceneDocument,
  generatedTokens: Array<
    | {
        id: string;
        monster: Monster;
      }
    | undefined
  >,
  options: { seed: string; documents?: CharacterDocument<SystemDataModel>[] }
) {
  const { state } = foldSceneEvents(scene);
  const existingByTokenId = new Map(state.initiative.map((entry) => [entry.tokenId, entry.value]));
  const generatedByTokenId = new Map(
    generatedTokens
      .filter((token): token is { id: string; monster: Monster } => Boolean(token))
      .map((token) => [token.id, token.monster])
  );
  const documentsById = new Map((options.documents ?? []).map((doc) => [doc.id, doc]));

  return Object.values(state.tokens)
    .map((token) => {
      const monster = generatedByTokenId.get(token.id);
      if (monster) {
        const rng = createSeededRng(`${options.seed}:${token.id}:initiative`);
        return {
          tokenId: token.id,
          value: rng.rollDie(20) + getAbilityModifier(monster.abilities.dex),
        };
      }

      // A token already in initiative keeps its value (a manual order or a
      // previous encounter's roll is never re-rolled).
      const existing = existingByTokenId.get(token.id);
      if (existing !== undefined) {
        return { tokenId: token.id, value: existing };
      }

      // Pre-existing tokens whose refId resolves to a character document roll
      // seeded d20 + DEX exactly like the monsters (per-token sub-stream, so
      // the result is deterministic and order-independent). The flat 10 is
      // only the last resort when no stats are resolvable.
      const dex = token.refId ? readDocumentDexterity(documentsById.get(token.refId)) : undefined;
      if (dex !== undefined) {
        const rng = createSeededRng(`${options.seed}:${token.id}:initiative`);
        return {
          tokenId: token.id,
          value: rng.rollDie(20) + getAbilityModifier(dex),
        };
      }

      return { tokenId: token.id, value: 10 };
    })
    .sort((a, b) => b.value - a.value || compareTokenIds(a.tokenId, b.tokenId));
}

/**
 * Read a character document's DEX score, or undefined when the sheet does not
 * carry a finite number (the caller then falls back to the flat default).
 */
function readDocumentDexterity(
  document: CharacterDocument<SystemDataModel> | undefined
): number | undefined {
  if (!document) return undefined;
  const attributes = (document.system as Record<string, unknown>).baseAttributes;
  if (!attributes || typeof attributes !== 'object') return undefined;
  const dex = (attributes as Record<string, unknown>).dex;
  return typeof dex === 'number' && Number.isFinite(dex) ? dex : undefined;
}

/**
 * Codepoint comparison for the initiative tie-break. `localeCompare` (with no
 * explicit locale) can order ids differently across user environments, which
 * would desync a "deterministic, replayable" event log between devices.
 */
function compareTokenIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function buildOccupiedCells(state: ReturnType<typeof foldSceneEvents>['state']): Set<string> {
  const occupied = new Set<string>();
  Object.values(state.tokens).forEach((token) => occupyCells(occupied, token.position, token.size));
  return occupied;
}

interface SpawnBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A zone rectangle clipped to the grid (may come back empty). */
function intersectBounds(
  zone: { position: SceneCoordinate; width: number; height: number },
  gridWidth: number,
  gridHeight: number
): SpawnBounds {
  const x = Math.max(0, Math.trunc(zone.position.x));
  const y = Math.max(0, Math.trunc(zone.position.y));
  return {
    x,
    y,
    width: Math.min(gridWidth, Math.trunc(zone.position.x) + Math.trunc(zone.width)) - x,
    height: Math.min(gridHeight, Math.trunc(zone.position.y) + Math.trunc(zone.height)) - y,
  };
}

function findOpenPosition(
  bounds: SpawnBounds,
  size: number,
  options: { origin: SceneCoordinate; occupied: Set<string> }
): SceneCoordinate | undefined {
  const maxY = bounds.y + Math.max(0, bounds.height - size);
  const maxX = bounds.x + Math.max(0, bounds.width - size);
  const startY = clampInteger(options.origin.y, bounds.y, maxY);
  const startX = clampInteger(options.origin.x, bounds.x, maxX);

  for (let yOffset = 0; yOffset < bounds.height; yOffset += 1) {
    const y = bounds.y + ((startY - bounds.y + yOffset) % bounds.height);
    if (y + size > bounds.y + bounds.height) continue;

    for (let xOffset = 0; xOffset < bounds.width; xOffset += 1) {
      const x = bounds.x + ((startX - bounds.x + xOffset) % bounds.width);
      if (x + size > bounds.x + bounds.width) continue;

      const position = { x, y };
      if (isFootprintOpen(options.occupied, position, size)) {
        return position;
      }
    }
  }

  return undefined;
}

function isFootprintOpen(occupied: Set<string>, position: SceneCoordinate, size: number): boolean {
  for (let y = position.y; y < position.y + size; y += 1) {
    for (let x = position.x; x < position.x + size; x += 1) {
      if (occupied.has(cellKey({ x, y }))) {
        return false;
      }
    }
  }
  return true;
}

function occupyCells(occupied: Set<string>, position: SceneCoordinate, size: number): void {
  for (let y = position.y; y < position.y + size; y += 1) {
    for (let x = position.x; x < position.x + size; x += 1) {
      occupied.add(cellKey({ x, y }));
    }
  }
}

export function getSceneTokenSize(size: Monster['size']): number {
  switch (size) {
    case 'large':
      return 2;
    case 'huge':
      return 3;
    case 'gargantuan':
      return 4;
    case 'tiny':
    case 'small':
    case 'medium':
    default:
      return 1;
  }
}

function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function getCharacterLevel(document: CharacterDocument<SystemDataModel>): number | undefined {
  const rawLevel = document.system.level;
  if (typeof rawLevel !== 'number' || !Number.isFinite(rawLevel)) {
    return undefined;
  }

  return Math.min(20, Math.max(1, Math.trunc(rawLevel)));
}

function makeUniqueTokenId(monsterId: string, used: Set<string>): string {
  const base = monsterId.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'monster';
  let index = 1;
  let candidate = `${base}-${index}`;
  while (used.has(candidate)) {
    index += 1;
    candidate = `${base}-${index}`;
  }
  return candidate;
}

function nextEventId(
  scene: SceneDocument,
  events: SceneEvent[],
  eventIdFactory?: () => string
): string {
  return eventIdFactory?.() ?? `encounter-event-${scene.events.length + events.length + 1}`;
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isInteger(value)) return min;
  return Math.min(max, Math.max(min, value));
}
