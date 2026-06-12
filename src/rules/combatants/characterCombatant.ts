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
 * Per-system the only differences are how the base attack bonus and AC are read.
 * The ability half of the attack bonus is the HIGHER of the STR/DEX modifiers — a
 * finesse-agnostic baseline (a DEX rogue is not crippled, a STR fighter loses
 * nothing) until equipped-weapon data drives the choice:
 *   - 5e: proficiency bonus (by level) + max(STR, DEX) mod
 *   - 3.5e / PF1e: base attack bonus + max(STR, DEX) mod; AC is
 *     { total, touch, flatFooted }
 *   - PF2e: martial weapon proficiency total + max(STR, DEX) mod; AC is a flat
 *     number
 * The flat DAMAGE modifier stays STR-based (RAW for 3.5e/PF1e even with Weapon
 * Finesse; honest baseline for 5e until the equipped weapon pins an ability).
 * Equipped-weapon and feat/feature attack & damage bonuses are layered on via the
 * shared compile layer, so magic items and feats already resolve identically.
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
import { profBonus } from '../../systems/dnd5e/shared/engine';
import { collectDnd5eRiderEffects } from '../conditions/dnd5eRiders';
import { collectPf2eRiderEffects } from '../conditions/pf2eRiders';
import { collectD20LegacyConditionEffects } from '../conditions/d20LegacyConditions';
import { collectD20LegacyRiderEffects } from '../conditions/d20LegacyRiders';
import {
  compileEquipmentEffects,
  compileModifierEffects,
  resolveEffects,
  type EffectInstance,
  type MagicBonusItem,
  type ModifierSource,
} from '../index';

/** Systems this adapter supports (the d20 "attack vs AC, reduce HP" family). */
const SUPPORTED: ReadonlySet<GameSystemId> = new Set<GameSystemId>([
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
]);

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
  reach: number;
  armorClass: number;
}

export type BuildCharacterCombatantResult =
  | { supported: true; combatant: CharacterCombatant }
  | { supported: false; reason: string };

interface NormalizedSheet {
  level: number;
  abilities: Record<string, number>;
  armorClass: number;
  hp: { current: number; max: number; temp: number };
  baseAttackBonus: number;
  equipment: EquippedItem[];
  feats: Feat[];
  features: Feature[];
}

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Read the system-specific AC into a flat number (5e/PF2e flat; d20-legacy .total). */
function readArmorClass(system: Record<string, unknown>): number {
  const ac = system.armorClass;
  if (typeof ac === 'number') return ac; // 5e (both), PF2e
  if (ac && typeof ac === 'object' && 'total' in ac) {
    return num((ac as { total: unknown }).total, 10); // 3.5e / PF1e
  }
  return 10;
}

/** Highest martial/relevant weapon-proficiency total for PF2e (level + tier). */
function pf2eWeaponProficiency(system: Record<string, unknown>): number {
  const profs = system.weaponProficiencies;
  if (!profs || typeof profs !== 'object') return 0;
  let best = 0;
  for (const prof of Object.values(profs as Record<string, { total?: unknown }>)) {
    best = Math.max(best, num(prof?.total));
  }
  return best;
}

/** Base attack bonus (before weapon/feat effects) for the given system. */
function baseAttackBonus(
  systemId: GameSystemId,
  sheet: NormalizedSheet,
  system: Record<string, unknown>
): number {
  // Finesse-agnostic baseline: the better of STR/DEX drives the attack roll
  // (5e finesse / 3.5e Weapon Finesse shaped) until weapon data pins one.
  const ability = Math.max(
    abilityMod(sheet.abilities.str ?? 10),
    abilityMod(sheet.abilities.dex ?? 10)
  );
  switch (systemId) {
    case 'dnd-5e-2014':
    case 'dnd-5e-2024':
      return profBonus(sheet.level) + ability;
    case 'dnd-3.5e':
    case 'pf1e':
      return num(system.baseAttackBonus) + ability;
    case 'pf2e':
      return pf2eWeaponProficiency(system) + ability;
    default:
      return ability;
  }
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

/** Which equipped items are "active" for combat, per the system's convention. */
function activeWeapons(systemId: GameSystemId, equipment: EquippedItem[]): MagicBonusItem[] {
  const isActive = (item: EquippedItem): boolean => {
    // 5e marks worn items by slot; d20-legacy/PF2e use an `equipped` flag.
    const equipped = (item as unknown as { equipped?: boolean }).equipped;
    if (systemId === 'dnd-5e-2014' || systemId === 'dnd-5e-2024') {
      return item.slot === 'mainHand' || equipped === true;
    }
    return equipped === true;
  };
  return equipment.filter(isActive).map((item) => ({
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
  if (!SUPPORTED.has(systemId)) {
    return {
      supported: false,
      reason: `${systemId} uses a non-d20 damage model (M&M Toughness / Daggerheart thresholds); needs a dedicated combatant adapter.`,
    };
  }

  const sheet = normalizeSheet(document);
  const system = document.system as Record<string, unknown>;
  const str = abilityMod(sheet.abilities.str ?? 10);

  // Attack: base (system-specific) + equipped-weapon/feat attack bonuses via the
  // shared compile layer (resolved so per-system stacking is correct).
  const weapons = activeWeapons(systemId, sheet.equipment);
  const modifiers = toModifierSources(sheet.feats, sheet.features);
  const compiled = [
    ...compileEquipmentEffects(systemId, weapons),
    ...compileModifierEffects(systemId, modifiers),
  ];
  const resolved = resolveEffects(compiled);
  const equipmentFeatAttack = resolved.byTarget.attack?.total ?? 0;
  const equipmentFeatDamage = resolved.byTarget.damage?.total ?? 0;

  const attackBonus = baseAttackBonus(systemId, sheet, system) + equipmentFeatAttack;

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

  // Phase 4 riders: active, feature-gated toggles (Rage/GWM/Sneak Attack)
  // assemble into the same attack/damage chain the sheet uses.
  const systemRaw = document.system as {
    activeToggles?: string[];
    classLevels?: Array<{ classId?: string; level?: number }>;
  };
  const classLevel = (classId: string) =>
    (systemRaw.classLevels ?? []).find((entry) => entry.classId === classId)?.level ?? 0;
  const riderEffects =
    document.systemId === 'dnd-5e-2014' || document.systemId === 'dnd-5e-2024'
      ? collectDnd5eRiderEffects({
          activeToggles: systemRaw.activeToggles ?? [],
          featureIds: new Set(sheet.features.map((feature) => feature.id)),
          featIds: new Set(sheet.feats.map((feat) => feat.id)),
          barbarianLevel: classLevel('barbarian'),
          rogueLevel: classLevel('rogue'),
        })
      : [];

  // PF2e riders mirror the 5e set with CRB numbers (Rage +2, Sneak Attack
  // 1d6/2d6@5/3d6@11/4d6@17), gated the same way.
  if (systemId === 'pf2e') {
    riderEffects.push(
      ...collectPf2eRiderEffects({
        activeToggles: systemRaw.activeToggles ?? [],
        featureIds: new Set(sheet.features.map((feature) => feature.id)),
        level: sheet.level,
      })
    );
  }

  // Legacy-d20 riders: PF1e Power Attack's formula-fixed trade compiles
  // (-[1+BAB/4] attack / +2x damage); 3.5e's choose-N trade stays manual.
  if (systemId === 'pf1e' || systemId === 'dnd-3.5e') {
    riderEffects.push(
      ...collectD20LegacyRiderEffects({
        systemId,
        activeToggles: systemRaw.activeToggles ?? [],
        featIds: new Set(sheet.feats.map((feat) => feat.id)),
        baseAttackBonus: sheet.baseAttackBonus,
      })
    );
  }

  // Legacy-d20 sheet conditions (shaken/sickened/...) fight along: the same
  // catalog the engines and scene tokens use compiles the document's
  // persisted conditions into attack/damage effects.
  const legacyConditionEffects =
    systemId === 'pf1e' || systemId === 'dnd-3.5e'
      ? collectD20LegacyConditionEffects(
          systemId,
          ((document.system as { conditions?: Array<{ id: string }> }).conditions ?? []).map(
            (condition) => condition.id
          )
        )
      : [];
  riderEffects.push(...legacyConditionEffects);

  const weaponDie = options.weaponDie ?? 6;
  const damageEffects: EffectInstance[] = [
    {
      id: `${systemId}:damage:die:${document.id}`,
      systemId,
      target: 'damage',
      operation: 'add-die',
      value: weaponDie,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: document.id, label: `${document.name} weapon` },
      label: `1d${weaponDie}`,
      category: 'other',
    },
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
      reach: options.reach ?? 1,
      armorClass: sheet.armorClass,
      // 5e Extra Attack: each granted 'extra-attack*' class feature adds one
      // attack to the Attack action. 3.5e/PF1e instead grant iteratives from
      // BAB (extra attack at +6/+11/+16, each at a cumulative -5 on a full
      // attack — SRD: Base Attack Bonus / Full Attack).
      ...(systemId === 'pf1e' || systemId === 'dnd-3.5e'
        ? {
            attacksPerRound:
              1 + Math.min(3, Math.floor(Math.max(0, sheet.baseAttackBonus - 1) / 5)),
            iterativePenaltyStep: 5,
          }
        : {
            attacksPerRound:
              1 +
              sheet.features.filter((feature) => /^extra-attack(-\d+)?$/.test(feature.id)).length,
          }),
      speedCells: Math.max(
        1,
        Math.floor(num((document.system as { speed?: unknown }).speed, 30) / 5)
      ),
    },
  };
}
