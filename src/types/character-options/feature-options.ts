import type { Modifier } from '../core/common';

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
  /**
   * Numeric bonuses this option grants. When present they are carried onto the
   * synthesized `Feature` (see `toFeature`) so the option resolves through the
   * shared `resolveCharacterEffects` path (RFC 003) — the same route feats and
   * features already take — instead of needing a bespoke hand-computed special
   * case per option. Options that model their effect elsewhere (e.g. the
   * Defense fighting style's AC bonus, applied by the engine directly) leave
   * this undefined so nothing is double-counted.
   */
  modifiers?: Modifier[];
}

export interface Dnd5eFeatureOptionSelection {
  id: string;
  group: Dnd5eFeatureOptionGroup;
}
