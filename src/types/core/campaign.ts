/**
 * Campaign / Party Management Types
 *
 * A Campaign groups characters together and provides shared metadata.
 * Characters are referenced by ID — the same character can belong to
 * multiple campaigns.
 */

export interface Campaign {
  id: string;
  name: string;
  /** Optional game system filter — when set, only characters of this system can be added. */
  systemId?: string;
  /** IDs of characters belonging to this campaign. */
  characterIds: string[];
  /** Free-form session / campaign notes. */
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
