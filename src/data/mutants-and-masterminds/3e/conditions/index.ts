// M&M 3e Conditions - Hero's Handbook
// Reference: https://www.d20herosrd.com/9-gamemastering/conditions/

export interface Condition {
  id: string;
  name: string;
  system: string;
  source: string;
  category: 'basic' | 'combined';
  description: string;
  effects: string[];
  supersededBy?: string[]; // IDs of conditions that supersede this one
}

// ========================================
// BASIC CONDITIONS
// ========================================

export const compelled: Condition = {
  id: 'compelled',
  name: 'Compelled',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'A compelled character is directed by an outside force, but struggling against it.',
  effects: [
    'Limited to free actions and a single standard action per turn',
    'Standard action is chosen by another, controlling, character',
    'Standard action can be traded for a move or free action',
  ],
  supersededBy: ['controlled'],
};

export const controlled: Condition = {
  id: 'controlled',
  name: 'Controlled',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'A controlled character has no free will.',
  effects: [
    "Character's actions each turn are dictated by another, controlling, character",
    'No independent decision-making',
  ],
};

export const dazed: Condition = {
  id: 'dazed',
  name: 'Dazed',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description:
    'A dazed character is limited to free actions and a single standard action per turn.',
  effects: [
    'Limited to free actions and one standard action per turn',
    'Standard action may be used to perform a move action',
  ],
  supersededBy: ['stunned'],
};

export const debilitated: Condition = {
  id: 'debilitated',
  name: 'Debilitated',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'The character has one or more abilities lowered below –5.',
  effects: [
    'Ability rank reduced to –5 or lower',
    'Effects vary by ability (see Debilitated Abilities in rulebook)',
    'Strength: Cannot take move actions to move',
    'Agility: Defenseless and immobile',
    'Fighting: Dazed and defenseless, cannot make close attacks',
    'Awareness: Stunned and unaware',
    'Intellect: Stunned',
    'Presence: Cannot interact or use Presence-based effects',
  ],
};

export const defenseless: Condition = {
  id: 'defenseless',
  name: 'Defenseless',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'A defenseless character has active defense bonuses of 0.',
  effects: [
    'Active defense bonuses (Dodge and Parry) reduced to 0',
    'Attackers can make attacks as routine checks',
    'If attacker makes normal attack check, any hit is a critical hit',
    'Often combined with prone condition',
  ],
};

export const disabled: Condition = {
  id: 'disabled',
  name: 'Disabled',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'A disabled character is at a –5 circumstance penalty on checks.',
  effects: [
    '–5 circumstance penalty on checks',
    'Can apply to specific checks (Attack Disabled, Fighting Disabled, etc.)',
  ],
  supersededBy: ['debilitated'],
};

export const fatigued: Condition = {
  id: 'fatigued',
  name: 'Fatigued',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'Fatigued characters are hindered.',
  effects: ['Character is hindered (moves at half speed)', 'Recover after one hour of rest'],
  supersededBy: ['exhausted'],
};

export const hindered: Condition = {
  id: 'hindered',
  name: 'Hindered',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'A hindered character moves at half normal speed.',
  effects: ['Movement speed reduced by –1 speed rank', 'Move at half normal speed'],
  supersededBy: ['immobile'],
};

export const immobile: Condition = {
  id: 'immobile',
  name: 'Immobile',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'Immobile characters have no movement speed and cannot move from their spot.',
  effects: [
    'No movement speed',
    'Cannot move from current position',
    'Still capable of taking actions unless prohibited by another condition',
  ],
};

export const impaired: Condition = {
  id: 'impaired',
  name: 'Impaired',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'An impaired character is at a –2 circumstance penalty on checks.',
  effects: [
    '–2 circumstance penalty on checks',
    'Can apply to specific checks (Attack Impaired, Fighting Impaired, etc.)',
  ],
  supersededBy: ['disabled'],
};

export const normal: Condition = {
  id: 'normal',
  name: 'Normal',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'The character is unharmed and unaffected by other conditions.',
  effects: ['No conditions affecting the character', 'Acting normally'],
};

export const stunned: Condition = {
  id: 'stunned',
  name: 'Stunned',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'Stunned characters cannot take any actions, including free actions.',
  effects: ['Cannot take any actions', 'Cannot take free actions'],
};

export const transformed: Condition = {
  id: 'transformed',
  name: 'Transformed',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description:
    'Transformed characters have some or all of their traits altered by an outside agency.',
  effects: [
    'Some or all traits altered by external effect',
    'May range from appearance change to complete trait alteration',
    'Character point total cannot increase',
    'Character point total can effectively decrease',
  ],
};

export const unaware: Condition = {
  id: 'unaware',
  name: 'Unaware',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'The character is completely unaware of their surroundings.',
  effects: [
    'Completely unaware of surroundings',
    'Treat as if all other characters have full concealment',
    'Cannot make Perception checks',
    'Defenseless against attacks',
  ],
};

export const vulnerable: Condition = {
  id: 'vulnerable',
  name: 'Vulnerable',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'Vulnerable characters are limited in their ability to defend themselves.',
  effects: [
    'Active defenses halved (round up the final value)',
    'Defenseless supersedes vulnerable',
  ],
};

export const weakened: Condition = {
  id: 'weakened',
  name: 'Weakened',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'basic',
  description: 'One or more traits are reduced in rank.',
  effects: [
    'Specified trait(s) reduced by effect rank',
    'If trait reduced below –5, character is debilitated',
    'Recovery varies by effect duration',
  ],
};

// ========================================
// COMBINED CONDITIONS
// ========================================

export const asleep: Condition = {
  id: 'asleep',
  name: 'Asleep',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'Asleep characters are defenseless, stunned, and unaware.',
  effects: [
    'Defenseless (defense bonuses are 0)',
    'Stunned (cannot take actions)',
    'Unaware (unconscious of surroundings)',
    'Loud noise or significant disturbance allows Awareness check to wake',
  ],
};

export const bound: Condition = {
  id: 'bound',
  name: 'Bound',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'Bound characters are defenseless, immobile, and impaired.',
  effects: [
    'Defenseless (defense bonuses are 0)',
    'Immobile (cannot move)',
    'Impaired (–2 penalty on checks)',
  ],
};

export const dying: Condition = {
  id: 'dying',
  name: 'Dying',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'A dying character is incapacitated and near death.',
  effects: [
    'Incapacitated (defenseless, stunned, unaware)',
    'Make a Fortitude check (DC 15) each round',
    'Success: Condition does not worsen',
    'Failure: Character dies',
    'Three successful checks: Stabilize at dying condition',
    'Stabilized character regains consciousness in 1d20 minutes',
  ],
};

export const entranced: Condition = {
  id: 'entranced',
  name: 'Entranced',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description:
    'Entranced characters are stunned, taking no actions other than paying attention to the entrancing effect.',
  effects: [
    'Stunned (cannot take actions)',
    'Can only pay attention to entrancing effect',
    'Any obvious threat automatically breaks trance',
    'Shake off: Interaction skill check vs. effect DC',
  ],
};

export const exhausted: Condition = {
  id: 'exhausted',
  name: 'Exhausted',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'Exhausted characters are near collapse.',
  effects: [
    'Impaired (–2 penalty on checks)',
    'Hindered (move at half speed)',
    'Recover after one hour of complete rest (becomes fatigued)',
    'After another hour of rest: No longer fatigued',
  ],
};

export const incapacitated: Condition = {
  id: 'incapacitated',
  name: 'Incapacitated',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'An incapacitated character is defenseless, stunned, and unaware.',
  effects: [
    'Defenseless (defense bonuses are 0)',
    'Stunned (cannot take actions)',
    'Unaware (unconscious)',
  ],
};

export const paralyzed: Condition = {
  id: 'paralyzed',
  name: 'Paralyzed',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'Paralyzed characters are defenseless, immobile, and physically stunned.',
  effects: [
    'Defenseless (defense bonuses are 0)',
    'Immobile (cannot move)',
    'Physically stunned (cannot take physical actions)',
    'Can take purely mental actions',
  ],
};

export const prone: Condition = {
  id: 'prone',
  name: 'Prone',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'A prone character is lying on the ground.',
  effects: [
    '–5 circumstance penalty to close attack checks',
    'Close attackers gain +5 circumstance bonus',
    'Ranged attackers have –5 circumstance penalty',
    'Character is hindered',
    'Standing requires move action (or Acrobatics check as free action)',
  ],
};

export const blind: Condition = {
  id: 'blind',
  name: 'Blind',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'The character cannot see.',
  effects: [
    'Everything has full visual concealment from the character',
    'Hindered (move at half speed)',
    'Visually unaware',
    'Vulnerable (active defenses halved)',
    'May be impaired or disabled for activities where vision is a factor',
  ],
};

export const deaf: Condition = {
  id: 'deaf',
  name: 'Deaf',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'The character cannot hear.',
  effects: [
    'Everything has total auditory concealment from the character',
    'May allow surprise attacks on the unaware character',
    'Interaction limited to sign-language and lip-reading',
  ],
};

export const restrained: Condition = {
  id: 'restrained',
  name: 'Restrained',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'Restrained characters are hindered and vulnerable.',
  effects: [
    'Hindered (move at half speed)',
    'Vulnerable (attackers gain additional degree of effect)',
  ],
};

export const staggered: Condition = {
  id: 'staggered',
  name: 'Staggered',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'A staggered character is dazed and hindered.',
  effects: [
    'Dazed (limited to free actions and one standard action)',
    'Hindered (move at half speed)',
  ],
};

// ========================================
// AGGREGATIONS
// ========================================

export const basicConditions: Condition[] = [
  compelled,
  controlled,
  dazed,
  debilitated,
  defenseless,
  disabled,
  fatigued,
  hindered,
  immobile,
  impaired,
  normal,
  stunned,
  transformed,
  unaware,
  vulnerable,
  weakened,
];

export const surprised: Condition = {
  id: 'surprised',
  name: 'Surprised',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'combined',
  description: 'A surprised character is caught off-guard.',
  effects: ['Stunned (cannot take actions)', 'Vulnerable (active defenses halved)'],
};

export const combinedConditions: Condition[] = [
  asleep,
  blind,
  bound,
  deaf,
  dying,
  entranced,
  exhausted,
  incapacitated,
  paralyzed,
  prone,
  restrained,
  staggered,
  surprised,
];

export const allConditions: Condition[] = [...basicConditions, ...combinedConditions];

export const conditionsById: Record<string, Condition> = allConditions.reduce(
  (acc, condition) => {
    acc[condition.id] = condition;
    return acc;
  },
  {} as Record<string, Condition>
);

export const conditionsByCategory: Record<string, Condition[]> = allConditions.reduce(
  (acc, condition) => {
    if (!acc[condition.category]) {
      acc[condition.category] = [];
    }
    acc[condition.category].push(condition);
    return acc;
  },
  {} as Record<string, Condition[]>
);
