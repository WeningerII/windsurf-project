import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type { DaggerheartAdversary, DaggerheartWeapon } from '../types/daggerheart';
import type { SceneToken } from '../types/core/scene';
import {
  buildCharacterCombatant,
  buildDaggerheartAdversaryCombatant,
  buildDaggerheartCombatant,
  buildMam3eCombatant,
  buildMonsterCombatant,
  type SceneCombatStats,
} from '../rules';

/**
 * The loader/document lookups a token's `refId` is resolved against. Passed in
 * (not captured) so this resolver is a pure function of (token, sources) — the
 * scene combat engine's "stats are resolved, not stored" contract.
 */
export interface CombatStatsSources {
  monstersById: ReadonlyMap<string, Monster>;
  documentsById: ReadonlyMap<string, CharacterDocument<SystemDataModel>>;
  daggerheartWeaponsById: ReadonlyMap<string, DaggerheartWeapon>;
  daggerheartAdversariesById: ReadonlyMap<string, DaggerheartAdversary>;
}

/**
 * Resolve a scene token's combat stats from its `refId`, or `undefined` when it
 * cannot fight (no ref, unknown ref, or an unsupported system).
 *
 * `monster` tokens resolve from a creature statblock (Daggerheart adversary or
 * generic monster); `character` tokens from a full sheet (per-system builder).
 * An `npc` is mechanically real when backed by *either* — it tries the statblock
 * first, then the sheet — so a goblin-archer NPC and a sheet-built lord both
 * fight by the same rules as everyone else. `object` tokens never fight.
 */
export function resolveSceneCombatStats(
  token: SceneToken,
  sources: CombatStatsSources
): SceneCombatStats | undefined {
  const { monstersById, documentsById, daggerheartWeaponsById, daggerheartAdversariesById } =
    sources;

  // A creature statblock (Daggerheart adversary or monster) keyed by refId.
  const resolveAsMonster = (): SceneCombatStats | undefined => {
    if (!token.refId) return undefined;
    // Daggerheart adversaries resolve by their own model: duality dice vs
    // Difficulty, threshold-marked HP slots.
    const adversary = daggerheartAdversariesById.get(token.refId);
    if (adversary) {
      const built = buildDaggerheartAdversaryCombatant(adversary, {
        tokenId: token.id,
        position: token.position,
      });
      if (!built.supported) return undefined;
      return {
        attackEffects: built.combatant.attackEffects,
        damageEffects: built.combatant.damageEffects,
        // Difficulty rides the targetValue channel, like Evasion.
        armorClass: built.combatant.difficulty,
        reach: built.combatant.reach,
        speedCells: built.combatant.speedCells,
        daggerheart: { thresholds: built.combatant.thresholds },
      };
    }
    const monster = monstersById.get(token.refId);
    if (!monster) return undefined;
    const built = buildMonsterCombatant(monster, { tokenId: token.id, position: token.position });
    return {
      attackEffects: built.attackEffects,
      damageEffects: built.damageEffects,
      armorClass: built.armorClass,
      reach: built.reach,
      attacksPerRound: built.attacksPerRound,
      speedCells: built.speedCells,
      areaSaveBonus: built.areaSaveBonus,
    };
  };

  // A full character sheet keyed by refId (per-system combatant builder).
  const resolveAsCharacter = (): SceneCombatStats | undefined => {
    if (!token.refId) return undefined;
    const doc = documentsById.get(token.refId);
    if (!doc) return undefined;
    if (doc.systemId === 'daggerheart') {
      const built = buildDaggerheartCombatant(doc, daggerheartWeaponsById, {
        tokenId: token.id,
        position: token.position,
      });
      if (!built.supported) return undefined;
      return {
        attackEffects: built.combatant.attackEffects,
        damageEffects: built.combatant.damageEffects,
        // Evasion rides the targetValue channel.
        armorClass: built.combatant.evasion,
        reach: built.combatant.reach,
        speedCells: built.combatant.speedCells,
        daggerheart: { thresholds: built.combatant.thresholds },
      };
    }
    if (doc.systemId === 'mam3e') {
      const built = buildMam3eCombatant(doc, { tokenId: token.id, position: token.position });
      if (!built.supported) return undefined;
      return {
        attackEffects: built.combatant.attackEffects,
        damageEffects: [],
        // Dodge rides the targetValue channel; Parry/Toughness in the variant.
        armorClass: built.combatant.dodge,
        reach: built.combatant.reach,
        speedCells: built.combatant.speedCells,
        mam3e: {
          parry: built.combatant.parry,
          toughness: built.combatant.toughness,
          effectRank: built.combatant.effectRank,
          ranged: built.combatant.ranged,
        },
      };
    }
    const built = buildCharacterCombatant(doc, { tokenId: token.id, position: token.position });
    if (!built.supported) return undefined;
    return {
      attackEffects: built.combatant.attackEffects,
      damageEffects: built.combatant.damageEffects,
      ...(built.combatant.offHandAttack ? { offHandAttack: built.combatant.offHandAttack } : {}),
      armorClass: built.combatant.armorClass,
      reach: built.combatant.reach,
      attacksPerRound: built.combatant.attacksPerRound,
      iterativePenaltyStep: built.combatant.iterativePenaltyStep,
      speedCells: built.combatant.speedCells,
      areaSaveBonus: Math.floor(
        (((doc.system as { baseAttributes?: { dex?: number } }).baseAttributes?.dex ?? 10) - 10) / 2
      ),
    };
  };

  if (token.kind === 'monster') return resolveAsMonster();
  if (token.kind === 'character') return resolveAsCharacter();
  if (token.kind === 'npc') return resolveAsMonster() ?? resolveAsCharacter();
  return undefined;
}
