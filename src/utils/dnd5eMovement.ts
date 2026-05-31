/**
 * D&D 5e movement and carrying math, cited against the SRD (identical in SRD 5.1
 * and SRD 5.2). Pure functions so the math is available to both 5e engines and
 * future calculators. Pinned by src/__tests__/dnd5eMovement.test.ts.
 */

/** Carrying capacity in pounds: Strength score × 15 (SRD: Carrying Capacity). */
export function dnd5eCarryingCapacity(strengthScore: number): number {
  return Math.max(0, strengthScore) * 15;
}

/**
 * Maximum weight a creature can push, drag, or lift: Strength score × 30 (twice
 * carrying capacity). Moving more than your carrying capacity, up to this limit,
 * costs you Speed (you move at 5 feet). (SRD: Push, Drag, or Lift.)
 */
export function dnd5ePushDragLift(strengthScore: number): number {
  return Math.max(0, strengthScore) * 30;
}

/**
 * Long jump distance in feet: with a 10-foot running start you clear your
 * Strength score in feet; a standing long jump covers half that, rounded down
 * (SRD: Jumping — Long Jump).
 */
export function dnd5eLongJump(strengthScore: number, runningStart = true): number {
  const full = Math.max(0, strengthScore);
  return runningStart ? full : Math.floor(full / 2);
}

/**
 * High jump height in feet: with a 10-foot running start you reach 3 + your
 * Strength modifier feet; a standing high jump reaches half that, rounded down
 * (SRD: Jumping — High Jump).
 */
export function dnd5eHighJump(strengthMod: number, runningStart = true): number {
  const full = Math.max(0, 3 + strengthMod);
  return runningStart ? full : Math.floor(full / 2);
}
