/**
 * D&D 5e (2014) - Warlock Eldritch Invocations
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface EldritchInvocation {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  prerequisites?: {
    level?: number;
    pactBoon?: 'blade' | 'chain' | 'tome';
    spells?: string[];
    otherInvocations?: string[];
  };
  version: string;
}

export const eldritchInvocations: EldritchInvocation[] = [
  {
    id: 'agonizing-blast',
    name: 'Agonizing Blast',
    description: 'When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    prerequisites: {
      spells: ['eldritch-blast'],
    },
    version: '1.0.0',
  },
  {
    id: 'armor-of-shadows',
    name: 'Armor of Shadows',
    description: 'You can cast mage armor on yourself at will, without expending a spell slot or material components.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'beast-speech',
    name: 'Beast Speech',
    description: 'You can cast speak with animals at will, without expending a spell slot.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'beguiling-influence',
    name: 'Beguiling Influence',
    description: 'You gain proficiency in the Deception and Persuasion skills.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'book-of-ancient-secrets',
    name: 'Book of Ancient Secrets',
    description: 'You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class\'s spell list. The spells appear in the book and don\'t count against the number of spells you know. With your Book of Shadows in hand, you can cast the chosen spells as rituals. You can also cast a warlock spell you know as a ritual if it has the ritual tag. On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell\'s level is equal to or less than half your warlock level (rounded up) and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    prerequisites: {
      pactBoon: 'tome',
    },
    version: '1.0.0',
  },
  {
    id: 'devils-sight',
    name: "Devil's Sight",
    description: 'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'eldritch-sight',
    name: 'Eldritch Sight',
    description: 'You can cast detect magic at will, without expending a spell slot.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'fiendish-vigor',
    name: 'Fiendish Vigor',
    description: 'You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'mask-of-many-faces',
    name: 'Mask of Many Faces',
    description: 'You can cast disguise self at will, without expending a spell slot.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'misty-visions',
    name: 'Misty Visions',
    description: 'You can cast silent image at will, without expending a spell slot or material components.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
  {
    id: 'repelling-blast',
    name: 'Repelling Blast',
    description: 'When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    prerequisites: {
      spells: ['eldritch-blast'],
    },
    version: '1.0.0',
  },
  {
    id: 'thief-of-five-fates',
    name: 'Thief of Five Fates',
    description: 'You can cast bane once using a warlock spell slot. You can\'t do so again until you finish a long rest.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 45 },
    version: '1.0.0',
  },
];
