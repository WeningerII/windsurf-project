// D&D 3.5e General Feats - System Reference Document v3.5
//
// Parsed from the OGL System Reference Document v3.5 (github.com/olimot/srd-v3.5-md),
// which reproduces the SRD verbatim under the Open Game License v1.0a.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const generalFeats: FeatDefinition[] = [
  {
    id: 'armor-proficiency-heavy-35e',
    name: 'Armor Proficiency (Heavy)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Armor Proficiency (light), Armor Proficiency (medium).' },
    ],
    description: 'See Armor Proficiency (light).',
    benefits: ['See Armor Proficiency (light).'],
    special:
      'Fighters, paladins, and clerics automatically have Armor Proficiency (heavy) as a bonus feat. They need not select it. (Normal: See Armor Proficiency (light).)',
  },
  {
    id: 'armor-proficiency-light-35e',
    name: 'Armor Proficiency (Light)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Balance, Climb, Escape Artist, Hide, Jump, Move Silently, Sleight of Hand, and Tumble checks.',
    benefits: [
      'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Balance, Climb, Escape Artist, Hide, Jump, Move Silently, Sleight of Hand, and Tumble checks.',
    ],
    special:
      'All characters except wizards, sorcerers, and monks automatically have Armor Proficiency (light) as a bonus feat. They need not select it. (Normal: A character who is wearing armor with which she is not proficient applies its armor check penalty to attack rolls and to all skill checks that involve moving, including Ride.)',
  },
  {
    id: 'armor-proficiency-medium-35e',
    name: 'Armor Proficiency (Medium)',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Armor Proficiency (light).' }],
    description: 'See Armor Proficiency (light).',
    benefits: ['See Armor Proficiency (light).'],
    special:
      'Fighters, barbarians, paladins, clerics, druids, and bards automatically have Armor Proficiency (medium) as a bonus feat. They need not select it. (Normal: See Armor Proficiency (light).)',
  },
  {
    id: 'diehard-35e',
    name: 'Diehard',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Endurance.' }],
    description: 'When reduced to between –1 and –9 hit points, you automatically become stable.',
    benefits: [
      'When reduced to between –1 and –9 hit points, you automatically become stable.',
      'You don’t have to roll d% to see if you lose 1 hit point each round.',
      'When reduced to negative hit points, you may choose to act as if you were disabled, rather than dying.',
      'You must make this decision as soon as you are reduced to negative hit points (even if it isn’t your turn).',
      'If you do not choose to act as if you were disabled, you immediately fall unconscious.',
      'When using this feat, you can take either a single move or standard action each turn, but not both, and you cannot take a full round action.',
      'You can take a move action without further injuring yourself, but if you perform any standard action (or any other action deemed as strenuous, including some free actions, such as casting a quickened spell) you take 1 point of damage after completing the act.',
      'If you reach –10 hit points, you immediately die.',
    ],
  },
  {
    id: 'endurance-35e',
    name: 'Endurance',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You gain a +4 bonus on the following checks and saves: Swim checks made to resist nonlethal damage, Constitution checks made to continue running, Constitution checks made to avoid nonlethal damage from a forced march, Constitution checks made to hold your breath, Constitution checks made to avoid nonlethal damage from starvation or thirst, Fortitude saves made to avoid nonlethal damage from hot or cold environments, and Fortitude saves made to resist damage from suffocation.',
    benefits: [
      'You gain a +4 bonus on the following checks and saves: Swim checks made to resist nonlethal damage, Constitution checks made to continue running, Constitution checks made to avoid nonlethal damage from a forced march, Constitution checks made to hold your breath, Constitution checks made to avoid nonlethal damage from starvation or thirst, Fortitude saves made to avoid nonlethal damage from hot or cold environments, and Fortitude saves made to resist damage from suffocation.',
      'Also, you may sleep in light or medium armor without becoming fatigued.',
    ],
    special:
      'A ranger automatically gains Endurance as a bonus feat at 3rd level. He need not select it. (Normal: A character without this feat who sleeps in medium or heavier armor is automatically fatigued the next day.)',
  },
  {
    id: 'extra-turning-35e',
    name: 'Extra Turning',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ability to turn or rebuke creatures.' }],
    description:
      'Each time you take this feat, you can use your ability to turn or rebuke creatures four more times per day than normal.',
    benefits: [
      'Each time you take this feat, you can use your ability to turn or rebuke creatures four more times per day than normal.',
      'If you have the ability to turn or rebuke more than one kind of creature each of your turning or rebuking abilities gains four additional uses per day.',
    ],
    special:
      'You can gain Extra Turning multiple times. Its effects stack. Each time you take the feat, you can use each of your turning or rebuking abilities four additional times per day. (Normal: Without this feat, a character can typically turn or rebuke undead (or other creatures) a number of times per day equal to 3 + his or her Charisma modifier.)',
  },
  {
    id: 'great-fortitude-35e',
    name: 'Great Fortitude',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You get a +2 bonus on all Fortitude saving throws.',
    benefits: ['You get a +2 bonus on all Fortitude saving throws.'],
  },
  {
    id: 'improved-counterspell-35e',
    name: 'Improved Counterspell',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell.',
    benefits: [
      'When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell.',
    ],
  },
  {
    id: 'improved-feint-35e',
    name: 'Improved Feint',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Int 13, Combat Expertise.' }],
    description: 'You can make a Bluff check to feint in combat as a move action.',
    benefits: ['You can make a Bluff check to feint in combat as a move action.'],
  },
  {
    id: 'improved-turning-35e',
    name: 'Improved Turning',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ability to turn or rebuke creatures.' }],
    description:
      'You turn or rebuke creatures as if you were one level higher than you are in the class that grants you the ability.',
    benefits: [
      'You turn or rebuke creatures as if you were one level higher than you are in the class that grants you the ability.',
    ],
  },
  {
    id: 'iron-will-35e',
    name: 'Iron Will',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You get a +2 bonus on all Will saving throws.',
    benefits: ['You get a +2 bonus on all Will saving throws.'],
  },
  {
    id: 'leadership-35e',
    name: 'Leadership',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Character level 6th.' }],
    description: 'Prerequisite: Character level 6th.',
    benefits: [
      'Prerequisite: Character level 6th.',
      'Benefits: Having this feat enables the character to attract loyal companions and devoted followers, subordinates who assist her.',
      'See the table below for what sort of cohort and how many followers the character can recruit.',
      'Leadership Modifiers: Several factors can affect a character’s Leadership score, causing it to vary from the base score (character level + Cha',
    ],
  },
  {
    id: 'lightning-reflexes-35e',
    name: 'Lightning Reflexes',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You get a +2 bonus on all Reflex saving throws.',
    benefits: ['You get a +2 bonus on all Reflex saving throws.'],
  },
  {
    id: 'martial-weapon-proficiency-35e',
    name: 'Martial Weapon Proficiency',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You make attack rolls with the selected weapon normally.',
    benefits: ['You make attack rolls with the selected weapon normally.'],
    special:
      'Barbarians, fighters, paladins, and rangers are proficient with all martial weapons. They need not select this feat. You can gain Martial Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of weapon. A cleric who chooses the War domain automatically gains the Martial Weapon Proficiency feat related to his deity’s favored weapon as a bonus feat, if the weapon is a martial one. He need not select it. (Normal: When using a weapon with which you are not proficient, you take a –4 penalty on attack rolls.)',
  },
  {
    id: 'run-35e',
    name: 'Run',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load).',
    benefits: [
      'When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load).',
      'If you make a jump after a running start (see the Jump skill description), you gain a +4 bonus on your Jump check.',
      'While running, you retain your Dexterity bonus to AC.',
    ],
  },
  {
    id: 'shield-proficiency-35e',
    name: 'Shield Proficiency',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You can use a shield and take only the standard penalties.',
    benefits: ['You can use a shield and take only the standard penalties.'],
    special:
      'Barbarians, bards, clerics, druids, fighters, paladins, and rangers automatically have Shield Proficiency as a bonus feat. They need not select it. (Normal: When you are using a shield with which you are not proficient, you take the shield’s armor check penalty on attack rolls and on all skill checks that involve moving, including Ride checks.)',
  },
  {
    id: 'simple-weapon-proficiency-35e',
    name: 'Simple Weapon Proficiency',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You make attack rolls with simple weapons normally.',
    benefits: ['You make attack rolls with simple weapons normally.'],
    special:
      'All characters except for druids, monks, and wizards are automatically proficient with all simple weapons. They need not select this feat. (Normal: When using a weapon with which you are not proficient, you take a –4 penalty on attack rolls.)',
  },
  {
    id: 'skill-focus-35e',
    name: 'Skill Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You get a +3 bonus on all checks involving that skill.',
    benefits: ['You get a +3 bonus on all checks involving that skill.'],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new skill.',
  },
  {
    id: 'toughness-35e',
    name: 'Toughness',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You gain +3 hit points.',
    benefits: ['You gain +3 hit points.'],
    special: 'A character may gain this feat multiple times. Its effects stack.',
  },
  {
    id: 'tower-shield-proficiency-35e',
    name: 'Tower Shield Proficiency',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Shield Proficiency.' }],
    description: 'You can use a tower shield and suffer only the standard penalties.',
    benefits: ['You can use a tower shield and suffer only the standard penalties.'],
    special:
      'Fighters automatically have Tower Shield Proficiency as a bonus feat. They need not select it. (Normal: A character who is using a shield with which he or she is not proficient takes the shield’s armor check penalty on attack rolls and on all skill checks that involve moving, including Ride.)',
  },
  {
    id: 'track-35e',
    name: 'Track',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'To find tracks or to follow them for 1 mile requires a successful Survival check.',
    benefits: [
      'To find tracks or to follow them for 1 mile requires a successful Survival check.',
      'You must make another Survival check every time the tracks become difficult to follow.',
      'You move at half your normal speed (or at your normal speed with a –5 penalty on the check, or at up to twice your normal speed with a –20 penalty on the check).',
      'The DC depends on the surface and the prevailing conditions, as given on the table below: <table data-debug="no-caption" class="half-width-table"><tbody><tr><th>Surface</th><th>Survival DC</th><th>Surface Survival</th><th>DC</th></tr><tr><td>Very soft ground</td><td>5</td><td>Firm ground</td><td>15</td></tr><tr><td>Soft ground</td><td>10</td><td>Hard ground</td><td>20</td></tr></tbody></table> Very Soft Ground: Any surface (fresh snow, thick dust, wet mud) that holds deep, clear impressions of footprints.',
      'Soft Ground: Any surface soft enough to yield to pressure, but firmer than wet mud or fresh snow, in which a creature leaves frequent but shallow footprints.',
      'Firm Ground: Most normal outdoor surfaces (such as lawns, fields, woods, and the like) or exceptionally soft or dirty indoor surfaces (thick rugs and very dirty or dusty floors).',
      'The creature might leave some traces (broken branches or tufts of hair), but it leaves only occasional or partial footprints.',
      'Hard Ground: Any surface that doesn’t hold footprints at all, such as bare rock or an indoor floor.',
      'Most streambeds fall into this category, since any footprints left behind are obscured or washed away.',
      'The creature leaves only traces (scuff marks or displaced pebbles).',
      'Several modifiers may apply to the Survival check, as given on the table below. <table data-debug="no-caption" class="half-width-table"><tbody><tr><th>Condition</th><th>Survival DC Modifier</th></tr><tr><td>Every three creatures in the group being tracked</td><td>–1</td></tr><tr><td>Size of creature or creatures being tracked:<sup>1</sup></td><td></td></tr><tr><td>Fine</td><td>+8</td></tr><tr><td>Diminutive</td><td>+4</td></tr><tr><td>Tiny</td><td>+2</td></tr><tr><td>Small</td><td>+1</td></tr><tr><td>Medium</td><td>+0</td></tr><tr><td>Large</td><td>–1</td></tr><tr><td>Huge</td><td>–2</td></tr><tr><td>Gargantuan</td><td>–4</td></tr><tr><td>Colossal</td><td>–8</td></tr><tr><td>Every 24 hours since the trail was made</td><td>+1</td></tr><tr><td>Every hour of rain since the trail was made</td><td>+1</td></tr><tr><td>Fresh snow cover since the trail was made</td><td>+10</td></tr><tr><td>Poor visibility:<sup>2</sup></td><td></td></tr><tr><td>Overcast or moonless night</td><td>+6</td></tr><tr><td>Moonlight</td><td>+3</td></tr><tr><td>Fog or precipitation</td><td>+3</td></tr><tr><td>Tracked party hides trail (and moves at half speed)</td><td>+5</td></tr><tr><td colspan="2">1 For a group of mixed sizes, apply only the modifier for the largest size category.</td></tr><tr><td colspan="2">2 Apply only the largest modifier from this category.</td></tr></tbody></table> If you fail a Survival check, you can retry after 1 hour (outdoors) or 10 minutes (indoors) of searching.',
    ],
    special:
      'A ranger automatically has Track as a bonus feat. He need not select it. This feat does not allow you to find or follow the tracks made by a subject of a pass without trace spell. (Normal: Without this feat, you can use the Survival skill to find tracks, but you can follow them only if the DC for the task is 10 or lower. Alternatively, you can use the Search skill to find a footprint or similar sign of a creature’s passage using the DCs given above, but you can’t use Search to follow tracks, even if someone else has already found them.)',
  },
];
