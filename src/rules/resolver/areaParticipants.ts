/**
 * Shared area participant selection: who an AoE actually catches.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md`, "Participant-aware resolution".
 *
 * Given an area template, where it originates and where it is aimed, plus a set
 * of candidate creatures, this returns the ones the blast catches — applying the
 * grid geometry, line of effect, cover (as a save bonus), and spread-around-
 * corners flood fill. It is pure and scene-free: callers pass abstract
 * candidates (id + position + base save bonus), so BOTH the scene bridge
 * (resolveSceneAreaEffect) and the scene-free tactical executor select
 * participants through one identical code path.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import type { AreaOfEffect } from '../../types/core/common';
import type { EffectInstance } from '../ir/types';
import {
  areaOfEffectToShape,
  areaOriginPoint,
  cellInArea,
  type AreaShape,
  type DiagonalRule,
} from './areaTargeting';
import {
  coverBetween,
  coverSaveBonus,
  spreadCells,
  type BlockPredicate,
  type CoverLevel,
} from './lineOfEffect';
import type { SaveParticipant } from './participantResolution';

/**
 * A save-based area action ready to resolve (a breath weapon or a spell). The
 * same shape whether the source is a monster statblock or a PC's spell.
 */
export interface SceneAreaAction {
  name: string;
  /** Ability targets save with (e.g. 'dex'), lowercased. */
  saveAbility: string;
  saveDC: number;
  /** When true, a successful save halves damage; else it negates. */
  halfOnSave: boolean;
  damageEffects: EffectInstance[];
  /**
   * Canonical area template; undefined → affects only the aimed cell. Every shape
   * (cone/cube/cylinder/line/sphere/emanation/spread) is supported.
   */
  area?: AreaOfEffect;
}

/** A creature an area effect might catch: identity, cell, and its base save bonus. */
export interface AreaCandidate {
  id: string;
  position: SceneCoordinate;
  /** Save bonus for the action's save ability, BEFORE cover (cover is added here). */
  saveBonus: number;
}

export interface AreaParticipantSelection {
  shape: AreaShape;
  /** The area's point of origin (whence line of effect is traced). */
  origin: SceneCoordinate;
  /** Candidate ids the template caught (line of effect clear). */
  caughtIds: string[];
  /** Per-caught save participants, with cover folded into the bonus. */
  participants: SaveParticipant[];
  /** Cover level per caught id (for display). */
  coverById: Map<string, CoverLevel>;
  /** How many candidates inside the template were fully shielded by total cover. */
  shieldedByCover: number;
}

const NO_BLOCK: BlockPredicate = () => false;

/** The grid shape an area fills; an undefined template is a single-cell burst on the aim. */
export function shapeForArea(
  area: AreaOfEffect | undefined,
  emitter: SceneCoordinate,
  aim: SceneCoordinate
): AreaShape {
  if (!area) return { kind: 'burst', origin: aim, radius: 0 };
  return areaOfEffectToShape(area, emitter, aim);
}

/**
 * Select the participants an area effect catches from a candidate set, applying
 * line of effect (total cover excludes), partial cover (added to the save), and
 * spread flood-fill membership. Pure and deterministic.
 */
export function computeAreaParticipants(input: {
  area: AreaOfEffect | undefined;
  /** The emitter's cell (cone apex / line start / emanation center). */
  emitter: SceneCoordinate;
  /** The aimed cell (sphere/cube/spread center; cone/line direction). */
  aim: SceneCoordinate;
  candidates: readonly AreaCandidate[];
  systemId: string;
  rule?: DiagonalRule;
  isBlocked?: BlockPredicate;
}): AreaParticipantSelection {
  const rule = input.rule ?? 'chebyshev';
  const isBlocked = input.isBlocked ?? NO_BLOCK;
  const shape = shapeForArea(input.area, input.emitter, input.aim);
  const origin = areaOriginPoint(shape);
  const spreadReach =
    input.area?.type === 'spread' && shape.kind === 'burst'
      ? spreadCells(shape.origin, shape.radius, isBlocked, rule)
      : undefined;

  const caughtIds: string[] = [];
  const coverById = new Map<string, CoverLevel>();
  const participants: SaveParticipant[] = [];
  let shieldedByCover = 0;

  for (const candidate of input.candidates) {
    if (!cellInArea(candidate.position, shape, rule)) continue;

    if (spreadReach) {
      if (!spreadReach.has(`${candidate.position.x},${candidate.position.y}`)) {
        shieldedByCover += 1; // a wall the spread could not bend around
        continue;
      }
      caughtIds.push(candidate.id);
      coverById.set(candidate.id, 'none');
      participants.push({ targetId: candidate.id, saveBonus: candidate.saveBonus });
      continue;
    }

    const cover = coverBetween(origin, candidate.position, isBlocked);
    if (cover === 'total') {
      shieldedByCover += 1; // no line of effect — fully shielded by a wall
      continue;
    }
    caughtIds.push(candidate.id);
    coverById.set(candidate.id, cover);
    participants.push({
      targetId: candidate.id,
      saveBonus: candidate.saveBonus + coverSaveBonus(cover, input.systemId),
    });
  }

  return { shape, origin, caughtIds, participants, coverById, shieldedByCover };
}
