/**
 * Pure transforms over a campaign's story scaffolding (quests, their
 * objectives, and the session log). Every function returns a new `Campaign`
 * and never mutates its input; when an operation would change nothing it
 * returns the original reference, so callers (and React) can skip a needless
 * persist/re-render. Ids and timestamps are passed in rather than generated
 * here, keeping the module deterministic and trivially unit-testable — the
 * campaign's own `updatedAt` is owned by the persistence hook, so these
 * transforms only ever touch a quest's nested `updatedAt`.
 */
import type {
  Campaign,
  CampaignObjective,
  CampaignQuest,
  CampaignQuestStatus,
  CampaignSessionEntry,
} from '../types/core/campaign';

// --- factories -------------------------------------------------------------

/** A fresh, active quest with no objectives. */
export function createQuest(id: string, title: string, summary: string, now: Date): CampaignQuest {
  return {
    id,
    title: title.trim(),
    summary: summary.trim(),
    status: 'active',
    objectives: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** A fresh, uncompleted objective. */
export function createObjective(id: string, text: string): CampaignObjective {
  return { id, text: text.trim(), done: false };
}

/** A session-log recap stamped with the moment it was written. */
export function createSessionEntry(
  id: string,
  title: string,
  body: string,
  now: Date
): CampaignSessionEntry {
  return { id, title: title.trim(), body: body.trim(), createdAt: now };
}

// --- quest-level transforms ------------------------------------------------

/** Append a quest to the campaign's arc list (oldest first). */
export function addQuest(campaign: Campaign, quest: CampaignQuest): Campaign {
  return { ...campaign, quests: [...campaign.quests, quest] };
}

/** Drop a quest by id. Returns the original campaign when no quest matched. */
export function removeQuest(campaign: Campaign, questId: string): Campaign {
  const quests = campaign.quests.filter((quest) => quest.id !== questId);
  return quests.length === campaign.quests.length ? campaign : { ...campaign, quests };
}

/** Edit a quest's title and/or summary, trimming and bumping its `updatedAt`. */
export function editQuest(
  campaign: Campaign,
  questId: string,
  patch: { title?: string; summary?: string },
  now: Date
): Campaign {
  return replaceQuest(campaign, questId, (quest) => {
    const next: CampaignQuest = { ...quest };
    if (patch.title !== undefined) next.title = patch.title.trim();
    if (patch.summary !== undefined) next.summary = patch.summary.trim();
    if (next.title === quest.title && next.summary === quest.summary) return quest;
    next.updatedAt = now;
    return next;
  });
}

/** Move a quest between active/completed/failed, bumping its `updatedAt`. */
export function setQuestStatus(
  campaign: Campaign,
  questId: string,
  status: CampaignQuestStatus,
  now: Date
): Campaign {
  return replaceQuest(campaign, questId, (quest) =>
    quest.status === status ? quest : { ...quest, status, updatedAt: now }
  );
}

// --- objective-level transforms --------------------------------------------

/** Append an objective to a quest's checklist. */
export function addObjective(
  campaign: Campaign,
  questId: string,
  objective: CampaignObjective,
  now: Date
): Campaign {
  return replaceQuest(campaign, questId, (quest) => ({
    ...quest,
    objectives: [...quest.objectives, objective],
    updatedAt: now,
  }));
}

/** Flip a single objective's done flag. */
export function toggleObjective(
  campaign: Campaign,
  questId: string,
  objectiveId: string,
  now: Date
): Campaign {
  return replaceQuest(campaign, questId, (quest) => {
    let changed = false;
    const objectives = quest.objectives.map((objective) => {
      if (objective.id !== objectiveId) return objective;
      changed = true;
      return { ...objective, done: !objective.done };
    });
    return changed ? { ...quest, objectives, updatedAt: now } : quest;
  });
}

/** Remove an objective from a quest's checklist. */
export function removeObjective(
  campaign: Campaign,
  questId: string,
  objectiveId: string,
  now: Date
): Campaign {
  return replaceQuest(campaign, questId, (quest) => {
    const objectives = quest.objectives.filter((objective) => objective.id !== objectiveId);
    return objectives.length === quest.objectives.length
      ? quest
      : { ...quest, objectives, updatedAt: now };
  });
}

// --- session log -----------------------------------------------------------

/** Append a recap to the session log (chronological, oldest first). */
export function addSessionEntry(campaign: Campaign, entry: CampaignSessionEntry): Campaign {
  return { ...campaign, sessionLog: [...campaign.sessionLog, entry] };
}

/** Delete a session-log entry by id. */
export function removeSessionEntry(campaign: Campaign, entryId: string): Campaign {
  const sessionLog = campaign.sessionLog.filter((entry) => entry.id !== entryId);
  return sessionLog.length === campaign.sessionLog.length ? campaign : { ...campaign, sessionLog };
}

// --- derived ---------------------------------------------------------------

/** Completed vs total objectives for a quest's progress indicator. */
export function questProgress(quest: CampaignQuest): { done: number; total: number } {
  const total = quest.objectives.length;
  const done = quest.objectives.reduce((count, objective) => count + (objective.done ? 1 : 0), 0);
  return { done, total };
}

// --- internal --------------------------------------------------------------

/**
 * Apply `transform` to the one quest matching `questId`. The transform may
 * return its input unchanged to signal "no change"; in that case (or when no
 * quest matched) the original campaign reference is returned.
 */
function replaceQuest(
  campaign: Campaign,
  questId: string,
  transform: (quest: CampaignQuest) => CampaignQuest
): Campaign {
  let changed = false;
  const quests = campaign.quests.map((quest) => {
    if (quest.id !== questId) return quest;
    const next = transform(quest);
    if (next !== quest) changed = true;
    return next;
  });
  return changed ? { ...campaign, quests } : campaign;
}
