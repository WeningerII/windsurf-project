// D&D 3.5e Combat Feats - System Reference Document v3.5
//
// Parsed from the OGL System Reference Document v3.5 (github.com/olimot/srd-v3.5-md),
// which reproduces the SRD verbatim under the Open Game License v1.0a.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const combatFeats: FeatDefinition[] = [
  {
    id: 'blind-fight-35e',
    name: 'Blind-Fight',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'In melee, every time you miss because of concealment, you can reroll your miss chance percentile roll one time to see if you actually hit.',
    benefits: [
      'In melee, every time you miss because of concealment, you can reroll your miss chance percentile roll one time to see if you actually hit.',
      'An invisible attacker gets no advantages related to hitting you in melee.',
      'That is, you don’t lose your Dexterity bonus to Armor Class, and the attacker doesn’t get the usual +2 bonus for being invisible.',
      'The invisible attacker’s bonuses do still apply for ranged attacks, however.',
      'You take only half the usual penalty to speed for being unable to see.',
      'Darkness and poor visibility in general reduces your speed to three-quarters normal, instead of one-half.',
    ],
    special:
      'The Blind-Fight feat is of no use against a character who is the subject of a blink spell. A fighter may select Blind-Fight as one of his fighter bonus feats. (Normal: Regular attack roll modifiers for invisible attackers trying to hit you apply, and you lose your Dexterity bonus to AC. The speed reduction for darkness and poor visibility also applies.)',
  },
  {
    id: 'cleave-35e',
    name: 'Cleave',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Str 13, Power Attack.' }],
    description:
      'If you deal a creature enough damage to make it drop (typically by dropping it to below 0 hit points or killing it), you get an immediate, extra melee attack against another creature within reach.',
    benefits: [
      'If you deal a creature enough damage to make it drop (typically by dropping it to below 0 hit points or killing it), you get an immediate, extra melee attack against another creature within reach.',
      'You cannot take a 5-foot step before making this extra attack.',
      'The extra attack is with the same weapon and at the same bonus as the attack that dropped the previous creature.',
      'You can use this ability once per round.',
    ],
    special: 'A fighter may select Cleave as one of his fighter bonus feats.',
  },
  {
    id: 'combat-expertise-35e',
    name: 'Combat Expertise',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Int 13.' }],
    description:
      'When you use the attack action or the full attack action in melee, you can take a penalty of as much as –5 on your attack roll and add the same number (+5 or less) as a dodge bonus to your Armor Class.',
    benefits: [
      'When you use the attack action or the full attack action in melee, you can take a penalty of as much as –5 on your attack roll and add the same number (+5 or less) as a dodge bonus to your Armor Class.',
      'This number may not exceed your base attack bonus.',
      'The changes to attack rolls and Armor Class last until your next action.',
    ],
    special:
      'A fighter may select Combat Expertise as one of his fighter bonus feats. (Normal: A character without the Combat Expertise feat can fight defensively while using the attack or full attack action to take a –4 penalty on attack rolls and gain a +2 dodge bonus to Armor Class.)',
  },
  {
    id: 'combat-reflexes-35e',
    name: 'Combat Reflexes',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You may make a number of additional attacks of opportunity equal to your Dexterity bonus.',
    benefits: [
      'You may make a number of additional attacks of opportunity equal to your Dexterity bonus.',
      'With this feat, you may also make attacks of opportunity while flat-footed.',
    ],
    special:
      'The Combat Reflexes feat does not allow a rogue to use her opportunist ability more than once per round. A fighter may select Combat Reflexes as one of his fighter bonus feats. A monk may select Combat Reflexes as a bonus feat at 2nd level. (Normal: A character without this feat can make only one attack of opportunity per round and can’t make attacks of opportunity while flat-footed.)',
  },
  {
    id: 'deflect-arrows-35e',
    name: 'Deflect Arrows',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 13, Improved Unarmed Strike.' }],
    description: 'You must have at least one hand free (holding nothing) to use this feat.',
    benefits: [
      'You must have at least one hand free (holding nothing) to use this feat.',
      'Once per round when you would normally be hit with a ranged weapon, you may deflect it so that you take no damage from it.',
      'You must be aware of the attack and not flatfooted.',
      'Attempting to deflect a ranged weapon doesn’t count as an action.',
      'Unusually massive ranged weapons and ranged attacks generated by spell effects can’t be deflected.',
    ],
    special:
      'A monk may select Deflect Arrows as a bonus feat at 2nd level, even if she does not meet the prerequisites. A fighter may select Deflect Arrows as one of his fighter bonus feats.',
  },
  {
    id: 'dodge-35e',
    name: 'Dodge',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 13.' }],
    description:
      'During your action, you designate an opponent and receive a +1 dodge bonus to Armor Class against attacks from that opponent.',
    benefits: [
      'During your action, you designate an opponent and receive a +1 dodge bonus to Armor Class against attacks from that opponent.',
      'You can select a new opponent on any action.',
      'A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses.',
      'Also, dodge bonuses stack with each other, unlike most other types of bonuses.',
    ],
    special: 'A fighter may select Dodge as one of his fighter bonus feats.',
  },
  {
    id: 'exotic-weapon-proficiency-35e',
    name: 'Exotic Weapon Proficiency',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +1 (plus Str 13 for bastard sword or dwarven waraxe).',
      },
    ],
    description: 'You make attack rolls with the weapon normally.',
    benefits: ['You make attack rolls with the weapon normally.'],
    special:
      'You can gain Exotic Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of exotic weapon. Proficiency with the bastard sword or the dwarven waraxe has an additional prerequisite of Str 13. A fighter may select Exotic Weapon Proficiency as one of his fighter bonus feats. (Normal: A character who uses a weapon with which he or she is not proficient takes a –4 penalty on attack rolls.)',
  },
  {
    id: 'far-shot-35e',
    name: 'Far Shot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Point Blank Shot.' }],
    description:
      'When you use a projectile weapon, such as a bow, its range increment increases by one-half (multiply by 1-1/2).',
    benefits: [
      'When you use a projectile weapon, such as a bow, its range increment increases by one-half (multiply by 1-1/2).',
      'When you use a thrown weapon, its range increment is doubled.',
    ],
    special: 'A fighter may select Far Shot as one of his fighter bonus feats.',
  },
  {
    id: 'great-cleave-35e',
    name: 'Great Cleave',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Str 13, Cleave, Power Attack, base attack bonus +4.' },
    ],
    description:
      'This feat works like Cleave, except that there is no limit to the number of times you can use it per round.',
    benefits: [
      'This feat works like Cleave, except that there is no limit to the number of times you can use it per round.',
    ],
    special: 'A fighter may select Great Cleave as one of his fighter bonus feats.',
  },
  {
    id: 'greater-two-weapon-fighting-35e',
    name: 'Greater Two-Weapon Fighting',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description:
          'Dex 19, Improved Two-Weapon Fighting, Two-Weapon Fighting, base attack bonus +11.',
      },
    ],
    description: 'You get a third attack with your off-hand weapon, albeit at a –10 penalty.',
    benefits: ['You get a third attack with your off-hand weapon, albeit at a –10 penalty.'],
    special:
      'A fighter may select Greater Two-Weapon Fighting as one of his fighter bonus feats. An 11th-level ranger who has chosen the two-weapon combat style is treated as having Greater Two-Weapon Fighting, even if he does not have the prerequisites for it, but only when he is wearing light or no armor.',
  },
  {
    id: 'greater-weapon-focus-35e',
    name: 'Greater Weapon Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description:
          'Proficiency with selected weapon, Weapon Focus with selected weapon, fighter level 8th.',
      },
    ],
    description: 'You gain a +1 bonus on all attack rolls you make using the selected weapon.',
    benefits: [
      'You gain a +1 bonus on all attack rolls you make using the selected weapon.',
      'This bonus stacks with other bonuses on attack rolls, including the one from Weapon Focus (see below).',
    ],
    special:
      'You can gain Greater Weapon Focus multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter must have Greater Weapon Focus with a given weapon to gain the Greater Weapon Specialization feat for that weapon. A fighter may select Greater Weapon Focus as one of his fighter bonus feats.',
  },
  {
    id: 'greater-weapon-specialization-35e',
    name: 'Greater Weapon Specialization',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description:
          'Proficiency with selected weapon, Greater Weapon Focus with selected weapon, Weapon Focus with selected weapon, Weapon Specialization with selected weapon, fighter level 12th.',
      },
    ],
    description: 'You gain a +2 bonus on all damage rolls you make using the selected weapon.',
    benefits: [
      'You gain a +2 bonus on all damage rolls you make using the selected weapon.',
      'This bonus stacks with other bonuses on damage rolls, including the one from Weapon Specialization (see below).',
    ],
    special:
      'You can gain Greater Weapon Specialization multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Greater Weapon Specialization as one of his fighter bonus feats.',
  },
  {
    id: 'improved-bull-rush-35e',
    name: 'Improved Bull Rush',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Str 13, Power Attack.' }],
    description:
      'When you perform a bull rush you do not provoke an attack of opportunity from the defender.',
    benefits: [
      'When you perform a bull rush you do not provoke an attack of opportunity from the defender.',
      'You also gain a +4 bonus on the opposed Strength check you make to push back the defender.',
    ],
    special: 'A fighter may select Improved Bull Rush as one of his fighter bonus feats.',
  },
  {
    id: 'improved-critical-35e',
    name: 'Improved Critical',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Proficient with weapon, base attack bonus +8.' },
    ],
    description: 'When using the weapon you selected, your threat range is doubled.',
    benefits: ['When using the weapon you selected, your threat range is doubled.'],
    special:
      'You can gain Improved Critical multiple times. The effects do not stack. Each time you take the feat, it applies to a new type of weapon. This effect doesn’t stack with any other effect that expands the threat range of a weapon. A fighter may select Improved Critical as one of his fighter bonus feats.',
  },
  {
    id: 'improved-disarm-35e',
    name: 'Improved Disarm',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Int 13, Combat Expertise.' }],
    description:
      'You do not provoke an attack of opportunity when you attempt to disarm an opponent, nor does the opponent have a chance to disarm you.',
    benefits: [
      'You do not provoke an attack of opportunity when you attempt to disarm an opponent, nor does the opponent have a chance to disarm you.',
      'You also gain a +4 bonus on the opposed attack roll you make to disarm your opponent.',
    ],
    special:
      'A fighter may select Improved Disarm as one of his fighter bonus feats. A monk may select Improved Disarm as a bonus feat at 6th level, even if she does not meet the prerequisites. (Normal: See the normal disarm rules.)',
  },
  {
    id: 'improved-grapple-35e',
    name: 'Improved Grapple',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 13, Improved Unarmed Strike.' }],
    description:
      'You do not provoke an attack of opportunity when you make a touch attack to start a grapple.',
    benefits: [
      'You do not provoke an attack of opportunity when you make a touch attack to start a grapple.',
      'You also gain a +4 bonus on all grapple checks, regardless of whether you started the grapple.',
    ],
    special:
      'A fighter may select Improved Grapple as one of his fighter bonus feats. A monk may select Improved Grapple as a bonus feat at 1st level, even if she does not meet the prerequisites. (Normal: Without this feat, you provoke an attack of opportunity when you make a touch attack to start a grapple.)',
  },
  {
    id: 'improved-initiative-35e',
    name: 'Improved Initiative',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description: 'You get a +4 bonus on initiative checks.',
    benefits: ['You get a +4 bonus on initiative checks.'],
    special: 'A fighter may select Improved Initiative as one of his fighter bonus feats.',
  },
  {
    id: 'improved-overrun-35e',
    name: 'Improved Overrun',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Str 13, Power Attack.' }],
    description: 'When you attempt to overrun an opponent, the target may not choose to avoid you.',
    benefits: [
      'When you attempt to overrun an opponent, the target may not choose to avoid you.',
      'You also gain a +4 bonus on your Strength check to knock down your opponent.',
    ],
    special:
      'A fighter may select Improved Overrun as one of his fighter bonus feats. (Normal: Without this feat, the target of an overrun can choose to avoid you or to block you.)',
  },
  {
    id: 'improved-precise-shot-35e',
    name: 'Improved Precise Shot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 19, Point Blank Shot, Precise Shot, base attack bonus +11.',
      },
    ],
    description:
      'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment.',
    benefits: [
      'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment.',
      'Total cover and total concealment provide their normal benefits against your ranged attacks.',
      'In addition, when you shoot or throw ranged weapons at a grappling opponent, you automatically strike at the opponent you have chosen.',
    ],
    special:
      'A fighter may select Improved Precise Shot as one of his fighter bonus feats. An 11th-level ranger who has chosen the archery combat style is treated as having Improved Precise Shot, even if he does not have the prerequisites for it, but only when he is wearing light or no armor. (Normal: See the normal rules on the effects of cover and concealment. Without this feat, a character who shoots or throws a ranged weapon at a target involved in a grapple must roll randomly to see which grappling combatant the attack strikes.)',
  },
  {
    id: 'improved-shield-bash-35e',
    name: 'Improved Shield Bash',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Shield Proficiency.' }],
    description:
      'When you perform a shield bash, you may still apply the shield’s shield bonus to your AC.',
    benefits: [
      'When you perform a shield bash, you may still apply the shield’s shield bonus to your AC.',
    ],
    special:
      'A fighter may select Improved Shield Bash as one of his fighter bonus feats. (Normal: Without this feat, a character who performs a shield bash loses the shield’s shield bonus to AC until his or her next turn.)',
  },
  {
    id: 'improved-sunder-35e',
    name: 'Improved Sunder',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Str 13, Power Attack.' }],
    description:
      'When you strike at an object held or carried by an opponent (such as a weapon or shield), you do not provoke an attack of opportunity.',
    benefits: [
      'When you strike at an object held or carried by an opponent (such as a weapon or shield), you do not provoke an attack of opportunity.',
      'You also gain a +4 bonus on any attack roll made to attack an object held or carried by another character.',
    ],
    special:
      'A fighter may select Improved Sunder as one of his fighter bonus feats. (Normal: Without this feat, you provoke an attack of opportunity when you strike at an object held or carried by another character.)',
  },
  {
    id: 'improved-trip-35e',
    name: 'Improved Trip',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Int 13, Combat Expertise.' }],
    description:
      'You do not provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed.',
    benefits: [
      'You do not provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed.',
      'You also gain a +4 bonus on your Strength check to trip your opponent.',
      'If you trip an opponent in melee combat, you immediately get a melee attack against that opponent as if you hadn’t used your attack for the trip attempt.',
    ],
    special:
      'At 6th level, a monk may select Improved Trip as a bonus feat, even if she does not have the prerequisites. A fighter may select Improved Trip as one of his fighter bonus feats. (Normal: Without this feat, you provoke an attack of opportunity when you attempt to trip an opponent while you are unarmed.)',
  },
  {
    id: 'improved-two-weapon-fighting-35e',
    name: 'Improved Two-Weapon Fighting',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Dex 17, Two-Weapon Fighting, base attack bonus +6.' },
    ],
    description:
      'In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a –5 penalty.',
    benefits: [
      'In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a –5 penalty.',
    ],
    special:
      'A fighter may select Improved Two-Weapon Fighting as one of his fighter bonus feats. A 6th-level ranger who has chosen the two-weapon combat style is treated as having Improved Two-Weapon Fighting, even if he does not have the prerequisites for it, but only when he is wearing light or no armor. (Normal: Without this feat, you can only get a single extra attack with an off-hand weapon.)',
  },
  {
    id: 'improved-unarmed-strike-35e',
    name: 'Improved Unarmed Strike',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You are considered to be armed even when unarmed —that is, you do not provoke attacks or opportunity from armed opponents when you attack them while unarmed.',
    benefits: [
      'You are considered to be armed even when unarmed —that is, you do not provoke attacks or opportunity from armed opponents when you attack them while unarmed.',
      'However, you still get an attack of opportunity against any opponent who makes an unarmed attack on you.',
      'In addition, your unarmed strikes can deal lethal or nonlethal damage, at your option.',
    ],
    special:
      'A monk automatically gains Improved Unarmed Strike as a bonus feat at 1st level. She need not select it. A fighter may select Improved Unarmed Strike as one of his fighter bonus feats. (Normal: Without this feat, you are considered unarmed when attacking with an unarmed strike, and you can deal only nonlethal damage with such an attack.)',
  },
  {
    id: 'manyshot-35e',
    name: 'Manyshot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Dex 17, Point Blank Shot, Rapid Shot, base attack bonus +6' },
    ],
    description:
      'As a standard action, you may fire two arrows at a single opponent within 30 feet.',
    benefits: [
      'As a standard action, you may fire two arrows at a single opponent within 30 feet.',
      'Both arrows use the same attack roll (with a –4 penalty) to determine success and deal damage normally (but see Special).',
      'For every five points of base attack bonus you have above +6, you may add one additional arrow to this attack, to a maximum of four arrows at a base attack bonus of +16.',
      'However, each arrow after the second adds a cumulative –2 penalty on the attack roll (for a total penalty of –6 for three arrows and –8 for four).',
      'Damage reduction and other resistances apply separately against each arrow fired.',
    ],
    special:
      'Regardless of the number of arrows you fire, you apply precision-based damage only once. If you score a critical hit, only the first arrow fired deals critical damage; all others deal regular damage. A fighter may select Manyshot as one of his fighter bonus feats. A 6th-level ranger who has chosen the archery combat style is treated as having Manyshot even if he does not have the prerequisites for it, but only when he is wearing light or no armor.',
  },
  {
    id: 'mobility-35e',
    name: 'Mobility',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 13, Dodge.' }],
    description:
      'You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area.',
    benefits: [
      'You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area.',
      'A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses.',
      'Dodge bonuses stack with each other, unlike most types of bonuses.',
    ],
    special: 'A fighter may select Mobility as one of his fighter bonus feats.',
  },
  {
    id: 'mounted-archery-35e',
    name: 'Mounted Archery',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ride 1 rank, Mounted Combat.' }],
    description:
      'The penalty you take when using a ranged weapon while mounted is halved: –2 instead of –4 if your mount is taking a double move, and –4 instead of –8 if your mount is running.',
    benefits: [
      'The penalty you take when using a ranged weapon while mounted is halved: –2 instead of –4 if your mount is taking a double move, and –4 instead of –8 if your mount is running.',
    ],
    special: 'A fighter may select Mounted Archery as one of his fighter bonus feats.',
  },
  {
    id: 'mounted-combat-35e',
    name: 'Mounted Combat',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ride 1 rank.' }],
    description:
      'Once per round when your mount is hit in combat, you may attempt a Ride check (as a reaction) to negate the hit.',
    benefits: [
      'Once per round when your mount is hit in combat, you may attempt a Ride check (as a reaction) to negate the hit.',
      'The hit is negated if your Ride check result is greater than the opponent’s attack roll. (Essentially, the Ride check result becomes the mount’s Armor Class if it’s higher than the mount’s regular AC.)',
    ],
    special: 'A fighter may select Mounted Combat as one of his fighter bonus feats.',
  },
  {
    id: 'point-blank-shot-35e',
    name: 'Point Blank Shot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    description:
      'You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.',
    benefits: [
      'You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.',
    ],
    special: 'A fighter may select Point Blank Shot as one of his fighter bonus feats.',
  },
  {
    id: 'power-attack-35e',
    name: 'Power Attack',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Str 13.' }],
    description:
      'On your action, before making attack rolls for a round, you may choose to subtract a number from all melee attack rolls and add the same number to all melee damage rolls.',
    benefits: [
      'On your action, before making attack rolls for a round, you may choose to subtract a number from all melee attack rolls and add the same number to all melee damage rolls.',
      'This number may not exceed your base attack bonus.',
      'The penalty on attacks and bonus on damage apply until your next turn.',
    ],
    special:
      'If you attack with a two-handed weapon, or with a one-handed weapon wielded in two hands, instead add twice the number subtracted from your attack rolls. You can’t add the bonus from Power Attack to the damage dealt with a light weapon (except with unarmed strikes or natural weapon attacks), even though the penalty on attack rolls still applies. (Normally, you treat a double weapon as a one-handed weapon and a light weapon. If you choose to use a double weapon like a two-handed weapon, attacking with only one end of it in a round, you treat it as a two-handed weapon.) A fighter may select Power Attack as one of his fighter bonus feats.',
  },
  {
    id: 'precise-shot-35e',
    name: 'Precise Shot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Point Blank Shot.' }],
    description:
      'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard –4 penalty on your attack roll.',
    benefits: [
      'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard –4 penalty on your attack roll.',
    ],
    special: 'A fighter may select Precise Shot as one of his fighter bonus feats.',
  },
  {
    id: 'quick-draw-35e',
    name: 'Quick Draw',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Base attack bonus +1.' }],
    description: 'You can draw a weapon as a free action instead of as a move action.',
    benefits: [
      'You can draw a weapon as a free action instead of as a move action.',
      'You can draw a hidden weapon (see the Sleight of Hand skill) as a move action.',
      'A character who has selected this feat may throw weapons at his full normal rate of attacks (much like a character with a bow).',
    ],
    special:
      'A fighter may select Quick Draw as one of his fighter bonus feats. (Normal: Without this feat, you may draw a weapon as a move action, or (if your base attack bonus is +1 or higher) as a free action as part of movement. Without this feat, you can draw a hidden weapon as a standard action.)',
  },
  {
    id: 'rapid-reload-35e',
    name: 'Rapid Reload',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Weapon Proficiency (crossbow type chosen).' }],
    description:
      'The time required for you to reload your chosen type of crossbow is reduced to a free action (for a hand or light crossbow) or a move action (for a heavy crossbow).',
    benefits: [
      'The time required for you to reload your chosen type of crossbow is reduced to a free action (for a hand or light crossbow) or a move action (for a heavy crossbow).',
      'Reloading a crossbow still provokes an attack of opportunity.',
      'If you have selected this feat for hand crossbow or light crossbow, you may fire that weapon as many times in a full attack action as you could attack if you were using a bow.',
    ],
    special:
      'You can gain Rapid Reload multiple times. Each time you take the feat, it applies to a new type of crossbow. A fighter may select Rapid Reload as one of his fighter bonus feats. (Normal: A character without this feat needs a move action to reload a hand or light crossbow, or a full-round action to reload a heavy crossbow.)',
  },
  {
    id: 'rapid-shot-35e',
    name: 'Rapid Shot',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 13, Point Blank Shot.' }],
    description: 'You can get one extra attack per round with a ranged weapon.',
    benefits: [
      'You can get one extra attack per round with a ranged weapon.',
      'The attack is at your highest base attack bonus, but each attack you make in that round (the extra one and the normal ones) takes a –2 penalty.',
      'You must use the full attack action to use this feat.',
    ],
    special:
      'A fighter may select Rapid Shot as one of his fighter bonus feats. A 2nd-level ranger who has chosen the archery combat style is treated as having Rapid Shot, even if he does not have the prerequisites for it, but only when he is wearing light or no armor.',
  },
  {
    id: 'ride-by-attack-35e',
    name: 'Ride-by Attack',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ride 1 rank, Mounted Combat.' }],
    description:
      'When you are mounted and use the charge action, you may move and attack as if with a standard charge and then move again (continuing the straight line of the charge).',
    benefits: [
      'When you are mounted and use the charge action, you may move and attack as if with a standard charge and then move again (continuing the straight line of the charge).',
      'Your total movement for the round can’t exceed double your mounted speed.',
      'You and your mount do not provoke an attack of opportunity from the opponent that you attack.',
    ],
    special: 'A fighter may select Ride-By Attack as one of his fighter bonus feats.',
  },
  {
    id: 'shot-on-the-run-35e',
    name: 'Shot on the Run',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 13, Dodge, Mobility, Point Blank Shot, base attack bonus +4.',
      },
    ],
    description:
      'When using the attack action with a ranged weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
    benefits: [
      'When using the attack action with a ranged weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
    ],
    special: 'A fighter may select Shot on the Run as one of his fighter bonus feats.',
  },
  {
    id: 'snatch-arrows-35e',
    name: 'Snatch Arrows',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Dex 15, Deflect Arrows, Improved Unarmed Strike.' },
    ],
    description:
      'When using the Deflect Arrows feat you may catch the weapon instead of just deflecting it.',
    benefits: [
      'When using the Deflect Arrows feat you may catch the weapon instead of just deflecting it.',
      'Thrown weapons can immediately be thrown back at the original attacker (even though it isn’t your turn) or kept for later use.',
      'You must have at least one hand free (holding nothing) to use this feat.',
    ],
    special: 'A fighter may select Snatch Arrows as one of his fighter bonus feats.',
  },
  {
    id: 'spirited-charge-35e',
    name: 'Spirited Charge',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ride 1 rank, Mounted Combat, Ride-By Attack.' }],
    description:
      'When mounted and using the charge action, you deal double damage with a melee weapon (or triple damage with a lance).',
    benefits: [
      'When mounted and using the charge action, you deal double damage with a melee weapon (or triple damage with a lance).',
    ],
    special: 'A fighter may select Spirited Charge as one of his fighter bonus feats.',
  },
  {
    id: 'spring-attack-35e',
    name: 'Spring Attack',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Dex 13, Dodge, Mobility, base attack bonus +4.' },
    ],
    description:
      'When using the attack action with a melee weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
    benefits: [
      'When using the attack action with a melee weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed.',
      'Moving in this way does not provoke an attack of opportunity from the defender you attack, though it might provoke attacks of opportunity from other creatures, if appropriate.',
      'You can’t use this feat if you are wearing heavy armor.',
      'You must move at least 5 feet both before and after you make your attack in order to utilize the benefits of Spring Attack.',
    ],
    special: 'A fighter may select Spring Attack as one of his fighter bonus feats.',
  },
  {
    id: 'stunning-fist-35e',
    name: 'Stunning Fist',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 13, Wis 13, Improved Unarmed Strike, base attack bonus +8.',
      },
    ],
    description:
      'You must declare that you are using this feat before you make your attack roll (thus, a failed attack roll ruins the attempt).',
    benefits: [
      'You must declare that you are using this feat before you make your attack roll (thus, a failed attack roll ruins the attempt).',
      'Stunning Fist forces a foe damaged by your unarmed attack to make a Fortitude saving throw (DC 10 + 1/2 your character level + your Wis modifier), in addition to dealing damage normally.',
      'A defender who fails this saving throw is stunned for 1 round (until just before your next action).',
      'A stunned character can’t act, loses any Dexterity bonus to AC, and takes a –2 penalty to AC.',
      'You may attempt a stunning attack once per day for every four levels you have attained (but see Special), and no more than once per round.',
      'Constructs, oozes, plants, undead, incorporeal creatures, and creatures immune to critical hits cannot be stunned.',
    ],
    special:
      'A monk may select Stunning Fist as a bonus feat at 1st level, even if she does not meet the prerequisites. A monk who selects this feat may attempt a stunning attack a number of times per day equal to her monk level, plus one more time per day for every four levels she has in classes other than monk. A fighter may select Stunning Fist as one of his fighter bonus feats.',
  },
  {
    id: 'trample-35e',
    name: 'Trample',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Ride 1 rank, Mounted Combat.' }],
    description:
      'When you attempt to overrun an opponent while mounted, your target may not choose to avoid you.',
    benefits: [
      'When you attempt to overrun an opponent while mounted, your target may not choose to avoid you.',
      'Your mount may make one hoof attack against any target you knock down, gaining the standard +4 bonus on attack rolls against prone targets.',
    ],
    special: 'A fighter may select Trample as one of his fighter bonus feats.',
  },
  {
    id: 'two-weapon-defense-35e',
    name: 'Two-Weapon Defense',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 15, Two-Weapon Fighting.' }],
    description:
      'When wielding a double weapon or two weapons (not including natural weapons or unarmed strikes), you gain a +1 shield bonus to your AC.',
    benefits: [
      'When wielding a double weapon or two weapons (not including natural weapons or unarmed strikes), you gain a +1 shield bonus to your AC.',
      'When you are fighting defensively or using the total defense action, this shield bonus increases to +2.',
    ],
    special: 'A fighter may select Two-Weapon Defense as one of his fighter bonus feats.',
  },
  {
    id: 'two-weapon-fighting-35e',
    name: 'Two-Weapon Fighting',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Dex 15.' }],
    description: 'Your penalties on attack rolls for fighting with two weapons are reduced.',
    benefits: [
      'Your penalties on attack rolls for fighting with two weapons are reduced.',
      'The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6.',
    ],
    special:
      'A 2nd-level ranger who has chosen the two-weapon combat style is treated as having Two-Weapon Fighting, even if he does not have the prerequisite for it, but only when he is wearing light or no armor. A fighter may select Two-Weapon Fighting as one of his fighter bonus feats. (Normal: If you wield a second weapon in your off hand, you can get one extra attack per round with that weapon. When fighting in this way you suffer a –6 penalty with your regular attack or attacks with your primary hand and a –10 penalty to the attack with your off hand. If your off-hand weapon is light the penalties are reduced by 2 each. (An unarmed strike is always considered light.))',
  },
  {
    id: 'weapon-finesse-35e',
    name: 'Weapon Finesse',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [{ type: 'other', description: 'Base attack bonus +1.' }],
    description:
      'With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls.',
    benefits: [
      'With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls.',
      'If you carry a shield, its armor check penalty applies to your attack rolls.',
    ],
    special:
      'A fighter may select Weapon Finesse as one of his fighter bonus feats. Natural weapons are always considered light weapons.',
  },
  {
    id: 'weapon-focus-35e',
    name: 'Weapon Focus',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      { type: 'other', description: 'Proficiency with selected weapon, base attack bonus +1.' },
    ],
    description: 'You gain a +1 bonus on all attack rolls you make using the selected weapon.',
    benefits: ['You gain a +1 bonus on all attack rolls you make using the selected weapon.'],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Weapon Focus as one of his fighter bonus feats. He must have Weapon Focus with a weapon to gain the Weapon Specialization feat for that weapon.',
  },
  {
    id: 'weapon-specialization-35e',
    name: 'Weapon Specialization',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description:
          'Proficiency with selected weapon, Weapon Focus with selected weapon, fighter level 4th.',
      },
    ],
    description: 'You gain a +2 bonus on all damage rolls you make using the selected weapon.',
    benefits: ['You gain a +2 bonus on all damage rolls you make using the selected weapon.'],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon. A fighter may select Weapon Specialization as one of his fighter bonus feats.',
  },
  {
    id: 'whirlwind-attack-35e',
    name: 'Whirlwind Attack',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    prerequisites: [
      {
        type: 'other',
        description:
          'Dex 13, Int 13, Combat Expertise, Dodge, Mobility, Spring Attack, base attack bonus +4.',
      },
    ],
    description:
      'When you use the full attack action, you can give up your regular attacks and instead make one melee attack at your full base attack bonus against each opponent within reach.',
    benefits: [
      'When you use the full attack action, you can give up your regular attacks and instead make one melee attack at your full base attack bonus against each opponent within reach.',
      'When you use the Whirlwind Attack feat, you also forfeit any bonus or extra attacks granted by other feats, spells, or abilities.',
    ],
    special: 'A fighter may select Whirlwind Attack as one of his fighter bonus feats.',
  },
];
