/** (Score - 10) / 2, floored — standard d20 ability modifier */
export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Format a signed modifier string: +2, -1, +0 */
export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Parse an integer from a string, returning fallback on NaN */
export function parseNum(v: string, fallback: number): number {
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}
