/**
 * Skill → Ability mapping (Pathfinder 2e).
 *
 * Deliberately excludes the generic 'lore' placeholder: lores are per-topic
 * proficiencies stored in `loreProficiencies` and rendered by the dedicated
 * Lore section, so a generic row here would write to the wrong store.
 */
export const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex',
  arcana: 'int',
  athletics: 'str',
  crafting: 'int',
  deception: 'cha',
  diplomacy: 'cha',
  intimidation: 'cha',
  medicine: 'wis',
  nature: 'wis',
  occultism: 'int',
  performance: 'cha',
  religion: 'wis',
  society: 'int',
  stealth: 'dex',
  survival: 'wis',
  thievery: 'dex',
};

/** Save → Ability mapping (Pathfinder 2e) */
export const SAVE_ABILITIES: Record<string, string> = {
  fortitude: 'con',
  reflex: 'dex',
  will: 'wis',
};
