import { D20_LEGACY_CONDITION_IDS, DAGGERHEART_CONDITION_IDS } from '../../rules';

/**
 * Conditions offered on scene tokens, per scene system: exactly the ids the
 * rules layer's dispatcher (`collectSceneConditionEffects`) compiles into
 * combat effects for that system — offering anything else would be a dead
 * control, and hiding a system's real vocabulary (as the picker did before,
 * rendering only for 5e-family scenes) makes the mechanic look 5e-only.
 */
const DND5E_SCENE_CONDITIONS = [
  'blinded',
  'frightened',
  'poisoned',
  'prone',
  'restrained',
  'paralyzed',
  'stunned',
] as const;

const SCENE_CONDITIONS_BY_SYSTEM: Record<string, readonly string[]> = {
  'dnd-5e-2014': DND5E_SCENE_CONDITIONS,
  'dnd-5e-2024': DND5E_SCENE_CONDITIONS,
  // Shared OGL flat-penalty catalog (shaken/frightened/sickened/…).
  'dnd-3.5e': D20_LEGACY_CONDITION_IDS,
  pf1e: D20_LEGACY_CONDITION_IDS,
  // Only the valued frightened/sickened variants: they are the sole 'all
  // checks' status penalties the scene compiler folds into attack rolls —
  // other PF2e conditions would compile to nothing on this path.
  pf2e: ['frightened-1', 'frightened-2', 'sickened-1', 'sickened-2'],
  // Note-only provenance (affects incoming rolls/movement, GM-adjudicated).
  daggerheart: DAGGERHEART_CONDITION_IDS,
  // The bruise track is owned by attack resolution (set-token-conditions
  // intents from resolveSceneAttack), not hand-picked.
  mam3e: [],
};

/**
 * An unset systemId resolves conditions under the rules layer's 5e default
 * branch, so the picker mirrors that same vocabulary to stay consistent;
 * unknown ids get no options (their conditions would compile to nothing).
 */
export function sceneConditionOptions(systemId: string | undefined): readonly string[] {
  if (!systemId) return DND5E_SCENE_CONDITIONS;
  return SCENE_CONDITIONS_BY_SYSTEM[systemId] ?? [];
}
