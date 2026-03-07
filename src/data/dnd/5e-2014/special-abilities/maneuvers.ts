import { Feature } from '../../../../types/core/character';

// Battle Master Maneuvers (D&D 5e-2014)
// Maneuvers are special combat techniques available to Battle Master fighters

export const maneuvers: Feature[] = [
  {
    id: 'maneuver-riposte',
    name: 'Riposte',
    source: 'Battle Master',
    description:
      'When a creature misses you with a melee attack, you can use your reaction and expend one superiority die to move up to your speed as a reaction right after the attack, and you can make one melee weapon attack against the attacker. If you hit, you add the superiority die to the damage of the attack.',
  },
  {
    id: 'maneuver-parry',
    name: 'Parry',
    source: 'Battle Master',
    description:
      'If another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on that die + your Dexterity modifier.',
  },
  {
    id: 'maneuver-disengage',
    name: 'Disarming Attack',
    source: 'Battle Master',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm your opponent. You add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, it drops the weapon of your choice that it's holding.",
  },
  {
    id: 'maneuver-feint',
    name: 'Feint in Combat',
    source: 'Battle Master',
    description:
      "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature you can see within 5 feet of you as your target. You have advantage on your next attack roll against that creature before the end of your turn. If that attack hits, add the superiority die to the attack's damage roll.",
  },
  {
    id: 'maneuver-trip',
    name: 'Trip Attack',
    source: 'Battle Master',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone.",
  },
  {
    id: 'maneuver-dodge',
    name: 'Dodge',
    source: 'Battle Master',
    description:
      'When an attacker that you can see hits you with an attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on that die + your Dexterity modifier.',
  },
  {
    id: 'maneuver-push',
    name: 'Pushing Attack',
    source: 'Battle Master',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.",
  },
  {
    id: 'maneuver-rally',
    name: 'Rally',
    source: 'Battle Master',
    description:
      'On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one creature other than yourself within 60 feet of you who can see or hear you. That creature gains temporary hit points equal to the superiority die result + your Charisma modifier (minimum of 1 temporary hit point).',
  },
  {
    id: 'maneuver-menace',
    name: 'Menacing Attack',
    source: 'Battle Master',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, it has disadvantage on attack rolls against targets other than you until the end of your next turn.",
  },
  {
    id: 'maneuver-evasion',
    name: 'Evasive Footwork',
    source: 'Battle Master',
    description:
      'When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving.',
  },
  {
    id: 'maneuver-precision',
    name: 'Precision Attack',
    source: 'Battle Master',
    description:
      'When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.',
  },
  {
    id: 'maneuver-commanding-strike',
    name: 'Commanding Strike',
    source: 'Battle Master',
    description:
      "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack's damage roll.",
  },
  {
    id: 'maneuver-ambush',
    name: 'Ambush',
    source: 'Battle Master (XGtE)',
    description:
      'When you make a Dexterity (Stealth) check or an initiative roll, you can expend one superiority die and add the number rolled to the total. You can use this maneuver before or after you roll, but before any effects of the roll are applied.',
  },
  {
    id: 'maneuver-brace',
    name: 'Brace',
    source: 'Battle Master (XGtE)',
    description:
      "When a creature you can see moves into the reach you have with a melee weapon, you can use your reaction and expend one superiority die to increase your AC by the number rolled, as long as you aren't incapacitated.",
  },
  {
    id: 'maneuver-grappling-strike',
    name: 'Grappling Strike',
    source: 'Battle Master (XGtE)',
    description:
      'Immediately after you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to grapple the target. You add the superiority die to the grapple check.',
  },
  {
    id: 'maneuver-lunging-attack',
    name: 'Lunging Attack',
    source: 'Battle Master (XGtE)',
    description:
      "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack's damage roll.",
  },
  {
    id: 'maneuver-maneuvering-attack',
    name: 'Maneuvering Attack',
    source: 'Battle Master (XGtE)',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.",
  },
  {
    id: 'maneuver-tactical-assessment',
    name: 'Tactical Assessment',
    source: 'Battle Master (XGtE)',
    description:
      'When you make an Intelligence (Insight), an Intelligence (Investigation), or a Wisdom (Insight) check, you can expend one superiority die and add the number rolled to the total. You can use this maneuver before or after you roll, but before any effects of the roll are applied.',
  },
  {
    id: 'maneuver-goading-attack',
    name: 'Goading Attack',
    source: 'Battle Master',
    description:
      "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
  },
  {
    id: 'maneuver-sweeping-attack',
    name: 'Sweeping Attack',
    source: 'Battle Master',
    description:
      'When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit it, the other creature takes damage equal to the number you roll on your superiority die.',
  },
  {
    id: 'maneuver-control-beast',
    name: 'Control Beast',
    source: 'Battle Master',
    description:
      "When you hit a beast with a weapon attack, you can expend one superiority die to attempt to control the beast on its next turn. You add the superiority die to the attack's damage roll. The beast must succeed on a Wisdom saving throw or have disadvantage on attack rolls against targets other than you until the end of your next turn.",
  },
];

export const battleMasterManeuvers = maneuvers;
