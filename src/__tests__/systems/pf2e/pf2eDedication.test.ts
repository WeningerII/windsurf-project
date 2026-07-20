import { describe, expect, it } from 'vitest';
import { allPf2eArchetypes } from '../../../data/pathfinder/2e/archetypes';
import {
  PF2E_ARCHETYPE_DEDICATION_GRANTS,
  createDefaultPf2eData,
  type Pf2eDataModel,
} from '../../../systems/pf2e/data-model';
import {
  applyPf2eArchetypeTemplate,
  removePf2eArchetypeTemplate,
} from '../../../systems/pf2e/pf2eTemplate';
import type { Archetype } from '../../../types/character-options/archetypes';
import type { CharacterDocument } from '../../../types/core/document';

const WIZARD_ID = 'pf2e-wizard-archetype';
const wizardArchetype = allPf2eArchetypes.find((entry) => entry.id === WIZARD_ID)!;
const wizardSource = `Archetype: ${wizardArchetype.name}`;

function makeDocument(system: Pf2eDataModel): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-dedication-fixture',
    name: 'Dedication Fixture',
    systemId: 'pf2e',
    system,
    createdAt: new Date('2026-07-20T12:00:00.000Z'),
    updatedAt: new Date('2026-07-20T12:00:00.000Z'),
  };
}

function makeSystem(overrides: Partial<Pf2eDataModel> = {}): Pf2eDataModel {
  return {
    ...createDefaultPf2eData(),
    classId: wizardArchetype.parentClassId,
    level: 20,
    ...overrides,
  };
}

describe('PF2e dedication proficiency aggregation', () => {
  it('grants the dedication skill and lore proficiencies with archetype provenance', () => {
    const applied = applyPf2eArchetypeTemplate(makeDocument(makeSystem()), wizardArchetype);
    const sys = applied.system;

    expect(sys.selectedArchetypeIds).toEqual([WIZARD_ID]);

    // Arcana (skill) and Academia (lore) are the wizard dedication's grants.
    expect(sys.skillProficiencies.arcana).toBeDefined();
    expect(sys.skillProficiencies.arcana.tier).toBe('trained');
    expect(sys.skillProficiencies.arcana.source).toContain(wizardSource);

    expect(sys.loreProficiencies.academia).toBeDefined();
    expect(sys.loreProficiencies.academia.tier).toBe('trained');
    expect(sys.loreProficiencies.academia.source).toContain(wizardSource);
  });

  it('is idempotent — re-selecting the same archetype does not stack sources', () => {
    const once = applyPf2eArchetypeTemplate(makeDocument(makeSystem()), wizardArchetype);
    const twice = applyPf2eArchetypeTemplate(once, wizardArchetype);

    expect(twice.system.selectedArchetypeIds).toEqual([WIZARD_ID]);
    expect(twice.system.skillProficiencies.arcana.source).toEqual([wizardSource]);
  });

  it('aggregates with an existing training: keeps the stronger tier and merges sources', () => {
    // A class already trained Arcana; the dedication also trains it. The merge
    // must union provenance and keep the stronger (here equal) tier.
    const system = makeSystem({
      skillProficiencies: {
        arcana: { tier: 'expert', total: 0, source: ['Wizard'] },
      },
    });

    const applied = applyPf2eArchetypeTemplate(makeDocument(system), wizardArchetype);
    const arcana = applied.system.skillProficiencies.arcana;

    expect(arcana.tier).toBe('expert'); // stronger existing tier wins
    expect(arcana.source).toEqual(expect.arrayContaining(['Wizard', wizardSource]));
    expect(arcana.source).toHaveLength(2);
  });

  it('removal reverts dedication-only grants but preserves the co-trained source', () => {
    const system = makeSystem({
      skillProficiencies: {
        arcana: { tier: 'expert', total: 0, source: ['Wizard'] },
      },
    });

    const applied = applyPf2eArchetypeTemplate(makeDocument(system), wizardArchetype);
    const removed = removePf2eArchetypeTemplate(applied, wizardArchetype);
    const sys = removed.system;

    expect(sys.selectedArchetypeIds).toEqual([]);
    // Arcana survives because the class still trains it; only the archetype's
    // provenance is stripped.
    expect(sys.skillProficiencies.arcana).toBeDefined();
    expect(sys.skillProficiencies.arcana.source).toEqual(['Wizard']);
    expect(sys.skillProficiencies.arcana.tier).toBe('expert');
    // Academia lore was granted solely by the dedication — it is fully removed.
    expect(sys.loreProficiencies.academia).toBeUndefined();
  });

  it('removal preserves a manually trained proficiency the dedication also touched', () => {
    // Arcana trained by hand (recorded as 'manual' by the sheet's cycle button).
    const system = makeSystem({
      skillProficiencies: {
        arcana: { tier: 'trained', total: 0, source: ['manual'] },
      },
    });

    const applied = applyPf2eArchetypeTemplate(makeDocument(system), wizardArchetype);
    expect(applied.system.skillProficiencies.arcana.source).toEqual(
      expect.arrayContaining(['manual', wizardSource])
    );

    const removed = removePf2eArchetypeTemplate(applied, wizardArchetype);
    expect(removed.system.skillProficiencies.arcana).toBeDefined();
    expect(removed.system.skillProficiencies.arcana.source).toEqual(['manual']);
  });

  it('removal fully clears a dedication whose grants stood alone', () => {
    const applied = applyPf2eArchetypeTemplate(makeDocument(makeSystem()), wizardArchetype);
    const removed = removePf2eArchetypeTemplate(applied, wizardArchetype);

    expect(removed.system.skillProficiencies.arcana).toBeUndefined();
    expect(removed.system.loreProficiencies.academia).toBeUndefined();
  });

  it('leaves an archetype with no declared grants purely feature-based', () => {
    // Guard the additive contract: an archetype absent from the grant table
    // must not create spurious proficiency entries.
    const bare: Archetype = {
      id: 'pf2e-grantless-archetype',
      name: 'Grantless Archetype',
      system: 'pf2e',
      source: 'Test',
      parentClassId: 'wizard',
      description: 'No dedication proficiency grants.',
      features: [{ level: 1, name: 'Dedication', description: 'Feature only.' }],
    };
    expect(PF2E_ARCHETYPE_DEDICATION_GRANTS[bare.id]).toBeUndefined();

    const applied = applyPf2eArchetypeTemplate(makeDocument(makeSystem()), bare);
    expect(applied.system.skillProficiencies).toEqual({});
    expect(applied.system.loreProficiencies).toEqual({});
    expect(applied.system.features.some((f) => f.source === `Archetype: ${bare.name}`)).toBe(true);
  });
});
