export interface ArchetypeFeature {
  level: number;
  name: string;
  description: string;
}

export interface Archetype {
  id: string;
  name: string;
  system: string;
  source: string;
  parentClassId: string;
  description: string;
  features: ArchetypeFeature[];
}
