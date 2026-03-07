/**
 * Pathfinder 1e Core Traits - SRD-Compliant
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: Pathfinder 1e SRD (d20pfsrd.com/)
 * License: OGL v1.0a
 */

export interface Trait {
  id: string;
  name: string;
  category: string;
  description: string;
  benefit: string;
  source: string;
}

export const pf1eTraits: Trait[] = [
  {
    id: 'pf1e-trait-acolyte',
    name: 'Acolyte',
    category: 'Religion',
    description: 'You were raised in a temple and trained in religious rites.',
    benefit: '+1 trait bonus on Knowledge (religion) checks.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-adopted',
    name: 'Adopted',
    category: 'Social',
    description: 'You were adopted and raised by people not of your birth race.',
    benefit:
      'You gain an additional language and +2 bonus on Diplomacy checks with your adopted race.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-ambitious',
    name: 'Ambitious',
    category: 'Personal',
    description: 'You are driven to succeed and achieve your goals.',
    benefit: '+1 trait bonus on one type of Craft or Profession check.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-anatomist',
    name: 'Anatomist',
    category: 'Combat',
    description: 'You have studied anatomy and know where to strike for maximum effect.',
    benefit: '+1 trait bonus on attack rolls to confirm critical hits.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-animal-friend',
    name: 'Animal Friend',
    category: 'Animal',
    description: 'Animals seem to trust you.',
    benefit: '+1 trait bonus on Handle Animal and Ride checks.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-armor-expert',
    name: 'Armor Expert',
    category: 'Combat',
    description: 'You have trained extensively in wearing armor.',
    benefit: 'Reduce armor check penalty by 1 (minimum 0).',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-artist',
    name: 'Artist',
    category: 'Craft',
    description: 'You are a talented artist in your chosen medium.',
    benefit: '+2 trait bonus on Craft checks for your chosen art form.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-battlefield-scavenger',
    name: 'Battlefield Scavenger',
    category: 'Combat',
    description: 'You are adept at finding useful items on the battlefield.',
    benefit: '+1 trait bonus on Perception checks to find items on the battlefield.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-beast-bond',
    name: 'Beast Bond',
    category: 'Animal',
    description: 'You have a special connection with animals.',
    benefit: '+1 trait bonus on animal companion checks.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf1e-trait-bully',
    name: 'Bully',
    category: 'Social',
    description: 'You grew up as a bully and learned to intimidate others.',
    benefit: '+1 trait bonus on Intimidate checks.',
    source: 'Core Rulebook',
  },
];

export const getTrait = (id: string): Trait | undefined => {
  return pf1eTraits.find((trait) => trait.id === id);
};

export const getTraitsByCategory = (category: string): Trait[] => {
  return pf1eTraits.filter((trait) => trait.category === category);
};

export const getTraitsByName = (name: string): Trait | undefined => {
  return pf1eTraits.find((trait) => trait.name === name);
};
