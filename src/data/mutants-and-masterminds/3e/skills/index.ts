// M&M 3e Skills - Hero's Handbook (SRD)

export interface Skill {
  id: string;
  name: string;
  system: string;
  source: string;
  ability: 'str' | 'sta' | 'agl' | 'dex' | 'fgt' | 'int' | 'awe' | 'pre';
  trainedOnly?: boolean;
  description: string;
  examples: string[];
}

export const acrobatics: Skill = {
  id: 'acrobatics', name: 'Acrobatics', system: 'mam3e', source: "Hero's Handbook",
  ability: 'agl',
  description: 'Perform acrobatic stunts, maintain balance, and escape from bonds.',
  examples: ['Balance on narrow surfaces', 'Tumble through opponents', 'Escape from restraints'],
};

export const athletics: Skill = {
  id: 'athletics', name: 'Athletics', system: 'mam3e', source: "Hero's Handbook",
  ability: 'str',
  description: 'Perform athletic feats like climbing, jumping, swimming, and throwing.',
  examples: ['Climb walls', 'Jump long distances', 'Swim', 'Break objects'],
};

export const closeCombat: Skill = {
  id: 'close-combat', name: 'Close Combat', system: 'mam3e', source: "Hero's Handbook",
  ability: 'fgt',
  description: 'Attack in close combat with a specific weapon group or unarmed.',
  examples: ['Unarmed combat', 'Swords', 'Improvised weapons'],
};

export const deception: Skill = {
  id: 'deception', name: 'Deception', system: 'mam3e', source: "Hero's Handbook",
  ability: 'pre',
  description: 'Deceive others through lies, disguises, or misdirection.',
  examples: ['Lie convincingly', 'Create disguises', 'Feint in combat'],
};

export const expertise: Skill = {
  id: 'expertise', name: 'Expertise', system: 'mam3e', source: "Hero's Handbook",
  ability: 'int',
  description: 'Specialized knowledge in a specific field.',
  examples: ['History', 'Magic', 'Science', 'Tactics', 'Medicine'],
};

export const insight: Skill = {
  id: 'insight', name: 'Insight', system: 'mam3e', source: "Hero's Handbook",
  ability: 'awe',
  description: 'Read people, sense motives, and detect lies.',
  examples: ['Sense motives', 'Detect lies', 'Read body language'],
};

export const intimidation: Skill = {
  id: 'intimidation', name: 'Intimidation', system: 'mam3e', source: "Hero's Handbook",
  ability: 'pre',
  description: 'Frighten or coerce others through threats or force of personality.',
  examples: ['Threaten opponents', 'Demoralize enemies', 'Extract information'],
};

export const investigation: Skill = {
  id: 'investigation', name: 'Investigation', system: 'mam3e', source: "Hero's Handbook",
  ability: 'int',
  description: 'Gather information, analyze clues, and solve mysteries.',
  examples: ['Search for clues', 'Analyze evidence', 'Research information'],
};

export const perception: Skill = {
  id: 'perception', name: 'Perception', system: 'mam3e', source: "Hero's Handbook",
  ability: 'awe',
  description: 'Notice things with your senses, including hidden objects and creatures.',
  examples: ['Spot hidden enemies', 'Notice details', 'Search areas'],
};

export const persuasion: Skill = {
  id: 'persuasion', name: 'Persuasion', system: 'mam3e', source: "Hero's Handbook",
  ability: 'pre',
  description: 'Influence others through reason, diplomacy, or charm.',
  examples: ['Negotiate', 'Change attitudes', 'Make requests'],
};

export const rangedCombat: Skill = {
  id: 'ranged-combat', name: 'Ranged Combat', system: 'mam3e', source: "Hero's Handbook",
  ability: 'dex',
  description: 'Attack at range with a specific weapon group.',
  examples: ['Guns', 'Bows', 'Thrown weapons', 'Energy blasts'],
};

export const sleightOfHand: Skill = {
  id: 'sleight-of-hand', name: 'Sleight of Hand', system: 'mam3e', source: "Hero's Handbook",
  ability: 'dex',
  description: 'Perform manual tricks, pick pockets, and conceal objects.',
  examples: ['Pick pockets', 'Palm objects', 'Disable devices'],
};

export const stealth: Skill = {
  id: 'stealth', name: 'Stealth', system: 'mam3e', source: "Hero's Handbook",
  ability: 'agl',
  description: 'Hide and move silently.',
  examples: ['Hide from view', 'Move silently', 'Tail someone'],
};

export const technology: Skill = {
  id: 'technology', name: 'Technology', system: 'mam3e', source: "Hero's Handbook",
  ability: 'int',
  description: 'Use, repair, and build technological devices.',
  examples: ['Hack computers', 'Repair devices', 'Build gadgets'],
};

export const treatment: Skill = {
  id: 'treatment', name: 'Treatment', system: 'mam3e', source: "Hero's Handbook",
  ability: 'int',
  description: 'Provide medical treatment and first aid.',
  examples: ['Stabilize dying', 'Treat injuries', 'Diagnose conditions'],
};

export const vehicles: Skill = {
  id: 'vehicles', name: 'Vehicles', system: 'mam3e', source: "Hero's Handbook",
  ability: 'dex',
  description: 'Operate and control vehicles.',
  examples: ['Drive cars', 'Pilot aircraft', 'Navigate ships'],
};

export const skills: Skill[] = [
  acrobatics, athletics, closeCombat, deception, expertise, insight,
  intimidation, investigation, perception, persuasion, rangedCombat,
  sleightOfHand, stealth, technology, treatment, vehicles,
];
