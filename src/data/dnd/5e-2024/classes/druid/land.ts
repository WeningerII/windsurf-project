import { Subclass } from '../../../../../types/character-options/classes';

export const landSubclass: Subclass = {
  id: 'land',
  name: 'Circle of the Land',
  parentClassId: 'druid',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'land-spells',
          name: 'Circle Spells',
          source: 'Circle of the Land 3',
          description:
            "You have formed a mystical bond with the land. Whenever you finish a Long Rest, choose one type of land: Arid, Polar, Temperate, or Tropical. You gain the spells listed for that land type in the Circle of the Land Spells table. These spells are prepared for you, and they don't count against the number of spells you can prepare.",
        },
        {
          id: 'lands-aid',
          name: "Land's Aid",
          source: 'Circle of the Land 3',
          description:
            'As a Magic action, you can expend a use of Wild Shape to channel the magic of your chosen land. Choose a point within 60 feet of yourself. Vitality-giving flowers and plants appear in a 10-foot-radius sphere centered on that point. Each creature of your choice in that area must make a Constitution saving throw. On a failed save, a creature takes 2d6 Necrotic damage. On a successful save, it takes half as much damage. One creature of your choice in that area regains 2d6 Hit Points. The damage and healing increase by 1d6 when you reach Druid levels 10 (3d6) and 14 (4d6).',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'natural-recovery',
          name: 'Natural Recovery',
          source: 'Circle of the Land 6',
          description:
            'You can cast one of your Circle Spells without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'natures-warding',
          name: "Nature's Warding",
          source: 'Circle of the Land 10',
          description:
            'You are immune to the Poisoned condition, and you have Resistance to Poison damage. Additionally, you are immune to disease.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'natures-sanctuary',
          name: "Nature's Sanctuary",
          source: 'Circle of the Land 14',
          description:
            'Creatures of the Plant and Beast types have Disadvantage on attack rolls against you. In addition, you have Resistance to the damage type associated with your chosen land: Fire (Arid), Cold (Polar), Lightning (Temperate), or Poison (Tropical).',
        },
      ],
    },
  ],

  description:
    'The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These Druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic.',
};
