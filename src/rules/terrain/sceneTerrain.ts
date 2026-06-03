/**
 * Functional terrain: bridging scene markers into the rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 4.
 *
 * Scene markers can carry `effects` (a structurally-typed `SceneTerrainEffect[]`
 * that mirrors the IR without coupling `scene.ts` to the rules module). This
 * module turns those into real `EffectInstance`s and collects the ones covering
 * a given grid cell, so terrain participates in deterministic resolution —
 * "the map and the rules are the same object."
 *
 * Pure and deterministic: pure geometry + a structural map. No RNG, no state
 * mutation. A cell with no functional terrain yields no effects, so existing
 * scenes are unaffected.
 */

import type { SceneCoordinate, SceneMarker, SceneState } from '../../types/core/scene';
import {
  makeEffectId,
  type EffectInstance,
  type EffectOperation,
  type StackPolicy,
} from '../ir/types';
import type { BlockPredicate, WallTopAt } from '../resolver/lineOfEffect';

/** Operations the terrain bridge accepts (a safe subset of EffectOperation). */
const TERRAIN_OPERATIONS = new Set<EffectOperation>([
  'add',
  'subtract',
  'multiply',
  'set',
  'min',
  'max',
  'note',
]);

function isTerrainOperation(operation: string): operation is EffectOperation {
  return TERRAIN_OPERATIONS.has(operation as EffectOperation);
}

function normalizeStackPolicy(stackPolicy: unknown): StackPolicy {
  if (
    stackPolicy === 'sum' ||
    stackPolicy === 'pf2e-item' ||
    stackPolicy === 'pf2e-status' ||
    stackPolicy === 'pf2e-circumstance'
  ) {
    return stackPolicy;
  }
  if (
    typeof stackPolicy === 'object' &&
    stackPolicy !== null &&
    'bonusType' in stackPolicy &&
    typeof (stackPolicy as { bonusType: unknown }).bonusType === 'string'
  ) {
    return stackPolicy as StackPolicy;
  }
  // Terrain effects default to summing (most terrain is a flat/multiplicative
  // environmental modifier, not a named-bonus-type stack).
  return 'sum';
}

/** True when grid cell (x, y) lies within the rectangular footprint of a marker. */
export function markerCoversCell(marker: SceneMarker, cell: SceneCoordinate): boolean {
  return (
    cell.x >= marker.position.x &&
    cell.x < marker.position.x + marker.width &&
    cell.y >= marker.position.y &&
    cell.y < marker.position.y + marker.height
  );
}

/**
 * A marker is a WALL — it blocks line of effect — when it carries a terrain
 * effect targeting `cover` (e.g. `{ target: 'cover', operation: 'set', value:
 * 'total' }`). The cover *gradient* (half/three-quarters/total) is then derived
 * geometrically from the wall's footprint by the line-of-effect layer, so a
 * marker only has to declare "I block", not pre-compute who is shielded.
 */
export function markerBlocksLineOfEffect(marker: SceneMarker): boolean {
  return (marker.effects ?? []).some((effect) => effect.target === 'cover');
}

/**
 * A `BlockPredicate` over the scene: a cell blocks line of effect when any wall
 * marker covers it. Used by area resolution so a blast cannot reach through walls
 * and creatures behind cover get the right save bonus.
 */
export function sceneBlockPredicate(state: SceneState): BlockPredicate {
  const walls = Object.values(state.markers).filter(markerBlocksLineOfEffect);
  return (cell) => walls.some((marker) => markerCoversCell(marker, cell));
}

/** A wall marker's top elevation in cells: its `wallHeight`, or Infinity (full-height). */
export function markerWallTop(marker: SceneMarker): number {
  return marker.wallHeight != null && marker.wallHeight > 0 ? marker.wallHeight : Infinity;
}

/**
 * A `WallTopAt` over the scene: the tallest wall covering a cell (0 where none).
 * Feeds elevation-aware line of effect, so a sight line can clear a low wall a
 * flyer is above while it still blocks creatures on the ground.
 */
export function sceneWallTopAt(state: SceneState): WallTopAt {
  const walls = Object.values(state.markers).filter(markerBlocksLineOfEffect);
  if (walls.length === 0) return () => 0;
  return (cell) => {
    let top = 0;
    for (const marker of walls) {
      if (markerCoversCell(marker, cell)) top = Math.max(top, markerWallTop(marker));
    }
    return top;
  };
}

/**
 * The cost multiplier to ENTER a cell covered by this marker, when it declares
 * difficult terrain (`target: 'difficult-terrain'` or `'movement-cost'`). The
 * value is the multiplier (≥2); a bare flag defaults to ×2 (5e difficult
 * terrain — each cell costs double). Non-terrain markers return 1.
 */
export function markerMoveCostMultiplier(marker: SceneMarker): number {
  const effect = (marker.effects ?? []).find(
    (entry) => entry.target === 'difficult-terrain' || entry.target === 'movement-cost'
  );
  if (!effect) return 1;
  return typeof effect.value === 'number' && effect.value > 1 ? effect.value : 2;
}

/**
 * A per-cell entering-cost function over the scene's difficult-terrain markers:
 * 1 on open ground, the marker's multiplier (≥2) on difficult terrain, taking
 * the worst when markers overlap. Feeds `moveToward` so the auto-round spends
 * the right movement crossing mud, rubble, or undergrowth.
 */
export function sceneMoveCost(state: SceneState): (cell: SceneCoordinate) => number {
  const rough = Object.values(state.markers)
    .map((marker) => ({ marker, mult: markerMoveCostMultiplier(marker) }))
    .filter((entry) => entry.mult > 1);
  if (rough.length === 0) return () => 1;
  return (cell) => {
    let mult = 1;
    for (const { marker, mult: m } of rough) {
      if (markerCoversCell(marker, cell)) mult = Math.max(mult, m);
    }
    return mult;
  };
}

/** Map a single marker's stored terrain effects onto real EffectInstances. */
export function markerToEffects(marker: SceneMarker, systemId: string): EffectInstance[] {
  if (!marker.effects || marker.effects.length === 0) {
    return [];
  }
  const effects: EffectInstance[] = [];
  for (const [index, raw] of marker.effects.entries()) {
    if (!isTerrainOperation(raw.operation)) {
      continue; // skip unknown operations rather than fabricate behavior
    }
    effects.push({
      id: makeEffectId(systemId, 'terrain', marker.id, raw.target, index),
      systemId: systemId as EffectInstance['systemId'],
      target: raw.target,
      operation: raw.operation,
      value: raw.value,
      stackPolicy: normalizeStackPolicy(raw.stackPolicy),
      source: { kind: 'terrain', id: marker.id, label: marker.label },
      label: raw.label,
      category: 'other',
    });
  }
  return effects;
}

/**
 * Collect every terrain effect that applies at a grid cell, across all markers
 * covering it. Order is deterministic (marker order, then effect order). Returns
 * an empty array when the cell has no functional terrain.
 */
export function collectTerrainEffectsAt(
  state: SceneState,
  cell: SceneCoordinate
): EffectInstance[] {
  const effects: EffectInstance[] = [];
  // Object.values preserves insertion order for string keys, keeping this
  // deterministic for replay.
  for (const marker of Object.values(state.markers)) {
    if (markerCoversCell(marker, cell)) {
      effects.push(...markerToEffects(marker, state.systemId));
    }
  }
  return effects;
}
