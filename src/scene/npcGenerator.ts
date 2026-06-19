import type { Monster } from '../types/creatures/monsters';
import type { SeededRng } from './seededRng';

/**
 * Deterministic NPC generation from loader-backed rules content. "Spinning up a
 * populated world" without an AI: a name comes from seeded syllable tables and
 * the statblock is drawn from the scene's open-content creature catalog, so the
 * NPC is mechanically real (the same statblocks monsters use) and reproducible.
 * Honest — a dice tool, not a model; the player edits the result freely. The
 * AI "from a sentence" layer is a separate concern (the Phase 7 AI port).
 */

// Kept deliberately small and obviously extensible; pronounceable fantasy-ish.
const NAME_STARTS = [
  'Bran',
  'Cor',
  'Dra',
  'El',
  'Fen',
  'Gor',
  'Hal',
  'Il',
  'Jor',
  'Kel',
  'Lyr',
  'Mor',
  'Nim',
  'Or',
  'Pry',
  'Quen',
  'Ral',
  'Syl',
  'Tor',
  'Ul',
  'Vex',
  'Wyn',
  'Yor',
  'Zel',
];
const NAME_MIDS = ['a', 'e', 'i', 'o', 'u', 'ae', 'ar', 'en', 'il', 'or', 'un', 'yth'];
const NAME_ENDS = [
  'as',
  'en',
  'eth',
  'ia',
  'in',
  'or',
  'us',
  'wyn',
  'dra',
  'ric',
  'mir',
  'la',
  'don',
  'is',
];

/** A seeded, pronounceable NPC name (e.g. "Branwyn", "Keldra"). */
export function generateNpcName(rng: SeededRng): string {
  const pick = <T>(values: readonly T[]): T => values[rng.nextInt(values.length)];
  return `${pick(NAME_STARTS)}${pick(NAME_MIDS)}${pick(NAME_ENDS)}`;
}

export interface GeneratedNpc {
  /** The creature statblock backing the NPC (its mechanical reality). */
  monster: Monster;
  /** A generated display name. */
  name: string;
}

/**
 * Roll up an NPC: a random catalog creature plus a generated name. Returns
 * undefined when the catalog is empty (no creatures loaded for the system).
 */
export function generateNpc(catalog: readonly Monster[], rng: SeededRng): GeneratedNpc | undefined {
  if (catalog.length === 0) return undefined;
  const monster = catalog[rng.nextInt(catalog.length)];
  return { monster, name: generateNpcName(rng) };
}
