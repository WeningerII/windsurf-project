// Mutants & Masterminds 3e Advantage Types

export interface Advantage {
  id: string;
  name: string;
  system: 'mam3e';
  source: string;

  type: AdvantageType;
  ranked: boolean;
  maxRanks?: number;

  prerequisites?: AdvantagePrerequisite[];

  description: string;
  benefit: string;
}

export type AdvantageType = 'combat' | 'fortune' | 'general' | 'skill';

export interface AdvantagePrerequisite {
  type: 'ability' | 'skill' | 'advantage' | 'other';
  id?: string;
  minValue?: number;
  description: string;
}
