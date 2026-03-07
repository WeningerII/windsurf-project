import { CharacterClass } from '../../../../types/character-options/classes';

export const rogue: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  system: 'pf2e',
  source: 'Core Rulebook',
  version: '2.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 178,
    url: 'https://2e.aonprd.com/Classes.aspx?ID=10',
  },
  hitDie: 'd8',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'wis'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'rapier', 'sap', 'shortbow', 'shortsword'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 7,
    options: ['stealth', 'acrobatics', 'thievery'],
    label: 'Trained in 7 + Int skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '15', multiplier: 1 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'racket',
          name: "Rogue's Racket",
          source: 'Rogue 1',
          description:
            'Choose a racket: Ruffian, Scoundrel, or Thief. Your racket determines which key ability score you use.',
        },
        {
          id: 'sneak-attack',
          name: 'Sneak Attack',
          source: 'Rogue 1',
          description:
            'When your enemy is flat-footed, deal extra precision damage equal to 1d6 (increasing at higher levels).',
        },
        {
          id: 'surprise-attack',
          name: 'Surprise Attack',
          source: 'Rogue 1',
          description:
            "On the first round of combat, creatures that haven't acted yet are flat-footed to you.",
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'deny-advantage',
          name: 'Deny Advantage',
          source: 'Rogue 3',
          description: "You aren't flat-footed to flanking creatures of your level or lower.",
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'weapon-tricks',
          name: 'Weapon Tricks',
          source: 'Rogue 5',
          description: 'You become expert with rogue class weapons and simple weapons.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Rogue 7',
          description:
            'Your proficiency rank for Reflex saves increases to master. When you roll a success, you get a critical success instead.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'vigilant-senses',
          name: 'Vigilant Senses',
          source: 'Rogue 9',
          description: 'Your proficiency rank for Perception increases to master.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'rogue-expertise',
          name: 'Rogue Expertise',
          source: 'Rogue 11',
          description: 'Your proficiency rank for your rogue class DC increases to expert.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'improved-evasion',
          name: 'Improved Evasion',
          source: 'Rogue 13',
          description: 'When you roll a failure on a Reflex save, you get a success instead.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'greater-sneak-attack',
          name: 'Greater Sneak Attack',
          source: 'Rogue 15',
          description: 'Your sneak attack damage increases to 3d6.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'slippery-mind',
          name: 'Slippery Mind',
          source: 'Rogue 17',
          description: 'Your proficiency rank for Will saves increases to master.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'master-strike',
          name: 'Master Strike',
          source: 'Rogue 19',
          description:
            'When you Strike a flat-footed creature, the target must succeed at a Fortitude save or be debilitated.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [
    {
      id: 'ruffian',
      name: 'Ruffian',
      parentClassId: 'rogue',
      description: 'You use brute force and intimidation to get what you want.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'ruffian-racket',
              name: 'Ruffian Racket',
              source: 'Ruffian 1',
              description:
                'You can deal sneak attack damage with medium armor and simple weapons. You become trained in Intimidation and medium armor.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'brutal-beating',
              name: 'Brutal Beating',
              source: 'Ruffian 3',
              description:
                'When you critically succeed at an Intimidation check to Demoralize, your target is frightened 2 instead of frightened 1.',
            },
          ],
        },
      ],
    },
    {
      id: 'scoundrel',
      name: 'Scoundrel',
      parentClassId: 'rogue',
      description: 'You use charm and deception to accomplish your goals.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'scoundrel-racket',
              name: 'Scoundrel Racket',
              source: 'Scoundrel 1',
              description:
                'When you successfully Feint, your target is flat-footed against melee attacks you make until the end of your next turn. You become trained in Deception.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'charming-liar',
              name: 'Charming Liar',
              source: 'Scoundrel 3',
              description:
                'When you critically succeed at a Deception check, the target takes a -2 circumstance penalty to Perception checks and saves against your abilities.',
            },
          ],
        },
      ],
    },
    {
      id: 'thief',
      name: 'Thief',
      parentClassId: 'rogue',
      description: 'You steal and disable traps with finesse and skill.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'thief-racket',
              name: 'Thief Racket',
              source: 'Thief 1',
              description:
                "When you use Thievery to Pick a Lock or Disable a Device, you can do so without a thieves' tools. You become trained in Thievery.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'nimble-dodge',
              name: 'Nimble Dodge',
              source: 'Thief 3',
              description:
                'You gain a +2 circumstance bonus to AC against melee attacks from flat-footed creatures.',
            },
          ],
        },
      ],
    },
    {
      id: 'mastermind',
      name: 'Mastermind',
      parentClassId: 'rogue',
      description: 'You use knowledge and strategy to outwit your foes.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'mastermind-racket',
              name: 'Mastermind Racket',
              source: 'Mastermind 1',
              description:
                'When you successfully Recall Knowledge about a creature, that creature is flat-footed against your attacks until the start of your next turn. You become trained in Deception and one Intelligence or Charisma skill.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'tactical-analysis',
              name: 'Tactical Analysis',
              source: 'Mastermind 3',
              description:
                "You can share your tactical insights with allies, granting them bonuses against creatures you've identified.",
            },
          ],
        },
      ],
    },
    {
      id: 'acrobat',
      name: 'Acrobat',
      parentClassId: 'rogue',
      description:
        'You are a master of movement and balance, using acrobatics to evade and strike.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'acrobat-racket',
              name: 'Acrobat Racket',
              source: 'Acrobat 1',
              description:
                "You become trained in Acrobatics. When you use Acrobatics to Tumble Through an enemy's space, you gain a +1 status bonus to AC until the start of your next turn.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'wall-run',
              name: 'Wall Run',
              source: 'Acrobat 3',
              description: 'You can run along walls and ceilings as if they were normal ground.',
            },
          ],
        },
      ],
    },
    {
      id: 'braggart',
      name: 'Braggart',
      parentClassId: 'rogue',
      description: 'You use showmanship and confidence to distract and manipulate your enemies.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'braggart-racket',
              name: 'Braggart Racket',
              source: 'Braggart 1',
              description:
                "You become trained in Performance. When you Strike a creature you've Demoralized, you gain a +1 status bonus to damage rolls.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'intimidating-strike',
              name: 'Intimidating Strike',
              source: 'Braggart 3',
              description:
                'When you critically hit with a melee Strike, you can Demoralize the target as a free action.',
            },
          ],
        },
      ],
    },
    {
      id: 'charlatan',
      name: 'Charlatan',
      parentClassId: 'rogue',
      description:
        'You are a master of deception and disguise, fooling others with false identities.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'charlatan-racket',
              name: 'Charlatan Racket',
              source: 'Charlatan 1',
              description:
                'You become trained in Deception and Disguise. When you create a disguise, you gain a +1 status bonus to Deception checks to maintain it.',
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'perfect-disguise',
              name: 'Perfect Disguise',
              source: 'Charlatan 3',
              description:
                'Your disguises are nearly impossible to see through. You gain a +2 status bonus to Deception checks when maintaining a disguise.',
            },
          ],
        },
      ],
    },
    {
      id: 'shadowdancer',
      name: 'Shadowdancer',
      parentClassId: 'rogue',
      description: 'You move through shadows and darkness, striking from the darkness.',
      features: [
        {
          level: 1,
          features: [
            {
              id: 'shadowdancer-racket',
              name: 'Shadowdancer Racket',
              source: 'Shadowdancer 1',
              description:
                "You can use Stealth to Hide in dim light and darkness, even without cover. When you Strike a creature you're hidden from, you gain a +1 status bonus to damage rolls.",
            },
          ],
        },
        {
          level: 3,
          features: [
            {
              id: 'shadow-stride',
              name: 'Shadow Stride',
              source: 'Shadowdancer 3',
              description:
                'You can move through shadows as if they were normal terrain, gaining concealment while doing so.',
            },
          ],
        },
      ],
    },
  ],
  classResources: [],
  multiclassRequirements: [{ type: 'attribute', value: 14, description: 'Dexterity 14' }],
  multiclassProficiencies: { armor: ['light'], weapons: ['simple'], tools: [] },
  description:
    'You are skilled and opportunistic. Using powerful finishing moves, you strike hard and exploit every opening.',
  displayMetadata: {
    icon: 'dagger',
    color: '#2F4F4F',
    shortDescription: 'A cunning combatant who exploits weaknesses.',
    playStyle: 'Stealthy striker with skill mastery',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Stealth players', 'Skill-focused characters'],
    tags: ['martial', 'stealth', 'skill-monkey'],
  },
};
