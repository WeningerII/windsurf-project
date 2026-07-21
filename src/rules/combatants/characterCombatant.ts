/**
 * Adapter: player CharacterDocument → combat-ready data (d20 family).
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * Monsters already convert to combatants (monsterCombatant.ts); this does the
 * same for PLAYER CHARACTERS so a real PC can fight real monsters. It covers the
 * five d20-family systems that share the "attack roll vs AC, reduce HP" model:
 * D&D 5e (2014 + 2024), D&D 3.5e, Pathfinder 1e, and Pathfinder 2e.
 *
 * Everything system-specific — base attack bonus, active-weapon convention,
 * riders/conditions, versatile/off-hand capability, attack economy — lives in
 * ONE profile per system (systemProfiles.ts). This builder is system-agnostic:
 * it normalizes the sheet, asks the profile, and assembles effects through the
 * shared compile layer, so magic items and feats resolve identically everywhere.
 *
 * M&M 3e (Toughness saves, no hit points) and Daggerheart (damage thresholds +
 * Armor Score) use fundamentally different damage models and are intentionally
 * NOT forced into an AC/HP shape here — buildCharacterCombatant returns an
 * `unsupported` result for them with an honest reason, to be handled by a
 * dedicated adapter rather than faked.
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import type { EquippedItem, Feat, Feature } from '../../types/core/character';
import type { SceneCoordinate, SceneToken } from '../../types/core/scene';
import { abilityMod } from '../../utils/math';
import {
  dnd5eVersatileDamageDie,
  dnd5eOffHandDamageMod,
  pf2eStrikingDice,
} from '../../utils/derivedCombatMath';
import { D20_PROFILES, num, type NormalizedSheet, type RiderContext } from './systemProfiles';
import {
  compileEquipmentEffects,
  compileModifierEffects,
  resolveEffects,
  type EffectInstance,
  type MagicBonusItem,
  type ModifierSource,
} from '../index';

export interface CharacterCombatant {
  token: SceneToken;
  /**
   * Attacks per Attack action (5e Extra Attack: fighter 5/11/20 reach 2/3/4;
   * other martials 2 at level 5). Derived from 'extra-attack*' features.
   */
  attacksPerRound: number;
  /**
   * Legacy-d20 iteratives (3.5e/PF1e full attack): each attack after the
   * first rolls at a cumulative -5. Unset for 5e-family (Multiattack rolls
   * every attack at full bonus).
   */
  iterativePenaltyStep?: number;
  /** Movement per turn in grid cells (sheet speed / 5; default 6). */
  speedCells: number;
  /**
   * Combat faction. An explicit `options.faction` wins; otherwise derived from
   * the token kind ('character' → 'party', matching `factionForToken`).
   */
  faction: string;
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  /**
   * Optional 5e two-weapon bonus attack: the off-hand light weapon's attack and
   * damage. Its damage omits the ability modifier (SRD) unless the Two-Weapon
   * Fighting style is active. Resolved once after the main Attack-action attacks.
   */
  offHandAttack?: { attackEffects: EffectInstance[]; damageEffects: EffectInstance[] };
  reach: number;
  armorClass: number;
}

export type BuildCharacterCombatantResult =
  | { supported: true; combatant: CharacterCombatant }
  | { supported: false; reason: string };

/** Read the system-specific AC into a flat number (5e/PF2e flat; d20-legacy .total). */
function readArmorClass(system: Record<string, unknown>): number {
  const ac = system.armorClass;
  if (typeof ac === 'number') return ac; // 5e (both), PF2e
  if (ac && typeof ac === 'object' && 'total' in ac) {
    return num((ac as { total: unknown }).total, 10); // 3.5e / PF1e
  }
  return 10;
}

function normalizeSheet(document: CharacterDocument<SystemDataModel>): NormalizedSheet {
  const system = document.system as Record<string, unknown>;
  const hp = (system.hitPoints as { current?: unknown; max?: unknown; temp?: unknown }) ?? {};
  return {
    level: Math.max(1, num(system.level, 1)),
    abilities: (system.baseAttributes as Record<string, number>) ?? {},
    armorClass: readArmorClass(system),
    hp: {
      current: num(hp.current, 1),
      max: num(hp.max, 1),
      temp: num(hp.temp, 0),
    },
    baseAttackBonus: num(system.baseAttackBonus),
    equipment: (system.equipment as EquippedItem[]) ?? [],
    feats: (system.feats as Feat[]) ?? [],
    features: (system.features as Feature[]) ?? [],
  };
}

function toMagicBonusItems(equipment: EquippedItem[]): MagicBonusItem[] {
  return equipment.map((item) => ({
    itemId: item.itemId,
    customName: item.customName,
    attackBonus: item.attackBonus,
    damageBonus: item.damageBonus,
    acBonus: item.acBonus,
    bonusType: item.bonusType,
    pf2eBucket: (item as unknown as { pf2eBucket?: 'item' | 'status' | 'circumstance' }).pf2eBucket,
  }));
}

function toModifierSources(feats: Feat[], features: Feature[]): ModifierSource[] {
  return [
    ...feats.map(
      (feat): ModifierSource => ({
        id: feat.id,
        name: feat.name,
        kind: 'feat',
        modifiers: feat.modifiers,
      })
    ),
    ...features.map(
      (feature): ModifierSource => ({
        id: feature.id,
        name: feature.name,
        kind: 'feature',
        modifiers: feature.modifiers,
      })
    ),
  ];
}

/**
 * Build a combat-ready combatant from a player character document. Returns
 * `{ supported: false }` for systems whose damage model is not attack-vs-AC.
 *
 * Damage is modeled from the character's equipped weapon attack/damage bonuses
 * plus a base weapon die (caller-supplied; defaults to a d6 + STR when the sheet
 * does not pin a weapon die — honest baseline, refined as weapon data lands).
 */
export function buildCharacterCombatant(
  document: CharacterDocument<SystemDataModel>,
  options: {
    tokenId?: string;
    position: SceneCoordinate;
    faction?: string;
    weaponDie?: number;
    reach?: number;
  }
): BuildCharacterCombatantResult {
  const systemId = document.systemId as GameSystemId;
  const profile = D20_PROFILES[systemId];
  if (!profile) {
    return {
      supported: false,
      reason: `${systemId} uses a non-d20 damage model (M&M Toughness / Daggerheart thresholds); needs a dedicated combatant adapter.`,
    };
  }

  const sheet = normalizeSheet(document);
  const system = document.system as Record<string, unknown>;
  const str = abilityMod(sheet.abilities.str ?? 10);

  // Attack: base (from the profile) + equipped-weapon/feat attack bonuses via
  // the shared compile layer (resolved so per-system stacking is correct).
  const weapons = toMagicBonusItems(sheet.equipment.filter(profile.isActiveWeapon));
  const modifiers = toModifierSources(sheet.feats, sheet.features);
  const compiled = [
    ...compileEquipmentEffects(systemId, weapons),
    ...compileModifierEffects(systemId, modifiers),
  ];
  const resolved = resolveEffects(compiled);
  const equipmentFeatAttack = resolved.byTarget.attack?.total ?? 0;
  const equipmentFeatDamage = resolved.byTarget.damage?.total ?? 0;

  const attackBonus = profile.baseAttackBonus(sheet, system) + equipmentFeatAttack;

  const attackEffects: EffectInstance[] = [
    {
      id: `${systemId}:attack:${document.id}`,
      systemId,
      target: 'attack',
      operation: 'add',
      value: attackBonus,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: document.id, label: `${document.name} attack` },
      label: 'Character attack bonus',
      category: 'other',
    },
  ];

  // Phase 4 riders: active, feature-gated toggles (Rage/GWM/Sneak Attack) and
  // persisted sheet conditions assemble into the same attack/damage chain the
  // sheet uses. The profile decides which collectors apply.
  const systemRaw = document.system as {
    activeToggles?: string[];
    classLevels?: Array<{ classId?: string; level?: number }>;
    conditions?: Array<{ id: string }>;
  };
  const riderContext: RiderContext = {
    activeToggles: systemRaw.activeToggles ?? [],
    featureIds: new Set(sheet.features.map((feature) => feature.id)),
    featIds: new Set(sheet.feats.map((feat) => feat.id)),
    level: sheet.level,
    baseAttackBonus: sheet.baseAttackBonus,
    classLevel: (classId) =>
      (systemRaw.classLevels ?? []).find((entry) => entry.classId === classId)?.level ?? 0,
    conditionIds: (systemRaw.conditions ?? []).map((condition) => condition.id),
  };
  const riderEffects = profile.collectRiderEffects(riderContext);

  // Weapon damage dice: prefer the equipped main-hand weapon's real dice
  // (count × die). A Versatile weapon (where the profile supports it) rolls its
  // larger die when wielded in two hands — i.e. nothing occupies the off-hand
  // slot. With no weapon data the caller's die (or the d6 placeholder) is used,
  // so existing scenes are unchanged. Populating weaponDamage from a catalog at
  // equip time is a separate Denominator-A content step.
  const mainHandWeapon = sheet.equipment.find(
    (item) => item.slot === 'mainHand' && item.weaponDamage
  );
  const wieldedTwoHanded = !sheet.equipment.some((item) => item.slot === 'offHand');
  let weaponDiceCount = 1;
  let weaponDie = options.weaponDie ?? 6;
  if (mainHandWeapon?.weaponDamage) {
    weaponDiceCount = Math.max(1, mainHandWeapon.weaponDamage.count);
    weaponDie = mainHandWeapon.weaponDamage.die;
    if (
      profile.supportsVersatile &&
      (mainHandWeapon.weaponProperties ?? []).includes('versatile')
    ) {
      weaponDie = dnd5eVersatileDamageDie(
        weaponDie,
        mainHandWeapon.weaponVersatileDie,
        wieldedTwoHanded
      );
    }
    // PF2e striking rune: a striking/greater/major rune SETS the weapon's
    // damage-dice count to 2/3/4 (CRB Runes). Only PF2e weapons carry one, so
    // the profile gates it; other systems leave the base count untouched.
    if (profile.supportsStrikingRunes && mainHandWeapon.strikingRune) {
      weaponDiceCount = pf2eStrikingDice(mainHandWeapon.strikingRune);
    }
  }

  const damageEffects: EffectInstance[] = [
    ...Array.from({ length: weaponDiceCount }, (_unused, index) => ({
      id: `${systemId}:damage:die:${document.id}:${index}`,
      systemId,
      target: 'damage' as const,
      operation: 'add-die' as const,
      value: weaponDie,
      stackPolicy: 'sum' as const,
      source: { kind: 'custom' as const, id: document.id, label: `${document.name} weapon` },
      label: `1d${weaponDie}`,
      category: 'other' as const,
    })),
    {
      id: `${systemId}:damage:str:${document.id}`,
      systemId,
      target: 'damage',
      operation: 'add',
      value: str + equipmentFeatDamage,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: document.id, label: `${document.name} damage` },
      label: 'Character damage bonus',
      category: 'other',
    },
  ];

  // Two-Weapon Fighting (profile-gated, 5e family): an equipped off-hand LIGHT
  // weapon grants a bonus attack whose damage uses the off-hand weapon's dice
  // but OMITS the ability modifier (SRD) unless the Two-Weapon Fighting style
  // is active. Built as a separate profile so the executor resolves it after
  // the Attack-action attacks.
  const offHandWeapon = profile.supportsOffHand
    ? sheet.equipment.find(
        (item) =>
          item.slot === 'offHand' &&
          item.weaponDamage &&
          (item.weaponProperties ?? []).includes('light')
      )
    : undefined;
  const hasTwoWeaponFightingStyle =
    sheet.features.some((feature) => /two-weapon-fighting/.test(feature.id)) ||
    sheet.feats.some((feat) => /two-weapon-fighting/.test(feat.id));
  const offHandAttack = offHandWeapon?.weaponDamage
    ? {
        attackEffects,
        damageEffects: [
          ...Array.from(
            { length: Math.max(1, offHandWeapon.weaponDamage.count) },
            (_unused, index) => ({
              id: `${systemId}:offhand:die:${document.id}:${index}`,
              systemId,
              target: 'damage' as const,
              operation: 'add-die' as const,
              value: offHandWeapon.weaponDamage!.die,
              stackPolicy: 'sum' as const,
              source: {
                kind: 'custom' as const,
                id: document.id,
                label: `${document.name} off-hand`,
              },
              label: `1d${offHandWeapon.weaponDamage!.die} (off-hand)`,
              category: 'other' as const,
            })
          ),
          {
            id: `${systemId}:offhand:mod:${document.id}`,
            systemId,
            target: 'damage' as const,
            operation: 'add' as const,
            value: dnd5eOffHandDamageMod(str, hasTwoWeaponFightingStyle),
            stackPolicy: 'sum' as const,
            source: {
              kind: 'custom' as const,
              id: document.id,
              label: `${document.name} off-hand`,
            },
            label: 'Off-hand ability mod',
            category: 'other' as const,
          },
        ],
      }
    : undefined;

  return {
    supported: true,
    combatant: {
      token: {
        id: options.tokenId ?? document.id,
        name: document.name,
        kind: 'character',
        position: options.position,
        size: 1,
        refId: document.id,
        hp: { current: sheet.hp.current, max: sheet.hp.max, temp: sheet.hp.temp },
      },
      // Explicit faction wins; 'party' is what factionForToken derives for a
      // 'character'-kind token.
      faction: options.faction ?? 'party',
      attackEffects: [...attackEffects, ...riderEffects.filter((e) => e.target === 'attack')],
      damageEffects: [...damageEffects, ...riderEffects.filter((e) => e.target === 'damage')],
      ...(offHandAttack ? { offHandAttack } : {}),
      reach: options.reach ?? 1,
      armorClass: sheet.armorClass,
      ...profile.attackEconomy(sheet),
      speedCells: Math.max(
        1,
        Math.floor(num((document.system as { speed?: unknown }).speed, 30) / 5)
      ),
    },
  };
}
