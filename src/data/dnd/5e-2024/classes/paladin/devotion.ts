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
            "You gain oath spells at the Paladin levels listed in the Oath of Devotion Spells table. Once you gain an oath spell, you always have it prepared, and it doesn't count against the number of spells you can prepare. If you gain an oath spell that doesn't appear on the Paladin spell list, the spell is nonetheless a Paladin spell for you.",
        },
        {
          id: 'sacred-weapon',
          name: 'Sacred Weapon',
          source: 'Oath of Devotion 3',
          description:
            'As a Bonus Action, you can expend a use of Channel Divinity to imbue one Melee weapon that you are holding with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1), and each hit deals Radiant damage. The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. You can end this effect on your turn (no action required). If you are no longer holding or carrying this weapon, or if you have the Unconscious condition, this effect ends.',
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
            "You and friendly creatures within 10 feet of you can't have the Charmed condition while you are conscious. At 18th level, the range of this aura increases to 30 feet.",
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'smite-of-protection',
          name: 'Smite of Protection',
          source: 'Oath of Devotion 15',
          description:
            'Your Divine Smite now radiates protective energy. Whenever you use Divine Smite, you and your allies within 10 feet of you gain Temporary Hit Points equal to your Charisma modifier plus the level of the spell slot you expended.',
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
            "As a Bonus Action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes Radiant damage equal to your Charisma modifier plus your Proficiency Bonus. In addition, for the duration, you have Advantage on saving throws against spells cast by Fiends or Undead. Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a 5th-level spell slot (no action required).",
        },
      ],
    },
  ],

  spellListExpansion: [
    'protection-from-evil-and-good',
    'sanctuary',
    'aid',
    'zone-of-truth',
    'beacon-of-hope',
    'dispel-magic',
    'freedom-of-movement',
    'guardian-of-faith',
    'commune',
    'flame-strike',
  ],
  alwaysPreparedSpellSourceLabel: 'Oath Spells',
  alwaysPreparedSpellsByLevel: {
    3: ['protection-from-evil-and-good', 'sanctuary'],
    5: ['aid', 'zone-of-truth'],
    9: ['beacon-of-hope', 'dispel-magic'],
    13: ['freedom-of-movement', 'guardian-of-faith'],
    17: ['commune', 'flame-strike'],
  },

  description:
    'The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order. Sometimes called cavaliers, white knights, or holy warriors, these paladins meet the ideal of the knight in shining armor, acting with honor in pursuit of justice and the greater good.',
};
