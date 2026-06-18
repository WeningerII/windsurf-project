import { describe, it, expect, beforeEach } from 'vitest';
import { loadCampaigns, saveCampaigns, clearCampaignStorage } from '../utils/campaignStorage';
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
