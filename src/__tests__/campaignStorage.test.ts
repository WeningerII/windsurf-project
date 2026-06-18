import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadCampaigns,
  saveCampaigns,
  clearCampaignStorage,
  exportCampaigns,
  importCampaigns,
} from '../utils/campaignStorage';
import type { Campaign } from '../types/core/campaign';

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-1',
    name: 'Test Campaign',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

describe('campaignStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no campaigns are stored', () => {
    expect(loadCampaigns()).toEqual([]);
  });

  it('saves and loads campaigns', () => {
    const campaigns = [makeCampaign(), makeCampaign({ id: 'camp-2', name: 'Second' })];
    saveCampaigns(campaigns);
    const loaded = loadCampaigns();
    expect(loaded).toHaveLength(2);
    expect(loaded[0].name).toBe('Test Campaign');
    expect(loaded[1].name).toBe('Second');
  });

  it('hydrates dates on load', () => {
    saveCampaigns([makeCampaign()]);
    const loaded = loadCampaigns();
    expect(loaded[0].createdAt).toBeInstanceOf(Date);
    expect(loaded[0].updatedAt).toBeInstanceOf(Date);
  });

  it('preserves characterIds', () => {
    saveCampaigns([makeCampaign({ characterIds: ['char-a', 'char-b'] })]);
    const loaded = loadCampaigns();
    expect(loaded[0].characterIds).toEqual(['char-a', 'char-b']);
  });

  it('clearCampaignStorage removes all data', () => {
    saveCampaigns([makeCampaign()]);
    expect(loadCampaigns()).toHaveLength(1);
    clearCampaignStorage();
    expect(loadCampaigns()).toEqual([]);
  });

  it('returns empty array for corrupted data', () => {
    localStorage.setItem('rpg-campaigns-v1', '{bad json');
    expect(loadCampaigns()).toEqual([]);
  });

  it('returns empty array when campaigns key is missing from payload', () => {
    localStorage.setItem('rpg-campaigns-v1', JSON.stringify({ version: '1.0' }));
    expect(loadCampaigns()).toEqual([]);
  });
});

describe('campaign export/import', () => {
  it('round-trips campaigns including quests and session log with hydrated dates', () => {
    const campaign = makeCampaign({
      characterIds: ['char-a'],
      quests: [
        {
          id: 'q1',
          title: 'Find the relic',
          summary: 'in the crypt',
          status: 'active',
          objectives: [{ id: 'o1', text: 'descend', done: true }],
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-02'),
        },
      ],
      sessionLog: [
        {
          id: 's1',
          title: 'Session 1',
          body: 'we fought goblins',
          createdAt: new Date('2026-01-03'),
        },
      ],
    });

    const json = exportCampaigns([campaign]);
    const imported = importCampaigns(json);

    expect(imported).toHaveLength(1);
    expect(imported[0]).toMatchObject({
      id: 'camp-1',
      characterIds: ['char-a'],
    });
    expect(imported[0].quests[0]).toMatchObject({ id: 'q1', status: 'active' });
    expect(imported[0].quests[0].createdAt).toBeInstanceOf(Date);
    expect(imported[0].quests[0].objectives).toEqual([{ id: 'o1', text: 'descend', done: true }]);
    expect(imported[0].sessionLog[0]).toMatchObject({ id: 's1', body: 'we fought goblins' });
    expect(imported[0].sessionLog[0].createdAt).toBeInstanceOf(Date);
  });

  it('throws on structurally invalid JSON', () => {
    expect(() => importCampaigns('{bad json')).toThrow(/invalid json/i);
    expect(() => importCampaigns(JSON.stringify({ version: '1.0' }))).toThrow(/invalid json/i);
  });

  it('drops malformed campaign entries rather than failing the whole import', () => {
    const json = JSON.stringify({
      version: '1.0',
      campaigns: [makeCampaign(), { name: 'no id' }, 'not an object'],
    });
    const imported = importCampaigns(json);
    expect(imported).toHaveLength(1);
    expect(imported[0].id).toBe('camp-1');
  });
});
