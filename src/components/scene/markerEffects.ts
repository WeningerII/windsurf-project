import type { SceneTerrainEffect } from '../../types/core/scene';

/**
 * Authorable functional-terrain presets for the marker-creation flow. Deliberately
 * the ONLY two mechanically live shapes in `resolveSceneAttack`
 * (src/rules/combat/sceneCombat.ts): cover reads a `target:'ac'` bonus off the
 * TARGET's cell (raising the effective defense — AC / Dodge / Parry / Evasion), and
 * high ground reads a `target:'attack'` bonus off the ATTACKER's cell (raising the
 * to-hit). We do not offer damage/other targets — they resolve to nothing today,
 * and a fake option would violate the project's no-fake-automation principle. Both
 * fold into every system's manual attack branch (d20/5e/PF-family, M&M, and
 * Daggerheart); the autonomous round (`runSceneRound`) does not apply terrain yet.
 */
export type MarkerEffectPreset = 'none' | 'cover-2' | 'cover-5' | 'high-ground-1';

interface MarkerEffectOption {
  value: MarkerEffectPreset;
  label: string;
}

export const MARKER_EFFECT_OPTIONS: readonly MarkerEffectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'cover-2', label: 'Cover (+2 AC)' },
  { value: 'cover-5', label: 'Cover (+5 AC)' },
  { value: 'high-ground-1', label: 'High ground (+1 attack)' },
];

/**
 * Map an authored preset to the marker's stored terrain effects. `none` returns
 * `undefined` so a marker placed without terrain stays byte-identical to today (no
 * `effects` field) — the strict-additive contract. Cover belongs under the DEFENDER
 * at resolution (raises effective defense); high ground under the ATTACKER (raises
 * to-hit).
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
    case 'none':
    default:
      return undefined;
  }
}
