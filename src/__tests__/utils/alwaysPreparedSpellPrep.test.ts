import { describe, expect, it } from 'vitest';
import { cleric } from '../../data/dnd/5e-2014/classes/cleric';
import { dnd5eSpellsById } from '../../data/dnd/5e-2014/spells';
import { pf2eSpellsById } from '../../data/pathfinder/2e/spells';
import { allSpells as dnd35eSpells } from '../../data/dnd/3.5e/spells';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultDnd5eData } from '../../systems/dnd5e/data-model';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';
import { getDnd5eAlwaysPreparedSpellIds } from '../../systems/dnd5e/shared/spellPreparation';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import { exportDocuments, importDocuments } from '../../utils/documentStorage';
import { buildSpellPreparationConcepts } from '../../utils/spellPreparation';

function spellLookup(records: Record<string, Spell> | Spell[]): Map<string, Spell> {
  const entries = Array.isArray(records) ? records : Object.values(records);
  return new Map(entries.map((spell) => [spell.id, spell]));
}

describe('always-prepared spell-prep contract — cross-system regression', () => {
  describe('D&D 5e (shared)', () => {
    it('surfaces structured Life Domain grants without mixing them into the daily prepared list', () => {
      const classLevels = [
        { classId: 'cleric', subclassId: 'life-domain', level: 5, hitDieRolls: [8, 5, 5, 5, 5] },
      ];
      const alwaysPreparedSpellIds = getDnd5eAlwaysPreparedSpellIds(classLevels, [cleric]);

      // Life Domain grants are deterministic and shipped.
      expect(alwaysPreparedSpellIds).toEqual([
        'bless',
        'cure-wounds',
        'lesser-restoration',
        'spiritual-weapon',
        'beacon-of-hope',
        'revivify',
      ]);

      // Player additionally tracks 2 spells; one of them collides with a Life Domain grant.
      const trackedSpellIds = ['guiding-bolt', 'bless'];
      // Player's daily prepared list also collides; the contract must drop the collision.
      const preparedSpellIds = ['guiding-bolt', 'cure-wounds'];

      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds,
        preparedSpellIds,
        alwaysPreparedSpellIds,
        spellById: spellLookup(dnd5eSpellsById),
      });

      // Always-prepared list contains exactly the grants.
      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id).sort()).toEqual(
        [...alwaysPreparedSpellIds].sort()
      );
      // Tracked list does not double-count grants the player also tracked.
      expect(concepts.trackedSpells.map((entry) => entry.id)).toEqual(['guiding-bolt']);
      // Daily prepared list does not double-count grants the player also prepared.
      expect(concepts.preparedSpells.map((entry) => entry.id)).toEqual(['guiding-bolt']);
    });

    it('attempting to un-prepare an always-prepared grant is a structural no-op', () => {
      // The shared 5e action handler short-circuits handleTogglePreparedSpell when
      // alwaysPreparedSpellIds.has(spellId). The buildSpellPreparationConcepts contract
      // mirrors that: even if the daily list contains the grant, it is filtered out.
      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds: [],
        preparedSpellIds: ['bless', 'cure-wounds'],
        alwaysPreparedSpellIds: ['bless'],
        spellById: spellLookup(dnd5eSpellsById),
      });

      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id)).toContain('bless');
      // Even though the daily prepared list listed 'bless', the contract drops it from preparedSpells.
      expect(concepts.preparedSpells.map((entry) => entry.id)).toEqual(['cure-wounds']);
    });
  });

  describe('Pathfinder 2e', () => {
    it('always-prepared grants surface separately from spellsKnown', () => {
      // PF2e stores always-prepared spell ids directly on spellcasting.alwaysPreparedSpellIds.
      // The repertoire (spellsKnown) and the always-prepared list are independent surfaces.
      const trackedSpellIds = ['fireball-pf2e', 'magic-missile-pf2e'];
      const alwaysPreparedSpellIds = ['heal-pf2e'];

      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds,
        alwaysPreparedSpellIds,
        spellById: spellLookup(pf2eSpellsById),
      });

      expect(concepts.trackedSpells.map((entry) => entry.id).sort()).toEqual([
        'fireball-pf2e',
        'magic-missile-pf2e',
      ]);
      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id)).toEqual(['heal-pf2e']);
      // Always-prepared spells must resolve through the PF2e spell catalog (not unresolved).
      expect(concepts.alwaysPreparedSpells.every((entry) => !entry.unresolved)).toBe(true);
    });

    it('does not double-count when a player has the same spell in repertoire and as a grant', () => {
      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds: ['fireball-pf2e', 'magic-missile-pf2e'],
        alwaysPreparedSpellIds: ['fireball-pf2e'],
        spellById: spellLookup(pf2eSpellsById),
      });

      // Tracked list drops the collision; always-prepared keeps it.
      expect(concepts.trackedSpells.map((entry) => entry.id)).toEqual(['magic-missile-pf2e']);
      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id)).toEqual(['fireball-pf2e']);
    });

    it('round-trips native rank slots, always-prepared grants, and manual focus state without shape drift', () => {
      const doc: CharacterDocument<SystemDataModel> = {
        id: 'pf2e-spell-prep-roundtrip',
        name: 'PF2e Prepared Matrix',
        systemId: 'pf2e',
        system: {
          ...createDefaultPf2eData(),
          spellcasting: {
            tradition: 'arcane',
            type: 'prepared',
            proficiency: { tier: 'trained', total: 0 },
            spellSlots: {
              1: { max: 3, used: 1 },
              10: { max: 1, used: 0 },
            },
            spellsKnown: ['fireball-pf2e', 'magic-missile-pf2e', 'rank-10-manual-pf2e'],
            preparedSpellsByRank: {
              1: ['magic-missile-pf2e'],
              10: ['rank-10-manual-pf2e'],
            },
            alwaysPreparedSpellIds: ['heal-pf2e', 'unresolved-pf2e-grant'],
            focusSpells: ['focus-pulse-pf2e', 'missing-focus-pf2e'],
            focusPoints: { current: 1, max: 1 },
          },
        },
        createdAt: new Date('2026-04-30T00:00:00.000Z'),
        updatedAt: new Date('2026-04-30T00:00:00.000Z'),
      };

      const [imported] = importDocuments(exportDocuments([doc]));

      expect(imported?.system).toMatchObject({
        spellcasting: {
          spellSlots: {
            1: { max: 3, used: 1 },
            10: { max: 1, used: 0 },
          },
          spellsKnown: ['fireball-pf2e', 'magic-missile-pf2e', 'rank-10-manual-pf2e'],
          preparedSpellsByRank: {
            1: ['magic-missile-pf2e'],
            10: ['rank-10-manual-pf2e'],
          },
          alwaysPreparedSpellIds: ['heal-pf2e', 'unresolved-pf2e-grant'],
          focusSpells: ['focus-pulse-pf2e', 'missing-focus-pf2e'],
          focusPoints: { current: 1, max: 1 },
        },
      });

      const spellcasting = (imported as CharacterDocument<ReturnType<typeof createDefaultPf2eData>>)
        .system.spellcasting;
      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds: spellcasting?.spellsKnown,
        alwaysPreparedSpellIds: spellcasting?.alwaysPreparedSpellIds,
        spellById: spellLookup(pf2eSpellsById),
        manualNotes: ['Focus spells remain manual unless represented as structured grants.'],
      });

      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id).sort()).toEqual([
        'heal-pf2e',
        'unresolved-pf2e-grant',
      ]);
      expect(
        concepts.alwaysPreparedSpells.find((entry) => entry.id === 'unresolved-pf2e-grant')
          ?.unresolved
      ).toBe(true);
      expect(concepts.trackedSpells.map((entry) => entry.id).sort()).toEqual([
        'fireball-pf2e',
        'magic-missile-pf2e',
        'rank-10-manual-pf2e',
      ]);
      expect(concepts.manualNotes).toEqual([
        'Focus spells remain manual unless represented as structured grants.',
      ]);
    });
  });

  describe('d20-legacy (3.5e + PF1e)', () => {
    it('always-prepared ids surface separately from tracked spells with manual notes preserved', () => {
      const dnd35eSpellById = spellLookup(dnd35eSpells);
      // The 3.5e catalog uses class-suffix ids (e.g. fireball-3-35e for the level-3 Fireball,
      // bless-cleric-35e for the cleric-only Bless). Verify the test fixtures are shipped.
      const fireball = dnd35eSpellById.get('fireball-3-35e');
      const bless = dnd35eSpellById.get('bless-cleric-35e');
      // Note: the cleric variant of Cure Light Wounds is collapsed into the druid
      // canonical id by the 3.5e merger; use the canonical id directly.
      const cureLightWounds = dnd35eSpellById.get('cure-light-wounds-druid-35e');
      expect(fireball, 'fireball-3-35e is shipped').toBeTruthy();
      expect(bless, 'bless-cleric-35e is shipped').toBeTruthy();
      expect(cureLightWounds, 'cure-light-wounds-druid-35e is shipped').toBeTruthy();

      const trackedSpellIds = ['fireball-3-35e', 'bless-cleric-35e'];
      const alwaysPreparedSpellIds = ['cure-light-wounds-druid-35e'];
      const manualNotes = [
        'Cleric and druid domain slots are applied manually.',
        'Spontaneous cure/inflict conversion is applied manually.',
      ];

      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds,
        alwaysPreparedSpellIds,
        spellById: dnd35eSpellById,
        manualNotes,
      });

      // Tracked never includes always-prepared.
      expect(concepts.trackedSpells.map((entry) => entry.id).sort()).toEqual([
        'bless-cleric-35e',
        'fireball-3-35e',
      ]);
      expect(concepts.alwaysPreparedSpells.map((entry) => entry.id)).toEqual([
        'cure-light-wounds-druid-35e',
      ]);
      // Manual notes survive and are deduped.
      expect(concepts.manualNotes).toEqual(manualNotes);
    });

    it('marks unresolved always-prepared ids without dropping them from the surface', () => {
      // The d20-legacy sheet must visibly preserve always-prepared ids even when the
      // loader can no longer resolve them, so players can still see the manual edge.
      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds: [],
        alwaysPreparedSpellIds: ['this-spell-does-not-exist-35e'],
        spellById: spellLookup(dnd35eSpells),
      });

      expect(concepts.alwaysPreparedSpells).toHaveLength(1);
      expect(concepts.alwaysPreparedSpells[0].unresolved).toBe(true);
      expect(concepts.alwaysPreparedSpells[0].id).toBe('this-spell-does-not-exist-35e');
    });
  });

  it('round-trips unresolved always-prepared ids through import/export and renders them unresolved', () => {
    const docs: CharacterDocument<SystemDataModel>[] = [
      {
        id: 'unresolved-5e-grant',
        name: 'Unresolved Domain Grant',
        systemId: 'dnd-5e-2014',
        system: {
          ...createDefaultDnd5eData(),
          spellcasting: {
            classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: 3 }],
            spellsKnown: [],
            spellsPrepared: [],
            alwaysPreparedSpellIds: ['source-blocked-domain-grant'],
            spellSlots: {},
          },
        },
        createdAt: new Date('2026-04-30T00:00:00.000Z'),
        updatedAt: new Date('2026-04-30T00:00:00.000Z'),
      },
      {
        id: 'unresolved-35e-grant',
        name: 'Unresolved Legacy Grant',
        systemId: 'dnd-3.5e',
        system: {
          ...createDefaultDnd35eData(),
          alwaysPreparedSpellIds: ['legacy-domain-edge-not-in-loader'],
        },
        createdAt: new Date('2026-04-30T00:00:00.000Z'),
        updatedAt: new Date('2026-04-30T00:00:00.000Z'),
      },
    ];

    const imported = importDocuments(exportDocuments(docs));

    expect(imported[0]?.system).toMatchObject({
      spellcasting: {
        alwaysPreparedSpellIds: ['source-blocked-domain-grant'],
      },
    });
    expect(imported[1]?.system).toMatchObject({
      alwaysPreparedSpellIds: ['legacy-domain-edge-not-in-loader'],
    });

    const dnd5eConcepts = buildSpellPreparationConcepts({
      alwaysPreparedSpellIds: ['source-blocked-domain-grant'],
      spellById: spellLookup(dnd5eSpellsById),
    });
    const legacyConcepts = buildSpellPreparationConcepts({
      alwaysPreparedSpellIds: ['legacy-domain-edge-not-in-loader'],
      spellById: spellLookup(dnd35eSpells),
      manualNotes: ['Domain slot effects remain manual.'],
    });

    expect(dnd5eConcepts.alwaysPreparedSpells).toEqual([
      expect.objectContaining({
        id: 'source-blocked-domain-grant',
        unresolved: true,
      }),
    ]);
    expect(legacyConcepts.alwaysPreparedSpells).toEqual([
      expect.objectContaining({
        id: 'legacy-domain-edge-not-in-loader',
        unresolved: true,
      }),
    ]);
    expect(legacyConcepts.manualNotes).toEqual(['Domain slot effects remain manual.']);
  });

  it('the additive always-prepared contract holds for every system the helper supports', () => {
    // Final cross-system invariant: the always-prepared list is always disjoint from
    // tracked and prepared lists in the resolved concepts, regardless of system.
    const systems: Array<{ label: string; spellById: Map<string, Spell>; sample: string[] }> = [
      {
        label: 'dnd-5e-2014',
        spellById: spellLookup(dnd5eSpellsById),
        sample: ['bless', 'cure-wounds'],
      },
      {
        label: 'pf2e',
        spellById: spellLookup(pf2eSpellsById),
        sample: ['fireball-pf2e', 'magic-missile-pf2e'],
      },
      {
        label: 'dnd-3.5e',
        spellById: spellLookup(dnd35eSpells),
        sample: ['fireball-3-35e', 'bless-cleric-35e'],
      },
    ];

    systems.forEach(({ label, spellById, sample }) => {
      const concepts = buildSpellPreparationConcepts({
        trackedSpellIds: sample,
        preparedSpellIds: sample,
        alwaysPreparedSpellIds: [sample[0]],
        spellById,
      });

      const alwaysSet = new Set(concepts.alwaysPreparedSpells.map((entry) => entry.id));
      const trackedSet = new Set(concepts.trackedSpells.map((entry) => entry.id));
      const preparedSet = new Set(concepts.preparedSpells.map((entry) => entry.id));

      const trackedOverlap = [...alwaysSet].filter((id) => trackedSet.has(id));
      const preparedOverlap = [...alwaysSet].filter((id) => preparedSet.has(id));

      expect(trackedOverlap, `${label} tracked-overlap`).toEqual([]);
      expect(preparedOverlap, `${label} prepared-overlap`).toEqual([]);
    });
  });
});
