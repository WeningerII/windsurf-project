import { describe, expect, it } from 'vitest';
import type { Campaign, CampaignQuest } from '../../types/core/campaign';
import {
  addObjective,
  addQuest,
  addSessionEntry,
  createObjective,
  createQuest,
  createSessionEntry,
  editQuest,
  questProgress,
  removeObjective,
  removeQuest,
  removeSessionEntry,
  setQuestStatus,
  toggleObjective,
} from '../../utils/campaignStory';

const T0 = new Date('2026-01-01T00:00:00.000Z');
const T1 = new Date('2026-02-01T00:00:00.000Z');

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-1',
    name: 'Solo Run',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: T0,
    updatedAt: T0,
    ...overrides,
  };
}

function makeQuest(overrides: Partial<CampaignQuest> = {}): CampaignQuest {
  return {
    id: 'q1',
    title: 'Find the relic',
    summary: '',
    status: 'active',
    objectives: [],
    createdAt: T0,
    updatedAt: T0,
    ...overrides,
  };
}

describe('campaignStory factories', () => {
  it('createQuest trims, starts active with no objectives, stamps both dates', () => {
    const quest = createQuest('q1', '  Slay the dragon  ', '  burn it down  ', T1);
    expect(quest).toEqual({
      id: 'q1',
      title: 'Slay the dragon',
      summary: 'burn it down',
      status: 'active',
      objectives: [],
      createdAt: T1,
      updatedAt: T1,
    });
  });

  it('createObjective trims and starts undone', () => {
    expect(createObjective('o1', '  open the gate ')).toEqual({
      id: 'o1',
      text: 'open the gate',
      done: false,
    });
  });

  it('createSessionEntry trims title and body', () => {
    expect(createSessionEntry('s1', '  Session 1 ', '  we fought goblins ', T1)).toEqual({
      id: 's1',
      title: 'Session 1',
      body: 'we fought goblins',
      createdAt: T1,
    });
  });
});

describe('campaignStory quest transforms', () => {
  it('addQuest appends without mutating the input', () => {
    const campaign = makeCampaign();
    const quest = makeQuest();
    const next = addQuest(campaign, quest);
    expect(next.quests).toEqual([quest]);
    expect(campaign.quests).toEqual([]); // unchanged
    expect(next).not.toBe(campaign);
  });

  it('removeQuest drops the match and returns the same reference when nothing matched', () => {
    const campaign = makeCampaign({ quests: [makeQuest()] });
    expect(removeQuest(campaign, 'q1').quests).toEqual([]);
    expect(removeQuest(campaign, 'missing')).toBe(campaign);
  });

  it('editQuest patches title/summary and bumps the quest updatedAt', () => {
    const campaign = makeCampaign({ quests: [makeQuest()] });
    const next = editQuest(campaign, 'q1', { title: '  New title ', summary: 'new goal' }, T1);
    expect(next.quests[0]).toMatchObject({
      title: 'New title',
      summary: 'new goal',
      updatedAt: T1,
    });
  });

  it('editQuest is a no-op (same reference) when nothing actually changes', () => {
    const campaign = makeCampaign({ quests: [makeQuest({ title: 'Same' })] });
    expect(editQuest(campaign, 'q1', { title: 'Same' }, T1)).toBe(campaign);
  });

  it('setQuestStatus changes status and bumps updatedAt; no-op when already set', () => {
    const campaign = makeCampaign({ quests: [makeQuest()] });
    const next = setQuestStatus(campaign, 'q1', 'completed', T1);
    expect(next.quests[0]).toMatchObject({ status: 'completed', updatedAt: T1 });
    expect(setQuestStatus(next, 'q1', 'completed', T1)).toBe(next);
  });
});

describe('campaignStory objective transforms', () => {
  it('addObjective appends to the quest and bumps its updatedAt', () => {
    const campaign = makeCampaign({ quests: [makeQuest()] });
    const next = addObjective(campaign, 'q1', createObjective('o1', 'do thing'), T1);
    expect(next.quests[0].objectives).toEqual([{ id: 'o1', text: 'do thing', done: false }]);
    expect(next.quests[0].updatedAt).toEqual(T1);
  });

  it('toggleObjective flips done; no-op reference when the objective is absent', () => {
    const campaign = makeCampaign({
      quests: [makeQuest({ objectives: [{ id: 'o1', text: 'x', done: false }] })],
    });
    const toggled = toggleObjective(campaign, 'q1', 'o1', T1);
    expect(toggled.quests[0].objectives[0].done).toBe(true);
    expect(toggleObjective(campaign, 'q1', 'missing', T1)).toBe(campaign);
  });

  it('removeObjective drops the objective', () => {
    const campaign = makeCampaign({
      quests: [
        makeQuest({
          objectives: [
            { id: 'o1', text: 'a', done: false },
            { id: 'o2', text: 'b', done: true },
          ],
        }),
      ],
    });
    const next = removeObjective(campaign, 'q1', 'o1', T1);
    expect(next.quests[0].objectives).toEqual([{ id: 'o2', text: 'b', done: true }]);
  });
});

describe('campaignStory session log', () => {
  it('addSessionEntry appends chronologically', () => {
    const campaign = makeCampaign();
    const entry = createSessionEntry('s1', 'One', 'recap', T1);
    expect(addSessionEntry(campaign, entry).sessionLog).toEqual([entry]);
  });

  it('removeSessionEntry drops by id; no-op reference when absent', () => {
    const entry = createSessionEntry('s1', 'One', 'recap', T1);
    const campaign = makeCampaign({ sessionLog: [entry] });
    expect(removeSessionEntry(campaign, 's1').sessionLog).toEqual([]);
    expect(removeSessionEntry(campaign, 'missing')).toBe(campaign);
  });
});

describe('questProgress', () => {
  it('counts completed vs total objectives', () => {
    const quest = makeQuest({
      objectives: [
        { id: 'a', text: 'a', done: true },
        { id: 'b', text: 'b', done: false },
        { id: 'c', text: 'c', done: true },
      ],
    });
    expect(questProgress(quest)).toEqual({ done: 2, total: 3 });
  });

  it('reports zero of zero for an empty checklist', () => {
    expect(questProgress(makeQuest())).toEqual({ done: 0, total: 0 });
  });
});
