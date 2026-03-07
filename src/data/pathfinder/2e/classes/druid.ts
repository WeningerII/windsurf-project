import { CharacterClass } from '../../../../types/character-options/classes';

export const druid: CharacterClass = {
  id: 'druid',
  name: 'Druid',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 128,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=6',
  },
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'con'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['nature'],
    label: 'Trained in Nature and 2 + Int skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'druidic-language',
          name: 'Druidic Language',
          source: 'Druid 1',
          description: 'You know Druidic, a secret language known to druids.',
        },
        {
          id: 'druidic-order',
          name: 'Druidic Order',
          source: 'Druid 1',
          description:
            'Choose an order: Animal, Leaf, Storm, or Wild. Your order determines your focus spell.',
        },
        {
          id: 'wild-empathy',
          name: 'Wild Empathy',
          source: 'Druid 1',
          description: 'You can use Diplomacy to Make an Impression on animals.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'alertness',
          name: 'Alertness',
          source: 'Druid 3',
          description: 'Your proficiency rank for Perception increases to expert.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'lightning-reflexes',
          name: 'Lightning Reflexes',
          source: 'Druid 5',
          description: 'Your proficiency rank for Reflex saves increases to expert.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'expert-spellcaster',
          name: 'Expert Spellcaster',
          source: 'Druid 7',
          description:
            'Your proficiency ranks for primal spell attacks and DCs increase to expert.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'druid-weapon-expertise',
          name: 'Druid Weapon Expertise',
          source: 'Druid 11',
          description: 'Your proficiency rank for simple weapons increases to expert.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'medium-armor-expertise',
          name: 'Medium Armor Expertise',
          source: 'Druid 13',
          description: 'Your proficiency ranks for light and medium armor increase to expert.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'master-spellcaster',
          name: 'Master Spellcaster',
          source: 'Druid 15',
          description:
            'Your proficiency ranks for primal spell attacks and DCs increase to master.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'legendary-spellcaster',
          name: 'Legendary Spellcaster',
          source: 'Druid 19',
          description:
            'Your proficiency ranks for primal spell attacks and DCs increase to legendary.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'animal',
      name: 'Animal Order',
      parentClassId: 'druid',
      description:
        'You have a strong connection to beasts, and you are allied with a beast companion.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'animal-companion',
              name: 'Animal Companion',
              source: 'Animal Order 1',
              description:
                'You gain an animal companion. Your animal companion has the minion trait and shares your multiple attack penalty.',
            },
            {
              id: 'heal-animal',
              name: 'Heal Animal',
              source: 'Animal Order 1',
              description:
                "You gain the heal animal order spell. Increasing the spell's level increases the hit points restored.",
            },
          ],
        },
        {
          level: 4,
          features: [
            {
              id: 'mature-animal-companion',
              name: 'Mature Animal Companion',
              source: 'Animal Order 4',
              description:
                'Your animal companion grows stronger. It becomes a nimble or savage animal companion.',
            },
          ],
        },
        {
          level: 6,
          features: [
            {
              id: 'order-explorer-animal',
              name: 'Order Explorer',
              source: 'Animal Order 6',
              description: 'You can learn focus spells from other druidic orders.',
            },
          ],
        },
      ],
    },
    {
      id: 'leaf',
      name: 'Leaf Order',
      parentClassId: 'druid',
      description:
        'You revere plants and the bounty of nature, acting as both a gardener and a warden for the wilderness.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'leshy-familiar',
              name: 'Leshy Familiar',
              source: 'Leaf Order 1',
              description:
                'You gain a leshy familiar. Your leshy familiar can serve as a conduit for your spells.',
            },
            {
              id: 'goodberry',
              name: 'Goodberry',
              source: 'Leaf Order 1',
              description:
                'You gain the goodberry order spell. These berries can grant temporary hit points and satisfy hunger.',
            },
          ],
        },
        {
          level: 4,
          features: [
            {
              id: 'verdant-metamorphosis',
              name: 'Verdant Metamorphosis',
              source: 'Leaf Order 4',
              description:
                'Your leshy familiar can transform into a tree. While in tree form, your familiar is essentially undetectable.',
            },
          ],
        },
      ],
    },
    {
      id: 'storm',
      name: 'Storm Order',
      parentClassId: 'druid',
      description:
        'You carry the fury of the storm within you, channeling it to terrifying effect.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'storm-born',
              name: 'Storm Born',
              source: 'Storm Order 1',
              description:
                'You are at home in wild weather. You gain a +2 circumstance bonus to saves against air and electricity effects.',
            },
            {
              id: 'tempest-surge',
              name: 'Tempest Surge',
              source: 'Storm Order 1',
              description:
                'You gain the tempest surge order spell. You surround a foe in a swirling storm of violent winds.',
            },
          ],
        },
        {
          level: 4,
          features: [
            {
              id: 'stormwalker',
              name: 'Stormwalker',
              source: 'Storm Order 4',
              description:
                "You can walk through storms with ease. Wind doesn't affect your movement, and you ignore difficult terrain from storms.",
            },
          ],
        },
      ],
    },
    {
      id: 'wild',
      name: 'Wild Order',
      parentClassId: 'druid',
      description: 'The savage, untamed instincts of wild beasts course through your body.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'wild-shape',
              name: 'Wild Shape',
              source: 'Wild Order 1',
              description:
                'You gain the wild shape order spell. You can transform into a battle form using Wild Shape.',
            },
            {
              id: 'wild-claws',
              name: 'Wild Claws',
              source: 'Wild Order 1',
              description:
                'Your nails sharpen into claws. You gain a claw unarmed attack dealing 1d6 slashing damage.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'wild-empathy',
              name: 'Wild Empathy',
              source: 'Wild Order 3',
              description:
                'You can use wild empathy to make a Diplomacy check to Make an Impression on an animal or to make a request of it.',
            },
          ],
        },
        {
          level: 5,
          features: [
            {
              id: 'primal-summoning',
              name: 'Primal Summoning',
              source: 'Wild Order 5',
              description:
                'Your summoned creatures are fiercer. Creatures you summon gain a +1 status bonus to attack and damage rolls.',
            },
          ],
        },
      ],
    },
  ],
  spellcasting: {
    ability: 'wis',
    spellListId: 'primal-pf2e',
    preparedCasterFormula: 'wis_mod + class_level',
    spellSlots: {
      1: [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      2: [0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3],
    },
    ritualCasting: true,
    multiclassCasterLevel: 'full',
  },
  classResources: [
    {
      id: 'focus-points',
      name: 'Focus Points',
      maxFormula: '1',
      recoveryType: 'short-rest',
      displayOrder: 1,
    },
  ],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Wisdom 14' }],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'The power of nature is impossible to resist. It can bring ruin to the stoutest fortress in minutes, reducing even the mightiest works to rubble.',
  displayMetadata: {
    icon: 'leaf',
    color: '#228B22',
    shortDescription: 'A primal spellcaster connected to nature.',
    playStyle: 'Full primal caster with order focus spells',
    complexity: 'moderate',
    role: 'controller',
    idealFor: ['Nature lovers', 'Versatile casters'],
    tags: ['primal', 'spellcaster', 'shapeshifter'],
    casterType: 'full',
  },
};
