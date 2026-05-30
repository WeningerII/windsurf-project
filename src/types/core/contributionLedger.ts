export type ContributionOperation = 'set' | 'add' | 'subtract' | 'multiply' | 'max' | 'min';

export type ContributionCategory =
  | 'ability'
  | 'defense'
  | 'proficiency'
  | 'spell'
  | 'resource'
  | 'cost'
  | 'automation'
  | 'reference'
  | 'other';

export type ContributionSourceKind =
  | 'system'
  | 'class'
  | 'subclass'
  | 'species'
  | 'background'
  | 'feat'
  | 'feature-option'
  | 'spell'
  | 'item'
  | 'domain-card'
  | 'power'
  | 'power-modifier'
  | 'custom';

export type ContributionValue =
  | number
  | string
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | null;

export interface ContributionSourceRef {
  kind: ContributionSourceKind;
  label: string;
  id?: string;
  path?: string;
}

export type ContributionManualBoundaryKind =
  | 'manual'
  | 'partial'
  | 'reference-only'
  | 'unsupported';

export interface ContributionManualBoundary {
  kind: ContributionManualBoundaryKind;
  note: string;
}

/**
 * Non-persisted explanation row for deterministic derived values.
 *
 * Ledger entries explain where a computed value came from; they are not stored
 * on CharacterDocument and must not be treated as an alternate state source.
 */
export interface ContributionLedgerEntry {
  id: string;
  systemId: string;
  target: string;
  source: ContributionSourceRef;
  label: string;
  operation: ContributionOperation;
  value: ContributionValue;
  category: ContributionCategory;
  manualBoundary?: ContributionManualBoundary;
  details?: Record<string, unknown>;
}

export interface ContributionLedgerResult {
  entries: ContributionLedgerEntry[];
}
