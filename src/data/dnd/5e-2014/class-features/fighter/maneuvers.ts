/**
 * D&D 5e (2014) - Battle Master Maneuvers
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface BattleMasterManeuver {
  id: string;
  name: string;
  description: string;
  superiorityDie: 'd8' | 'd10' | 'd12';
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  prerequisites?: string[];
  targetType: 'self' | 'creature' | 'area';
  actionType: 'attack' | 'reaction' | 'bonus' | 'special';
  savingThrow?: {
    ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    dc: 'maneuver-save-dc';
  };
  version: string;
}

export const battleMasterManeuvers: BattleMasterManeuver[] = [
  {
    id: 'commanders-strike',
    name: "Commander's Strike",
    description:
      "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'bonus',
    version: '1.0.0',
  },
  {
    id: 'disarming-attack',
    name: 'Disarming Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it's holding. You add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    savingThrow: {
      ability: 'str',
      dc: 'maneuver-save-dc',
    },
    version: '1.0.0',
  },
  {
    id: 'distracting-strike',
    name: 'Distracting Strike',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack's damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    version: '1.0.0',
  },
  {
    id: 'evasive-footwork',
    name: 'Evasive Footwork',
    description:
      'When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'self',
    actionType: 'special',
    version: '1.0.0',
  },
  {
    id: 'feinting-attack',
    name: 'Feinting Attack',
    description:
      "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'bonus',
    version: '1.0.0',
  },
  {
    id: 'goading-attack',
    name: 'Goading Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    savingThrow: {
      ability: 'wis',
      dc: 'maneuver-save-dc',
    },
    version: '1.0.0',
  },
  {
    id: 'lunging-attack',
    name: 'Lunging Attack',
    description:
      "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    version: '1.0.0',
  },
  {
    id: 'maneuvering-attack',
    name: 'Maneuvering Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    version: '1.0.0',
  },
  {
    id: 'menacing-attack',
    name: 'Menacing Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    savingThrow: {
      ability: 'wis',
      dc: 'maneuver-save-dc',
    },
    version: '1.0.0',
  },
  {
    id: 'parry',
    name: 'Parry',
    description:
      'When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + your Dexterity modifier.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'self',
    actionType: 'reaction',
    version: '1.0.0',
  },
  {
    id: 'precision-attack',
    name: 'Precision Attack',
    description:
      'When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    version: '1.0.0',
  },
  {
    id: 'pushing-attack',
    name: 'Pushing Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    savingThrow: {
      ability: 'str',
      dc: 'maneuver-save-dc',
    },
    version: '1.0.0',
  },
  {
    id: 'rally',
    name: 'Rally',
    description:
      'On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you. That creature gains temporary hit points equal to the superiority die roll + your Charisma modifier.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'bonus',
    version: '1.0.0',
  },
  {
    id: 'riposte',
    name: 'Riposte',
    description:
      "When a creature misses you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'reaction',
    version: '1.0.0',
  },
  {
    id: 'sweeping-attack',
    name: 'Sweeping Attack',
    description:
      'When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage is of the same type dealt by the original attack.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'area',
    actionType: 'attack',
    version: '1.0.0',
  },
  {
    id: 'trip-attack',
    name: 'Trip Attack',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'attack',
    savingThrow: {
      ability: 'str',
      dc: 'maneuver-save-dc',
    },
    version: '1.0.0',
  },
  {
    id: 'bait-and-switch',
    name: 'Bait and Switch',
    description:
      "When you're within 5 feet of a creature on your turn, you can expend one superiority die and switch places with that creature, provided you spend at least 5 feet of movement and the creature is willing and isn't incapacitated. This movement doesn't provoke opportunity attacks. Roll the superiority die. Until the start of your next turn, you or the other creature (your choice) gains a bonus to AC equal to the number rolled.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'special',
    version: '1.0.0',
  },
  {
    id: 'brace',
    name: 'Brace',
    description:
      "When a creature you can see moves into the reach you have with the melee weapon you're wielding, you can use your reaction to expend one superiority die and make one attack against the creature using that weapon. If the attack hits, add the superiority die to the weapon's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'reaction',
    version: '1.0.0',
  },
  {
    id: 'grappling-strike',
    name: 'Grappling Strike',
    description:
      'Immediately after you hit a creature with a melee attack on your turn, you can expend one superiority die and then try to grapple the target as a bonus action. Add the superiority die to your Strength (Athletics) check.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'bonus',
    version: '1.0.0',
  },
  {
    id: 'quick-toss',
    name: 'Quick Toss',
    description:
      "As a bonus action, you can expend one superiority die and make a ranged attack with a weapon that has the thrown property. You can draw the weapon as part of making this attack. If you hit, add the superiority die to the weapon's damage roll.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'creature',
    actionType: 'bonus',
    version: '1.0.0',
  },
  {
    id: 'tactical-assessment',
    name: 'Tactical Assessment',
    description:
      'When you make an Intelligence (Investigation), an Intelligence (History), or a Wisdom (Insight) check, you can expend one superiority die and add the superiority die to the ability check.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'self',
    actionType: 'special',
    version: '1.0.0',
  },
  {
    id: 'ambush',
    name: 'Ambush',
    description:
      "When you make a Dexterity (Stealth) check or an initiative roll, you can expend one superiority die and add the die to the roll, provided you aren't incapacitated.",
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'self',
    actionType: 'special',
    version: '1.0.0',
  },
  {
    id: 'commanding-presence',
    name: 'Commanding Presence',
    description:
      'When you make a Charisma (Intimidation), a Charisma (Performance), or a Charisma (Persuasion) check, you can expend one superiority die and add the superiority die to the ability check.',
    superiorityDie: 'd8',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 28 },
    targetType: 'self',
    actionType: 'special',
    version: '1.0.0',
  },
];
