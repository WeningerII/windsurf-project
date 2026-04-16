import type { GameSystemId } from './game-systems';

export type SystemSupportLevel = 'full' | 'partial' | 'scaffold';

export type SystemContentCategoryId =
  | 'spells'
  | 'classes'
  | 'domains'
  | 'domainCards'
  | 'species'
  | 'backgrounds'
  | 'featureOptions'
  | 'traits'
  | 'archetypes'
  | 'complications'
  | 'monsters'
  | 'equipment'
  | 'feats'
  | 'advantages'
  | 'powerModifiers';

export type SystemContentReachability = 'product' | 'source-filtered';

export interface SystemContentSummary {
  id: SystemContentCategoryId;
  label: string;
  count: number;
  reachability: SystemContentReachability;
  note?: string;
}

export interface SystemCatalogSummary {
  systemId: GameSystemId;
  label: string;
  version?: string;
  supportLevel: SystemSupportLevel;
  supportNotes?: string;
  categories: SystemContentSummary[];
  totalReachableCount: number;
}
