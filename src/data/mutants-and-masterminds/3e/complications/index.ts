// M&M 3e Complications - Hero's Handbook

export interface Complication {
  id: string;
  name: string;
  system: string;
  source: string;
  category:
    | 'motivation'
    | 'accident'
    | 'addiction'
    | 'disability'
    | 'enemy'
    | 'fame'
    | 'hatred'
    | 'honor'
    | 'identity'
    | 'obsession'
    | 'phobia'
    | 'power-loss'
    | 'prejudice'
    | 'relationship'
    | 'reputation'
    | 'responsibility'
    | 'rivalry'
    | 'secret'
    | 'temper'
    | 'weakness'
    | 'other';
  description: string;
  examples: string[];
}

export const acceptanceMotivation: Complication = {
  id: 'motivation-acceptance',
  name: 'Motivation: Acceptance',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero wants to be accepted by society or a particular group.',
  examples: [
    'Mutant wanting to be accepted by humanity',
    'Reformed villain seeking redemption',
    'Alien wanting to fit in on Earth',
  ],
};

export const greedMotivation: Complication = {
  id: 'motivation-greed',
  name: 'Motivation: Greed',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero is motivated by the accumulation of wealth or power.',
  examples: [
    'Mercenary hero who does good for pay',
    'Hero seeking magical artifacts',
    'Corporate-sponsored hero with profit motive',
  ],
};

export const justiceMotivation: Complication = {
  id: 'motivation-justice',
  name: 'Motivation: Justice',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero fights for justice, seeking to bring wrongdoers to account.',
  examples: [
    'Police officer turned vigilante',
    'Lawyer who fights crime by night',
    'Victim of crime seeking to protect others',
  ],
};

export const patriotismMotivation: Complication = {
  id: 'motivation-patriotism',
  name: 'Motivation: Patriotism',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero is motivated by love of country.',
  examples: [
    'Super-soldier serving their nation',
    'Hero inspired by national ideals',
    'Government agent with heroic values',
  ],
};

export const recognitionMotivation: Complication = {
  id: 'motivation-recognition',
  name: 'Motivation: Recognition',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero seeks fame, glory, or acknowledgment.',
  examples: [
    'Celebrity hero who craves attention',
    'Young hero trying to prove themselves',
    'Hero competing to be "the best"',
  ],
};

export const responsibilityMotivation: Complication = {
  id: 'motivation-responsibility',
  name: 'Motivation: Responsibility',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero feels a sense of duty to use their powers for good.',
  examples: [
    '"With great power comes great responsibility"',
    'Heir to a heroic legacy',
    'Only one who can stop a particular threat',
  ],
};

export const thrillsMotivation: Complication = {
  id: 'motivation-thrills',
  name: 'Motivation: Thrills',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero is motivated by the excitement and adventure of heroism.',
  examples: [
    'Adrenaline junkie hero',
    'Hero who finds normal life boring',
    'Thrill-seeker with superpowers',
  ],
};

export const accident: Complication = {
  id: 'accident',
  name: 'Accident',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'accident',
  description: "Your powers can cause damage or appearance problems if you're not careful.",
  examples: [
    'Destructive powers that damage surroundings',
    'Fire powers that cause collateral damage',
    'Super-strength that breaks everything',
  ],
};

export const addiction: Complication = {
  id: 'addiction',
  name: 'Addiction',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'addiction',
  description: 'You have an addiction that can interfere with your heroics.',
  examples: [
    'Substance dependency',
    'Addiction to power source',
    'Psychological dependency on hero work',
  ],
};

export const disability: Complication = {
  id: 'disability',
  name: 'Disability',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'disability',
  description: 'You have a physical or mental disability that can cause difficulties.',
  examples: [
    'Blindness (even with compensating powers)',
    'Paralysis',
    'Missing limb',
    'Mental illness',
  ],
};

export const enemy: Complication = {
  id: 'enemy',
  name: 'Enemy',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'enemy',
  description: 'You have a recurring enemy who threatens you or those you care about.',
  examples: ['Arch-nemesis villain', 'Criminal organization', 'Government agency', 'Rival hero'],
};

export const fame: Complication = {
  id: 'fame',
  name: 'Fame',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'fame',
  description: 'You are well-known, which can cause problems.',
  examples: [
    'Constantly recognized in public',
    'Paparazzi following you',
    'Fans interfering with heroics',
  ],
};

export const hatred: Complication = {
  id: 'hatred',
  name: 'Hatred',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'hatred',
  description: 'You have an irrational hatred that can cloud your judgment.',
  examples: [
    'Hatred of a particular villain',
    'Hatred of a type of criminal',
    'Prejudice against a group',
  ],
};

export const honor: Complication = {
  id: 'honor',
  name: 'Honor',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'honor',
  description: 'You have a code of honor that limits your actions.',
  examples: [
    'Never kill',
    'Always accept a challenge',
    'Never lie',
    'Protect the innocent at all costs',
  ],
};

export const identity: Complication = {
  id: 'identity',
  name: 'Identity',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'identity',
  description: 'You have a secret identity that you must protect.',
  examples: [
    'Dual life as civilian and hero',
    "Family doesn't know about powers",
    'Secret government agent',
  ],
};

export const obsession: Complication = {
  id: 'obsession',
  name: 'Obsession',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'obsession',
  description: 'You have an obsession that can override your better judgment.',
  examples: [
    'Obsessed with stopping one villain',
    'Collecting something',
    'Perfecting your powers',
  ],
};

export const phobia: Complication = {
  id: 'phobia',
  name: 'Phobia',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'phobia',
  description: 'You have an irrational fear that can paralyze you.',
  examples: ['Fear of fire', 'Claustrophobia', 'Fear of heights', 'Fear of a particular creature'],
};

export const powerLoss: Complication = {
  id: 'power-loss',
  name: 'Power Loss',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'power-loss',
  description:
    'Certain circumstances cause some or all of your powers to fail or stop working, or rob you of them altogether.',
  examples: ["Powers don't work in darkness", 'Need to recharge powers', 'Powers fade over time'],
};

export const prejudice: Complication = {
  id: 'prejudice',
  name: 'Prejudice',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'prejudice',
  description: 'Others are prejudiced against you for some reason.',
  examples: [
    'Mutant discrimination',
    'Alien distrust',
    'Former villain stigma',
    'Physical appearance',
  ],
};

export const relationship: Complication = {
  id: 'relationship',
  name: 'Relationship',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'relationship',
  description: 'You have relationships that can be used against you.',
  examples: [
    'Loved ones targeted by villains',
    'Family responsibilities',
    'Romantic entanglements',
  ],
};

export const reputation: Complication = {
  id: 'reputation',
  name: 'Reputation',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'reputation',
  description: 'You have a reputation (good or bad) that affects how others treat you.',
  examples: [
    'Known as dangerous',
    'Reputation for failure',
    'Associated with controversial actions',
  ],
};

export const responsibility: Complication = {
  id: 'responsibility',
  name: 'Responsibility',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'responsibility',
  description: 'You have responsibilities that demand your time and attention.',
  examples: ['Job responsibilities', 'Team obligations', 'Dependent family members'],
};

export const rivalry: Complication = {
  id: 'rivalry',
  name: 'Rivalry',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'rivalry',
  description: 'You have a rivalry with another hero or character.',
  examples: ['Competing hero', 'Professional rival', 'Sibling rivalry with powers'],
};

export const secret: Complication = {
  id: 'secret',
  name: 'Secret',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'secret',
  description: 'You have a secret that could cause problems if revealed.',
  examples: ['Criminal past', 'True origin', 'Connection to villain', 'Government secrets'],
};

export const temper: Complication = {
  id: 'temper',
  name: 'Temper',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'temper',
  description: 'You have a temper that can get you into trouble.',
  examples: ['Quick to anger', 'Berserk rage', 'Easily provoked by specific triggers'],
};

export const weakness: Complication = {
  id: 'weakness',
  name: 'Weakness',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'weakness',
  description: 'You have a weakness that can be exploited.',
  examples: [
    'Vulnerable to specific substance',
    'Weak against magic',
    'Specific frequency disrupts powers',
  ],
};

export const doingGoodMotivation: Complication = {
  id: 'motivation-doing-good',
  name: 'Motivation: Doing Good',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'motivation',
  description: 'The hero is motivated by a simple desire to do good and help others.',
  examples: ['Altruistic hero', 'Selfless protector', 'Guardian of the innocent'],
};

export const quirk: Complication = {
  id: 'quirk',
  name: 'Quirk',
  system: 'mam3e',
  source: "Hero's Handbook",
  category: 'other',
  description: 'You have an unusual personality trait or habit.',
  examples: ['Always speaks in rhyme', 'Compulsive truth-teller', 'Refuses to use technology'],
};

export const complications: Complication[] = [
  acceptanceMotivation,
  greedMotivation,
  justiceMotivation,
  patriotismMotivation,
  recognitionMotivation,
  responsibilityMotivation,
  thrillsMotivation,
  doingGoodMotivation,
  accident,
  addiction,
  disability,
  enemy,
  fame,
  hatred,
  honor,
  identity,
  obsession,
  phobia,
  powerLoss,
  prejudice,
  relationship,
  reputation,
  responsibility,
  rivalry,
  secret,
  temper,
  weakness,
  quirk,
];
