import { describe, it, expect } from 'vitest';
import { channelDivinityOptions } from '../data/dnd/5e-2014/class-features/cleric/channel-divinity';

describe('D&D 5e-2014 Channel Divinity Options', () => {
  it('should have at least 12 options', () => {
    expect(channelDivinityOptions.length).toBeGreaterThanOrEqual(12);
  });
  
  it('should have unique IDs', () => {
    const ids = channelDivinityOptions.map(o => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    channelDivinityOptions.forEach(option => {
      expect(option.id).toMatch(/^[a-z0-9-]+$/);
      expect(option.name).toBeTruthy();
      expect(option.description).toBeTruthy();
      expect(option.system).toBe('dnd-5e-2014');
      expect(option.source.book).toBe('SRD 5.1');
      expect(option.source.page).toBeGreaterThan(0);
      expect(['action', 'reaction', 'bonus']).toContain(option.actionType);
      expect(option.minLevel).toBeGreaterThan(0);
    });
  });
  
  it('should have version numbers', () => {
    channelDivinityOptions.forEach(option => {
      expect(option.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
  
  it('should include Turn Undead', () => {
    const turnUndead = channelDivinityOptions.find(o => o.id === 'turn-undead');
    expect(turnUndead).toBeDefined();
    expect(turnUndead?.domain).toBeUndefined();
    expect(turnUndead?.minLevel).toBe(2);
  });
  
  it('should have valid domains when present', () => {
    const validDomains = ['knowledge', 'life', 'light', 'nature', 'tempest', 'trickery', 'war'];
    
    channelDivinityOptions.forEach(option => {
      if (option.domain !== undefined) {
        expect(validDomains).toContain(option.domain);
      }
    });
  });
  
  it('should include one option per domain at level 2', () => {
    const domains = ['knowledge', 'life', 'light', 'nature', 'tempest', 'trickery', 'war'];
    
    domains.forEach(domain => {
      const level2Options = channelDivinityOptions.filter(
        o => o.domain === domain && o.minLevel === 2
      );
      expect(level2Options.length).toBeGreaterThanOrEqual(1);
    });
  });
  
  it('should have appropriate level requirements', () => {
    channelDivinityOptions.forEach(option => {
      expect([2, 6, 8, 17]).toContain(option.minLevel);
    });
  });
  
  it('should include domain-specific options', () => {
    const domainOptions = [
      'preserve-life',
      'guided-strike',
      'destructive-wrath',
      'invoke-duplicity',
      'radiance-of-the-dawn',
    ];
    
    const optionIds = channelDivinityOptions.map(o => o.id);
    domainOptions.forEach(domain => {
      expect(optionIds).toContain(domain);
    });
  });
  
  it('should have reaction-based options', () => {
    const reactionOptions = channelDivinityOptions.filter(o => o.actionType === 'reaction');
    expect(reactionOptions.length).toBeGreaterThan(0);
  });
});
