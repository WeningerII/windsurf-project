// Pathfinder 2e Class Feats (Sample - Core Fighter and Rogue Feats)

import { FeatDefinition } from '../../../../types/character-options/feats';

export const classFeats: FeatDefinition[] = [
  // Fighter Feats
  {
    id: 'double-slice',
    name: 'Double Slice',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You attack with both weapons at once.',
    benefits: ['You make two Strikes, one with each weapon. If both hit, combine their damage.'],
  },
  {
    id: 'exacting-strike',
    name: 'Exacting Strike',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: "You make a controlled attack that doesn't leave you off-balance.",
    benefits: [
      'Make a Strike. If you miss, you do not apply the multiple attack penalty to further attacks this turn.',
    ],
  },
  {
    id: 'point-blank-shot',
    name: 'Point-Blank Shot',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You are deadly with ranged weapons at close range.',
    benefits: [
      'Your ranged Strikes against targets within your first range increment ignore the penalty from the volley trait and deal 2 additional damage.',
    ],
  },
  {
    id: 'power-attack',
    name: 'Power Attack',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You put all your strength into a devastating strike.',
    benefits: [
      'Make a melee Strike. This counts as two attacks for your multiple attack penalty.',
      'Add an extra weapon damage die on a hit.',
    ],
  },
  {
    id: 'reactive-shield',
    name: 'Reactive Shield',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You can snap your shield into place just in time.',
    benefits: [
      'When hit by an attack, you can use your reaction to Raise a Shield immediately before the damage is determined.',
    ],
  },
  {
    id: 'snagging-strike',
    name: 'Snagging Strike',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You combine an attack with a quick grab.',
    benefits: [
      'Make a Strike. If it hits, the target is flat-footed until the start of your next turn.',
    ],
  },
  {
    id: 'sudden-charge',
    name: 'Sudden Charge',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Fighter' }],
    description: 'You rush forward and attack.',
    benefits: ['Stride twice and then make a melee Strike.'],
  },
  {
    id: 'aggressive-block',
    name: 'Aggressive Block',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Fighter' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'You push back against an attacking foe.',
    benefits: [
      'When you use Shield Block, you can push the attacker 5 feet or make them flat-footed.',
    ],
  },
  {
    id: 'brutish-shove',
    name: 'Brutish Shove',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Fighter' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'You use your attack to push foes away.',
    benefits: [
      'Make a Strike with a two-handed melee weapon. On a hit, the target is pushed 5 feet and flat-footed.',
    ],
  },
  {
    id: 'combat-grab',
    name: 'Combat Grab',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Fighter' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'You grab your foe after a successful attack.',
    benefits: ['Make a Strike with one hand free. On a hit, you automatically grab the target.'],
  },
  // Rogue Feats
  {
    id: 'nimble-dodge',
    name: 'Nimble Dodge',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Rogue' }],
    description: 'You deftly dodge out of the way.',
    benefits: [
      'When targeted by an attack, you gain a +2 circumstance bonus to AC against that attack.',
    ],
  },
  {
    id: 'trap-finder',
    name: 'Trap Finder',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Rogue' }],
    description: 'You have an uncanny ability to find traps.',
    benefits: [
      'You gain a +1 circumstance bonus to Perception checks to find traps.',
      'You can find traps requiring Legendary proficiency.',
    ],
  },
  {
    id: 'twin-feint',
    name: 'Twin Feint',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Rogue' }],
    description: 'You use one attack to distract for another.',
    benefits: [
      'Make two Strikes with different weapons. If the first hits, the second ignores any circumstance AC bonus the target gains.',
    ],
  },
  {
    id: 'you-are-next',
    name: "You're Next",
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Rogue' }],
    description: 'After you incapacitate a foe, you threaten the next.',
    benefits: [
      'When you reduce a foe to 0 HP, you can Demoralize another foe within 30 feet as a free action.',
    ],
  },
  {
    id: 'mobility',
    name: 'Mobility',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Rogue' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'You move swiftly to avoid reactions.',
    benefits: [
      'When you Stride, you do not trigger reactions triggered by your movement for the first 10 feet.',
    ],
  },
  {
    id: 'quick-draw',
    name: 'Quick Draw',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Rogue' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'You draw your weapon and attack in one motion.',
    benefits: ['You Interact to draw a weapon, then Strike with it.'],
  },
  {
    id: 'unbalancing-blow',
    name: 'Unbalancing Blow',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [
      { type: 'class', description: 'Rogue' },
      { type: 'level', value: 2, description: 'Level 2' },
    ],
    description: 'Your strikes knock foes off-balance.',
    benefits: [
      'When you deal sneak attack damage, the target is flat-footed until the start of your next turn.',
    ],
  },
  // Wizard Feats
  {
    id: 'counterspell',
    name: 'Counterspell',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You can disrupt spells.',
    benefits: [
      'When a creature casts a spell you have prepared, you can expend a prepared spell to counter it.',
    ],
  },
  {
    id: 'eschew-materials',
    name: 'Eschew Materials',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You can cast spells without material components.',
    benefits: ['You can cast spells without needing material components worth 1 gp or less.'],
  },
  {
    id: 'familiar',
    name: 'Familiar',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You make a pact with a creature.',
    benefits: ['You gain a familiar.'],
  },
  {
    id: 'hand-of-the-apprentice',
    name: 'Hand of the Apprentice',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You can magically hurl your weapon.',
    benefits: [
      'You can make a ranged Strike with a melee weapon, using your spellcasting modifier for the attack.',
    ],
  },
  {
    id: 'reach-spell',
    name: 'Reach Spell',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You can cast spells at greater range.',
    benefits: [
      'You can increase the range of a spell by 30 feet by spending an additional action.',
    ],
  },
  {
    id: 'widen-spell',
    name: 'Widen Spell',
    system: 'pf2e',
    source: 'Core Rulebook',
    prerequisites: [{ type: 'class', description: 'Wizard' }],
    description: 'You can expand the area of your spells.',
    benefits: [
      'You can spend an additional action to increase the area of a burst, cone, or line spell by 5 feet.',
    ],
  },
];
