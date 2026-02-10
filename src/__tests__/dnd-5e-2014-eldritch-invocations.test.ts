import { describe, it, expect } from 'vitest';
import { eldritchInvocations } from '../data/dnd/5e-2014/class-features/warlock/eldritch-invocations';

describe('D&D 5e-2014 Eldritch Invocations', () => {
  it('should have at least 12 invocations', () => {
    expect(eldritchInvocations.length).toBeGreaterThanOrEqual(12);
  });
  
  it('should have unique IDs', () => {
    const ids = eldritchInvocations.map(i => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
  
  it('should all have valid structure', () => {
    eldritchInvocations.forEach(invocation => {
      expect(invocation.id).toMatch(/^[a-z0-9-]+$/);
      expect(invocation.name).toBeTruthy();
      expect(invocation.description).toBeTruthy();
      expect(invocation.system).toBe('dnd-5e-2014');
      expect(invocation.source.book).toBe('SRD 5.1');
      expect(invocation.source.page).toBeGreaterThan(0);
    });
  });
  
  it('should have version numbers', () => {
    eldritchInvocations.forEach(invocation => {
      expect(invocation.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
  
  it('should include core invocations', () => {
    const coreInvocations = [
      'agonizing-blast',
      'armor-of-shadows',
      'devils-sight',
      'mask-of-many-faces',
      'repelling-blast',
    ];
    
    const invocationIds = eldritchInvocations.map(i => i.id);
    coreInvocations.forEach(core => {
      expect(invocationIds).toContain(core);
    });
  });
  
  it('should have valid prerequisites when present', () => {
    eldritchInvocations.forEach(invocation => {
      if (invocation.prerequisites) {
        const prereqs = invocation.prerequisites;
        
        if (prereqs.level !== undefined) {
          expect(prereqs.level).toBeGreaterThan(0);
          expect(prereqs.level).toBeLessThanOrEqual(20);
        }
        
        if (prereqs.pactBoon !== undefined) {
          expect(['blade', 'chain', 'tome']).toContain(prereqs.pactBoon);
        }
        
        if (prereqs.spells !== undefined) {
          expect(Array.isArray(prereqs.spells)).toBe(true);
          expect(prereqs.spells.length).toBeGreaterThan(0);
        }
        
        if (prereqs.otherInvocations !== undefined) {
          expect(Array.isArray(prereqs.otherInvocations)).toBe(true);
        }
      }
    });
  });
  
  it('should have eldritch blast prerequisites for relevant invocations', () => {
    const blastInvocations = ['agonizing-blast', 'repelling-blast'];
    
    blastInvocations.forEach(id => {
      const invocation = eldritchInvocations.find(i => i.id === id);
      expect(invocation?.prerequisites?.spells).toContain('eldritch-blast');
    });
  });
  
  it('should have pact boon prerequisites for book of ancient secrets', () => {
    const book = eldritchInvocations.find(i => i.id === 'book-of-ancient-secrets');
    expect(book?.prerequisites?.pactBoon).toBe('tome');
  });
});
