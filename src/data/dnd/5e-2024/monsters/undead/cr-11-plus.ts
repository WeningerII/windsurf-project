import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Undead - CR 11+ (SRD 5.2)
// Vampire and lich - legendary undead

export const vampire: Monster = {
  id: 'vampire-2024',
  name: 'Vampire',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 16,
  hitPoints: { count: 16, die: 'd8', modifier: 64, notation: '16d8+64' },
  speed: { walk: 30, fly: 30 },
  abilities: { str: 18, dex: 18, con: 18, int: 17, wis: 15, cha: 18 },
  savingThrows: { dex: 7, wis: 6, cha: 8 },
  skills: { Perception: 6, Stealth: 10 },
  damageResistances: ['necrotic', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['truesight 120 ft.', 'passive Perception 16'],
  languages: ['Common'],
  challengeRating: 13,
  experiencePoints: 10000,
  specialAbilities: [
    {
      name: 'Legendary Resistance',
      description:
        'If the vampire fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
    {
      name: 'Misty Form',
      description:
        "The vampire can use its action to polymorph into a cloud of mist or back into its true form. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can enter a hostile creature's space and stop there, and can move through open doors and windows.",
    },
    {
      name: 'Regeneration',
      description:
        "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The vampire makes two attacks, only one of which can be a bite attack. It can use Parry in place of one attack.',
    },
    {
      name: 'Unarmed Strike',
      description:
        'Melee Weapon Attack: +8 to hit, reach 5 ft., one creature. Hit: 8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 16).',
      attackBonus: 8,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd8', modifier: 4, notation: '1d8+4' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +8 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 8 (1d8 + 4) piercing damage plus 14 (4d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.",
      attackBonus: 8,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd8', modifier: 4, notation: '1d8+4' }, type: 'piercing' },
        { dice: { count: 4, die: 'd6', notation: '4d6' }, type: 'necrotic' },
      ],
    },
  ],
  legendaryActions: [
    {
      name: 'Move',
      cost: 1,
      description: 'The vampire moves up to its speed without provoking opportunity attacks.',
    },
    {
      name: 'Unarmed Strike',
      cost: 1,
      description: 'The vampire makes one unarmed strike.',
    },
    {
      name: 'Bite Attack',
      cost: 2,
      description: 'The vampire makes one bite attack.',
    },
  ],
  environment: ['urban', 'castle'],
};

export const lich: Monster = {
  id: 'lich-2024',
  name: 'Lich',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 17,
  hitPoints: { count: 18, die: 'd8', modifier: 72, notation: '18d8+72' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
  savingThrows: { int: 9, wis: 5, cha: 8 },
  skills: { Arcana: 12, History: 12, Insight: 5, Perception: 5 },
  damageImmunities: ['cold', 'lightning', 'necrotic'],
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  senses: ['truesight 120 ft.', 'passive Perception 15'],
  languages: ['Common'],
  challengeRating: 21,
  experiencePoints: 33000,
  specialAbilities: [
    {
      name: 'Legendary Resistance',
      description:
        'If the lich fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
    {
      name: 'Rejuvenation',
      description:
        'If the lich is destroyed, it returns to life in 1d10 days, regaining all its hit points. Only if its phylactery is destroyed can the lich be permanently killed.',
    },
    {
      name: 'Spellcasting',
      description:
        'The lich is a 20th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The lich can cast disguise self and invisibility at will and has the following wizard spells prepared: Cantrips (at will): mage hand, prestidigitation; 1st level (4 slots): detect magic, magic missile, shield, thunderwave; 2nd level (4 slots): detect thoughts, invisibility, scorching ray, shatter; 3rd level (4 slots): animate dead, counterspell, dispel magic, fireball; 4th level (4 slots): blight, dimension door, greater invisibility, ice storm; 5th level (4 slots): cone of cold, scrying, telekinesis; 6th level (2 slots): chain lightning, disintegrate, globe of invulnerability; 7th level (2 slots): delayed blast fireball, teleport; 8th level (1 slot): mind blank; 9th level (1 slot): time stop.',
    },
    {
      name: 'Turn Resistance',
      description: 'The lich has advantage on saving throws against effects that turn undead.',
    },
  ],
  actions: [
    {
      name: 'Paralyzing Touch',
      description:
        'Melee Spell Attack: +9 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage. The target must succeed on a DC 17 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
      attackBonus: 9,
      reach: 5,
      damage: [{ dice: { count: 3, die: 'd6', notation: '3d6' }, type: 'cold' }],
    },
  ],
  legendaryActions: [
    {
      name: 'Cantrip',
      cost: 1,
      description: 'The lich casts a cantrip.',
    },
    {
      name: 'Paralyzing Touch',
      cost: 1,
      description: 'The lich uses Paralyzing Touch.',
    },
    {
      name: 'Frightening Gaze',
      cost: 2,
      description:
        'The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 17 Wisdom saving throw against this magic or become frightened until the end of its next turn.',
    },
    {
      name: 'Disrupt Life',
      cost: 3,
      description:
        'Each non-undead creature within 20 feet of the lich must make a DC 17 Constitution saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much on a successful one.',
    },
  ],
  environment: ['tower', 'dungeon'],
};

export const undeadCR11Plus: Monster[] = [vampire, lich];
