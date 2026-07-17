import type { SceneTerrainEffect } from '../../types/core/scene';

/**
 * Authorable functional-terrain presets for the marker-creation flow. Deliberately
 * the ONLY mechanically live shapes the scene runtime consumes: cover reads a
 * `target:'ac'` bonus off the TARGET's cell (raising the effective defense — AC /
 * Dodge / Parry / Evasion), high ground reads a `target:'attack'` bonus off the
 * ATTACKER's cell (raising the to-hit), and difficult terrain reads a
 * `target:'movement'` cost off a cell being ENTERED (each authored point adds a
 * cell of movement cost). We do not offer damage/other targets — they resolve to
 * nothing today, and a fake option would violate the project's no-fake-automation
 * principle. Cover + high ground fold into every system's attack resolution — the
 * manual path (`resolveSceneAttack`, all system branches) and the autonomous round
 * (`runSceneRound` via the tactical executor). Difficult terrain is consumed by the
 * autonomous move-to-engage step (manual dragging is GM-adjudicated). All looked up
 * by live position; a cell with no terrain resolves and moves identically to today.
 */
export type MarkerEffectPreset = 'none' | 'cover-2' | 'cover-5' | 'high-ground-1' | 'difficult';

interface MarkerEffectOption {
  value: MarkerEffectPreset;
  label: string;
}

export const MARKER_EFFECT_OPTIONS: readonly MarkerEffectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'cover-2', label: 'Cover (+2 defense)' },
  { value: 'cover-5', label: 'Cover (+5 defense)' },
  { value: 'high-ground-1', label: 'High ground (+1 attack)' },
  { value: 'difficult', label: 'Difficult terrain (×2 move)' },
];

/**
 * Map an authored preset to the marker's stored terrain effects. `none` returns
 * `undefined` so a marker placed without terrain stays byte-identical to today (no
 * `effects` field) — the strict-additive contract. Cover belongs under the DEFENDER
 * at resolution (raises effective defense); high ground under the ATTACKER (raises
 * to-hit); difficult terrain adds a movement point to the cost of ENTERING the cell
 * (`+1` → double cost, the SRD "difficult terrain" rule).
 */
export function terrainEffectsForPreset(
  preset: MarkerEffectPreset
): SceneTerrainEffect[] | undefined {
  switch (preset) {
    case 'cover-2':
      return [{ target: 'ac', operation: 'add', value: 2, label: '+2 cover' }];
    case 'cover-5':
      return [{ target: 'ac', operation: 'add', value: 5, label: '+5 cover' }];
    case 'high-ground-1':
      return [{ target: 'attack', operation: 'add', value: 1, label: '+1 high ground' }];
    case 'difficult':
      return [{ target: 'movement', operation: 'add', value: 1, label: 'difficult terrain' }];
    case 'none':
    default:
      return undefined;
  }
}

/**
 * One-line, honest description of what an authored preset does in play, for the
 * marker panel (null for `none`). Kept beside the presets so the UI copy and the
 * mechanical mapping above cannot drift apart — the scope each line claims is
 * exactly what {@link terrainEffectsForPreset} emits and the runtime consumes.
 */
export function markerEffectHelp(preset: MarkerEffectPreset): string | null {
  switch (preset) {
    case 'cover-2':
    case 'cover-5':
      return 'Cover raises the defense of a token standing on this cell. Applies when resolving attacks in scene combat — every system, manual and autonomous.';
    case 'high-ground-1':
      return 'High ground raises the to-hit of a token attacking from this cell. Applies when resolving attacks in scene combat — every system, manual and autonomous.';
    case 'difficult':
      return 'Difficult terrain doubles the movement cost to enter this cell, so the autonomous Run Round moves fewer cells across it (manual dragging is GM-adjudicated).';
    case 'none':
    default:
      return null;
  }
}
