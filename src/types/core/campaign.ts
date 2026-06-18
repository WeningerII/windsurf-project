/**
 * Campaign / Party Management Types
 *
 * A Campaign groups characters together and provides shared metadata.
 * Characters are referenced by ID — the same character can belong to
 * multiple campaigns.
 *
 * Beyond the party roster, a campaign carries the lightweight story
 * scaffolding a solo player needs to run themselves: quests (each a
 * checklist of objectives) and a chronological session log of recaps.
 */

/** A single checkable goal within a quest. */
export interface CampaignObjective {
  id: string;
  /** What the party must do. */
  text: string;
  /** Whether the objective has been accomplished. */
  done: boolean;
}

/** Lifecycle of a quest. `active` quests are in progress; the others are done. */
export type CampaignQuestStatus = 'active' | 'completed' | 'failed';

/** A story arc the party is pursuing, tracked as a checklist of objectives. */
export interface CampaignQuest {
  id: string;
  title: string;
  /** One-line description of the quest's goal. */
  summary: string;
  status: CampaignQuestStatus;
  /** Ordered objectives; completing all of them does not auto-close the quest. */
  objectives: CampaignObjective[];
  createdAt: Date;
  updatedAt: Date;
}

/** A dated recap of what happened in one play session. */
export interface CampaignSessionEntry {
  id: string;
  /** Short heading, e.g. "Session 3 — The Sunless Citadel". */
  title: string;
  /** Narrative recap of what occurred. */
  body: string;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  /** Optional game system filter — when set, only characters of this system can be added. */
  systemId?: string;
  /** IDs of characters belonging to this campaign. */
  characterIds: string[];
  /** Free-form session / campaign notes. */
  notes: string;
  /** Story arcs the party is pursuing, oldest first. */
  quests: CampaignQuest[];
  /** Chronological session recaps, oldest first. */
  sessionLog: CampaignSessionEntry[];
  createdAt: Date;
  updatedAt: Date;
}
