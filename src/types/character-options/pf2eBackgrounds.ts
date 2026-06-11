/**
 * PF2e background definitions — moved out of the data layer (review M-2:
 * types declared inside src/data files).
 */
export interface Pf2eBackgroundChoice {
  options: string[];
  label: string;
}

export interface Pf2eBackgroundFeatGrant {
  id: string;
  name: string;
  type: 'skill' | 'general';
  description: string;
}

export interface Pf2eBackgroundDefinition {
  id: string;
  name: string;
  source: string;
  description: string;
  abilityBoosts: Pf2eBackgroundChoice;
  skillTraining: string | Pf2eBackgroundChoice;
  loreTraining: string | Pf2eBackgroundChoice;
  feat: Pf2eBackgroundFeatGrant;
}
