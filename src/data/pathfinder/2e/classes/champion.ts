import { CharacterClass } from '../../../../types/character-options/classes';

export const champion: CharacterClass = {
  id: 'champion',
  name: 'Champion',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 104,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=4',
  },
  hitDie: 'd10',
  primaryAbility: ['str', 'dex'],
  savingThrowProficiencies: ['str', 'cha'],
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['religion'],
    label: 'Trained in Religion and 2 + Int skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'cause',
          name: 'Cause',
          source: 'Champion 1',
          description:
            "Select a cause: Paladin (LG), Redeemer (NG), or Liberator (CG). Your cause determines your champion's reaction.",
        },
        {
          id: 'deity-and-cause',
          name: 'Deity and Cause',
          source: 'Champion 1',
          description: 'Champions are divine servants of a deity. Select your deity.',
        },
        {
          id: 'champions-reaction',
          name: "Champion's Reaction",
          source: 'Champion 1',
          description:
            'Your cause grants you a special reaction to protect allies or harm enemies.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'divine-ally',
          name: 'Divine Ally',
          source: 'Champion 3',
          description:
            'Your deity grants you a divine ally: Blade Ally, Shield Ally, or Steed Ally.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'weapon-expertise',
          name: 'Weapon Expertise',
          source: 'Champion 5',
          description: 'Your proficiency ranks for simple and martial weapons increase to expert.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'armor-expertise',
          name: 'Armor Expertise',
          source: 'Champion 7',
          description:
            'Your proficiency ranks for all armor and unarmored defense increase to expert.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'champions-aura',
          name: "Champion's Aura",
          source: 'Champion 9',
          description: 'Your divine ally grants an aura that benefits nearby allies.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'divine-will',
          name: 'Divine Will',
          source: 'Champion 11',
          description: 'Your proficiency rank for Will saves increases to master.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'armor-mastery',
          name: 'Armor Mastery',
          source: 'Champion 13',
          description: 'Your proficiency ranks for all armor increase to master.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'greater-weapon-specialization',
          name: 'Greater Weapon Specialization',
          source: 'Champion 15',
          description: 'Your weapon damage bonus increases further.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'heros-defiance',
          name: "Hero's Defiance",
          source: 'Champion 19',
          description: 'You can use your reaction to prevent death.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'paladin',
      name: 'The Paladin (Lawful Good)',
      parentClassId: 'champion',
      description:
        'You are a stalwart protector of good, fighting against evil with unwavering conviction.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'paladins-code',
              name: "Paladin's Code",
              source: 'Paladin 1',
              description:
                'You must act with honor, respect lawful authority, and protect the innocent.',
            },
            {
              id: 'retributive-strike',
              name: 'Retributive Strike',
              source: 'Paladin 1',
              description:
                'Your Retributive Strike deals persistent good damage equal to your Charisma modifier to the attacker.',
            },
            {
              id: 'lay-on-hands',
              name: 'Lay on Hands',
              source: 'Paladin 1',
              description:
                'You gain the lay on hands devotion spell. It restores 6 Hit Points and can counteract the frightened condition.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'divine-smite',
              name: 'Divine Smite',
              source: 'Paladin 9',
              description: 'Your Retributive Strike gains bonus damage against fiends and undead.',
            },
          ],
        },
      ],
    },
    {
      id: 'redeemer',
      name: 'The Redeemer (Neutral Good)',
      parentClassId: 'champion',
      description:
        'You believe all beings can be redeemed, and you fight to protect and redeem the wayward.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'redeemers-code',
              name: "Redeemer's Code",
              source: 'Redeemer 1',
              description:
                'You must show compassion, offer redemption before violence, and protect those who repent.',
            },
            {
              id: 'glimpse-of-redemption',
              name: 'Glimpse of Redemption',
              source: 'Redeemer 1',
              description:
                'Your reaction can make an attacker enfeebled 2 until the end of its next turn, and you reduce damage to an ally.',
            },
            {
              id: 'lay-on-hands',
              name: 'Lay on Hands',
              source: 'Redeemer 1',
              description: 'You gain the lay on hands devotion spell. It restores 6 Hit Points.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'merciful-smite',
              name: 'Merciful Smite',
              source: 'Redeemer 9',
              description:
                'When using Glimpse of Redemption, you can choose to make your Strike nonlethal with no penalty.',
            },
          ],
        },
      ],
    },
    {
      id: 'liberator',
      name: 'The Liberator (Chaotic Good)',
      parentClassId: 'champion',
      description:
        'You fight for freedom, breaking chains and opposing tyranny wherever you find it.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'liberators-code',
              name: "Liberator's Code",
              source: 'Liberator 1',
              description:
                "You must respect others' freedom, fight oppression, and never force others against their will.",
            },
            {
              id: 'liberating-step',
              name: 'Liberating Step',
              source: 'Liberator 1',
              description:
                'Your reaction grants an ally a Step action, allowing them to escape before taking damage.',
            },
            {
              id: 'lay-on-hands',
              name: 'Lay on Hands',
              source: 'Liberator 1',
              description:
                'You gain the lay on hands devotion spell. It restores 6 Hit Points and can counteract the grabbed and restrained conditions.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'freedom-smite',
              name: 'Freedom Smite',
              source: 'Liberator 9',
              description: 'When using Liberating Step, your ally can Stride instead of Step.',
            },
          ],
        },
      ],
    },
    {
      id: 'antipaladin',
      name: 'The Antipaladin (Lawful Evil)',
      parentClassId: 'champion',
      description: 'You serve tyranny and evil, enforcing dark laws with an iron fist.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'antipaladins-code',
              name: "Antipaladin's Code",
              source: 'Antipaladin 1',
              description: 'You must enforce tyranny, punish mercy, and spread suffering.',
            },
            {
              id: 'selfish-shield',
              name: 'Selfish Shield',
              source: 'Antipaladin 1',
              description:
                'Your reaction grants yourself a +2 circumstance bonus to AC against an attack, but nearby allies lose this benefit.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'evil-smite',
              name: 'Evil Smite',
              source: 'Antipaladin 9',
              description: 'Your Retributive Strike gains bonus damage against good creatures.',
            },
          ],
        },
      ],
    },
    {
      id: 'blade-ally',
      name: 'Blade Ally',
      parentClassId: 'champion',
      description: 'Your divine ally is a powerful weapon that grows with you.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'blade-ally',
              name: 'Blade Ally',
              source: 'Blade Ally 1',
              description:
                'You gain a magical weapon as your divine ally. It grows stronger as you level up.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'blade-mastery',
              name: 'Blade Mastery',
              source: 'Blade Ally 7',
              description: 'Your blade ally becomes a +1 weapon.',
            },
          ],
        },
      ],
    },
    {
      id: 'shield-ally',
      name: 'Shield Ally',
      parentClassId: 'champion',
      description: 'Your divine ally is a protective shield that guards you and your allies.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'shield-ally',
              name: 'Shield Ally',
              source: 'Shield Ally 1',
              description:
                'You gain a magical shield as your divine ally. It grants you and nearby allies protection.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'shield-mastery',
              name: 'Shield Mastery',
              source: 'Shield Ally 7',
              description: 'Your shield ally becomes a +1 shield.',
            },
          ],
        },
      ],
    },
    {
      id: 'steed-ally',
      name: 'Steed Ally',
      parentClassId: 'champion',
      description: 'Your divine ally is a loyal mount that carries you into battle.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'steed-ally',
              name: 'Steed Ally',
              source: 'Steed Ally 1',
              description:
                'You gain a magical steed as your divine ally. It can carry you and fight alongside you.',
            },
          ],
        },
        {
          level: 7,
          features: [
            {
              id: 'steed-mastery',
              name: 'Steed Mastery',
              source: 'Steed Ally 7',
              description: 'Your steed becomes more powerful and gains additional abilities.',
            },
          ],
        },
      ],
    },
    {
      id: 'tyrant',
      name: 'The Tyrant (Neutral Evil)',
      parentClassId: 'champion',
      description: 'You rule through fear and domination, crushing all who oppose you.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'tyrants-code',
              name: "Tyrant's Code",
              source: 'Tyrant 1',
              description:
                'You must dominate others, take what you want, and show no mercy to the weak.',
            },
            {
              id: 'selfish-shield',
              name: 'Selfish Shield',
              source: 'Tyrant 1',
              description:
                'Your reaction grants yourself a +2 circumstance bonus to AC, but nearby allies lose this benefit.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'dominating-strike',
              name: 'Dominating Strike',
              source: 'Tyrant 9',
              description:
                'When you hit with a melee Strike, you can attempt to Demoralize the target.',
            },
          ],
        },
      ],
    },
    {
      id: 'rogue',
      name: 'The Rogue (Chaotic Evil)',
      parentClassId: 'champion',
      description: 'You pursue your own desires above all else, caring nothing for others.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'rogues-code',
              name: "Rogue's Code",
              source: 'Rogue 1',
              description:
                'You must pursue your own desires, betray others for personal gain, and never show loyalty.',
            },
            {
              id: 'selfish-shield',
              name: 'Selfish Shield',
              source: 'Rogue 1',
              description:
                'Your reaction grants yourself a +2 circumstance bonus to AC, but nearby allies lose this benefit.',
            },
          ],
        },
        {
          level: 9,
          features: [
            {
              id: 'treacherous-strike',
              name: 'Treacherous Strike',
              source: 'Rogue 9',
              description:
                'When you hit an ally with a melee Strike, you gain a +1 status bonus to damage rolls.',
            },
          ],
        },
      ],
    },
  ],
  spellcasting: {
    ability: 'cha',
    spellListId: 'divine-pf2e',
    spellSlots: {
      1: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      2: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'half',
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
  multiclassRequirements: [
    { type: 'attribute', value: 14, description: 'Strength 14 and Charisma 14' },
  ],
  multiclassProficiencies: {
    armor: ['light', 'medium'],
    weapons: ['simple', 'martial'],
    tools: [],
  },
  description:
    'You are an emissary of a deity, a devoted servant who uses divine power to protect the weak.',
  displayMetadata: {
    icon: 'shield',
    color: '#FFD700',
    shortDescription: "A divine warrior who protects allies with champion's reactions.",
    playStyle: 'Defensive melee combatant with divine magic',
    complexity: 'moderate',
    role: 'defender',
    idealFor: ['Defenders', 'Heroic characters'],
    tags: ['divine', 'martial', 'tank', 'support'],
    casterType: 'half',
  },
};
