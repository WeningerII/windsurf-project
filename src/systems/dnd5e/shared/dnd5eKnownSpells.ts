/**
 * D&D 5e known-spell-count enforcement (SRD 5.1/5.2: Spellcasting — Spells
 * Known of 1st Level and Higher). A *known* caster (Bard, Sorcerer, Ranger,
 * Warlock) may only carry the number of spells its class table lists at the
 * character's level; *prepared* casters (Cleric, Druid, Wizard, Paladin) have
 * no fixed known cap and are exempt. These are pure helpers so the validation
 * surface and any future sheet display share one cited formula.
 */

interface KnownSpellProgression {
  /** Class-table spells-known count per class level (index 0 = level 1). */
  spellsKnown?: readonly number[];
  /** Class-table cantrips-known count per class level (index 0 = level 1). */
  cantripsKnown?: readonly number[];
}

/** Clamp a 1-indexed class level to a valid 0-based index into a progression. */
function progressionIndex(classLevel: number, length: number): number {
  return Math.min(Math.max(1, classLevel), length) - 1;
}

/**
 * The number of spells a known caster may carry at `classLevel`: the class
 * table's spells-known value plus its cantrips-known value (cantrips are folded
 * in so a stored known-list that lumps cantrips together is not falsely flagged).
 * Returns null for a prepared caster (no `spellsKnown` progression), signalling
 * "no fixed known cap — do not enforce".
 */
export function dnd5eKnownSpellLimit(
  progression: KnownSpellProgression | undefined,
  classLevel: number
): number | null {
  const known = progression?.spellsKnown;
  if (!known || known.length === 0) return null;
  const leveled = known[progressionIndex(classLevel, known.length)] ?? 0;
  const cantrips = progression?.cantripsKnown;
  const cantripsKnown = cantrips?.[progressionIndex(classLevel, cantrips.length)] ?? 0;
  return leveled + cantripsKnown;
}

/**
 * How many spells the known list carries beyond the cap (0 when within it). The
 * enforcement is warn-not-block, so callers surface this as a recoverable
 * warning rather than rejecting the build.
 */
export function dnd5eKnownSpellOverage(knownCount: number, limit: number): number {
  return Math.max(0, knownCount - limit);
}
