import { describe, it, expect, beforeAll } from 'vitest';
import { createDaggerheartValidator } from '../../../systems/daggerheart/validation';
import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import type { DaggerheartDataModel } from '../../../systems/daggerheart/data-model';
import {
  loadDaggerheartClassesForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartCommunitiesForSystem,
} from '../../../utils/dataLoader';
import type { CharacterDocument } from '../../../types/core/document';
import type { ValidationContext } from '../../../registry/types';

const validator = createDaggerheartValidator();

// Real catalog names, resolved once so the test tracks the loader-backed data.
let className = '';
let subclassName = '';
let heritageName = '';
let communityName = '';
let classDomains: string[] = [];

beforeAll(async () => {
  const [classes, ancestries, communities] = await Promise.all([
    loadDaggerheartClassesForSystem('daggerheart'),
    loadDaggerheartAncestriesForSystem('daggerheart'),
    loadDaggerheartCommunitiesForSystem('daggerheart'),
  ]);
  const firstClass = classes[0];
  className = firstClass.name;
  subclassName = firstClass.subclasses[0].name;
  classDomains = firstClass.domains;
  heritageName = ancestries[0].name;
  communityName = communities[0].name;
});

function legalDoc(
  mutate?: (sys: DaggerheartDataModel) => void
): CharacterDocument<DaggerheartDataModel> {
  const system = createDefaultDaggerheartData();
  system.level = 1;
  system.class = className;
  system.subclass = subclassName;
  system.heritage = heritageName;
  system.community = communityName;
  // Level-1 fixed trait array +2/+1/+1/0/0/-1.
  system.attributes = {
    agility: 2,
    strength: 1,
    finesse: 1,
    instinct: 0,
    presence: 0,
    knowledge: -1,
  };
  mutate?.(system);
  return {
    id: 'dh-validate-doc',
    name: 'DH Hero',
    systemId: 'daggerheart',
    system,
    createdAt: new Date('2026-03-05T00:00:00.000Z'),
    updatedAt: new Date('2026-03-05T00:00:00.000Z'),
  };
}

async function validate(
  doc: CharacterDocument<DaggerheartDataModel>,
  context: Omit<ValidationContext, 'systemId'> = { reason: 'creation' }
) {
  return validator.validateDocument(doc, { ...context, systemId: 'daggerheart' });
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('createDaggerheartValidator', () => {
  it('passes a complete, in-catalog level-1 build', async () => {
    const { issues } = await validate(legalDoc());
    expect(issues).toEqual([]);
  });

  it('rejects a level-1 trait array that is not +2/+1/+1/0/0/-1', async () => {
    const doc = legalDoc((sys) => {
      sys.attributes.agility = 3; // now [3,1,1,0,0,-1]
    });
    const { issues } = await validate(doc);
    const mismatch = issues.find((issue) => issue.code === 'daggerheart-trait-array-mismatch');
    expect(mismatch?.severity).toBe('error');
    expect(mismatch?.details).toMatchObject({ expected: [2, 1, 1, 0, 0, -1] });
  });

  it('accepts the standard array in any trait order', async () => {
    const doc = legalDoc((sys) => {
      sys.attributes = {
        agility: -1,
        strength: 0,
        finesse: 0,
        instinct: 1,
        presence: 1,
        knowledge: 2,
      };
    });
    const { issues } = await validate(doc);
    expect(codes(issues)).not.toContain('daggerheart-trait-array-mismatch');
  });

  it('flags a subclass that does not belong to the class', async () => {
    const doc = legalDoc((sys) => {
      sys.subclass = 'Not A Subclass';
    });
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('daggerheart-subclass-class-mismatch');
  });

  it('rejects a loadout above the five-card limit', async () => {
    const doc = legalDoc((sys) => {
      sys.domainCards = Array.from({ length: 6 }, (_unused, index) => ({
        id: `card-${index}`,
        name: `Card ${index}`,
        domain: classDomains[0],
        level: 1,
        location: 'loadout' as const,
        description: '',
      }));
    });
    const { issues } = await validate(doc);
    const over = issues.find((issue) => issue.code === 'daggerheart-loadout-over-limit');
    expect(over?.severity).toBe('error');
    expect(over?.details).toMatchObject({ loadoutCount: 6, limit: 5 });
  });

  it('rejects a domain card above the character level', async () => {
    const doc = legalDoc((sys) => {
      sys.domainCards = [
        {
          id: 'too-high',
          name: 'Overlevel Card',
          domain: classDomains[0],
          level: 5,
          location: 'loadout',
          description: '',
        },
      ];
    });
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('daggerheart-card-above-level');
  });

  it('warns about a card outside the class domains', async () => {
    const offDomain = ['blade', 'bone', 'codex', 'grace'].find(
      (domain) => !classDomains.map((entry) => entry.toLowerCase()).includes(domain)
    )!;
    const doc = legalDoc((sys) => {
      sys.domainCards = [
        {
          id: 'off',
          name: 'Off Domain',
          domain: offDomain,
          level: 1,
          location: 'loadout',
          description: '',
        },
      ];
    });
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('daggerheart-card-off-domain');
  });

  it('rejects an out-of-range level', async () => {
    const { issues } = await validate(legalDoc((sys) => (sys.level = 11)));
    expect(codes(issues)).toContain('daggerheart-invalid-level');
  });

  it('flags a system-id mismatch', async () => {
    const doc = { ...legalDoc(), systemId: 'pf2e' } as CharacterDocument<DaggerheartDataModel>;
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('daggerheart-system-mismatch');
  });

  it('stamps the issue source from the validation reason', async () => {
    const { issues } = await validate(
      legalDoc((sys) => (sys.level = 0)),
      { reason: 'ai-draft' }
    );
    const invalid = issues.find((issue) => issue.code === 'daggerheart-invalid-level');
    expect(invalid?.source).toBe('ai-draft');
  });
});
