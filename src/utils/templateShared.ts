import type { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * Shared leaf helpers for the per-system character template applicators
 * (class / species / background / feat / d20-legacy). These were previously
 * copy-pasted into each template module; consolidating the plumbing here keeps
 * one source of truth while each system retains its own apply-template policy.
 */

/** Deep-clone a character document before applying a template transform. */
export function cloneDocument<T extends SystemDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

/** Order-preserving de-duplication of a string list. */
export function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

/** Faces on a hit die expressed as `dN` (e.g. `d8` -> 8). */
export function hitDieFaces(hitDie: string): number {
  return Number.parseInt(hitDie.replace('d', ''), 10);
}

/** SRD "average" roll for a hit die: floor(faces / 2) + 1. */
export function averageHitDieRoll(hitDie: string): number {
  return Math.floor(hitDieFaces(hitDie) / 2) + 1;
}

/**
 * Seed hit-die rolls for `level` levels: preserve any existing positive roll,
 * otherwise seed the SRD average — except index 0 of the character's FIRST
 * class row, which takes the maximum (PHB/SRD grant max HP only at character
 * level 1; a class added later starts on the average like any other level).
 */
export function seedHitDieRolls(
  existingRolls: number[],
  hitDie: string,
  level: number,
  maxFirstLevel = true
): number[] {
  const maxAtLevelOne = hitDieFaces(hitDie);
  const averagePerLevel = averageHitDieRoll(hitDie);
  const rolls: number[] = [];

  for (let index = 0; index < level; index += 1) {
    const existing = existingRolls[index];
    if (typeof existing === 'number' && Number.isFinite(existing) && existing > 0) {
      rolls.push(existing);
      continue;
    }

    rolls.push(index === 0 && maxFirstLevel ? maxAtLevelOne : averagePerLevel);
  }

  return rolls;
}
