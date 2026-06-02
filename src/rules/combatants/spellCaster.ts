/**
 * Adapter: a spellcaster's area spells → combat-ready `SceneAreaAction`s.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * Monsters breathe (monsterCombatant.ts); this lets a PLAYER CHARACTER cast a
 * save-based area spell — fireball and friends — through the exact same scene
 * area path. Spells already carry the canonical `areaOfEffect`, `savingThrow`,
 * and `damage`, so the conversion is mechanical: the spell's save DC comes from
 * the caster (per system), its damage dice become IR damage effects, and its
 * area template is reused as-is. The result is a `SceneAreaAction`, identical in
 * shape to a breath weapon, so `resolveSceneAreaEffect` (participants, line of
 * effect, cover, per-system save) needs no spell-specific code.
 *
 * Scope: save-based, damaging, AoE spells for the d20 family (the systems whose
 * characters become combatants). Attack-roll AoEs and non-damaging control
 * spells are intentionally excluded here. Upcasting/heightening uses the spell's
 * base damage for now (a slot-level selector is the next increment).
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import type { Spell } from '../../types/magic/spells';
import type { SpellcastingInfo } from '../../types/core/character';
import type { DiceType } from '../../types/core/common';
import { abilityMod } from '../../utils/math';
import { profBonus } from '../../systems/dnd5e/shared/engine';
import { makeEffectId, type EffectInstance } from '../ir/types';
import type { SceneAreaAction } from '../combat/sceneCombat';

/** Save attribute words (5e abilities + Pathfinder save names) → IR ability key. */
const SAVE_ABILITY: Record<string, string> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
  fortitude: 'con',
  reflex: 'dex',
  will: 'wis',
  str: 'str',
  dex: 'dex',
  con: 'con',
  int: 'int',
  wis: 'wis',
  cha: 'cha',
};

function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Faces of a die string like 'd6'. Returns 0 for unrecognized input. */
function dieFaces(die: DiceType | string): number {
  const match = /^d(\d+)$/.exec(die);
  return match ? Number(match[1]) : 0;
}

/** The caster's spellcasting ability ('int' | 'wis' | 'cha'), if any. */
function spellcastingAbility(system: Record<string, unknown>): string | undefined {
  const sc = system.spellcasting as SpellcastingInfo | undefined;
  const ability = sc?.classes?.[0]?.ability;
  return ability ? ability.toLowerCase() : undefined;
}

/**
 * The caster's spell save DC for a spell, by system (RAW):
 *   - 5e: 8 + proficiency + spellcasting modifier;
 *   - PF2e: 10 + proficiency + spellcasting modifier (class/spell DC);
 *   - 3.5e / PF1e: 10 + spell level + spellcasting modifier.
 */
export function spellSaveDC(
  document: CharacterDocument<SystemDataModel>,
  spell: Spell,
  systemId: GameSystemId
): number {
  const system = document.system as Record<string, unknown>;
  const level = Math.max(1, num(system.level, 1));
  const ability = spellcastingAbility(system) ?? 'int';
  const abilities = (system.baseAttributes as Record<string, number>) ?? {};
  const mod = abilityMod(num(abilities[ability], 10));
  switch (systemId) {
    case 'dnd-5e-2014':
    case 'dnd-5e-2024':
      return 8 + profBonus(level) + mod;
    case 'pf2e':
      return 10 + profBonus(level) + mod;
    case 'dnd-3.5e':
    case 'pf1e':
      return 10 + spell.level + mod;
    default:
      return 10 + mod;
  }
}

/** Build IR damage effects from a spell's base damage dice. */
export function spellDamageEffects(
  systemId: GameSystemId,
  casterId: string,
  spell: Spell
): EffectInstance[] {
  if (!spell.damage) return [];
  const { base, type } = spell.damage;
  const faces = dieFaces(base.die);
  if (faces <= 0) return [];
  const target = `damage.${type}`;
  const effects: EffectInstance[] = [];
  for (let dieIndex = 0; dieIndex < base.count; dieIndex += 1) {
    effects.push({
      id: makeEffectId(systemId, target, casterId, spell.id, 'die', dieIndex),
      systemId,
      target,
      operation: 'add-die',
      value: faces,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: spell.id, label: spell.name },
      label: `${spell.name} d${faces}`,
      category: 'other',
    });
  }
  if (base.modifier) {
    effects.push({
      id: makeEffectId(systemId, target, casterId, spell.id, 'flat'),
      systemId,
      target,
      operation: 'add',
      value: base.modifier,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: spell.id, label: spell.name },
      label: `${spell.name} damage bonus`,
      category: 'other',
    });
  }
  return effects;
}

/**
 * Convert a spell into a scene area action when it is a save-based, damaging AoE.
 * Returns undefined for spells without an area, save, or damage, and for
 * attack-roll AoEs (which resolve through the attack path, not the save path).
 */
export function spellAreaAction(
  spell: Spell,
  document: CharacterDocument<SystemDataModel>,
  systemId: GameSystemId
): SceneAreaAction | undefined {
  if (!spell.areaOfEffect || !spell.savingThrow || !spell.damage) return undefined;
  if (spell.attackRoll) return undefined;
  const attribute = spell.savingThrow.attribute.toLowerCase();
  return {
    name: spell.name,
    saveAbility: SAVE_ABILITY[attribute] ?? attribute,
    saveDC: spellSaveDC(document, spell, systemId),
    halfOnSave: spell.savingThrow.success === 'half',
    damageEffects: spellDamageEffects(systemId, document.id, spell),
    area: spell.areaOfEffect,
  };
}

/**
 * A caster's known/prepared save-based AoE spells, as scene area actions. Reads
 * the document's spellcasting list and looks each id up in the loaded spell map;
 * unknown ids and non-AoE spells are skipped.
 */
export function casterSpellAreaActions(
  document: CharacterDocument<SystemDataModel>,
  spellsById: ReadonlyMap<string, Spell>,
  systemId: GameSystemId
): SceneAreaAction[] {
  const system = document.system as Record<string, unknown>;
  const sc = system.spellcasting as SpellcastingInfo | undefined;
  if (!sc) return [];
  const ids = new Set<string>([
    ...(sc.spellsPrepared ?? []),
    ...(sc.spellsKnown ?? []),
    ...(sc.alwaysPreparedSpellIds ?? []),
  ]);
  const actions: SceneAreaAction[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const spell = spellsById.get(id);
    if (!spell) continue;
    const action = spellAreaAction(spell, document, systemId);
    if (action && !seen.has(action.name)) {
      seen.add(action.name);
      actions.push(action);
    }
  }
  return actions;
}
