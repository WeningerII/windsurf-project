import { Subclass } from '../../../../../types/character-options/classes';

export const devotionSubclass: Subclass = {
  id: 'devotion',
  name: 'Oath of Devotion',
  parentClassId: 'paladin',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'oath-spells-devotion',
          name: 'Oath Spells',
          source: 'Oath of Devotion 3',
          description:
            'You gain oath spells at the paladin levels listed.\n\n3rd: protection from evil and good, sanctuary\n5th: lesser restoration, zone of truth\n9th: beacon of hope, dispel magic\n13th: freedom of movement, guardian of faith\n17th: commune, flame strike',
        },
        {
          id: 'channel-divinity-devotion',
          name: 'Channel Divinity',
          source: 'Oath of Devotion 3',
          description:
            "When you take this oath at 3rd level, you gain the following two Channel Divinity options.\n\nSacred Weapon: As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.\n\nYou can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.\n\nTurn the Unholy: As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.\n\nA turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'aura-of-devotion',
          name: 'Aura of Devotion',
          source: 'Oath of Devotion 7',
          description:
            "Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.\n\nAt 18th level, the range of this aura increases to 30 feet.",
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'purity-of-spirit',
          name: 'Purity of Spirit',
          source: 'Oath of Devotion 15',
          description:
            'Beginning at 15th level, you are always under the effects of a protection from evil and good spell.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'holy-nimbus',
          name: 'Holy Nimbus',
          source: 'Oath of Devotion 20',
          description:
            "At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.\n\nWhenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage.\n\nIn addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead.\n\nOnce you use this feature, you can't use it again until you finish a long rest.",
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
  ],

  spellListExpansion: [
    'protection-from-evil-and-good',
    'sanctuary',
    'lesser-restoration',
    'zone-of-truth',
    'beacon-of-hope',
    'dispel-magic',
    'freedom-of-movement',
    'guardian-of-faith',
    'commune',
    'flame-strike',
  ],

  description:
    'The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order. Sometimes called cavaliers, white knights, or holy warriors, these paladins meet the ideal of the knight in shining armor, acting with honor in pursuit of justice and the greater good.',
};
