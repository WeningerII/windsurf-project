/**
 * Adapter: player CharacterDocument → a check/skill modifier.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * The non-combat parallel of buildCharacterCombatant: pull a character's actual
 * modifier for a named ability or skill check off its sheet, so the conversation
 * and skill-challenge panels use real numbers — and each party member contributes
 * its OWN bonus — instead of a single GM-typed value.
 *
 * Scope: D&D 5e (2014 + 2024) is derived faithfully here (ability modifier +
 * proficiency from the sheet's skill proficiencies). The other systems store
 * skills differently enough (Pathfinder 2e proficiency tiers, d20-legacy ranks,
 * M&M ranks, Daggerheart traits) that deriving them belongs with each system's
 * own sheet math; until that's wired, this returns `undefined` for them and the
 * caller falls back to a manual modifier — honest, not a fabricated number.
 */

import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { abilityMod } from '../../utils/math';
import { profBonus, SKILL_ABILITIES } from '../../systems/dnd5e/shared/engine';

/** Total character level (sum of class levels, else the flat level), min 1. */
function totalLevel(system: Record<string, unknown>): number {
  const classLevels = system.classLevels as Array<{ level?: number }> | undefined;
  if (Array.isArray(classLevels) && classLevels.length > 0) {
    return Math.max(
      1,
      classLevels.reduce((sum, entry) => sum + (entry.level ?? 0), 0)
    );
  }
  return Math.max(1, typeof system.level === 'number' ? system.level : 1);
}

type SkillProficiencyEntry = { level?: string };

/**
 * The character's modifier for an ability ('cha') or skill ('persuasion') check,
 * or undefined when it can't be derived from the sheet (caller supplies a manual
 * modifier). Currently faithful for D&D 5e (both editions).
 */
export function characterCheckModifier(
  document: CharacterDocument<SystemDataModel>,
  checkId: string,
  systemId: GameSystemId
): number | undefined {
  if (systemId !== 'dnd-5e-2014' && systemId !== 'dnd-5e-2024') return undefined;

  const system = document.system as Record<string, unknown>;
  const abilities = (system.baseAttributes as Record<string, number>) ?? {};
  const id = checkId.toLowerCase();

  // Raw ability check (e.g. 'cha').
  if (id in abilities) return abilityMod(abilities[id]);

  // Skill check: governing ability modifier + proficiency from the sheet.
  if (id in SKILL_ABILITIES) {
    const base = abilityMod(abilities[SKILL_ABILITIES[id]] ?? 10);
    const proficiencies = system.skillProficiencies as
      | Record<string, SkillProficiencyEntry>
      | undefined;
    const level = proficiencies?.[id]?.level;
    const pb = profBonus(totalLevel(system));
    if (level === 'expertise' || level === 'double') return base + pb * 2;
    if (level === 'proficient') return base + pb;
    if (level === 'half') return base + Math.floor(pb / 2);
    return base;
  }

  return undefined;
}
