import { Subclass } from '../../../../../types/character-options/classes';

export const hunterSubclass: Subclass = {
  id: 'hunter',
  name: 'Hunter',
  parentClassId: 'ranger',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'hunters-prey',
          name: "Hunter's Prey",
          source: 'Hunter 3',
          description:
            "You gain one of the following features of your choice:\n\n• Colossus Slayer: Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it's below its Hit Point maximum. You can deal this extra damage only once per turn.\n\n• Horde Breaker: Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.",
        },
        {
          id: 'hunter-lore',
          name: "Hunter's Lore",
          source: 'Hunter 3',
          description:
            "You can call on your mystical bond with nature to mark a creature as your quarry. You always have the Hunter's Mark spell prepared, and it doesn't count against the number of spells you can prepare. Additionally, you know the damage immunities, resistances, and vulnerabilities of any creature marked by your Hunter's Mark spell.",
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'defensive-tactics',
          name: 'Defensive Tactics',
          source: 'Hunter 7',
          description:
            'You gain one of the following features of your choice:\n\n• Escape the Horde: Opportunity Attacks against you are made with Disadvantage.\n\n• Multiattack Defense: When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'superior-hunters-prey',
          name: "Superior Hunter's Prey",
          source: 'Hunter 11',
          description:
            "You gain one of the following features of your choice:\n\n• Volley: You can use your Action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon's range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target.\n\n• Whirlwind Attack: You can use your Action to make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target.",
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'superior-hunters-defense',
          name: "Superior Hunter's Defense",
          source: 'Hunter 15',
          description:
            "You gain one of the following features of your choice:\n\n• Evasion: When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.\n\n• Uncanny Dodge: When an attacker that you can see hits you with an attack roll, you can use your Reaction to halve the attack's damage against you.",
        },
      ],
    },
  ],

  description:
    "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness. As you walk the Hunter's path, you learn specialized techniques for fighting the threats you face.",
};
