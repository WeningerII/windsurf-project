export type Dnd5eFeatureOptionGroup =
  | 'invocations'
  | 'fighting-styles'
  | 'metamagic'
  | 'maneuvers'
  | 'ki-abilities'
  | 'channel-divinity'
  | 'wild-shapes'
  | 'smites';

export interface Dnd5eFeatureOptionDefinition {
  id: string;
  group: Dnd5eFeatureOptionGroup;
  name: string;
  system: 'dnd-5e-2014';
  source: string;
  description: string;
  classIds: string[];
  subclassIds?: string[];
  minLevel?: number;
  prerequisites?: string[];
}

export interface Dnd5eFeatureOptionSelection {
  id: string;
  group: Dnd5eFeatureOptionGroup;
}
