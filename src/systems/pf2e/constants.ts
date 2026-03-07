/** Skill → Ability mapping (Pathfinder 2e) */
export const SKILL_ABILITIES: Record<string, string> = {
  acrobatics: 'dex',
  arcana: 'int',
  athletics: 'str',
  crafting: 'int',
  deception: 'cha',
  diplomacy: 'cha',
  intimidation: 'cha',
  lore: 'int',
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
