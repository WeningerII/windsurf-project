import { Subclass } from '../../../../../types/character-options/classes';

export const landSubclass: Subclass = {
  id: 'land',
  name: 'Circle of the Land',
  parentClassId: 'druid',
  
  features: [
    {
      level: 2,
      features: [
        {
          id: 'bonus-cantrip-land',
          name: 'Bonus Cantrip',
          source: 'Circle of the Land 2',
          description: 'When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice.',
        },
        {
          id: 'natural-recovery',
          name: 'Natural Recovery',
          source: 'Circle of the Land 2',
          description: 'Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can\'t use this feature again until you finish a long rest.\n\nFor example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'circle-spells',
          name: 'Circle Spells',
          source: 'Circle of the Land 2',
          description: 'Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land—arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark—and consult the associated list of spells.\n\nOnce you gain access to a circle spell, you always have it prepared, and it doesn\'t count against the number of spells you can prepare each day. If you gain access to a spell that doesn\'t appear on the druid spell list, the spell is nonetheless a druid spell for you.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'lands-stride-druid',
          name: 'Land\'s Stride',
          source: 'Circle of the Land 6',
          description: 'Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\n\nIn addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'natures-ward',
          name: 'Nature\'s Ward',
          source: 'Circle of the Land 10',
          description: 'When you reach 10th level, you can\'t be charmed or frightened by elementals or fey, and you are immune to poison and disease.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'natures-sanctuary',
          name: 'Nature\'s Sanctuary',
          source: 'Circle of the Land 14',
          description: 'When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.\n\nThe creature is aware of this effect before it makes its attack against you.',
        },
      ],
    },
  ],
  
  description: 'The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic.',
};
