import { buildDnd5eCharacterCreationCandidatePool } from '../ai';

describe('D&D 5e AI candidate pools', () => {
  it('builds a compact loader-backed 2024 character creation pool by default', async () => {
    const pool = await buildDnd5eCharacterCreationCandidatePool('dnd-5e-2024', {
      generatedAt: '2026-05-01T00:00:00.000Z',
    });

    expect(pool.systemId).toBe('dnd-5e-2024');
    expect(pool.generatedAt).toBe('2026-05-01T00:00:00.000Z');
    expect(pool.constraints).toContain(
      'Candidate ids are loader-backed and source-filtered before AI use.'
    );

    const categories = Object.fromEntries(
      pool.categories.map((category) => [category.id, category.candidates])
    );

    expect(categories.class.length).toBeGreaterThan(0);
    expect(categories.species.length).toBeGreaterThan(0);
    expect(categories.background.length).toBeGreaterThan(0);
    expect(categories.feat.length).toBeGreaterThan(0);
    expect(categories.spell).toBeUndefined();
    expect(categories.equipment).toBeUndefined();

    expect(categories.class[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
        source: expect.any(String),
      })
    );
  });

  it('can include bounded spell and equipment step pools', async () => {
    const pool = await buildDnd5eCharacterCreationCandidatePool('dnd-5e-2024', {
      includeSpells: true,
      includeEquipment: true,
      maxSpells: 5,
      maxEquipment: 7,
    });

    const spellCategory = pool.categories.find((category) => category.id === 'spell');
    const equipmentCategory = pool.categories.find((category) => category.id === 'equipment');

    expect(spellCategory?.candidates).toHaveLength(5);
    expect(equipmentCategory?.candidates).toHaveLength(7);
    expect(spellCategory?.candidates[0].tags).toEqual(
      expect.arrayContaining([expect.stringMatching(/^level:/)])
    );
    expect(equipmentCategory?.candidates[0].tags).toEqual(
      expect.arrayContaining([expect.stringMatching(/^type:/)])
    );
  });
});
