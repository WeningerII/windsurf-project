import type { Monster } from '../types/creatures/monsters';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { SceneCoordinate, SceneDocument, SceneEvent } from '../types/core/scene';
import { appendSceneEvent, foldSceneEvents, resolveSceneAction } from './runtime';
import { createSeededRng } from './seededRng';

export interface EncounterMonsterSelection {
  monsterId: string;
  count: number;
}

export interface BuildEncounterEventsParams {
  scene: SceneDocument;
  monsters: Monster[];
  selections: EncounterMonsterSelection[];
  origin?: SceneCoordinate;
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
  origin = { x: 0, y: 0 },
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
  const tokenIds = new Set(Object.keys(folded.state.tokens));
  const monsterTotals = planned.reduce((totals, entry) => {
    totals.set(entry.monster.id, (totals.get(entry.monster.id) ?? 0) + 1);
    return totals;
  }, new Map<string, number>());
  const monsterOrdinals = new Map<string, number>();
  const generatedTokens = planned.map(({ monster }) => {
    const size = getSceneTokenSize(monster.size);
    const position = findOpenPosition(folded.state.grid.width, folded.state.grid.height, size, {
      origin,
      occupied,
    });

    if (!position) {
      issues.push({
        code: 'encounter-grid-full',
        message: `No open ${size}x${size} space remains for ${monster.name}.`,
      });
      return undefined;
    }

    occupyCells(occupied, position, size);
    const tokenId = makeUniqueTokenId(monster.id, tokenIds);
    tokenIds.add(tokenId);
    const ordinal = (monsterOrdinals.get(monster.id) ?? 0) + 1;
    monsterOrdinals.set(monster.id, ordinal);

    return {
      id: tokenId,
      name: (monsterTotals.get(monster.id) ?? 0) > 1 ? `${monster.name} ${ordinal}` : monster.name,
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
  options: { seed: string }
) {
  const { state } = foldSceneEvents(scene);
  const existingByTokenId = new Map(state.initiative.map((entry) => [entry.tokenId, entry.value]));
  const generatedByTokenId = new Map(
    generatedTokens
      .filter((token): token is { id: string; monster: Monster } => Boolean(token))
      .map((token) => [token.id, token.monster])
  );

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

      return {
        tokenId: token.id,
        value: existingByTokenId.get(token.id) ?? 10,
      };
    })
    .sort((a, b) => b.value - a.value || a.tokenId.localeCompare(b.tokenId));
}

function buildOccupiedCells(state: ReturnType<typeof foldSceneEvents>['state']): Set<string> {
  const occupied = new Set<string>();
  Object.values(state.tokens).forEach((token) => occupyCells(occupied, token.position, token.size));
  return occupied;
}

function findOpenPosition(
  gridWidth: number,
  gridHeight: number,
  size: number,
  options: { origin: SceneCoordinate; occupied: Set<string> }
): SceneCoordinate | undefined {
  const startY = clampInteger(options.origin.y, 0, Math.max(0, gridHeight - size));
  const startX = clampInteger(options.origin.x, 0, Math.max(0, gridWidth - size));

  for (let yOffset = 0; yOffset < gridHeight; yOffset += 1) {
    const y = (startY + yOffset) % gridHeight;
    if (y + size > gridHeight) continue;

    for (let xOffset = 0; xOffset < gridWidth; xOffset += 1) {
      const x = (startX + xOffset) % gridWidth;
      if (x + size > gridWidth) continue;

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

function cellKey(position: SceneCoordinate): string {
  return `${position.x}:${position.y}`;
}

function getSceneTokenSize(size: Monster['size']): number {
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
