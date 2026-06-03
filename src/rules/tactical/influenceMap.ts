/**
 * Influence / threat maps — the spatial substrate for tactical reasoning.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted). This is the gold-standard
 * pattern from Dave Mark's "Modular Tactical Influence Maps" (Game AI Pro 2):
 * encode "how dangerous / contested / desirable is this cell" as a scalar field
 * the AI reads in O(1), so movement and positioning become cover-aware and
 * danger-avoiding instead of "walk straight at the nearest foe."
 *
 * Deterministic and pure: integer math over a bounded grid window, no RNG, no
 * float decay (which drifts across platforms). A threat field answers "how
 * dangerous is it to stand here" — the basis for kiting, approaching from safety,
 * and not wandering into a wall of opportunity attacks. Threat is stamped on each
 * source's own elevation plane, matching our verticality: a grounded melee foe
 * threatens the ground, not a flyer hovering above it.
 */

import type { SceneCoordinate } from '../../types/core/scene';
import { gridDistance, type DiagonalRule } from '../resolver/areaTargeting';

/** A sparse integer field over grid cells (3D-aware key); absent cells read 0. */
export type InfluenceMap = ReadonlyMap<string, number>;

const cellKey = (cell: SceneCoordinate): string => `${cell.x},${cell.y},${cell.z ?? 0}`;

/** The field value at a cell (0 where nothing was stamped). */
export function influenceAt(map: InfluenceMap, cell: SceneCoordinate): number {
  return map.get(cellKey(cell)) ?? 0;
}

/** A combatant that makes some cells dangerous to occupy. */
export interface ThreatSource {
  position: SceneCoordinate;
  /** Melee reach in cells. */
  reach: number;
  /** Movement budget in cells this turn (it can move then strike); 0 = stationary. */
  speed: number;
  /** Ranged attack range in cells, when it has a ranged option. */
  range?: number;
  /** Magnitude this source adds to every cell it could attack (e.g. expected damage). */
  threat: number;
}

/**
 * Build a threat field over the grid: each source stamps every in-bounds cell it
 * could attack THIS turn — within (speed + reach) for melee, or within `range`
 * for ranged — with its threat magnitude, summed across sources so a cell several
 * enemies can reach scores as more dangerous. Stamped on each source's own
 * elevation plane. Pure, deterministic, integer.
 */
export function buildThreatMap(params: {
  sources: readonly ThreatSource[];
  /** Grid width (x in [0, width)). */
  width: number;
  /** Grid height (y in [0, height)). */
  height: number;
  rule?: DiagonalRule;
}): InfluenceMap {
  const rule = params.rule ?? 'chebyshev';
  const map = new Map<string, number>();

  for (const source of params.sources) {
    const meleeEnvelope = source.speed + source.reach;
    const envelope = Math.max(meleeEnvelope, source.range ?? 0);
    if (envelope <= 0) continue;
    const z = source.position.z ?? 0;

    // Only scan the bounding window the envelope could reach, clamped to the grid.
    const minX = Math.max(0, source.position.x - envelope);
    const maxX = Math.min(params.width - 1, source.position.x + envelope);
    const minY = Math.max(0, source.position.y - envelope);
    const maxY = Math.min(params.height - 1, source.position.y + envelope);

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const distance = gridDistance(source.position, { x, y, z }, rule);
        const threatened =
          distance <= meleeEnvelope || (source.range != null && distance <= source.range);
        if (!threatened) continue;
        const key = `${x},${y},${z}`;
        map.set(key, (map.get(key) ?? 0) + source.threat);
      }
    }
  }

  return map;
}
